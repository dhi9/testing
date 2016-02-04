<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_user_by_id($id)
	{
		$this->db->where('user_id', $id);
		
		return $this->get_user_list();
	}
	
	public function get_user_by_reference($reference)
	{
		$this->db->where('user_reference', $reference);
		
		return $this->get_user_list();
	}
	
	public function get_user_history_list_by_user_id($user_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('user_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('user_id', $user_id)
			->order_by('vuh.date_created desc')
		->get();
	}
	
	public function get_user_list()
	{
		return $this->db->get('users');
	}
	
	public function get_user_list_by_date_created_year($year)
	{
		if($year != NULL)
		{
			$this->db->where("YEAR(date_created)", $year);
		}
		
		return $this->get_user_list();
	}
	
	public function insert_user($array)
	{
		if ( $this->db->insert('users', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_user_update_history($array)
	{
		if ( $this->db->insert('user_update_history', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_user($data)
	{
		$this->db->update(
			'users',
			$data,
			array('user_id' => $data['user_id'])
		);
	}
	
	public function get_user_by_username($username)
	{
		return $this->db
			->where('username', $username)
		->get('users');
	}
	
	public function get_user_approval_by_user_id($user_id)
	{
		return $this->db
			->where('user_id', $user_id)
		->get('user_approvals');
	}
	
	public function update_user_approval($data)
	{
		$this->db->update(
			'user_approvals',
			$data,
			array('user_id' => $data['user_id'])
		);
	}
	
	public function get_user_access_by_user_id($user_id)
	{
		return $this->db
			->where('user_id', $user_id)
		->get('user_permissions');
	}
	
	public function update_user_access($data)
	{
		$this->db->update(
			'user_permissions',
			$data,
			array(
				'user_id' => $data['user_id'],
				'permission_code' => $data['permission_code']
			)
		);
	}
	
	public function insert_user_access($array)
	{
		if ( $this->db->insert('user_permissions', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_user_approval($array)
	{
		if ( $this->db->insert('user_approvals', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
}