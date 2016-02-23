<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vendor_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_vendor_by_id($id)
	{
		$this->db->where('vendor_id', $id);
		
		return $this->get_vendor_list();
	}
	
	public function get_vendor_by_reference($reference)
	{
		$this->db->where('vendor_reference', $reference);
		
		return $this->get_vendor_list();
	}
	
	public function get_vendor_history_list_by_vendor_id($vendor_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('vendor_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('vendor_id', $vendor_id)
			->order_by('vuh.date_created desc')
		->get();
	}
	
	public function get_active_vendor_list()
	{
		$this->db->where('status', "A");
		
		return $this->get_vendor_list();
	}
	
	public function get_vendor_list()
	{
		return $this->db->get('vendors');
	}
	
	public function get_vendor_list_by_date_created_year($year)
	{
		if($year != NULL)
		{
			$this->db->where("YEAR(date_created)", $year);
		}
		
		return $this->get_vendor_list();
	}
	
	public function insert_vendor($array)
	{
		if ( $this->db->insert('vendors', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_vendor_update_history($array)
	{
		if ( $this->db->insert('vendor_update_history', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_vendor($data)
	{
		$this->db->update(
			'vendors',
			$data,
			array('vendor_id' => $data['vendor_id'])
		);
	}
}