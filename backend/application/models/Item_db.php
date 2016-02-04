<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Item_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function delete_item_uom_conversion($data)
	{
		$this->db->update(
			'item_uom_conversions',
			array('status' => 'X'),
			array('conversion_id' => $data['conversion_id'])
		);
	}
	
	public function get_all_items()
	{
		return $this->db->get('items');
	}
	
	public function get_all_item_with_category()
	{
		return $this->db
		->select('i.*, c.category_name')
		->from('items i')
		->join('categories c', 'i.category_id = c.category_id')
		->get();
	}
	
	public function get_raw_item_list()
	{
		return $this->db->where('item_type', 'RAW')->get('items');
	}
	
	public function get_tag_list()
	{
		return $this->db->where('status', 'A')->get('tags');
	}
	
	public function get_item_tag_list($item_code)
	{
		return $this->db
		->select('it.*, t.tag_name')
		->from('item_tags it')
		->join('tags t', 't.tag_id = it.tag_id')
		->where('it.item_code', $item_code)
		->where('it.status', 'A')
		->where('t.status', 'A')
		->get();
	}
	
	public function get_tag($tag_name)
	{
		return $this->db->where('tag_name',$tag_name)->get('tags');
	}
	
	public function get_item($item_id)
	{
		return $this->db->where('item_id', $item_id)->get('items');
	}
	
	public function get_item_by_item_code($item_code)
	{
		return $this->db->where('item_code', $item_code)->get('items');
	}
	
	public function get_manual_stock_setting_list()
	{
		return $this->db
			->select('mss.*, u.username as creator')
			->from('manual_stock_settings mss')
			->join('users u', 'mss.creator_id = u.user_id')
			->where_not_in('mss.status', 'X')
		->get();
	}
	
	public function get_item_uom_history_list_by_item_code($item_code)
	{
		return $this->db
			->select('*, iuh.date_created as datetime')
			->from('item_update_histories iuh')
			->join('users u', 'u.user_id = iuh.user_id')
			->where('iuh.item_code', $item_code)
			->order_by('iuh.date_created desc')
		->get();
	}
	
	public function get_item_uom_conversion_by_id($id)
	{
		return $this->db
			->where('conversion_id', $id)
		->get('item_uom_conversions');
	}
	
	public function get_item_uom_conversion_list_by_item_code($item_code)
	{
		return $this->db
			->where('item_code', $item_code)
		->get('item_uom_conversions');
	}
	
	public function get_item_uom_conversion_by_item_code_and_item_unit($item_code, $item_unit)
	{
		return $this->db
			->where('item_code', $item_code)
			->where('alternative_uom', $item_unit)
		->get('item_uom_conversions');
	}
	
	public function get_site_id_by_site_reference($site_reference)
	{
		return $this->db
			->select('site_id')
			->from('sites')
			->where('site_reference', $site_reference)
		->get();
	}
	
	public function get_all_inventory_by_site_reference($site_id, $item_code)
	{
		return $this->db
			->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name')
			->from('inventory_stocks is')
			->join('batchs b', 'b.batch_id = is.batch_id', 'left')
			->join('sites s', 's.site_id = is.site_id', 'left')
			->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
			->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
			->where('is.item_code', $item_code)
			->where_in('is.site_id', $site_id)
		->get();
	}
	
	public function get_all_inventory_by_item_code($item_code)
	{
		return $this->db
			->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name')
			->from('inventory_stocks is')
			->join('batchs b', 'b.batch_id = is.batch_id', 'left')
			->join('sites s', 's.site_id = is.site_id', 'left')
			->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
			->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
			->where('is.item_code', $item_code)
		->get();
	}
	
	public function get_all_inventory()
	{
		return $this->db
			->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name')
			->from('inventory_stocks is')
			->join('batchs b', 'b.batch_id = is.batch_id', 'left')
			->join('sites s', 's.site_id = is.site_id', 'left')
			->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
			->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
		->get();
	}
	
	public function get_batch($batch_reference)
	{
		return $this->db->where('batch_reference', $batch_reference)->get('batchs');
	}
	
	public function insert_item_uom_conversion($array)
	{
		if ( $this->db->insert('item_uom_conversions', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_item($array)
	{
		if ( $this->db->insert('items', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	
	public function insert_tag($array)
	{
		if ( $this->db->insert('tags', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_item_tag($array)
	{
		if ( $this->db->insert('item_tags', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_item_update_history($array)
	{
		if ( $this->db->insert('item_update_histories', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function update_item_uom_conversion($data)
	{
		$this->db->update(
			'item_uom_conversions',
			$data,
			array('conversion_id' => $data['conversion_id'])
		);
	}
	
	public function update_item($data)
	{
		$data['date_updated'] = date('Y-m-d H:i:s');
		
		$this->db->update(
			'items',
			$data,
			array('item_code' => $data['item_code'])
		);
	}
	
	public function update_item_tag($data)
	{
		$this->db->update(
			'item_tags',
			$data,
			array('item_tag_id' => $data['item_tag_id'])
		);
	}
	
	public function update_all_item_tag($data)
	{
		$this->db->update(
			'item_tags',
			$data,
			array('tag_id' => $data['tag_id'])
		);
	}
	
	public function update_item_base_uom($item_code, $base_uom, $base_uom_description)
	{
		$this->db->update(
			'item_uom_conversions',
			array(
				'base_uom' => $base_uom,
				'base_uom_description' => $base_uom_description
			),
			array('item_code' => $item_code)
		);
	}
	
	public function get_combined_item_list_by_customer_id($customer_id)
	{
		return $this->db
			->where('customer_id', $customer_id)
		->get('customer_combined_items');
	}
	
	public function get_combined_item_by_item_code($item_code)
	{
		return $this->db
			->where('item_code', $item_code)
		->get('customer_combined_items');
	}
	
	public function insert_combined_item($array)
	{
		if ( $this->db->insert('customer_combined_items', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function get_item_location_list($item_code)
	{
		return $this->db
			->select('is.*, s.site_reference, sl.storage_name, bn.bin_name')
			->from('item_locations is')
			->join('sites s', 's.site_id = is.site_id', 'left')
			->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
			->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
			->where('is.item_code', $item_code)
		->get();
	}
	
	public function get_item_location_list_by_item_code($item_code)
	{
		return $this->db
			->select('is.*, s.site_reference, sl.storage_name, bn.bin_name')
			->from('inventory_stocks is')
			->join('sites s', 's.site_id = is.site_id', 'left')
			->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left')
			->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left')
			->where('is.item_code', $item_code)
		->get();
	}
	
	public function get_item_location_by_data($data)
	{
		return $this->db->get_where(
			'item_locations',
			$data
		);
	}
	public function get_item_alternate_by_data($data)
	{
		return $this->db->get_where(
			'item_alternates',
			$data
		);
	}
	
	public function update_item_location_by_id($id, $data)
	{
		$this->db->update(
			'item_locations',
			$data,
			array('item_location_id' => $id)
		);
	}
	public function update_item_alternate_by_id($id, $data)
	{
		$this->db->update(
			'item_alternates',
			$data,
			array('item_alternate_id' => $id)
		);
	}
	
	public function insert_item_location($array)
	{
		if ( $this->db->insert('item_locations', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_item_alternate($array)
	{
		if ( $this->db->insert('item_alternates', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function get_item_delivery_by_delivery_item_id($id)
	{
		return $this->db
			->where('purchase_delivery_request_item_id', $id)
			->get('request_delivery_request_items');
	}
	
	public function get_items_with_tag($id)
	{
		return $this->db
			->where('tag_id', $id)
			->where('status', "A")
			->get('item_tags');
	}
	
	public function get_item_tags($tag_id, $item_code)
	{
		return $this->db
			->where('tag_id', $tag_id)
			->where('item_code', $item_code)
			->get('item_tags');
	}
	
	public function update_tag($data)
	{
		$this->db->update(
			'tags',
			$data,
			array('tag_id' => $data['tag_id'])
		);
	}
	
}
