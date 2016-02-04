<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Bankapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('auditlog_model', 'user_model', 'bank_db'));
	}
	
	public function get_bank_by_id($id){
		$feedback = array(
			'call_status' => 'success',
			'bank' => $this->bank_db->get_bank_by_id($id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_bank_history_list_by_bank_id($bank_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->bank_model->get_bank_history_list_by_bank_id($bank_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'history_list' => $history_list
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_bank_list(){
		$feedback = array(
			'call_status' => 'success',
			'bank_list' => $this->bank_db->get_bank_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function insert_bank()
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
			
			if( empty($data['bank_name']) ){
				$array = array(
					"call_status" => "error",
					"error_message" =>"Nama Bank tidak boleh kosong"
				);
			}
			else{
				$this->db->trans_start();
				
				$this->auditlog_model->insert_audit_log("bankapi","insert_bank",$json);
				
				$bank_id = $this->bank_db->insert_bank($data);
				
				$insert = array(
					'bank_id' => $bank_id,
					'user_id' => $this->session->userdata('user_id'),
					'new_data' => 'Data Baru'
				);
				//$this->bank_model->insert_bank_update_history($insert);
				
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
		
		echo json_encode($array);
	}
	
	public function update_bank()
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
			
			$this->db->trans_start();
			
			$this->auditlog_model->insert_audit_log("bankapi","update_bank",$json);
			
			//$this->bank_bl->insert_bank_history($data);
			$this->bank_db->update_bank($data);
			
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
		
		echo json_encode($array);
	}
}
