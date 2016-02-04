<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Stock_setting_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_stock_setting_list()
	{
		return $this->db->get('manual_stock_settings');
	
		/*return $this->db
			->select('mss.*, u.username as creator, a.username as approver')
			->from('manual_stock_settings mss')
			->join('users u', 'mss.creator_id = u.user_id')
			->join('users a', 'mss.approver_id = a.user_id', 'left')
			->where_not_in('mss.status', 'X')
		->get();*/
	}
	
	public function get_stock_setting_by_id($id)
	{
		return $this->db
			->where('manual_stock_setting_id', $id)
		->get('manual_stock_settings');
	}
	
	public function get_stock_setting_by_reference($reference)
	{
		return $this->db
			->where('manual_stock_setting_reference', $reference)
		->get('manual_stock_settings');
	}
	
	public function get_stock_setting_item_list_by_stock_setting_id($id)
	{
		return $this->db
			->where('manual_stock_setting_id', $id)
		->get('manual_stock_setting_items');
	}
	
	public function insert_stock_setting($array)
	{
		if ( $this->db->insert('manual_stock_settings', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_stock_setting_item($array)
	{
		if ( $this->db->insert('manual_stock_setting_items', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_stock_setting($data)
	{
		$this->db->update(
			'manual_stock_settings',
			$data,
			array('manual_stock_setting_id' => $data['manual_stock_setting_id'])
		);
	}
	
	public function update_stock_setting_by_reference($reference, $data)
	{
		$this->db->update(
			'manual_stock_settings',
			$data,
			array('manual_stock_setting_reference' => $reference)
		);
	}
	
	public function get_manual_stock_setting_list_by_date_created_range($start_date, $end_date)
	{
		if($start_date != NULL)
		{
			$this->db->where('date_created >', $start_date);
		}
		if($end_date != NULL)
		{
			$this->db->where('date_created <=', $end_date);
		}
		
		return $this->get_stock_setting_list();
	}
	
	public function get_stock_setting_approver_list()
	{
		return $this->db
			->select('u.*')
			->from('user_approvals ua')
			->join('users u', 'u.user_id = ua.user_id')
			->where('ua.inventory_adjustment', 'Y')
		->get();
	}
	
	public function get_stock_setting_approver_by_user_id($user_id)
	{
		return $this->db
			->where('user_id', $user_id)
			->where('inventory_adjustment', 'Y')
		->get('user_approvals');
	}
}
