<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customer_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('customer_db');
	}
	
	public function generate_customer_reference($customer_id)
	{
		$query = $this->customer_db->get_customer_by_id($customer_id);
		if($query->num_rows() > 0)
		{
			$date_created = $query->row()->date_created;
			$date = date('Y', strtotime($date_created));
		}
		else
		{
			$date = date('Y');
		}
		
		$initial_date = $date.' 00:00:00';
		
		$query = $this->customer_db->get_customer_list_by_date_created_range($initial_date, $date_created);
		$count = $query->num_rows();
		
		$sequence = str_pad($count, 4, "0", STR_PAD_LEFT);
		
		$customer_reference = $date.'-C'.$sequence;
		
		return $customer_reference;
	}
	
	public function is_customer_credit_blocked($customer_id)
	{
		$customer = $this->customer_db->get_customer($customer_id)->row_array();
		
		if($customer['is_credit_blocked'] == 1) return true;
		else return false;
	}
	
	public function insert_customer_history($new_customer)
	{
		$data_list = array(
			'customer_name' => array('field' => 'Nama Customer', 'section' => 'Detail Customer'),
			'pic_name' => array('field' => 'Nama PIC', 'section' => 'Detail Customer'),
			'address' => array('field' => 'Alamat', 'section' => 'Detail Customer'),
			'phone_number' => array('field' => 'No. Telp', 'section' => 'Detail Customer'),
			'city' => array('field' => 'Kota', 'section' => 'Detail Customer'),
			'postcode' => array('field' => 'Kodepos', 'section' => 'Detail Customer'),
			'customer_email' => array('field' => 'Email', 'section' => 'Detail Customer'),
			'fax_number' => array('field' => 'No. Fax', 'section' => 'Detail Customer'),
		);
		
		$old_customer = $this->customer_db->get_customer_by_id($new_customer['customer_id'])->row_array();
		
		$now = date('Y-m-d H:i:s');
		
		foreach($data_list as $key => $value){
			if($old_customer[$key] != $new_customer[$key]){
				$insert = array(
					'customer_id' => $new_customer['customer_id'],
					'user_id' => $this->session->userdata('user_id'),
					'section' => $value['section'],
					'field' => $value['field'],
					'old_data' => $old_customer[$key],
					'new_data' => $new_customer[$key],
					'date_created' => $now
				);
				$this->customer_db->insert_customer_history($insert);
			}
		}
	}
	
	public function update_customer($data)
	{
		$this->customer_bl->insert_customer_history($data['customer']);
		$this->customer_db->update_customer($data['customer']);
		
		foreach($data['delivery_address_list'] as $address){
			if( isset($address['delivery_address_id']) ) {
				$this->customer_db->update_delivery_address($address);
			}
			else {
				$address['customer_id'] = $data['customer']['customer_id'];
				
				$this->customer_db->insert_delivery_address($address);
			}
		}
	}
}
