<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Site_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_site_by_id($id)
	{
		return $this->db->where('site_id', $id)->get('sites');
	}
	
	public function get_site_by_reference($reference)
	{
		return $this->db->where('site_reference', $reference)->get('sites');
	}
	
	public function get_site_history_list_by_site_id($site_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('site_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('site_id', $site_id)
			->order_by('vuh.date_created desc')
		->get();
	}
	
	public function get_movement_code_list()
	{
		return $this->db->get('movements_code');
	}
	
	public function get_site_list()
	{
		return $this->db->get('sites');
	}
	public function get_site_consignment_list()
	{
		return $this->db->from('sites')
			->where('consignment', '1')
			->where('customer_id', NULL)
			->get();
	}
    
    public function get_site_non_consignment_list()
	{
		return $this->db->from('sites')
			->where('consignment', '0')
			->where('customer_id', NULL)
			->get();
	}
    
	public function get_site_consignment_list_by_customer_id($customerId)
	{
		return $this->db->from('sites')
			->where('customer_id', $customerId)
			->get();
	}
	public function get_storage_location_list()
	{
		return $this->db->get('storage_locations');
	}
	
	public function get_site_location_list_by_site_id($site_id)
	{
		return $this->db->where('site_id', $site_id)->get('storage_locations');
	}
	
	public function get_storage_by_id($id)
	{
		return $this->db->where('storage_id', $id)->get('storage_locations');
	}
	
	public function get_storage_by_name($name)
	{
		return $this->db->where('storage_name', $name)->get('storage_locations');
	}
	
	public function get_site_bin_list_by_storage_id($storage_id)
	{
		return $this->db->where('storage_id', $storage_id)->get('bin_locations');
	}
	
	public function get_bin_by_id($id)
	{
		return $this->db->where('bin_id', $id)->get('bin_locations');
	}
	
	public function get_storage_history_list_by_storage_id($storage_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('storage_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('storage_id', $storage_id)
			->order_by('vuh.date_created desc')
		->get();
	}
	
	public function get_bin_history_list_by_bin_id($bin_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('bin_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('bin_id', $bin_id)
			->order_by('vuh.date_created desc')
		->get();
	}
	
	public function insert_site_update_history($array)
	{
		if ( $this->db->insert('site_update_history', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function update_site($data)
	{
		$this->db->update(
			'sites',
			$data,
			array('site_id' => $data['site_id'])
		);
	}
	
	
	public function get_storage_list_by_site_id($site_id)
	{
		return $this->db->where('site_id', $site_id)->get('storage_locations');
	}
	
	public function insert_storage($array)
	{
		if ( $this->db->insert('storage_locations', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function update_storage($data)
	{
		$this->db->update(
			'storage_locations',
			$data,
			array('storage_id' => $data['storage_id'])
		);
	}
	
	
	public function update_bin($data)
	{
		$this->db->update(
			'bin_locations',
			$data,
			array('bin_id' => $data['bin_id'])
		);
	}
	
	public function insert_bin($array)
	{
		if ( $this->db->insert('bin_locations', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_storage_update_history($array)
	{
		if ( $this->db->insert('storage_update_history', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_bin_update_history($array)
	{
		if ( $this->db->insert('bin_update_history', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_site($array)
	{
		if ( $this->db->insert('sites', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function get_bin_list_by_item_code_storage_id($item_code, $storage_id)
	{
		return $this->db
			//->select('*, vuh.date_created as datetime')
			->from('inventory_stocks is')
			->join('bin_locations bl', 'bl.bin_id = is.bin_id')
			->where('is.item_code', $item_code)
			->where('is.storage_id', $storage_id)
		->get();
	}
}
