<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Attribute_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_attribute_by_id($id)
	{
		$this->db->where('attribute_id', $id);
		
		return $this->get_attribute_list();
	}
	
	public function get_attribute_by_name($name)
	{
		$this->db->where('attribute_name', $name);
		
		return $this->get_attribute_list();
	}
	
	public function get_attribute_by_reference($reference)
	{
		$this->db->where('attribute_reference', $reference);
		
		return $this->get_attribute_list();
	}
	
	public function get_attribute_item_by_value($value, $attribute_id)
	{
		$this->db->where('attribute_item', $value);
		
		return $this->get_attribute_item_list_by_attribute_id($attribute_id);
	}
	
	/*public function get_attribute_history_list_by_attribute_id($attribute_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('attribute_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('attribute_id', $attribute_id)
			->order_by('vuh.date_created desc')
		->get();
	}*/
	
	public function get_attribute_list()
	{
		return $this->db->get('attributes');
	}
	public function get_attribute_item_list_by_attribute_id($attribute_id)
	{
		return $this->db
			->where('attribute_id', $attribute_id)
			->get('attribute_items');
	}
	public function get_attribute_active_list()
	{
		return $this->db
			->from('attributes')
			->where('status', 'A')
			->get();
	}
	
	public function insert_attribute($array)
	{
		if ( $this->db->insert('attributes', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_attribute_item($array)
	{
		if ( $this->db->insert('attribute_items', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	/*public function insert_attribute_update_history($array)
	{
		if ( $this->db->insert('attribute_update_history', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}*/
	
	public function update_attribute($data)
	{
		$this->db->update(
			'attributes',
			$data,
			array('attribute_id' => $data['attribute_id'])
		);
	}
	
	public function update_attribute_by_id($data, $attribute_id)
	{
		$this->db->update(
			'attributes',
			$data,
			array('attribute_id' => $data['attribute_id'])
		);
	}
}