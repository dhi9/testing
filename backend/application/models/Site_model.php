<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Site_model extends CI_Model {

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
	
	public function get_active_site_list()
	{
		return $this->db->where('status', 'A')->get('sites');
	}
	
	public function get_storage_location_list()
	{
		return $this->db->get('storage_locations');
	}
	
	public function get_site_location_list_by_site_id($site_id)
	{
		return $this->db->where('site_id', $site_id)->get('storage_locations');
	}
	
	public function get_site_location_list_by_site_reference($site_reference)
	{
		return $this->db->where('site_reference', $site_reference)->get('storage_locations');
	}
	
	public function get_storage_by_id($id)
	{
		return $this->db->where('storage_id', $id)->get('storage_locations');
	}
	
	public function get_storage_by_storage_name($storage_name)
	{
		return $this->db->where('storage_name', $storage_name)->get('storage_locations');
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
	
	public function insert_site_history($new_site)
	{
		$data_list = array(
			'site_name' => array('field' => 'Nama', 'section' => 'Umum'),
			'address' => array('field' => 'Alamat', 'section' => 'Umum'),
			'city' => array('field' => 'Kota', 'section' => 'Umum'),
			'postcode' => array('field' => 'Kode Pos', 'section' => 'Umum'),
			'phone_number' => array('field' => 'No. Telp', 'section' => 'Umum'),
			'fax_number' => array('field' => 'Fax', 'section' => 'Umum'),
			'status' => array('field' => 'Status', 'section' => 'Umum'),
		);
		
		$old_site = $this->get_site_by_id($new_site['site_id'])->row_array();
		
		$now = date('Y-m-d H:i:s');
		
		foreach($data_list as $key => $value){
			if($old_site[$key] != $new_site[$key]){
				$insert = array(
					'site_id' => $new_site['site_id'],
					'user_id' => $this->session->userdata('user_id'),
					'section' => $value['section'],
					'field' => $value['field'],
					'old_data' => $old_site[$key],
					'new_data' => $new_site[$key],
					'date_created' => $now
				);
				$this->insert_site_update_history($insert);
			}
		}
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
	
	public function insert_storage_history($new_storage)
	{
		$data_list = array(
			'storage_name' => array('field' => 'Lokasi', 'section' => 'Umum'),
			'storage_details' => array('field' => 'Detail Lokasi', 'section' => 'Umum'),
			'status' => array('field' => 'Status', 'section' => 'Umum'),
		);
		
		$old_storage = $this->get_storage_by_id($new_storage['storage_id'])->row_array();
		
		$now = date('Y-m-d H:i:s');
		
		foreach($data_list as $key => $value){
			if($old_storage[$key] != $new_storage[$key]){
				$insert = array(
					'storage_id' => $new_storage['storage_id'],
					'user_id' => $this->session->userdata('user_id'),
					'section' => $value['section'],
					'field' => $value['field'],
					'old_data' => $old_storage[$key],
					'new_data' => $new_storage[$key],
					'date_created' => $now
				);
				$this->insert_storage_update_history($insert);
			}
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
	
	public function insert_bin_history($new_bin)
	{
		$data_list = array(
			'bin_name' => array('field' => 'Nama', 'section' => 'Umum'),
			'status' => array('field' => 'Status', 'section' => 'Umum'),
		);
		
		$old_bin = $this->get_bin_by_id($new_bin['bin_id'])->row_array();
		
		$now = date('Y-m-d H:i:s');
		
		foreach($data_list as $key => $value){
			if($old_bin[$key] != $new_bin[$key]){
				$insert = array(
					'bin_id' => $new_bin['bin_id'],
					'user_id' => $this->session->userdata('user_id'),
					'section' => $value['section'],
					'field' => $value['field'],
					'old_data' => $old_bin[$key],
					'new_data' => $new_bin[$key],
					'date_created' => $now
				);
				$this->insert_bin_update_history($insert);
			}
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
