<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Site_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('site_db');
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
	
	/*public function insert_site($data)
	{
		$site_id = $this->site_model->insert_site($data);
		
		$insert_inventory = array(
			'item_code'
		);
	}*/
}
