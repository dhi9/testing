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
					'system_quantity' => $l['uom_quantity'],
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
		foreach($data['tag'] as $tag){
			$tag_id = $this->item_db->get_tag($tag['tag_name'])->row()->tag_id;
			array_push($array_tag, $tag_id);
		}
		$array_get = array (
			'site_id' => $data['site_id'],
			'tags' => $array_tag,
			'count_tags' => count($array_tag)
		);
		$feedback= array(
				'call_status' => 'success',
				'stock_display_list' => $this->inventory_db->get_stock_display_by_filter($array_get)->result_array(),
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
		// check if item_code is exist
		$item_insert_valid = array();
		$item_update_valid = array();
		$item_invalid = array();
		foreach($data as $dt){
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
			$start = DateTime::createFromFormat('d/m/Y', $item['discount_start_date']);
			$end = DateTime::createFromFormat('d/m/Y', $item['discount_end_date']);
			$item['discount_start_date'] = $start->format('d/m/Y');
			$item['discount_end_date'] = $end->format('d/m/Y');
			switch ($item['discount_type']){
				case "Normal":
					break;
				case "Persen":
					$item['discount_perc_start_date'] = date_create($item['discount_start_date']);
					$item['discount_perc_end_date'] = date_create($item['discount_end_date']);
					break;
				case "Tetap":
					$item['discount_special_price_start_date'] = date_create($item['discount_start_date']);
					$item['discount_special_price_end_date'] = date_create($item['discount_end_date']);
					break;
				default:
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
				$insert_category = array(
					"category_name" => $item['category']
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
		
		
		$feedback = array(
			'call_status' => 'success'
		);
		
		echo json_encode($feedback);
	}
	
}
