<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inventoryapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('inventory_model','auditlog_model', 'stock_movement_db', 'inventory_bl', 'user_model', 'user_bl', 'item_db', 'category_db'));
	}
	
	public function get_stock_setting_by_reference($reference){
		$stock_setting = $this->inventory_model->get_stock_setting_by_reference($reference);
		
		$manual_stock_setting_id = $stock_setting->row()->manual_stock_setting_id;
		
		$feedback = array(
			'call_status' => 'success',
			'stock_setting' => $stock_setting->row_array(),
			'stock_setting_items' => $this->inventory_model->get_stock_setting_item_list_by_stock_setting_id($manual_stock_setting_id)->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function insert_stock_setting(){
		/*if (!$this->_check_is_logged_on()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {*/
			// ambil data dari post
			$json = file_get_contents('php://input');
			
			$this->db->trans_start();
			
			//$this->auditlog_model->insert_audit_log("vendorapi","insert_vendor",$json);
			
			$data = json_decode($json, true);
			
			$manual_stock_setting_reference = $this->inventory_bl->insert_stock_setting($data);
			
			$this->db->trans_complete();
			
			$array = array(
				'call_status' => 'success',
				'reference' => $manual_stock_setting_reference
			);
		//}
		
		echo json_encode($array);
	}
	
	public function reject_stock_setting_by_reference ($reference){
		$update = array(
				'manual_stock_setting_reference' => $reference,
				'status'	=> 'X'
		);
		
		$this->inventory_model->reject_stock_setting_by_reference($update);
		
		$feedback = array(
				'call_status' => 'success'
				
		);
		
		echo json_encode($feedback);
	}
	
	public function get_stock_movement_list_by_item_code($item_code)
	{
		$feedback = array(
			'call_status' => 'success',
			'stock_movement_list' => $this->stock_movement_db->get_stock_movement_list_by_item_code($item_code)->result_array()	
		);
		
		echo json_encode($feedback);
	}
	
	public function is_site_empty($site_id)
	{
		$feedback = array(
			'call_status' => 'success',
			'empty' => $this->inventory_bl->is_site_empty($site_id)	
		);
		
		echo json_encode($feedback);
	}

	public function get_opname_by_creator_id()
	{
		$user_id = $this->session->userdata('user_id');
		
		$feedback = array(
			'call_status' => 'success',
			'opname_list' => $this->inventory_db->get_opname_by_creator_id($user_id)->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_opname_list()
	{
		$feedback = array(
			'call_status' => 'success',
			'opname_list' => $this->inventory_db->get_opname_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_opname_detail($stock_opname_id)
	{
		$feedback = array(
			'call_status' => 'success',
			'opname' => $this->inventory_db->get_opname_detail($stock_opname_id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_opname_item_list($stock_opname_id)
	{
		$feedback = array(
			'call_status' => 'success',
			'opname_item_list' => $this->inventory_db->get_opname_item_list($stock_opname_id)->result_array()
		);
		
		echo json_encode($feedback);
	}
	public function start_opname_by_month() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "405",
				"error_message" => "User not logged on"
			);
		} else {
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		
			$site_id = $data->site_id;
			$opname_start_date = $data->opname_start_date;
			$opname_start_date = date($opname_start_date);
			
			$time=strtotime($opname_start_date);
			$day=date("t",$time);
			$month=date("m",$time);
			$year=date("Y",$time);
			$start_date = date($year."-".$month."-01");
			$end_date = $year."-".$month."-".$day;
			$opname_date = $year."/".$month;
			$is_opname_exist = $this->inventory_db->is_opname_exist($opname_date, $site_id);
			if($is_opname_exist->num_rows() > 0){
				$array = array(
					"call_status" => "error",
					"error_code" => "405",
					"error_message" => "Opname already exist"
				);
			}else{
			$insert_stock_opname = array (
				'opname_date' => $opname_date,
				'opname_start_date' => $start_date,
				'opname_finish_date' => $end_date,
				'site_id' => $site_id,
				'opname_creator_id' => $this->session->userdata('user_id')
			);
			$stock_opname = $this->inventory_db->insert_stock_opname($insert_stock_opname);
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'date' => $opname_start_date,
				'stock_opname_id' => $stock_opname
			);
			}
		}
		
		echo json_encode($array);
	}
	
	public function start_opname_item_by_month() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
		$json = file_get_contents('php://input');
		$data = json_decode($json);
		
			$site_id = $data->site_id;
			$opname_start_date = $data->opname_start_date;
			$opname_start_date = date($opname_start_date);
			$stock_opname = $data->stock_opname_id;
			$list = $this->inventory_bl->start_opname_item($site_id, $opname_start_date);
			
			foreach($list as $l){
				$insert_stock_opname_item = array(
					'stock_opname_id' => $stock_opname,
					'item_code' => $l['item_code'],
					'site_id' => $site_id,
					'batch_id' => $l['batch_id'],
					'base_uom' => $l['uom'],
					'system_quantity' => $l['base_uom_quantity'],
					//'remark' => $l['item_code'],
				);
				$stock_opname_item = $this->inventory_db->insert_stock_opname_item($insert_stock_opname_item);
			}
			// feedback API
			$array = array(
				'call_status' => 'success',
				'list' => $list,
				'date' => $opname_start_date,
				'stock_opname_id' => $stock_opname
			);
		}
		
		echo json_encode($array);
	}
	
	public function is_user_has_opname_access(){
		
		$stock_opname = $this->user_bl->is_user_has_access("STOCKOPNAME");
		
		$feedback = array(
			'call_status' => 'success',
			'stock_opname_access' => $stock_opname
		);
		
		echo json_encode($feedback);
	}
	
	public function approve_opname_item (){
		
		$json = file_get_contents('php://input');
		$data = json_decode($json, true);
		
		$opname_item = $data['opname_item'];
		$adjustment_quantity = $opname_item['aktual_quantity'] - $opname_item['system_quantity'];
		if($adjustment_quantity > 0){
			$insert = array(
				'item_code'	=> $opname_item['item_code'],
				'site_id'	=> $opname_item['site_id'],
				'batch_id'	=> $opname_item['batch_id'],
				'quantity'	=> $adjustment_quantity			
			);
			$this->inventory_bl->add_stock_quantity($insert, $adjustment_quantity);
		}else{
			$adjustment_quantity = $opname_item['system_quantity'] - $opname_item['aktual_quantity'];
			$this->inventory_bl->subtract_stock_quantity($opname_item, $adjustment_quantity);
			$adjustment_quantity = $opname_item['aktual_quantity'] - $opname_item['system_quantity'];
		}
		
		$update = array(
				'approver_id' => $this->session->userdata('user_id'),
				'aktual_quantity' => $opname_item['aktual_quantity'],
				'adjustment_quantity' => $adjustment_quantity,
				'stock_opname_item_id' => $opname_item['stock_opname_item_id'],
				'status'	=> 'A'
		);
		
		$this->inventory_db->update_stock_item($update);
		
		$feedback = array(
				'call_status' => 'success',
				'data' => $data,
				'adjustment' => $adjustment_quantity
				
		);
		
		echo json_encode($feedback);
	}
	
	public function get_stock_display()
	{
		$feedback= array(
				'call_status' => 'success',
				'stock_display_list' => $this->inventory_db->get_stock_display()->result_array(),
		);
		echo json_encode($feedback);
	}
	
	public function get_stock_display_by_filter()
	{
		$json = file_get_contents('php://input');
		$data = json_decode($json, true);
		$array_tag = array();
		if(!empty($data['tag'])){
			foreach($data['tag'] as $tag){
				$tag_id = $this->item_db->get_tag($tag['tag_name'])->row()->tag_id;
				array_push($array_tag, $tag_id);
			}
		}
		$array_get = array (
			'site_id' => $data['site_id'],
			'tags' => $array_tag,
			'count_tags' => count($array_tag)
		);
		$feedback= array(
				'call_status' => 'success',
				'stock_display_list' => $this->inventory_db->get_stock_display_by_filter($array_get)->result_array(),
				'tags' => $array_tag,
		);
		echo json_encode($feedback);
	}
	
	public function get_attribute_value_list_by_attribute_name($attribute_name)
	{
		$feedback= array(
			'call_status' => 'success',
			'attribute_value_list' => $this->inventory_bl->get_attribute_value_list_by_attribute_name($attribute_name),
		);
		echo json_encode($feedback);
	}

	public function is_data_for_import_stock_valid(){
		$json = file_get_contents('php://input');
		$data = json_decode($json, true);
		$array_sheets = array();
		$array_header = array();
		$array_rows = array();
		$array_result = array();
		$array_result2 = array();
		foreach($data['sheets'] as $sheet){
			$sheet_header=array();
			$sheet_rows=array();
				$header = array();
				$data_row = array();
			foreach($sheet['rows'] as $i => $row){
				if($i == 0){
					foreach($row['cells'] as $j => $cell){
						array_push($header, $cell['value']);
					}
					array_push($sheet_header, $header);
				}else{
					$data_cell = array();
					foreach($row['cells'] as $j => $cell){
						array_push($data_cell, $cell['value']);
					}
					if(count($header) != count($data_cell)){
						foreach($header as $k => $val){
							if(!isset($data_cell[$k])){
								$data_cell[$k] = null;
							}
						}
					}
					array_push($data_row, $data_cell);
				}
			}
			foreach($data_row as $dr){
				$combined = array_combine($header, $dr);
				array_push($array_result, $combined);
			}
			array_push($array_header, $sheet_header);
			array_push($array_rows, $sheet_rows);
		}
		foreach($array_result as $result){
			$res = array();
			foreach($result as $header => $value){
				foreach($data['column_list'] as $column => $column_name){
					if($header == $column_name){
						$res[$column] = $value;
					}
				}
			}
			array_push($array_result2, $res);
		}
		$check = $this->check_is_data_for_import_stock_valid($array_result2);
		$feedback= array(
				'call_status' => 'success',
				'result' => $array_result2,
				'check' => $check
		);
		echo json_encode($feedback);
	}
	public function check_is_data_for_import_stock_valid($data){
		function validateDate($date)
		{
			//$date = DateTime::createFromFormat("dd/mm/YY", $date);
			//return ($date === false ? false : true);
			$newDate = date("m/d/Y", strtotime($date));
			$d = DateTime::createFromFormat("m/d/Y", $newDate);
			return $d && $d->format("m/d/Y") == $newDate;
		}
		// check if item_code is exist
		$item_insert_valid = array();
		$item_update_valid = array();
		$item_invalid = array();
		foreach($data as $dt){
			$error_messages = array();
			if(!empty($dt['no'])){
			if($dt['item_code'] != NULL){
				$item = $this->item_db->get_item_by_item_code($dt['item_code']);
				if($dt['action'] == "Baru"){
					if($item->num_rows() > 0){
						array_push($error_messages, "Duplicate ArticleID/SKU");
					}
				}elseif($dt['action'] == "Ubah"){
					if($item->num_rows() == 0){
						array_push($error_messages, "There is no matching ArticleID/SKU's");
					}
				}else{
					array_push($error_messages, "Please define baru/ubah for this item");
				}
			}else{
				array_push($error_messages, "ArticleID/SKU can't be empty");
			}
			
			
			if($dt['item_name'] != NULL || $dt['item_name'] != ""){
				
			}else{
				if($dt['action'] != "Ubah"){
					array_push($error_messages, "Nama can't be empty");
				}
			}
			
			
			if($dt['sell_price_type']!= NULL){
				if($dt['sell_price_type'] == "Persen" || $dt['sell_price_type'] == "P"){
					
				}elseif($dt['sell_price_type'] == "Tambah"){
					
				}elseif($dt['sell_price_type'] == "Tetap"){
					
				}else{
					array_push($error_messages, "Harga Jual must between (Persen/Tambah/Tetap)");
				}
			}else{
				if($dt['action'] != "Ubah"){
					array_push($error_messages, "Harga Jual can't be empty");
				}
			}
			
			if($dt['discount_type'] != NULL){
				if($dt['discount_type'] == "Normal" || $dt['discount_type'] == "N"){
					
				}elseif($dt['discount_type'] == "Persen" || $dt['discount_type'] == "P"){

					if(!validateDate($dt['discount_start_date'])){
						array_push($error_messages, "Invalid Tgl Diskon Mulai");
					}
					if(!validateDate($dt['discount_end_date'])){
						array_push($error_messages, "Invalid Tgl Diskon Selesai");
					}
				}elseif($dt['discount_type'] == "Tetap" || $dt['discount_type'] == "T"){
					if(!validateDate($dt['discount_start_date'])){
						array_push($error_messages, "Invalid Tgl Diskon Mulai");
					}
					if(!validateDate($dt['discount_end_date'])){
						array_push($error_messages, "Invalid Tgl Diskon Selesai");
					}
				}else{
					array_push($error_messages, "Diskon must between (Normal/Persen/Tetap)");
				}
			}
			
			
			$count_error = count($error_messages);
			if($count_error > 0){
				$dt['error_messages'] = $error_messages;
				array_push($item_invalid, $dt);
			}else{
				if($dt['action'] == "Baru"){
					array_push($item_insert_valid, $dt);
				}else{
					array_push($item_update_valid, $dt);
				}
			}
			
			}
			/*
			if($dt['item_code'] != NULL){
				$item = $this->item_db->get_item_by_item_code($dt['item_code']);
				if($dt['action'] == "Baru"){
					if($item->num_rows() > 0){
						$dt['error_messages'] = "Duplicate ArticleID/SKU";
						array_push($item_invalid, $dt);
					}else{
						array_push($item_insert_valid, $dt);
					}
				}elseif($dt['action'] == "Ubah"){
					if($item->num_rows() > 0){
						array_push($item_update_valid, $dt);
					}else{
						$dt['error_messages'] = "There is no matching ArticleID/SKU's";
						array_push($item_invalid, $dt);
					}
				}else{
					$dt['error_messages'] = "Please define baru/ubah for this item";
					array_push($item_invalid, $dt);
				}
			}else{
				$dt['error_messages'] = "ArticleID/SKU can't be empty";
				array_push($item_invalid, $dt);
			}
			*/
		}
		$return= array(
			'insert_valid' => $item_insert_valid,
			'update_valid' => $item_update_valid,
			'invalid' => $item_invalid
		);
		return $return;
	}
	public function start_import_stock(){
		$json = file_get_contents('php://input');
		$data = json_decode($json, true);
		foreach($data as $item){
			if(!empty($item['no'])){
				unset($item['no']);
				//unset($item['action']);
				//unset($item['category']);
				unset($item['availability']);
				unset($item['sell_price_type']);
				//unset($item['discount_type']);
				//unset($item['discount_start_date']);
				//unset($item['discount_end_date']);
				//unset($item['tag']);
				unset($item['remark']);
				unset($item['attributes']);
				
				//Discount
				$start = date("Y-m-d H:i:s", strtotime($item['discount_start_date']));
				$end = date("Y-m-d H:i:s", strtotime($item['discount_end_date']));
				//$start = DateTime::createFromFormat('d/m/Y', $item['discount_start_date']);
				//$end = DateTime::createFromFormat('d/m/Y', $item['discount_end_date']);
				if(!empty($start) && !empty($end)){
					$item['discount_start_date'] = date_create($start);//->format('d/m/Y');
					$item['discount_end_date'] = date_create($end);//->format('d/m/Y');
				}else{
					$item['discount_start_date'] = null;
					$item['discount_end_date'] = null;
				}
				switch ($item['discount_type']){
					case "Normal":
					case "N":
						break;
					case "Persen":
					case "P":
						$item['discount_perc_start_date'] = date_format($item['discount_start_date'], "Y-m-d");
						$item['discount_perc_end_date'] = date_format($item['discount_end_date'], "Y-m-d");
						break;
					case "Tetap":
					case "T":
						$item['discount_special_price_start_date'] = date_format($item['discount_start_date'], "Y-m-d");
						$item['discount_special_price_end_date'] = date_format($item['discount_end_date'], "Y-m-d");
						break;
					default:
						$item['discount_type'] = "N";
						break;
				}
				unset($item['discount_start_date']);
				unset($item['discount_end_date']);
				//End Discount
				
				//Categories
				$category = $this->category_db->get_category_by_reference($item['category']);
				if($category->num_rows() > 0){
					$item['category_id'] = $category->row()->category_id;
				}else{
					$category_name = $item['category'];
					$insert_category = array(
						"category_name" => $category_name
					);
					$item['category_id'] = $this->category_db->insert_category($insert_category);
				}
				unset($item['category']);
				//End Categories
				
				//Tags
				if($item['tag'] != NULL){
					$item['tag'] = str_replace(", ",",",$item['tag']);
					$tags = explode(",", $item['tag']);
					foreach($tags as $t){
						$tag = $this->item_db->get_tag($t);
						if($tag->num_rows() > 0){
							$tag_id = $tag->row()->tag_id;
							$item_tags = $this->item_db->get_item_tags($tag_id, $item['item_code']);
							if($item_tags->num_rows() > 0){
								$update_item_tag = array(
									"item_tag_id" => $item_tags->row()->item_tag_id,
									"status" => "A"
								);
								$this->item_db->update_item_tag($update_item_tag);
							}else{
								$insert_item_tag = array(
									"tag_id" => $tag_id,
									"item_code" => $item['item_code']
								);
								$this->item_db->insert_item_tag($insert_item_tag);
							}
						}else{
							$insert_tag = array(
								"tag_name" => $t
							);
							$tag_id = $this->item_db->insert_tag($insert_tag);
							$insert_item_tag = array(
								"tag_id" => $tag_id,
								"item_code" => $item['item_code']
							);
							$this->item_db->insert_item_tag($insert_item_tag);
						}
					}
				}
				unset($item['tag']);
				//End Tags
				
				if($item['action'] == "Baru"){
					unset($item['action']);
					$this->item_db->insert_item($item);
				}else{
					unset($item['action']);
					$this->item_db->update_item($item);
				}
			}
		}
		
		
		$feedback = array(
			'call_status' => 'success'
		);
		
		echo json_encode($feedback);
	}
	
	public function total_today_stock_value()
	{
		$feedback = array(
			'call_status' => 'success',
			'available_stock_value' => $this->inventory_bl->total_today_available_stock_value(),
			'consignment_stock_value' => $this->inventory_bl->total_today_consignment_stock_value(),
		);
		
		echo json_encode($feedback);
	}
	
	public function get_all_inventory()
	{
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
			//echo print_r($array['inventList']);
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
}