<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Categoryapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('category_db', 'user_model', 'auditlog_model'));
	}
	
	public function get_category_by_id($id){
		$feedback = array(
			'call_status' => 'success',
			'category' => $this->category_db->get_category_by_id($id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	/*public function get_category_history_list_by_category_id($category_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->category_db->get_category_history_list_by_category_id($category_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'history_list' => $history_list
			);
		}
		
		echo json_encode($array);
	}*/
	
	public function get_category_list(){
		$feedback = array(
			'call_status' => 'success',
			'category_list' => $this->category_db->get_category_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	public function get_category_active_list(){
		$feedback = array(
			'call_status' => 'success',
			'category_list' => $this->category_db->get_category_active_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function insert_category()
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
			
			$this->auditlog_model->insert_audit_log("categoryapi","insert_category",$json);
			
			$data = json_decode($json, true);
			
			$category_id = $this->category_db->insert_category($data);
			
			/*$insert = array(
				'category_id' => $category_id,
				'user_id' => $this->session->userdata('user_id'),
				'new_data' => 'Data Baru'
			);
			$this->category_db->insert_category_update_history($insert);*/
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
			
			$this->db->trans_complete();
		}
		
		echo json_encode($array);
	}
	
	public function update_category()
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
			
			$this->auditlog_model->insert_audit_log("categoryapi","update_category",$json);
			
			$data = json_decode($json, true);
			
			//$this->category_db->insert_category_history($data);
			$this->category_db->update_category($data);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
			
			$this->db->trans_complete();
		}
		
		echo json_encode($array);
	}
}
