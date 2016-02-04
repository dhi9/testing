<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customer_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}

	public function get_all_customers()
	{
		return $this->db
			->select('*')
			->get('customers');
	}
	
	public function get_all_customers_by_phone($phone_number = NULL)
	{
		if($phone_number != NULL)
		{
			$this->db->where('phone_number', $phone_number);
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

	public function get_delivery_addresses($customer_id)
	{
		return $this->db
			->select('*')
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

	public function generate_customer_reference($customer_id)
	{
		// ambil date created dari tabel draft berdasarkan draft id
		$query = $this->db->where('customer_id', $customer_id)->get('customers');
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
	
		// hitung jumlah date created yang sama
		$query = $this->db
		->where('date_created <=', $date_created)
		->where('date_created >', $initial_date)
		->get('customers');
		$count = $query->num_rows();
	
		// buat urutannya
		$sequence = str_pad($count, 4, "0", STR_PAD_LEFT);
	
		$customer_reference = $date.'-C'.$sequence;
	
		$data = array(
				'customer_reference' => $customer_reference
		);
	
		$this->db->where('customer_id', $customer_id);
		$this->db->update('customers', $data);
	
		return $customer_reference;
	}
	
	public function update_customer($data)
	{
		$this->db->update(
				'customers',
				$data,
				array('customer_id' => $data['customer_id'])
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
	
	public function is_customer_credit_blocked($customer_id)
	{
		$customer = $this->get_customer($customer_id)->row_array();
		
		if($customer['is_credit_blocked'] == 1) return true;
		else return false;
	}
	
}
