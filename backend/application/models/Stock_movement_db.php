<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Stock_movement_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_stock_movement_list()
	{
		return $this->db->get('stock_movements');
	}
	
	public function get_stock_movement_by_id($id)
	{
		return $this->db->where('stock_movement_id', $id)->get('stock_movements');
	}
	
	public function get_stock_movement_list_by_item_code($item_code)
	{
		return $this->db->where('item_code', $item_code)->get('stock_movements');
	}
	
	public function insert_stock_movement($array)
	{
		if(! empty($array['attributes'])){
			$attributes = $array['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($array['attributes']) ;
		}
		
		if ( $this->db->insert('stock_movements', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function update_stock_movement($data)
	{
		$this->db->update(
			'stock_movements',
			$data,
			array('stock_movement_id' => $data['stock_movement_id'])
		);
	}
}
