<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Item_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('item_db', 'order_model'));
	}
	
	public function get_combined_item_list_by_customer_id($customer_id)
	{
		$item_list = $this->item_db->get_combined_item_list_by_customer_id($customer_id)->result_array();
		
		foreach ($item_list as &$item){
			$item['children'] = array();
			
			$child_item_code_list = json_decode($item['child_items'],  true);
			
			foreach ($child_item_code_list as $item_code){
				$data = $this->item_db->get_item_by_item_code($item_code)->row_array();
				$data['length_width_height'] = $data['length']." x ".$data['width']." x ".$data['height'];
				array_push($item['children'], $data);
			}
			$item['level'] = "E";
		}
		
		return $item_list;
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
		
		$this->item_db->insert_combined_item($array_combined_item);
	}
	
	public function get_order_item_list_by_order_id($order_id)
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
				$array_temp['item_name'] = $this->item_db->get_combined_item_by_item_code($order_item['item_code'])->row()->item_name;
				$array_temp['children'] = json_decode($order_item['child_items']);
			}
			
			array_push($order_item_list, $array_temp);
		}
		
		return $order_item_list;
	}
	
	public function get_item_name_by_item_code($item_code)
	{
		$item = $this->item_db->get_item_by_item_code($item_code);
		
		if($item->num_rows() > 0){
			return $item->row()->item_name;
		}
		else {
			$combined_item = $this->item_db->get_combined_item_by_item_code($item_code);
			
			if($combined_item->num_rows() > 0){
				return $combined_item->row()->item_name;
			}
			else{
				return "";
			}
		}
	}
	
	public function get_item_unit_by_item_code($item_code)
	{
		$item = $this->item_db->get_item_by_item_code($item_code);
		
		if($item->num_rows() > 0){
			return $item->row()->item_unit;
		}
		else {
			$combined_item = $this->item_db->get_combined_item_by_item_code($item_code);
			
			if($combined_item->num_rows() > 0){
				return $combined_item->row()->item_unit;
			}
			else{
				return "";
			}
		}
	}
	
	public function insert_uom_history($new_conversion)
	{
		$data_list = array(
			'base_amount', 'alternative_uom', 'alternative_uom_description'
		);
		
		$old_conversion = $this->item_db->get_item_uom_conversion_by_id($new_conversion['conversion_id'])->row_array();
		
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
			$this->item_db->insert_item_update_history($insert);
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
		);
		
		$old_item = $this->item_db->get_item_by_item_code($new_item['item_code'])->row_array();
		
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
				$this->item_db->insert_item_update_history($insert);
			}
		}
	}
	
	public function update_item_location($data)
	{
		foreach($data as $location){
			$param = array(
				'item_code' => $location['item_code'],
				'site_id' => $location['site_id'],
				'storage_id' => $location['storage_id'],
				'bin_id' => $location['bin_id'],
			);
			
			$query = $this->item_db->get_item_location_by_data($param);
			
			if($query->num_rows() > 0){
				$location_db = $query->row_array();
				
				if($location_db['status'] != $location['status']){
					$update = array('status' => $location['status']);
					$this->item_db->update_item_location_by_id($location_db['item_location_id'], $update);
				}
			}
			else{
				if($location['status'] == 'A'){
					$this->item_db->insert_item_location($param);
				}
			}
		}
	}
	
	public function update_item_alternate($data)
	{
		foreach($data as $location){
			$param = array(
				'item_code' => $location['item_code'],
				'alternate_code' => $location['alternate_code'],
				'alternate_name' => $location['alternate_name'],
			);
			
			$query = $this->item_db->get_item_alternate_by_data($param);
			
			if($query->num_rows() > 0){
				$location_db = $query->row_array();
				
				if($location_db['status'] != $location['status']){
					$update = array('status' => $location['status']);
					$this->item_db->update_item_alternate_by_id($location_db['item_alternate_id'], $update);
				}
			}
			else{
				if($location['status'] == 'A'){
					$this->item_db->insert_item_alternate($param);
				}
			}
		}
	}
	
	public function convert_to_base_uom_quantity($item_code, $alternative_uom_quantity, $alternative_uom)
	{
		$query = $this->item_db->get_item_uom_conversion_by_item_code_and_item_unit($item_code, $alternative_uom);
		if($query->num_rows() > 0){
			$item_uom = $query->row_array();
			return $alternative_uom_quantity * $item_uom['base_amount'];
		}else{
			return $alternative_uom_quantity;
		}
	}
}
