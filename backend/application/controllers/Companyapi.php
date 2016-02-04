<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Companyapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('customer_model','auditlog_model', 'user_model', 'item_model', 'customer_db', 'site_db', 'company_db'));
	}
	
	public function get_company()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$company = $this->company_db->get_company()->row_array();
			
			$company['delivery_image'] = json_decode($company['delivery_image']);
			$company['ir_image'] = json_decode($company['ir_image']);
			$company['order_image'] = json_decode($company['order_image']);
			$company['consignment_image'] = json_decode($company['consignment_image']);

			$array = array(
				'call_status' => 'success',
				'company' => $company 
			);
		}
		
		echo json_encode($array);
	}

	public function insert_company()
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
			$data = json_decode($json, true);
			
			$data['delivery_image'] = json_encode($data['delivery_image']);
			$data['ir_image'] = json_encode($data['ir_image']);
			$data['order_image'] = json_encode($data['order_image']);
			$data['consignment_image'] = json_encode($data['consignment_image']);
			$this->auditlog_model->insert_audit_log("customerapi","insert_customer",$json);

			$this->company_db->insert_company($data);
			
			// feedback API
			$array = array(
				'call_status' => 'success',
			);
		}
		
		echo json_encode($array);
	}

	public function update_company()
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
			$data = json_decode($json, true);
			$data['delivery_image'] = json_encode($data['delivery_image']);
			$data['ir_image'] = json_encode($data['ir_image']);
			$data['order_image'] = json_encode($data['order_image']);
			$data['consignment_image'] = json_encode($data['consignment_image']);
			$this->auditlog_model->insert_audit_log("customerapi","insert_customer",$json);

			$this->company_db->update_company($data);
			
			// feedback API
			$array = array(
				'call_status' => 'success',
			);
		}
		
		echo json_encode($array);
	}
}
