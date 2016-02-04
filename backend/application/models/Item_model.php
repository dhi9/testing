<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Item_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}

	public function delete_item_uom_conversion($data)
	{
		$this->db->update(
				'item_uom_conversions',
				array('status' => 'X'),
				array('conversion_id' => $data['conversion_id'])
				);
	}
	
	public function get_all_items()
	{
		return $this->db->get('items');
	}
	
	public function get_raw_item_list()
	{
		return $this->db->get('items');
	}
	
	public function get_item($item_id)
	{
		return $this->db->where('item_id', $item_id)->get('items');
	}
	
	public function get_item_by_item_code($item_code)
	{
		return $this->db->where('item_code', $item_code)->get('items');
	}
	public function get_item_alternate_list($item_code)
	{
		return $this->db->where('item_code', $item_code)->get('item_alternates');
	}
	public function get_manual_stock_setting_list()
	{
		return $this->db
		->select('mss.*, u.username as creator')
		->from('manual_stock_settings mss')
		->join('users u', 'mss.creator_id = u.user_id')
		->where_not_in('mss.status', 'X')
		->get();
	}
	
	public function get_item_uom_history_list_by_item_code($item_code)
	{
		return $this->db
		->select('*, iuh.date_created as datetime')
		->from('item_update_histories iuh')
		->join('users u', 'u.user_id = iuh.user_id')
		->where('iuh.item_code', $item_code)
		->order_by('iuh.date_created desc')
		->get();
	}

	public function get_item_uom_conversion_by_id($id)
	{
		return $this->db
		->where('conversion_id', $id)
		->get('item_uom_conversions');
	}
	public function get_item_uom_conversion_list_by_item_code($item_code)
	{
		return $this->db
		->where('item_code', $item_code)
		->get('item_uom_conversions');
	}
	
	public function get_site_id_by_site_reference($site_reference)
	{
		return $this->db
		->select('site_id')
		->from('sites')
		->where('site_reference', $site_reference)
		->get();
	}
	
	public function get_all_inventory_by_site_reference($site_id, $item_code)
	{
		return $this->db
		->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name')
		->from('inventory_stocks is')
		->join('batchs b', 'b.batch_id = is.batch_id', 'left')
		->join('sites s', 's.site_id = is.site_id', 'left')
		->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
		->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
		->where('is.item_code', $item_code)
		->where_in('is.site_id', $site_id)
		->get();
	}
	
	public function get_all_inventory_by($where)
	{
		/*
		$this->db->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name');
		$this->db->from('inventory_stocks is');
		$this->db->join('batchs b', 'b.batch_id = is.batch_id', 'left');
		$this->db->join('sites s', 's.site_id = is.site_id', 'left');
		$this->db->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left');
		$this->db->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left');
		if(!empty($where['item_code'])){
		$this->db->where('is.item_code', $where['item_code']);
		}
		if(!empty($where['site_id'])){
		$this->db->where_in('is.site_id', $where['site_id']);
		}
		if(!empty($where['storage_id'])){
		$this->db->where_in('is.storage_id', $where['storage_id']);
		}
		return $this->db->get();
		*/
		$item_code = ""; $site_id = ""; $storage_id = ""; $attributes = "";
		if (! empty( $where['item_code'] )) {
			$item_code = "item_code = '".$where['item_code']."'";
		}
		if (! empty( $where['site_id'] )) {
			$site_id = " AND sites.site_id IN (".$where['site_id'].")";
		}
		if (! empty( $where['storage_id'] )) {
			$storage_id = " AND storage_locations.storage_id IN (".$where['storage_id'].")";
		}
		if (! empty( $where['attributes'] )) {
			foreach($where['attributes'] as $key => $val){
				if($key%2 == 0){
					$attributes = $attributes." AND COLUMN_GET(attributes, '".$val."' AS CHAR)";
				}else{
					 $attributes = $attributes. "= '".$val."'";
				}
				
			}
		}
		return $this->db->query("
					SELECT	*, COLUMN_JSON(attributes) as attributes
					FROM inventory_stocks
					LEFT JOIN
						batchs ON batchs.batch_id=inventory_stocks.batch_id
					LEFT JOIN
						sites ON sites.site_id=inventory_stocks.site_id
					LEFT JOIN
						storage_locations ON storage_locations.storage_id=inventory_stocks.storage_id
					LEFT JOIN
						bin_locations ON bin_locations.bin_id=inventory_stocks.bin_id
					WHERE
						inventory_stocks.item_code = '".$where['item_code']."'
						".$site_id."
						".$storage_id."
						".$attributes."					 
				");
	}
	
	public function get_all_inventory_by_item_code($item_code)
	{
		return $this->db
		->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name')
		->from('inventory_stocks is')
		->join('batchs b', 'b.batch_id = is.batch_id', 'left')
		->join('sites s', 's.site_id = is.site_id', 'left')
		->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
		->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
		->where('is.item_code', $item_code)
		->get();
	}
	
	public function get_all_inventory()
	{
		return $this->db
		->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name')
		->from('inventory_stocks is')
		->join('batchs b', 'b.batch_id = is.batch_id', 'left')
		->join('sites s', 's.site_id = is.site_id', 'left')
		->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
		->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
		->get();
	}

	public function get_inventory_stock_by_item_code($itemCode)
	{
		return $this->db
		->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name')
		->from('inventory_stocks is')
		->where('is.item_code', $itemCode)
		->join('batchs b', 'b.batch_id = is.batch_id', 'left')
		->join('sites s', 's.site_id = is.site_id', 'left')
		->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
		->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
		->get();
	}
	
	public function get_all_batch_by_item_code($item_code)
	{
		return $this->db->where('item_code', $item_code)->get('batchs');
	}
	
	public function get_batch($batch_reference)
	{
		return $this->db->where('batch_reference', $batch_reference)->get('batchs');
	}
	
	public function insert_item_uom_conversion($array)
	{
		if ( $this->db->insert('item_uom_conversions', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_item($array)
	{
		if ( $this->db->insert('items', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_uom_history($new_conversion)
	{
		$data_list = array(
			'base_amount', 'alternative_uom', 'alternative_uom_description'
		);
		
		$old_conversion = $this->get_item_uom_conversion_by_id($new_conversion['conversion_id'])->row_array();
		
		$now = date('Y-m-d H:i:s');
		
		$changed = false;
		foreach($data_list as $key){
			if($old_conversion[$key] != $new_conversion[$key]){
				$changed = true;
				break;
			}
		}
		
		if($changed){
			$insert = array(
				'item_code' => $new_conversion['item_code'],
				'user_id' => $this->session->userdata('user_id'),
				'section' => 'UOM',
				'field' => 'Tabel Konversi',
				'old_data' => "1".$old_conversion['alternative_uom'].$old_conversion['alternative_uom_description']."=".$old_conversion['base_amount'].$old_conversion['base_uom'].$old_conversion['base_uom_description'],
				'new_data' => "1".$new_conversion['alternative_uom'].$new_conversion['alternative_uom_description']."=".$new_conversion['base_amount'].$new_conversion['base_uom'].$new_conversion['base_uom_description'],
			);
			$this->insert_item_update_history($insert);
		}	
	}
	
	public function insert_item_history($new_item)
	{
		$data_list = array(
			'item_name' => array('field' => 'Nama', 'section' => 'Umum'),
			'item_type' => array('field' => 'Tipe', 'section' => 'Umum'),
			'item_category' => array('field' => 'Kategori', 'section' => 'Umum'),
			'extra1' => array('field' => 'Extra 1', 'section' => 'Umum'),
			'extra2' => array('field' => 'Extra 2', 'section' => 'Umum'),
			'remarks' => array('field' => 'Catatan', 'section' => 'Umum'),
			'item_unit' => array('field' => 'UOM Dasar', 'section' => 'UOM'),
			'unit_description' => array('field' => 'Deskripsi UOM', 'section' => 'UOM'),
			'value_currency' => array('field' => 'Nilai per UOM Dasar', 'section' => 'Nilai'),
			'value_amount' => array('field' => 'Amount', 'section' => 'Nilai'),
			'item_image' => array('field' => 'Gambar', 'section' => 'Gambar'),
		);
		
		$old_item = $this->get_item_by_item_code($new_item['item_code'])->row_array();
		
		$now = date('Y-m-d H:i:s');
		
		foreach($data_list as $key => $value){
			if($old_item[$key] != $new_item[$key]){
				$insert = array(
					'item_code' => $new_item['item_code'],
					'user_id' => $this->session->userdata('user_id'),
					'section' => $value['section'],
					'field' => $value['field'],
					'old_data' => $old_item[$key],
					'new_data' => $new_item[$key],
					'date_created' => $now
				);
				$this->insert_item_update_history($insert);
			}
		}
	}
	
	public function insert_item_update_history($array)
	{
		if ( $this->db->insert('item_update_histories', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function update_item_uom_conversion($data)
	{
		$this->db->update(
				'item_uom_conversions',
				$data,
				array('conversion_id' => $data['conversion_id'])
				);
	}
	
	public function update_item($data)
	{
		unset($data['location_list']);
		$this->db->update(
				'items',
				$data,
				array('item_code' => $data['item_code'])
				);
	}
	
	public function update_item_base_uom($item_code, $base_uom, $base_uom_description)
	{
		$this->db->update(
				'item_uom_conversions',
				array(
						'base_uom' => $base_uom,
						'base_uom_description' => $base_uom_description
				),
				array('item_code' => $item_code)
				);
	}
	
	public function get_combined_item_list_by_customer_id($customer_id)
	{
		return $this->db
			->where('customer_id', $customer_id)
		->get('customer_combined_items');
	}
	
	public function get_combined_item_by_item_code($item_code)
	{
		return $this->db
			->where('item_code', $item_code)
		->get('customer_combined_items');
	}
	
	public function insert_combined_item($array)
	{
		if ( $this->db->insert('customer_combined_items', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function new_combined_item($item)
	{
		$array_combined_item = array(
			'customer_id' => $item['customer_id'],
			'item_code' => $item['item_code'],
			'item_name' => $item['item_name'],
		);
		
		if(isset($item['item_unit'])){
			$array_combined_item['item_unit'] = $item['item_unit'];
		};
		if(isset($item['value_currency'])){
			$array_combined_item['value_currency'] = $item['value_currency'];
		};
		if(isset($item['value_amount'])){
			$array_combined_item['value_amount'] = $item['value_amount'];
		};
		
		$child_code_list = array();
		foreach($item['children'] as $child){
			array_push($child_code_list, $child['item_code']);
		}
		$array_combined_item['child_items'] = json_encode($child_code_list);
		
		$this->item_model->insert_combined_item($array_combined_item);
	}
	
	public function bl_get_order_item_list_by_order_id($order_id)
	{
		$order_item_list = array();
		
		$order_items = $this->order_model->get_order_items($order_id)->result_array();
		
		foreach ($order_items as $order_item) {
			$array_temp = array(
				'item_code' => $order_item['item_code'],
				'length_width_height' => $order_item['length'].'x'.$order_item['width'].'x'.$order_item['height'],
				'quantity' => $order_item['quantity'],
				'material_type' => $order_item['material_type'],
				'remark' => $order_item['remark'],
				'level' => 'E'
			);
			
			if($order_item['child_items'] != NULL){
				$array_temp['item_name'] = $this->item_model->get_combined_item_by_item_code($order_item['item_code'])->row()->item_name;
				$array_temp['children'] = json_decode($order_item['child_items']);
			}
			
			array_push($order_item_list, $array_temp);
		}
		
		return $order_item_list;
	}
	
	public function bl_get_item_name_by_item_code($item_code)
	{
		$item = $this->item_model->get_item_by_item_code($item_code);
		
		if($item->num_rows() > 0){
			return $item->row()->item_name;
		}
		else {
			$combined_item = $this->item_model->get_combined_item_by_item_code($item_code);
			
			if($combined_item->num_rows() > 0){
				return $combined_item->row()->item_name;
			}
			else{
				return "";
			}
		}
	}
	
	public function bl_get_item_unit_by_item_code($item_code)
	{
		$item = $this->item_model->get_item_by_item_code($item_code);
		
		if($item->num_rows() > 0){
			return $item->row()->item_unit;
		}
		else {
			$combined_item = $this->item_model->get_combined_item_by_item_code($item_code);
			
			if($combined_item->num_rows() > 0){
				return $combined_item->row()->item_unit;
			}
			else{
				return "";
			}
		}
	}
}
