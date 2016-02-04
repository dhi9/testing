<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inventory_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function generate_stock_setting_reference($stock_setting_id)
	{
		$date_created = $this->get_stock_setting_by_id($stock_setting_id)->row()->date_created;
		
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
		
		$query = $this->db
			->where('date_created <=', $date_created)
			->where('date_created >', $initial_date)
		->get('manual_stock_settings');
		$count = $query->num_rows();
		
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		$manual_stock_setting_reference = 'PS_'.$date.'-'.$sequence;
		
		return $manual_stock_setting_reference;
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
	
		/*
		return $this->db
			->where('manual_stock_setting_id', $id)
		->get('manual_stock_setting_items');
		*/
		return $this->db->query("SELECT
					`manual_stock_setting_item_id`,
					`manual_stock_setting_id`,
					`item_code`,
					`item_name`,
					`item_uom`,
					`quantity`,
					`bin_id`,
					`batch_id`,
					`attributes`,
					`remark`,
					COLUMN_JSON(attributes) AS 'attributes'
					FROM manual_stock_setting_items WHERE `manual_stock_setting_id` = ".$id."");
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
	
	public function reject_stock_setting_by_reference($data){
		$this->db->update(
			'manual_stock_settings',
				$data,
				array('manual_stock_setting_reference' => $data['manual_stock_setting_reference'])
		);
	}
}