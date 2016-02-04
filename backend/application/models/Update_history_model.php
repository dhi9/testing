<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Update_history_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_old_value($table,$column_id,$id,$column)
	{
		return $this->db->where($column_id, $id)->get($table)->row()->$column;
	}
	
	public function get_orders_by_order_id($order_id)
	{
		return $this->db->query("
			select uh.update_timestamp, uh.update_description, DATE_FORMAT(uh.old_value, '%d-%m-%Y') as old, DATE_FORMAT(uh.new_value, '%d-%m-%Y') as new, u.username
			from update_history uh
			join users u
			 on u.user_id = uh.user_id
			where order_id = $order_id
			
			UNION
			
			select uh.update_timestamp, uh.update_description, DATE_FORMAT(uh.old_value, '%d-%m-%Y') as old, DATE_FORMAT(uh.new_value, '%d-%m-%Y') as new, u.username
			from delivery_requests dr
			join update_history uh
			 on dr.delivery_request_id = uh.delivery_request_id
			join users u
			 on u.user_id = uh.user_id
			where dr.order_id = $order_id
			
			UNION
			
			select uh.update_timestamp, uh.update_description, DATE_FORMAT(uh.old_value, '%d-%m-%Y') as old, DATE_FORMAT(uh.new_value, '%d-%m-%Y') as new, u.username
			from deliveries dv
			join delivery_requests dr
			 on dv.delivery_request_id = dr.delivery_request_id
			join update_history uh
			 on dv.delivery_id = uh.delivery_id
			join users u
			 on u.user_id = uh.user_id
			where dr.order_id = $order_id
		");
	}
	
	public function get_deliveries_by_delivery_id($delivery_id)
	{
		return $this->db
			->select('uh.update_timestamp, uh.update_description, uh.old_value, uh.new_value, u.username')
			->from('update_history uh')
			->join('users u', 'u.user_id = uh.user_id')
			->where('uh.delivery_id', $delivery_id)
			->where('uh.update_level', 'D')
		->get();
	}

	public function insert_update_history($data)
	{
		$insert = array(
			'user_id' => $this->session->userdata('user_id'),
			'update_timestamp' => date("Y-m-d H:i:s"),
			'update_level' => $data['update_level'],
			'update_description' => $data['update_description']
		);
		
		if(isset($data['order_id']))
		{
			$insert['order_id'] = $data['order_id'];
		}
		
		if(isset($data['delivery_id']))
		{
			$insert['delivery_id'] = $data['delivery_id'];
		}
		
		if(isset($data['delivery_request_id']))
		{
			$insert['delivery_request_id'] = $data['delivery_request_id'];
		}
		
		if(isset($data['delivery_request_id']))
		{
			$insert['delivery_request_id'] = $data['delivery_request_id'];
		}
		
		if(isset($data['old_value']))
		{
			$insert['old_value'] = $data['old_value'];
		}
		else
		{
			$insert['old_value'] = NULL;
		}
		
		if(isset($data['new_value']))
		{
			$insert['new_value'] = $data['new_value'];
		}
		else
		{
			$insert['new_value'] = NULL;
		}
		
		if(($insert['old_value'] != $insert['new_value']) || ($insert['old_value'] == NULL && $insert['new_value'] == NULL))
		{
			if ( $this->db->insert('update_history', $insert) )
			{
				return $this->db->insert_id();
			} 
			else
			{
				return 0;
			}
		}
	}
	

}
