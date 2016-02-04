<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Category_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_category_by_id($id)
	{
		$this->db->where('category_id', $id);
		
		return $this->get_category_list();
	}
	
	public function get_category_by_reference($reference)
	{
		$this->db->where('category_name', $reference);
		
		return $this->get_category_list();
	}
	
	/*public function get_category_history_list_by_category_id($category_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('category_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('category_id', $category_id)
			->order_by('vuh.date_created desc')
		->get();
	}*/
	
	public function get_category_list()
	{
		return $this->db->get('categories');
	}
	public function get_category_active_list()
	{
		return $this->db
			->from('categories')
			->where('status', 'A')
			->get();
	}
	
	public function insert_category($array)
	{
		if ( $this->db->insert('categories', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	/*public function insert_category_update_history($array)
	{
		if ( $this->db->insert('category_update_history', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}*/
	
	public function update_category($data)
	{
		$this->db->update(
			'categories',
			$data,
			array('category_id' => $data['category_id'])
		);
	}
	
	public function update_category_by_id($data, $category_id)
	{
		$this->db->update(
			'categories',
			$data,
			array('category_id' => $data['category_id'])
		);
	}
}