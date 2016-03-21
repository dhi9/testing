<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vendorapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('vendor_model','auditlog_model', 'user_model', 'vendor_db', 'vendor_bl'));
	}
	
	public function get_vendor_by_id($id){
		$feedback = array(
			'call_status' => 'success',
			'vendor' => $this->vendor_model->get_vendor_by_id($id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_vendor_by_reference($reference){
		$feedback = array(
			'call_status' => 'success',
			'vendor' => $this->vendor_model->get_vendor_by_reference($reference)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_vendor_history_list_by_vendor_id($vendor_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->vendor_model->get_vendor_history_list_by_vendor_id($vendor_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'history_list' => $history_list
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_vendor_list(){
		$feedback = array(
			'call_status' => 'success',
			'vendor_list' => $this->vendor_model->get_vendor_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_active_vendor_list()
	{
		$feedback = array(
			'call_status' => 'success',
			'vendor_list' => $this->vendor_db->get_active_vendor_list()->result_array()
		);
		
		echo json_encode($feedback);
	}

	public function get_all_vendor()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$vendor = $this->vendor_model->get_all_vendor()->result_array();

			$array = array(
				'call_status' => 'success',
				'vendor_details_list' => $vendor
			);
		}

		echo json_encode($array);
	}



	public function get_vendor($vendor_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$vendor = $this->vendor_model->get_vendor($vendor_id)->row_array();

			$array = array(
				'call_status' => 'success',
				'vendor_details' => $vendor,
				'vendor_list' => $this->vendor_model->get_vendor($vendor_id)->result_array(),
				//'delivery_address_list' => $this->vendor_model->get_delivery_addresses($vendor_id)->result_array()
			);
		}

		echo json_encode($array);
	}

	
	public function insert_vendor()
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
			
			if( empty($data['vendor_name']) ){
				$array = array(
					"call_status" => "error",
					"error_message" =>"Nama Vendor tidak boleh kosong"
				);
			}
			else{
				$this->db->trans_start();
				
				$this->auditlog_model->insert_audit_log("vendorapi","insert_vendor",$json);
				
				$vendor_id = $this->vendor_model->insert_vendor($data);
				$this->vendor_model->generate_vendor_reference($vendor_id);
				
				$insert = array(
					'vendor_id' => $vendor_id,
					'user_id' => $this->session->userdata('user_id'),
					'new_data' => 'Data Baru'
				);
				$this->vendor_model->insert_vendor_update_history($insert);
				
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
	
	public function update_vendor()
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
			
			$this->auditlog_model->insert_audit_log("vendorapi","update_vendor",$json);
			
			$this->vendor_bl->insert_vendor_history($data);
			$this->vendor_db->update_vendor($data);
			
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
