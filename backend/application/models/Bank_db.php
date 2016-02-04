<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Bank_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_bank_by_id($id)
	{
		$this->db->where('bank_id', $id);
		
		return $this->get_bank_list();
	}
	
	public function get_bank_history_list_by_bank_id($bank_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('bank_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('bank_id', $bank_id)
			->order_by('vuh.date_created desc')
		->get();
	}
	
	public function get_bank_list()
	{
		return $this->db->get('banks');
	}
	
	public function insert_bank($array)
	{
		if ( $this->db->insert('banks', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_bank_update_history($array)
	{
		if ( $this->db->insert('bank_update_history', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_bank($data)
	{
		$this->db->update(
			'banks',
			$data,
			array('bank_id' => $data['bank_id'])
		);
	}
}