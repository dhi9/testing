<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inventory_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('inventory_db', 'stock_movement_db', 'item_bl', 'purchase_bl'));
	}
	
	public function generate_stock_setting_reference($stock_setting_id)
	{
		$date_created = $this->inventory_db->get_stock_setting_by_id($stock_setting_id)->row()->date_created;
		
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
		
		$query = $this->inventory_db->get_manual_stock_setting_list_by_date_created_range($initial_date, $date_created);
		
		$count = $query->num_rows();
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		$manual_stock_setting_reference = 'PS_'.$date.'-'.$sequence;
		
		return $manual_stock_setting_reference;
	}
	
	public function add_stock_quantity($data, $quantity = NULL)
	{
		if($quantity != NULL){
			$query = $this->inventory_db->get_stock_by_data($data);
			
			if($query->num_rows() > 0){
				$changed_quantity = $query->row()->quantity + $quantity;
				$this->inventory_db->update_stock_by_data($data, $changed_quantity);
			}
			else{
				$data['quantity'] = $quantity;
				$this->inventory_db->insert_inventory($data);
			}
		}
	}
	
	public function subtract_stock_quantity($data, $quantity = NULL)
	{
		if($quantity != NULL){
			$query = $this->inventory_db->get_stock_by_data($data);
			$changed_quantity = $query->row()->quantity - $quantity;
			$this->inventory_db->update_stock_by_data($data, $changed_quantity);
		}
	}
	
	public function set_inventory($site_id = NULL, $storage_id = NULL, $bin_id = NULL, $batch_id = NULL)
	{
		$data = array();
		
		if($site_id != NULL){
			$data['site_id'] = $site_id;
		}
		if($storage_id != NULL){
			$data['storage_id'] = $storage_id;
		}
		if($bin_id != NULL){
			$data['bin_id'] = $bin_id;
		}
		if($batch_id != NULL){
			$data['batch_id'] = $batch_id;
		}
		
		return $data;
	}
	
	public function insert_stock_setting($data)
	{
		$stock_setting = $data['stock_setting'];
		$stock_setting_items = $data['stock_setting_items'];
			
		$insert_stock_setting = array(
			'type' => $stock_setting['type'],
			//'material'
			'creator_id' => $this->session->userdata('user_id'),
			//'approver_id'
			'posting_date' => $stock_setting['posting_date'],
			'posting_name' => $stock_setting['posting_name'],
			'site_id' => $stock_setting['site_id'],
			'storage_id' => $stock_setting['storage_id'],
			//'approved_data'
		);
		$manual_stock_setting_id = $this->inventory_db->insert_stock_setting($insert_stock_setting);
		
		$manual_stock_setting_reference = $this->generate_stock_setting_reference($manual_stock_setting_id);
		
		$update = array(
			'manual_stock_setting_id' => $manual_stock_setting_id,
			'manual_stock_setting_reference' => $manual_stock_setting_reference
		);
		$this->inventory_db->update_stock_setting($update);
		
		foreach($stock_setting_items as $item){
			$insert_item = array(
				'manual_stock_setting_id' => $manual_stock_setting_id,
				'item_code' => $item['item_code'],
				'item_name' => $item['item_name'],
				'item_uom' => @$item['item_uom'],
				'quantity' => $item['quantity'],
				//'bin_id' => @$item['bin_id'],
				//'batch_id' => $item['batch_id'],
				//'attributes' => $item['attributes'],
			);
			$array_attributes = json_decode($item['attributes'], true);
			$attributes = array();
			foreach($array_attributes as $key => $val){
				array_push($attributes, "'".$key."'");
				array_push($attributes, "'".$val."'");
			}
			$insert_item['attributes'] = $attributes;
			
			if(isset($item['bin_id'])){
				$insert_item['bin_id'] = $item['bin_id'];
			}
			if(isset($item['remark'])){
				$insert_item['remark'] = $item['remark'];
			}
			
			$this->inventory_db->insert_stock_setting_item($insert_item);
			
			
			$data = array(
				'site_id' => $stock_setting['site_id'],
				'storage_id' => $stock_setting['storage_id'],
				//'bin_id' => $item['bin_id'],
			);
			
			if(isset($item['bin_id'])){
				$data['bin_id'] = $item['bin_id'];
			}
			$basic_uom_quantity = $this->item_bl->convert_to_basic_uom_quantity($item['item_code'], $item['quantity'], $item['item_uom']);
			
			if($stock_setting['type'] == 'VPS1'){
				$this->add_stock_quantity($data, $basic_uom_quantity);
			}
			else{
				$this->subtract_stock_quantity($data, $basic_uom_quantity);
			}
			
			
			$insert_stock_movement = array(
				'item_code' => $item['item_code'],
				//'document_number' => 'D',
				'document_reference' => $manual_stock_setting_reference,
				//'posting_date' => $actual_loading_date_old_value,
				'quantity' => $item['quantity'],
				'site_id' => $stock_setting['site_id'],
				//'batch_id' => ,
				'uom' => $item['item_uom'],
				'uom_quantity' => $basic_uom_quantity,
				//'email' => ,
				'type' => $stock_setting['type'],
				//'price' => ,
			);
			$this->stock_movement_db->insert_stock_movement($insert_stock_movement);
		}
		
		return $manual_stock_setting_reference;
	}
	
	public function add_stock_by_order($order_id, $date)
	{
		$order = $this->order_db->get_order_by_id($order_id)->row_array();
		$item_list = $this->order_db->get_order_item_list_by_order_id($order_id)->result_array();
		
		foreach($item_list as $item){
			$data = array(
				'item_code' => $item['item_code'],
				'site_id' => 1,
				'storage_id' => 1
			);
			$data['attributes'] = $this->purchase_bl->array_to_cb(json_decode($item['attributes'], TRUE));
			$this->inventory_bl->add_stock_quantity($data, $item['quantity']);
			
			$insert_stock_movement = array(
				'item_code' => $item['item_code'],
				//'document_number' => 'D',
				'document_reference' => $order['order_reference'],
				'posting_date' => $date,
				'quantity' => $item['quantity'],
				//'uom' => ,
				//'uom_quantity' => ,
				//'email' => ,
				'type' => 'VVV1',
				//'price' => ,
			);
			$this->stock_movement_db->insert_stock_movement($insert_stock_movement);
		}
	}
	
	public function subtract_stock_by_delivery($delivery_id, $date)
	{
		$delivery = $this->delivery_db->get_delivery_by_id($delivery_id)->row_array();
		$item_list = $this->delivery_db->get_delivery_item_list_by_delivery_id($delivery_id)->result_array();
		
		foreach($item_list as $item){
			$data = array(
				'item_code' => $item['item_code'],
				'site_id' => 1,
				'storage_id' => 1,
			);
			$this->inventory_bl->subtract_stock_quantity($data, $item['quantity_sent']);
			
			$insert_stock_movement = array(
				'item_code' => $item['item_code'],
				//'document_number' => 'D',
				'document_reference' => $delivery['delivery_reference'],
				'posting_date' => $date,
				'quantity' => $item['quantity_sent'],
				//'uom' => ,
				//'uom_quantity' => ,
				//'email' => ,
				'type' => 'VGI1',
				//'price' => ,
			);
			$this->stock_movement_db->insert_stock_movement($insert_stock_movement);
		}
	}
	
	public function add_stock_by_purchase($order_id, $date)
	{
		$order = $this->order_db->get_order_by_id($order_id)->row_array();
		$item_list = $this->order_db->get_order_item_list_by_order_id($order_id)->result_array();
		
		foreach($item_list as $item){
			$data = array(
				'item_code' => $item['item_code'],
				'site_id' => 1,
				'storage_id' => 1,
			);
			$this->inventory_bl->add_stock_quantity($data, $item['quantity']);
			
			$insert_stock_movement = array(
				'item_code' => $item['item_code'],
				//'document_number' => 'D',
				'document_reference' => $order['order_reference'],
				'posting_date' => $date,
				'quantity' => $item['quantity'],
				//'uom' => ,
				//'uom_quantity' => ,
				//'email' => ,
				'type' => 'VVV1',
				//'price' => ,
			);
			$this->stock_movement_db->insert_stock_movement($insert_stock_movement);
		}
	}
	
	public function is_site_empty($site_id)
	{
		$data = array(
			'site_id' => $site_id,
			'storage_id' => NULL,
		);
		$query_stock = $this->inventory_db->get_stock_by_data($data);
		
		$empty = TRUE;
		if($query_stock->num_rows() > 0){
			$stock_list = $query_stock->result_array();
			
			foreach($stock_list as $stock){
				if($stock['quantity'] != 0){
					$empty = FALSE;
				}
			}
		}
		
		return $empty;
	}
	
	public function get_site_item_list_old($site_id = NULL, $opname_start_date = NULL)
	{
		
		$query_requests = $this->db
			->where('site_id', $site_id)
			->where('requested_date >=', $opname_start_date)
			->order_by('requested_date desc')
		->get('request_delivery_requests');
		$requests = $query_requests->result_array();
		
		$request_item_list = array();
		
		foreach($requests as $r){
			$query_request_item = $this->db
				->where('requests_delivery_request_id', $r['requests_delivery_request_id'])
			->get('request_delivery_request_items');
			$request_item = $query_request_item->result_array();
			foreach($request_item as $ri){
				if(array_key_exists($ri['item_code'], $request_item_list)){
					$request_item_list[$ri['item_code']]['quantity'] = $request_item_list[$ri['item_code']]['quantity'] + $ri['quantity'];
				}else{
					$request_item_list[$ri['item_code']] = array(
						'quantity' => $ri['quantity'],
					);
				}
			}
		}
		return $request_item_list;
		/*
		if($start_date != NULL) $this->db->where('date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('date_created <', $end_date);
		}
		
		return $this->db
			->where('site_id', $site_id)
			->where('status !=', 'Z')
			->order_by('date_created desc')
		->get('request_delivery_items');
		*/
	}
	
	public function start_opname_item($site_id = NULL, $opname_start_date = NULL)
	{
		$time=strtotime($opname_start_date);
		$day=date("t",$time);
		$month=date("m",$time);
		$year=date("Y",$time);
		$start_date = $year."-".$month."-01";
		$end_date = $year."-".$month."-".$day;
		$query_requests = $this->inventory_db->get_stock_movements($site_id, $start_date, $end_date);
		$requests = $query_requests->result_array();
		foreach($requests as $r){
			
		}
		return $requests;
	}
	
	public function get_attribute_value_list_by_attribute_name($attribute_name)
	{
		$this->db->select("COLUMN_GET(attributes, '$attribute_name' as char(20)) as attribute_value");
		$query = $this->db->get('inventory_stocks');
		
		$value_list = array();
		$for_check = array();
		
		foreach($query->result_array() as $row){
			if(
				($row['attribute_value'] != NULL)
				&& (! in_array($row['attribute_value'], $for_check))
			){
				$tmp = array(
					'attribute_value' => $row['attribute_value'],
				);
				array_push($value_list, $tmp);
				array_push($for_check, $row['attribute_value']);
			}
		}
		
		return $value_list;
	}
	
	public function update_consigment_stock($data, $quantity = NULL)
	{
		$stock = array(
			'customer_id' => $data['customer_id'],
			'customer_address_id' => $data['customer_address_id'],
			'item_code' => $data['item_code'],
		);
		
		if(! empty($stock['attributes'])){
			$stock['attributes'] = $this->purchase_bl->array_to_cb($data['attributes']);
		}
		
		if($quantity != NULL){
			$query = $this->inventory_db->get_consigment_stock_by_data($stock);
			
			if($query->num_rows() > 0){
				if($data['type'] == 'add'){
					$changed_quantity = $query->row()->quantity + $quantity;
				}
				else{
					$changed_quantity = $query->row()->quantity - $quantity;
				}
				$this->inventory_db->update_consigment_stock_by_data($stock, $changed_quantity);
			}
			else{
				$stock['quantity'] = $quantity;
				$this->inventory_db->insert_inventory($stock);
			}
		}
	}
	
	public function set_stock_status_data_by($where)
	{
		$this->load->model(array('attribute_db'));
		
		$item_code = $where['item_code'];
		
		$data = array();
		
		$array = array(
			'item_code' => $item_code
		);
		$sum = $this->inventory_db->sum_inventory_by_data($array);
		
		$row = array(
			"parentId" => "",
			"selfId" => $item_code,
			"name" => $item_code,
			"quantity" => $sum,
			//"quality" => $i['quality'],
			//"block_status" => $i['block_status'],
			"item_code" => $item_code,
			"batch_reference" => 0,
			"is" => 'item',
			"konsinyasi" => $this->inventory_db->sum_consignment_by_item_code($item_code),
			"pengadaan" => $this->purchase_bl->count_provision_by_item_code($item_code)
		);
		array_push($data, $row);
		
		
		$query = $this->db
			->select('rdri.item_code, rdr.site_id, s.site_reference')
			->from('request_delivery_request_items rdri')
			->join('request_delivery_requests rdr', 'rdr.requests_delivery_request_id = rdri.requests_delivery_request_id')
			->join('sites s', 's.site_id = rdr.site_id')
			->where('rdri.item_code', $item_code)
			->group_by('rdr.site_id')
		->get()->result_array();
		
		foreach($query as $site_row){
			$array = array(
				'item_code' => $item_code,
				'site_id' => $site_row['site_id']
			);
			$sum = $this->inventory_db->sum_inventory_by_data($array);
			
			$row = array(
				"parentId" => $item_code,
				"selfId" => $site_row['site_reference'],
				"name" => $site_row['site_reference'],
				"quantity" => $sum,
				//"quality" => $i['quality'],
				//"block_status" => $i['block_status'],
				//"item_code" => $i['item_code'],
				"batch_reference" => 0,
				"pengadaan" => $this->purchase_bl->count_provision_by_item_code_site_id($item_code, $site_row['site_id']),
				"is" => 'site'
			);
			array_push($data, $row);
			
			
			$query2 = $this->db
				->where('is.item_code', $item_code)
				->where('is.site_id', $site_row['site_id'])
				->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
				->group_by('is.storage_id')
			->get('inventory_stocks is')->result_array();
			
			foreach($query2 as $storage_row){
				$array = array(
					'item_code' => $item_code,
					'site_id' => $storage_row['site_id'],
					'storage_id' => $storage_row['storage_id']
				);
				$sum = $this->inventory_db->sum_inventory_by_data($array);
				
				$row = array(
					"parentId" => $site_row['site_reference'],
					"selfId" => $storage_row['storage_name'],
					"name" => $storage_row['storage_name'],
					"quantity" => $sum,
					"quality" => $storage_row['quality'],
					"block_status" => $storage_row['block_status'],
					"item_code" => $item_code,
					//"batch_reference" => $storage_row['batch_reference'],
					"is" => 'storage'
				);
				array_push($data, $row);
			}
		}
		
		return $data;
	}
	
	public function total_today_available_stock_value()
	{
		$stock_list = $this->db
			->select('is.item_code, SUM(is.quantity) as quantity, i.value_amount')
			->from('inventory_stocks as is')
			->join('items as i', 'i.item_code = is.item_code', 'left')
			->group_by('is.item_code')
		->get()->result_array();
		
		$total = 0;
		foreach($stock_list as $stock){
			$total += $stock['quantity'] * $stock['value_amount'];
		}
		
		return $total;
	}
	
	public function total_today_consignment_stock_value()
	{
		$stock_list = $this->db
			->select('cs.item_code, SUM(cs.quantity) as quantity, i.value_amount')
			->from('consignment_stocks as cs')
			->join('items as i', 'i.item_code = cs.item_code', 'left')
			->group_by('cs.item_code')
		->get()->result_array();
		
		$total = 0;
		foreach($stock_list as $stock){
			if(empty($stock['value_amount'])){
				$stock['value_amount'] = 1;
			}
			
			$total += $stock['quantity'] * $stock['value_amount'];
		}
		
		return $total;
	}
}