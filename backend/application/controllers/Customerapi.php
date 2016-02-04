<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customerapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('customer_model','auditlog_model', 'user_model', 'item_model', 'customer_db', 'site_db', 'customer_bl'));
	}
	
	public function add_credit_block()
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
			$data = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("customerapi","add_credit_block",$data->creditblockdata);
			
			$data = json_decode($data->creditblockdata, true);
			
			// update tabel customer
			$this->db->update(
				'customers',
				array(
					'is_credit_blocked' => 1,
					'credit_blocked_reason' => $data['credit_blocked_reason']
				),
				array('customer_id' => $data['customer_id'])
			);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_all_customers()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$customers = $this->customer_model->get_all_customers()->result_array();
			
			$array = array(
				'call_status' => 'success',
				'customer_details_list' => $customers
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_customer_consignment_list()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$customers = $this->customer_db->get_customer_consignment_list()->result_array();
			
			$array = array(
				'call_status' => 'success',
				'customer_list' => $customers
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_all_customers_by_phone()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$input = json_decode(file_get_contents('php://input'));			
			$data = json_decode($input->filterdata,true);
			
			$customers = $this->customer_model->get_all_customers_by_phone($data['phone_number'])->result_array();
			
			$array = array(
				'call_status' => 'success',
				'customer_details_list' => $customers
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_blocked_customers()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$customers = $this->customer_model->get_blocked_customers()->result_array();
			
			$array = array(
				'call_status' => 'success',
				'customer_details_list' => $customers
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_customer($customer_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$customer = $this->customer_model->get_customer($customer_id)->row_array();
			
			$array = array(
				'call_status' => 'success',
				'customer_details' => $customer,
				'customer_list' => $this->customer_model->get_customer($customer_id)->result_array(),
				'delivery_address_list' => $this->customer_model->get_delivery_addresses($customer_id)->result_array()
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_customer_indexes()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$customers = $this->customer_model->get_customer_indexes()->result_array();
			
			$array = array(
				'call_status' => 'success',
				'customer_indexes_list' => $customers
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_delivery_addresses($customer_id)
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
				"call_status" => "success",
				"delivery_addresses" => $this->customer_model->get_delivery_addresses($customer_id)->result_array()
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_customer_combined_item_list($customer_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			$item_list = $this->customer_model->get_customer_combined_item_list($customer_id)->result_array();
			
			foreach ($item_list as &$item){
				$item['children'] = array();
				
				$child_item_code_list = json_decode($item['child_items'],  true);
				
				foreach ($child_item_code_list as $item_code){
					$data = $this->item_model->get_item_by_item_code($item_code)->row_array();
					$data['length_width_height'] = $data['length']." x ".$data['width']." x ".$data['height'];
					array_push($item['children'], $data);
				}
				$item['level'] = "E";
			}
			
			$array = array(
				"call_status" => "success",
				"customer_combined_item_list" => $item_list
			);
		}
	
		echo json_encode($array);
	}
        
	public function insert_delivery_address()
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
			
			$this->auditlog_model->insert_audit_log("customerapi","insert_delivery_address", $json);
			
			foreach ($data as $deliveryAddress){
				$insert_delivery_address = array(
					'customer_id' => $deliveryAddress['customer_id'],
					'description' => $deliveryAddress['description'],
					'delivery_address' => $deliveryAddress['delivery_address'],
					'area' => @$deliveryAddress['area'],
					'city' => @$deliveryAddress['city'],
					'pic_name' => @$deliveryAddress['pic_name'],
					'post_code' => @$deliveryAddress['post_code'],
					'phone_number' => @$deliveryAddress['phone_number'],
					'status' => "A",
						);
				$this->customer_model->insert_delivery_address($insert_delivery_address);
			}
			
			// feedback API
			$array = array(
				'call_status' => 'success',
			);
		}
		
		echo json_encode($array);
	}
	
	public function remove_credit_block()
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
			$data = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("customerapi","remove_credit_block",$data->creditblockdata);
			
			$data = json_decode($data->creditblockdata, true);
			
			// update tabel customer
			$this->db->update(
				'customers',
				array(
					'is_credit_blocked' => 0,
					'credit_blocked_reason' => NULL
				),
				array('customer_id' => $data['customer_id'])
			);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function update_customer()
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
			
			$this->auditlog_model->insert_audit_log("customerapi","update_customer",$json);
			
			$this->customer_bl->update_customer($data);
			
			$this->db->trans_complete();
			
			if($this->db->trans_complete() == FALSE){
				$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
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
	
	public function update_customer_payment()
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
			
			$this->auditlog_model->insert_audit_log("customerapi","update_customer_payment",$json);
			
			$update = array(
				"customer_id" => $data['customer_id'],
				"payment_term_type" => $data['payment_term_type'],
				"payment_term_value" => $data['payment_term_value'],
				"payment_term_credit_limit" => $data['payment_term_credit_limit'],
			);
			
			if($data['payment_term_type'] == 'C'){
				$update['payment_term_value'] = 0;
				$update['payment_term_credit_limit'] = 0;
			}
			
			$this->customer_db->update_customer_payment($update);
			
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function update_customer_commission()
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
			
			$this->auditlog_model->insert_audit_log("customerapi","update_customer_commission",$json);
			
			$update = array(
				"customer_id" => $data['customer_id'],
				"commission" => $data['commission'],
				"commission_type" => $data['commission_type'],
				"commission_persent" => $data['commission_persent'],
				"commission_value" => $data['commission_value'],
			);
			
			if($data['commission'] == NULL or $data['commission'] == FALSE ){
				$update['commission_type'] = NULL;
				$update['commission_persent'] = 0;
				$update['commission_value'] = 0;
			}else{
				if($data['commission_type'] == 'P'){
					$update['commission_value'] = 0;
				}else{
					$update['commission_persent'] = 0;
				}
			}
			
			$this->customer_db->update_customer_commission($update);
			
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'data' => $update
			);
		}
		
		echo json_encode($array);
	}
	
	public function update_customer_consignment()
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
			
			$this->auditlog_model->insert_audit_log("customerapi","update_customer_consignment",$json);
			
			if($data['old_site_id'] !== NULL ){
				$updateOldSite = array(
					"customer_id" => NULL,
					"site_id" => $data['old_site_id']
				);
				$this->site_db->update_site($updateOldSite);
			}
			
			$updateCustomer = array(
				"customer_id" => $data['customer_id'],
				"consignment" => $data['consignment'],
				"site_id" => $data['site_id']
			);
			
			$updateSite = array(
				"customer_id" => $data['customer_id'],
				"site_id" => $data['site_id']
			);
			
			if($data['consignment'] == NULL or $data['consignment'] == FALSE ){
				$updateCustomer['site_id'] = NULL;
				$updateSite['customer_id'] = NULL;
			}
			
			$this->customer_db->update_customer_commission($updateCustomer);	
			$this->site_db->update_site($updateSite);
			
			// feedback API
			$array = array(
				'call_status' => 'success',
			);
		}
		
		echo json_encode($array);
	}
	
	public function update_delivery_address()
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
			
			$this->auditlog_model->insert_audit_log("customerapi","update_delivery_address",$json);
				
			foreach ($data as $deliveryAddress){
				$update_delivery_address = array(
						'delivery_address_id' => $deliveryAddress['delivery_address_id'],
						'description' => $deliveryAddress['description'],
						'delivery_address' => $deliveryAddress['delivery_address'],
						'area' => @$deliveryAddress['area'],
						'city' => @$deliveryAddress['city'],
						'pic_name' => @$deliveryAddress['pic_name'],
						'post_code' => @$deliveryAddress['post_code'],
						'phone_number' => @$deliveryAddress['phone_number'],
						'status' => @$deliveryAddress['status'],
				);
				$this->customer_model->update_delivery_address($update_delivery_address);
			}
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function insert_customer()
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
			
			if( empty($data['customer']['customer_name']) ){
				$array = array(
					"call_status" => "error",
					"error_message" =>"Nama Customer tidak boleh kosong."
				);
			}
			else{
				$this->db->trans_start();
				
				$this->auditlog_model->insert_audit_log("customerapi","insert_customer",$json);
				
				$customer_id = $this->customer_model->insert_customer($data['customer']);
				
				$insert = array(
					'customer_id' => $customer_id,
					'user_id' => $this->session->userdata('user_id'),
					'new_data' => 'Data Baru'
				);
				$this->customer_db->insert_customer_history($insert);
				
				$customer_reference = $this->customer_model->generate_customer_reference($customer_id);
				
				foreach($data['delivery_address_list'] as $address){
					$address['customer_id'] = $customer_id;
					
					$this->customer_model->insert_delivery_address($address);
				}
				
				$this->db->trans_complete();
				
				if($this->db->trans_status() == FALSE){
					$array = array(
						"call_status" => "error",
						"error_message" =>"Terjadi kesalahan saat menghubungi database"
					);
				}
				else{
					$array = array(
						'call_status' => 'success',
						'customer_id' => $customer_id,
						'customer_reference' => $customer_reference
					);
				}
			}
		}
		
		echo json_encode($array);
	}
	
	public function get_customer_history_list_by_customer_id($customer_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->customer_db->get_customer_history_list_by_customer_id($customer_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'history_list' => $history_list
			);
		}
		
		echo json_encode($array);
	}
}