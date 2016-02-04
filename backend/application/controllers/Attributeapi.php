<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Attributeapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('attribute_db', 'user_model', 'auditlog_model'));
	}
	
	public function get_attribute_by_id($id){
		$attribute = $this->attribute_db->get_attribute_by_id($id)->row_array();
		$attribute_items = $this->attribute_db->get_attribute_item_list_by_attribute_id($attribute['attribute_id'])->result_array();
		$feedback = array(
			'call_status' => 'success',
			'attribute' => $attribute,
			'attribute_items' => $attribute_items
		);
		
		echo json_encode($feedback);
	}
	
	/*public function get_attribute_history_list_by_attribute_id($attribute_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->attribute_db->get_attribute_history_list_by_attribute_id($attribute_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'history_list' => $history_list
			);
		}
		
		echo json_encode($array);
	}*/
	
	public function get_attribute_list(){
		$feedback = array(
			'call_status' => 'success',
			'attribute_list' => $this->attribute_db->get_attribute_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	public function get_attribute_active_list(){
		$attributes = $this->attribute_db->get_attribute_active_list()->result_array();
		$attribute_list = array();
		foreach($attributes as $attrib){
			$attrib['attribute_items'] = $this->attribute_db->get_attribute_item_list_by_attribute_id($attrib['attribute_id'])->result_array();
			array_push($attribute_list, $attrib);
		}
		$feedback = array(
			'call_status' => 'success',
			'attribute_list' => $attribute_list
		);
		
		echo json_encode($feedback);
	}
	
	public function insert_attribute()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$json = file_get_contents('php://input');
			$data = json_decode($json, true);
			
			if( empty($data['attribute_name']) ){
				$array = array(
					"call_status" => "error",
					"error_message" =>"Nama Attribute tidak boleh kosong",
				);
			}
			else{
				$query = $this->attribute_db->get_attribute_by_name($data['attribute_name']);
				
				if($query->num_rows() > 0){
					$array = array(
						"call_status" => "error",
						"error_message" =>"Nama Attribute sudah ada di database",
					);
				}
				else{
					$this->db->trans_start();
					
					$this->auditlog_model->insert_audit_log("attributeapi","insert_attribute",$json);
					
					$attribute_id = $this->attribute_db->insert_attribute($data);
					
					/*$insert = array(
						'attribute_id' => $attribute_id,
						'user_id' => $this->session->userdata('user_id'),
						'new_data' => 'Data Baru'
					);
					$this->attribute_db->insert_attribute_update_history($insert);*/
					
					$this->db->trans_complete();
					
					if($this->db->trans_status() == FALSE){
						$array = array(
							"call_status" => "error",
							"error_message" =>"Terjadi kesalahan saat menghubungi database"
						);
					}
					else{
						$array = array(
							'call_status' => 'success'
						);
					}
				}
			}
		}
		
		echo json_encode($array);
	}
	
	public function update_attribute()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$this->db->trans_start();
			
			$json = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("attributeapi","update_attribute",$json);
			
			$data = json_decode($json, true);
			
			//$this->attribute_db->insert_attribute_history($data);
			$this->attribute_db->update_attribute($data);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
			
			$this->db->trans_complete();
		}
		
		echo json_encode($array);
	}
	
	public function insert_attribute_item()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$json = file_get_contents('php://input');
			$data = json_decode($json, true);
			
			if( empty($data['attribute_item']) ){
				$array = array(
					"call_status" => "error",
					"error_message" =>"Nama Attribute tidak boleh kosong",
				);
			}
			else{
				$query = $this->attribute_db->get_attribute_item_by_value($data['attribute_item'], $data['attribute_id']);
				
				if($query->num_rows() > 0){
					$array = array(
						"call_status" => "error",
						"error_message" =>"Value attribute sudah ada",
					);
				}
				else{
					$this->db->trans_start();
					
					$this->auditlog_model->insert_audit_log("attributeapi","insert_attribute_item",$json);
					
					$attribute_item_id = $this->attribute_db->insert_attribute_item($data);

					$this->db->trans_complete();
					
					if($this->db->trans_status() == FALSE){
						$array = array(
							"call_status" => "error",
							"error_message" =>"Terjadi kesalahan saat menghubungi database"
						);
					}
					else{
						$array = array(
							'call_status' => 'success'
						);
					}
				}
			}
		}
		
		echo json_encode($array);
	}
	
}
