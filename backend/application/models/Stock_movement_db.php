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
	
	public function get_stock_movement_list_by_search($searchBy)
	{
		$this->db->select("sm.*, mc.description as type_name, COLUMN_JSON(sm.attributes) as attributes");
		$this->db->from('stock_movements sm');
		$this->db->join('movements_code mc', 'sm.type = mc.code_reference');
		if(isset($searchBy['searchSite'])){
			$this->db->where('sm.site_id', $searchBy['searchSite']);
		}
		if(isset($searchBy['searchDateFrom'])){
			$this->db->where('sm.date_created >=', $searchBy['searchDateFrom']);
		}
		if(isset($searchBy['searchDateTo'])){
			$this->db->where('sm.date_created <=', $searchBy['searchDateTo']);
		}
		if(isset($searchBy['searchItem'])){
			if(!empty($searchBy['searchItem'])){
				$this->db->where_in('sm.item_code', $searchBy['searchItem']);
			}
		}
		 
		 return $this->db->get();
	}
	
	public function get_sum_stock_movement_list_by_search($searchBy)
	{
		$this->db->select("item_code, COLUMN_JSON(attributes) as attributes, SUM(CASE WHEN type = 'VGR1' THEN base_uom_quantity ELSE 0 END) as 'VGR1'
						  , SUM(CASE WHEN type = 'VPS1' THEN base_uom_quantity ELSE 0 END) as 'VPS1'");
		$this->db->from('stock_movements');
		if(isset($searchBy['searchSite'])){
			$this->db->where('site_id', $searchBy['searchSite']);
		}
		if(isset($searchBy['searchDateFrom'])){
			$this->db->where('date_created <', $searchBy['searchDateFrom']);
		}
		if(isset($searchBy['searchItem'])){
			if(!empty($searchBy['searchItem'])){
				$this->db->where_in('item_code', $searchBy['searchItem']);
			}
		}
		 $this->db->group_by('item_code, attributes');
		 return $this->db->get();
	}
	
	public function get_group_stock_movement_list_by_search($searchBy)
	{
		
		$this->db->select("*, COLUMN_JSON(attributes) as attributes, SUM(CASE WHEN type = 'VGR1' THEN base_uom_quantity ELSE 0 END) as 'VGR1'
						  , SUM(CASE WHEN type = 'VPS1' THEN base_uom_quantity ELSE 0 END) as 'VPS1'");
		$this->db->from('stock_movements');
		if(isset($searchBy['searchSite'])){
			$this->db->where('site_id', $searchBy['searchSite']);
		}
		if(isset($searchBy['searchDateFrom'])){
			$this->db->where('date_created >=', $searchBy['searchDateFrom']);
		}
		if(isset($searchBy['searchDateTo'])){
			$this->db->where('date_created <=', $searchBy['searchDateTo']);
		}
		if(isset($searchBy['searchItem'])){
			if(!empty($searchBy['searchItem'])){
				$this->db->where_in('item_code', $searchBy['searchItem']);
			}
		}
		 $this->db->group_by('item_code, attributes');
		 return $this->db->get();
	}
	
	public function get_movement_code_list()
	{
		return $this->db->get('movements_code');
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
