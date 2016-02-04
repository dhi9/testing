<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Itemapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('item_model', 'auditlog_model','user_model', 'item_db', 'item_bl', 'attribute_db', 'site_model', 'category_db'));
	}
	
	public function _check_is_logged_on()
	{
		if($this->session->userdata('username') != NULL)
		{
			return true;
		}
		
		return false;
	}
	
	public function get_all_items()
	{
		if (! $this->user_model->is_user_logged_in()) {
				$array = array(
						"call_status" => "error",
						"error_code" => "701",
						"error_message" =>"User not logged on"
				);
		}
		else {
			$items = $this->item_db->get_all_items()->result_array();
			$item_list = array();
			foreach($items as $i){
				$category = $this->category_db->get_category_by_id($i['category_id'])->row_array();
				$i['category_name'] = $category['category_name'];
				array_push($item_list, $i);
			}
			
			$array = array(
				'call_status' => 'success',
				'item_details_list' => $item_list
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_raw_item_list()
	{
		if (! $this->user_model->is_user_logged_in()) {
				$array = array(
						"call_status" => "error",
						"error_code" => "701",
						"error_message" =>"User not logged on"
				);
		}
		else {
			$array = array(
				'call_status' => 'success',
				'item_list' => $this->item_model->get_raw_item_list()->result_array()
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_item_alternate_list($item_code)
	{
		if (! $this->user_model->is_user_logged_in()) {
				$array = array(
						"call_status" => "error",
						"error_code" => "701",
						"error_message" =>"User not logged on"
				);
		}
		else {
			$array = array(
				'call_status' => 'success',
				'item_alternate_list' => $this->item_model->get_item_alternate_list($item_code)->result_array()
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_tag_list()
	{
		if (! $this->user_model->is_user_logged_in()) {
				$array = array(
						"call_status" => "error",
						"error_code" => "701",
						"error_message" =>"User not logged on"
				);
		}
		else {
			$array = array(
				'call_status' => 'success',
				'tag_list' => $this->item_db->get_tag_list()->result_array()
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_tag_list_with_stock()
	{
		if (! $this->user_model->is_user_logged_in()) {
				$array = array(
						"call_status" => "error",
						"error_code" => "701",
						"error_message" =>"User not logged on"
				);
		}
		else {
			$tag_list = $this->item_db->get_tag_list()->result_array();
			$i = 0;
			foreach($tag_list as $tl){
				$count_stock = $this->item_db->get_items_with_tag($tl['tag_id'])->num_rows();
				$tag_list[$i]['stock'] = $count_stock;
				$i += 1;
			}
			$array = array(
				'call_status' => 'success',
				'tag_list' => $tag_list
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_item_tag_list($item_code)
	{
		if (! $this->user_model->is_user_logged_in()) {
				$array = array(
						"call_status" => "error",
						"error_code" => "701",
						"error_message" =>"User not logged on"
				);
		}
		else {
			$array = array(
				'call_status' => 'success',
				'tag_list' => $this->item_db->get_item_tag_list($item_code)->result_array()
			);
		}
		
		echo json_encode($array);
	}
	public function get_tag()
	{
		if (! $this->user_model->is_user_logged_in()) {
				$array = array(
						"call_status" => "error",
						"error_code" => "701",
						"error_message" =>"User not logged on"
				);
		}
		else {
			$tag_name = file_get_contents('php://input');
			$array = array(
				'call_status' => 'success',
				'tag' => $this->item_db->get_tag($tag_name)->row(),
				'tag_name' => $tag_name
			);
		}
		
		echo json_encode($array);
	}
	public function get_item($item_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
				$array = array(
						"call_status" => "error",
						"error_code" => "701",
						"error_message" =>"User not logged on"
				);
		}
		else {
			$item = $this->item_model->get_item($item_id)->row_array();
			
			$array = array(
				'call_status' => 'success',
				'item_details' => $item
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_item_by_item_code($item_code)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$item = $this->item_model->get_item_by_item_code($item_code)->row_array();
			$item['location_list'] = $this->item_db->get_item_location_list($item_code)->result_array();
			$item['item_image'] = json_decode($item['item_image']);
			
			$array = array(
				'call_status' => 'success',
				'item_details' => $item
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_item_with_uom_by_item_code($item_code)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$item = $this->item_model->get_item_by_item_code($item_code)->row_array();
			$item['uom_list'] = $this->item_model->get_item_uom_conversion_list_by_item_code($item_code)->result_array();
			$item_unit = array(
				'alternative_uom' => $item['item_unit'] ,
				'alternative_uom_description' => $item['unit_description'],
				'base_amount' => 1,
				'base_uom' => $item['item_unit'],
				'base_uom_description' => $item['unit_description']
				);
			array_push($item['uom_list'], $item_unit);
			$array = array(
				'call_status' => 'success',
				'item_details' => $item
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_item_uom_conversion_list_by_item_code($item_code)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			
			$conversion_list = $this->item_model->get_item_uom_conversion_list_by_item_code($item_code)->result_array();
			$item = $this->item_model->get_item_by_item_code($item_code)->row_array();
			$item_unit = array(
				'alternative_uom' => $item['item_unit'] ,
				'alternative_uom_description' => $item['unit_description'],
				'base_amount' => 1,
				'base_uom' => $item['item_unit'],
				'base_uom_description' => $item['unit_description']
				);
			array_push($conversion_list, $item_unit);
			
			$array = array(
					'call_status' => 'success',
					'conversion_list' => $conversion_list
			);
		}
	
		echo json_encode($array);
	}
	
	public function get_item_uom_history_list_by_item_code($item_code)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->item_model->get_item_uom_history_list_by_item_code($item_code)->result_array();
			$no = 0;
			foreach($history_list as $hl){
				if($hl['section'] == 'Gambar'){
					$history_list[$no]['old_data'] = json_decode($hl['old_data']);
					$history_list[$no]['new_data'] = json_decode($hl['new_data']);
				}
				$no += 1;
			}
			$array = array(
					'call_status' => 'success',
					'history_list' => $history_list
			);
		}
	
		echo json_encode($array);
	}
	
	public function get_manual_stock_setting_list()
	{
		if (!$this->_check_is_logged_on()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$setting_list = $this->item_model->get_manual_stock_setting_list()->result_array();
			
			$array = array(
				'call_status' => 'success',
				'setting_list' => $setting_list
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_inventory_stock_by_item_code($itemCode){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			$items = $this->item_model->get_inventory_stock_by_item_code($itemCode)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'stock_list' => $items
			);
		}
		echo json_encode($array);
	}
	
	public function get_all_inventory()
	{
		$this->load->model('inventory_bl');
		
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			
			$data = json_decode(file_get_contents('php://input'), true);
			//$items = $this->item_model->get_all_inventory()->result_array();
			$where = array(
				'item_code' => $data['item_code']
			);
			if(! empty($data['site_reference'])){
				$array = explode('-', $data['site_reference']);
				$site= array();
				foreach ($array as $a){
					$site_id = $this->item_model->get_site_id_by_site_reference($a)->row_array();
					if ($site_id !== NULL){
						array_push($site, $site_id['site_id']);
					}
				}
				$where['site_id'] = implode(',', $site);
			}
			if(! empty($data['storage_name'])){
				$array = explode('-', $data['storage_name']);
				$storage= array();
				foreach ($array as $a){
					$storage_id = $this->site_model->get_storage_by_storage_name($a)->row_array();
					if ($storage_id !== NULL){
						array_push($storage, $storage_id['storage_id']);
					}
				}
				$where['storage_id'] =  implode(',', $storage);
			}
			if(! empty($data['attributes'])){
				$attributes = explode('-', $data['attributes']);
				$where['attributes'] = $attributes;
			}
			if(! empty($data['tag'])){
				$array = explode('-', $data['tag']);
				$tag= array();
				/*
				foreach ($array as $a){
					$tag_id = $this->item_model->get_site_id_by_site_reference($a)->row_array();
					if ($tag_id !== NULL){
						array_push($tag, $tag_id['tag']);
					}
				}
				$where['tag'] = $tag;
				*/
			}
			
			$array = array(
				'call_status' => 'success',
				'inventList' => $this->inventory_bl->set_stock_status_data_by($where),
				'where' => $where,
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_all_inventory_by_item_code($item_code)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			//$items = $this->item_model->get_all_inventory()->result_array();
			$items = $this->item_model->get_all_inventory_by_item_code($item_code)->result_array();
			$attribute_list = $this->attribute_db->get_attribute_active_list()->result_array();
			$data=array();
			foreach($items as $i ){
				if ($i['bin_name']==null){
					$parent_site = array(
							"parentId" => "",
							"selfId" => $i['site_reference'],
							"name" => $i['site_reference'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => 0,
							"is" => 'site'
					);
					array_push($data, $parent_site);
					
					$parent_storage = array(
							"parentId" => $i['site_reference'],
							"selfId" => $i['storage_name'],
							"name" =>  $i['storage_name'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'storage'
					);
					array_push($data, $parent_storage);
					$batchs = array(
							"parentId" => $i['bin_name'],
							"selfId" => $i['batch_reference'],
							"name" => $i['batch_reference'],
							"quantity" => $i['quantity'],
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'batch'
					);
					array_push($data, $batchs);
				}else {
					$parent_site = array(
							"parentId" => "",
							"selfId" => $i['site_reference'],
							"name" => $i['site_reference'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => 0,
							"is" => 'site'
					);
					array_push($data, $parent_site);
					$parent_storage = array(
							"parentId" => $i['site_reference'],
							"selfId" => $i['storage_name'],
							"name" =>  $i['storage_name'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'storage'
					);
					array_push($data, $parent_storage);
					$parent_bin = array(
							"parentId" => $i['storage_name'] ,
							"selfId" => $i['bin_name'],
							"name" => $i['bin_name'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"is" => 'bin'
					);
					array_push($data, $parent_bin);
					$attribute = (array) json_decode($i['attributes']);
					$result = "";
					$n = 1;
					foreach($attribute as $key => $val){
						if($n > 1){
							$result = $result.", ";
						}
						//$result = $result.$key.":".$val;
						$result = $result.$val;
						$n += 1;
					}
					$batchs = array(
							"parentId" => $i['bin_name'],
							"selfId" => $i['batch_reference']." / ".$result,
							"name" => $i['batch_reference']." / ".$result,
							"quantity" => $i['quantity'],
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'batch'
					);
					array_push($data, $batchs);
				}
			}
			
			function unique_multidim_array($array, $key){
				$temp_array = array();
				$i = 0;
				$key_array = array();
				foreach($array as $val){
					if(!in_array($val[$key],$key_array)){
						$key_array[$i] = $val[$key];
						array_push($temp_array,$val);
					}
					$i++;
				}
				return $temp_array;
			}
			
			$data = unique_multidim_array($data,'selfId');
			$dataCopy = $data;
			$index = 0;
			foreach ($data as $d){
				foreach ($dataCopy as $dc){
					if ($d['is'] == 'batch'){
						if($d['selfId'] == $dc['parentId']){
							$data[$index]['quantity'] += $dc['quantity'];
							$dataCopy = $data;
						}
					}
				}
				$index++;
			}
			
			$index = 0;
			foreach ($data as $d){
				foreach ($dataCopy as $dc){
					if ($d['is'] == 'bin'){
						if($d['selfId'] == $dc['parentId']){
							$data[$index]['quantity'] += $dc['quantity'];
							$dataCopy = $data;
						}
					}
				}
				$index++;
			}
			
			$index = 0;
			foreach ($data as $d){
				foreach ($dataCopy as $dc){
					if ($d['is'] == 'storage'){
						if($d['selfId'] == $dc['parentId']){
							$data[$index]['quantity'] += $dc['quantity'];
							$dataCopy = $data;
						}
					}
				}
				$index++;
			}
			
			$index = 0;
			foreach ($data as $d){
				foreach ($dataCopy as $dc){
					if ($d['is'] == 'site'){
						if($d['selfId'] == $dc['parentId']){
							$data[$index]['quantity'] += $dc['quantity'];
							$dataCopy = $data;
						}
					}
				}
				$index++;
			}
			$array = array(
				'call_status' => 'success',
				'inventList' => $data,
			);
		}
		
		echo json_encode($array);
		//echo json_encode($data);
	}
	
	public function get_all_inventory_by_site_reference($site_reference, $item_code)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			$array = explode('-', $site_reference);
			$site= array();
			foreach ($array as $a){
				$site_id = $this->item_model->get_site_id_by_site_reference($a)->row_array();
				if ($site_id !== NULL){
					array_push($site, $site_id['site_id']);
				}
			}
			//$items = $this->item_model->get_all_inventory()->result_array();
			$items = $this->item_model->get_all_inventory_by_site_reference($site, $item_code)->result_array();
			$attribute_list = $this->attribute_db->get_attribute_active_list()->result_array();
				
			$data=array();
			foreach($items as $i ){
				if ($i['batch_id']==NULL){
					$parent_site = array(
							"parentId" => "",
							"selfId" => $i['site_reference'],
							"name" => $i['site_reference'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => 0,
							"is" => 'site'
					);
					array_push($data, $parent_site);
					$parent_storage = array(
							"parentId" => $i['site_reference'],
							"selfId" => $i['storage_name'],
							"name" =>  $i['storage_name'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'storage'
					);
					array_push($data, $parent_storage);
					$batchs = array(
							"parentId" => $i['storage_name'],
							"selfId" => $i['batch_reference'],
							"name" => $i['batch_reference'],
							"quantity" => $i['quantity'],
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'batch'
					);
					array_push($data, $batchs);
				}elseif ($i['bin_name']==null){
					$parent_site = array(
							"parentId" => "",
							"selfId" => $i['site_reference'],
							"name" => $i['site_reference'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => 0,
							"is" => 'site'
					);
					array_push($data, $parent_site);
					$parent_storage = array(
							"parentId" => $i['site_reference'],
							"selfId" => $i['storage_name'],
							"name" =>  $i['storage_name'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'storage'
					);
					array_push($data, $parent_storage);
					$batchs = array(
							"parentId" => $i['storage_name'],
							"selfId" => $i['batch_reference'],
							"name" => $i['batch_reference'],
							"quantity" => $i['quantity'],
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'batch'
					);
					array_push($data, $batchs);
				}
				else{
					$parent_site = array(
							"parentId" => "",
							"selfId" => $i['site_reference'],
							"name" => $i['site_reference'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => 0,
							"is" => 'site'
					);
					array_push($data, $parent_site);
					$parent_storage = array(
							"parentId" => $i['site_reference'],
							"selfId" => $i['storage_name'],
							"name" =>  $i['storage_name'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'storage'
					);
					array_push($data, $parent_storage);
					$parent_bin = array(
							"parentId" => $i['storage_name'] ,
							"selfId" => $i['bin_name'],
							"name" => $i['bin_name'],
							"quantity" => 0,
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"is" => 'bin'
					);
					array_push($data, $parent_bin);
					$aa = (array) json_decode($i['attributes']);
					$result = "";
					$n = 1;
					foreach($aa as $key => $val){
						if($n > 1){
							$result = $result.", ";
						}
						//$result = $result.$key.":".$val;
						$result = $result.$val;
						$n += 1;
					}
					$batchs = array(
							"parentId" => $i['bin_name'],
							"selfId" => $i['batch_reference']." / ".$result,
							"name" => $i['batch_reference']." / ".$result,
							"quantity" => $i['quantity'],
							"quality" => $i['quality'],
							"block_status" => $i['block_status'],
							"item_code" => $i['item_code'],
							"batch_reference" => $i['batch_reference'],
							"is" => 'batch'
					);
					array_push($data, $batchs);
				}
			}
		}
		function unique_multidim_array($array, $key){
			$temp_array = array();
			$i = 0;
			$key_array = array();
			foreach($array as $val){
				if(!in_array($val[$key],$key_array)){
					$key_array[$i] = $val[$key];
					array_push($temp_array,$val);
				}
				$i++;
			}
			return $temp_array;
		}
		$data = unique_multidim_array($data,'selfId');
		$dataCopy = $data;
		$index = 0;
		foreach ($data as $d){
			foreach ($dataCopy as $dc){
				if ($d['is'] == 'batch'){
					if($d['selfId'] == $dc['parentId']){
						$data[$index]['quantity'] += $dc['quantity'];
						$dataCopy = $data;
					}
				}
			}
			$index++;
		}
	
		$index = 0;
		foreach ($data as $d){
			foreach ($dataCopy as $dc){
				if ($d['is'] == 'bin'){
					if($d['selfId'] == $dc['parentId']){
						$data[$index]['quantity'] += $dc['quantity'];
						$dataCopy = $data;
					}
				}
			}
			$index++;
		}
	
		$index = 0;
		foreach ($data as $d){
			foreach ($dataCopy as $dc){
				if ($d['is'] == 'storage'){
					if($d['selfId'] == $dc['parentId']){
						$data[$index]['quantity'] += $dc['quantity'];
						$dataCopy = $data;
					}
				}
			}
			$index++;
		}
	
		$index = 0;
		foreach ($data as $d){
			foreach ($dataCopy as $dc){
				if ($d['is'] == 'site'){
					if($d['selfId'] == $dc['parentId']){
						$data[$index]['quantity'] += $dc['quantity'];
						$dataCopy = $data;
					}
				}
			}
			$index++;
		}
	
		$inventory = array(
				'call_status' => 'success',
				'inventList' => $data,
		);
		echo json_encode($inventory);
		//echo json_encode($data);
	}
	
	public function get_all_batch_by_item_code($itemCode)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			$batch = $this->item_model->get_all_batch_by_item_code($itemCode)->result_array();
				
			$array = array(
					'call_status' => 'success',
					'batch_list' => $batch
			);
		}
	
		echo json_encode($array);
	}

	public function get_batch_by_batch_reference($batchReference)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			$batch = $this->item_model->get_batch($batchReference)->row_array();
				
			$array = array(
					'call_status' => 'success',
					'batch_info' => $batch
			);
		}
	
		echo json_encode($array);
	}
	
	public function insert_item()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$input = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("itemapi","insert_item",$input);
			
			$data = json_decode($input,true);
			$isExist = $this->item_model->get_item_by_item_code($data['item_code'])->row_array();
			if($isExist !== null){
				$array = array(
					'call_status' => 'duplicate',
				);
			}else{
				$this->item_model->insert_item($data);
				$array = array(
					'call_status' => 'success',
				);
			}		
		}
		
		echo json_encode($array);
	}
	
	public function insert_item_tag()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$input = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("itemapi","insert_tag",$input);
			
			$data = json_decode($input,true);
			
			if($data['exist'] == 'N'){
				
				$tag = array(
					'tag_name' => $data['tag_name'],
					);
				
				$tag_id = $this->item_db->insert_tag($tag);
				
				$item_tag = array(
							 'tag_id' => $tag_id,
							 'item_code' => $data['item_code']
							 );
				$this->item_db->insert_item_tag($item_tag);
			}else{
				$item_tag = array(
							 'tag_id' => $data['tag_id'],
							 'item_code' => $data['item_code']
							 );
				$this->item_db->insert_item_tag($item_tag);
			}
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	public function insert_tag()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$tag_name = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("itemapi", "insert_tag", $tag_name);
			
			$tag = array(
				'tag_name' => $tag_name,
				);
			
			$tag_id = $this->item_db->insert_tag($tag);
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'tag_id' => $tag_id
			);
		}
		
		echo json_encode($array);
	}
	
	public function insert_item_uom_conversion()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			// ambil data dari post
			$input = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("itemapi","insert_item_uom_conversion",$input);
			
			$data = json_decode($input, true);
			
			$this->item_model->insert_item_uom_conversion($data);
			
			$insert = array(
				'item_code' => $data['item_code'],
				'user_id' => $this->session->userdata('user_id'),
				'section' => 'UOM',
				'field' => 'Tabel Konversi',
				'new_data' => 'Data Baru',
			);
			$this->item_model->insert_item_update_history($insert);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function delete_item_uom_conversion()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			// ambil data dari post
			$input = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("itemapi","delete_item_uom_conversion",$input);
			
			$data = json_decode($input, true);
			
			$this->item_model->delete_item_uom_conversion($data);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function update_item_base_uom()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("itemapi","update_item",$json);
			
			$data = json_decode($json, true);
			
			$this->item_model->update_item($data);
			$this->item_model->update_item_base_uom($data['item_code'], $data['item_unit'], $data['unit_description']);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function update_item()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("itemapi","update_item",$json);
				
			$data = json_decode($json, true);
			if(isset($data['item_image'])){
				$data['item_image'] = json_encode($data['item_image'], true);
			}
			unset($data['location_list']);
			//echo print_r($data);
			$this->item_model->insert_item_history($data);
			$this->item_db->update_item($data);
				
			// feedback API
			$array = array(
					'call_status' => 'success'
			);
		}
	
		echo json_encode($array);
	}
	public function remove_item_tag()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$item_tag_id = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("itemapi","change status item tag",$item_tag_id);
			$data = array(
				'item_tag_id' => $item_tag_id,
				'status' => 'X'
			);
			$this->item_db->update_item_tag($data);
				
			// feedback API
			$array = array(
					'call_status' => 'success',
					'a' => $item_tag_id
			);
		}
	
		echo json_encode($array);
	}
	public function update_item_uom_conversion()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
					"call_status" => "error",
					"error_code" => "702",
					"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			// ambil data dari post
			$input = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("itemapi","update_item_uom_conversion",$input);
				
			$data = json_decode($input, true);
				
			$this->item_model->insert_uom_history($data);
			$this->item_model->update_item_uom_conversion($data);
				
			// feedback API
			$array = array(
					'call_status' => 'success'
			);
		}
	
		echo json_encode($array);
	}
	
	public function update_item_location()
	{
		/*if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
					"call_status" => "error",
					"error_code" => "702",
					"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		else {*/
			//$this->db->trans_start();
			
			$input = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("itemapi","update_item_location",$input);
				
			$data = json_decode($input, true);
			
			$this->item_bl->update_item_location($data);
			
			//$this->db->trans_complete();
			
			if($this->db->trans_status() == FALSE){
				$array = array(
					'call_status' => 'error',
					'title' => 'Update Lokasi Item Gagal',
					'text' => 'Terjadi masalah saat mengakses database'
				);
			}
			else{
				$array = array(
					'call_status' => 'success',
					'title' => 'Update Lokasi Item Berhasil',
					'text' => ''
				);
			}
		//}
	
		echo json_encode($array);
	}
	
	public function update_item_alternate()
	{
		/*if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
					"call_status" => "error",
					"error_code" => "702",
					"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		else {*/
			//$this->db->trans_start();
			
			$input = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("itemapi","update_item_alternate",$input);
				
			$data = json_decode($input, true);
			
			$this->item_bl->update_item_alternate($data);
			
			//$this->db->trans_complete();
			
			if($this->db->trans_status() == FALSE){
				$array = array(
					'call_status' => 'error',
					'title' => 'Update Alternate Item Gagal',
					'text' => 'Terjadi masalah saat mengakses database'
				);
			}
			else{
				$array = array(
					'call_status' => 'success',
					'title' => 'Update Alternate Item Berhasil',
					'text' => ''
				);
			}
		//}
	
		echo json_encode($array);
	}
	
	/*public function update_item_location()
	{
		$array = array(
			'call_status' => 'success',
			'title' => 'Update Lokasi Item Berhasil',
			'text' => ''
		);
	
		echo json_encode($array);
	}*/
	
	public function get_item_delivery_by_delivery_item_id($id)
	{
		$item = $this->item_db->get_item_delivery_by_delivery_item_id($id)->row_array();
		
		$array = array(
			'call_status' => 'success',
			'item' => $item
		);
	
		echo json_encode($array);
	}
	public function update_tag()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$tag = file_get_contents('php://input');
			$data = json_decode($tag, TRUE);
			
			$this->auditlog_model->insert_audit_log("itemapi","update tag",$tag);
			$update = array(
				'tag_id' => $data['tag_id'],
				'tag_name' => $data['tag_name'],
			);
			if(! empty($data['status'])){
				$update['status'] = $data['status'];
				$update_items = array(
				'tag_id' => $data['tag_id'],
				//'status' => $data['status'],	
				'status' => "X",				  
				);
				$this->item_db->update_all_item_tag($update_items);
			}
			$this->item_db->update_tag($update);
				
			// feedback API
			$array = array(
					'call_status' => 'success',
					'updated' => $update
			);
		}
	
		echo json_encode($array);
	}
}
