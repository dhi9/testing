<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customer_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_all_customers()
	{
		return $this->db->get('customers');
	}
	
	public function get_customer_consignment_list()
	{
		return $this->db
			->from('customers')
			->where('consignment', '1')
			->where('site_id', NULL)
			->get();
	}
	
	public function get_all_customers_by_phone($phone_number = NULL)
	{
		if($phone_number != NULL)
		{
			$this->db->where('phone_number', $phone_number);
		}
		
		return $this->get_all_customers();
	}
	
	public function get_customer_list_by_date_created_range($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL)
		{
			$this->db->where('date_created >', $start_date);
		}
		if($end_date != NULL)
		{
			$this->db->where('date_created <=', $end_date);
		}
		
		return $this->get_all_customers();
	}
	
	public function get_customer_combined_item_list($customer_id)
	{
		return $this->db
			->where('customer_id', $customer_id)
		->get('customer_combined_items');
	}
	
	public function get_customer($customer_id)
	{
		return $this->db
			->select('
					customer_id,
					customer_reference,
					customer_name,
					pic_name,
					address,
					city,
					postcode,
					phone_number,
					fax_number,
					customer_email,
					is_credit_blocked,
					credit_blocked_reason
				')
			->where('customer_id', $customer_id)
		->get('customers');
	}
	
	public function get_customer_by_id($customer_id)
	{
		return $this->db
			->where('customer_id', $customer_id)
		->get('customers');
	}
	
	public function get_delivery_addresses($customer_id)
	{
		return $this->db
			->where('customer_id', $customer_id)
		->get('customer_delivery_addresses');
	}
	
	public function get_customer_indexes()
	{
		return $this->db
			->select('customer_id, customer_name, pic_name')
		->get('customers');
	}
	
	public function get_blocked_customers()
	{
		return $this->db
			->select('customer_id, customer_name, pic_name, phone_number, customer_email')
			->where('is_credit_blocked', 1)
		->get('customers');
	}
	
	public function update_customer($data)
	{
		$this->db->update(
			'customers',
			$data,
			array('customer_id' => $data['customer_id'])
		);
	}
	
	public function update_customer_payment($data)
	{
		$this->db->update(
			'customers',
			$data,
			array('customer_id' => $data['customer_id'])
		);
	}
	
	public function update_customer_commission($data)
	{
		$this->db->update(
			'customers',
			$data,
			array('customer_id' => $data['customer_id'])
		);
	}
	
	public function update_customer_by_id($customer_id, $data)
	{
		$this->db->update(
			'customers',
			$data,
			array('customer_id' => $customer_id)
		);
	}
	
	public function update_delivery_address($data)
	{
		$this->db->update(
			'customer_delivery_addresses',
			$data,
			array('delivery_address_id' => $data['delivery_address_id'])
		);
	}
	
	public function insert_customer($array)
	{
		if ( $this->db->insert('customers', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_delivery_address($array)
	{
		if ( $this->db->insert('customer_delivery_addresses', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function get_customer_history_list_by_customer_id($customer_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('customer_histories vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('customer_id', $customer_id)
			->order_by('vuh.date_created desc')
		->get();
	}
	
	public function insert_customer_history($array)
	{
		if ( $this->db->insert('customer_histories', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
}
