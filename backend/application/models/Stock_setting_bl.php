<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Stock_setting_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('inventory_db', 'inventory_bl', 'user_db', 'stock_setting_db', 'item_bl'));
	}
	
	public function insert_stock_setting($data)
	{
		$stock_setting = $data['stock_setting'];
		$stock_setting_items = $data['stock_setting_items'];
			
		$insert_stock_setting = array(
			'type' => $stock_setting['type'],
			//'material'
			'creator_id' => $this->session->userdata('user_id'),
			//'approver_id'
			'posting_date' => $stock_setting['posting_date'],
			'posting_name' => $stock_setting['posting_name'],
			'site_id' => $stock_setting['site_id'],
			'storage_id' => $stock_setting['storage_id'],
			//'approved_data'
		);
		$manual_stock_setting_id = $this->stock_setting_db->insert_stock_setting($insert_stock_setting);
		
		$manual_stock_setting_reference = $this->generate_stock_setting_reference($manual_stock_setting_id);
		
		$update = array(
			'manual_stock_setting_id' => $manual_stock_setting_id,
			'manual_stock_setting_reference' => $manual_stock_setting_reference
		);
		$this->stock_setting_db->update_stock_setting($update);
		
		foreach($stock_setting_items as $item){
			$insert_item = array(
				'manual_stock_setting_id' => $manual_stock_setting_id,
				'item_code' => $item['item_code'],
				'item_name' => $item['item_name'],
				'item_uom' => @$item['item_uom'],
				'quantity' => $item['quantity'],
				//'bin_id' => @$item['bin_id'],
				//'batch_id' => $item['batch_id'],
			);
			
			if(isset($item['bin_id'])){
				$insert_item['bin_id'] = $item['bin_id'];
			}
			if(isset($item['remark'])){
				$insert_item['remark'] = $item['remark'];
			}
			
			$this->stock_setting_db->insert_stock_setting_item($insert_item);
		}
		
		return $manual_stock_setting_reference;
	}
	
	public function approve_stock_setting($data)
	{
		$update = array(
			'manual_stock_setting_id' => $data['manual_stock_setting_id'],
			'approver_id' => $data['approver_id'],
			'approved_date' => date('Y-m-d H:i:s'),
			'status' => 'P'
		);
		$this->stock_setting_db->update_stock_setting($update);
		
		$stock_setting = $this->stock_setting_db->get_stock_setting_by_id($data['manual_stock_setting_id'])->row_array();
		$creator = $this->user_db->get_user_by_id($stock_setting['creator_id'])->row_array();
		$item_list = $this->stock_setting_db->get_stock_setting_item_list_by_stock_setting_id($data['manual_stock_setting_id'])->result_array();
		
		foreach($item_list as $item){
			$stock = array(
				'item_code' => $item['item_code'],
				'site_id' => $stock_setting['site_id'],
				'storage_id' => $stock_setting['storage_id'],
			);
			
			$basic_uom_quantity = $this->item_bl->convert_to_basic_uom_quantity($item['item_code'], $item['quantity'], $item['item_uom']);
			
			if($stock_setting['type'] == 'VPS1'){
				$this->inventory_bl->add_stock_quantity($stock, $basic_uom_quantity);
			}
			else{
				$this->inventory_bl->subtract_stock_quantity($stock, $basic_uom_quantity);
			}
			
			$item_detail = $this->item_db->get_item_by_item_code($item['item_code'])->row_array();
			$price = $basic_uom_quantity * $item_detail['value_amount'];
			
			$insert_stock_movement = array(
				'item_code' => $item['item_code'],
				'document_reference' => $stock_setting['manual_stock_setting_reference'],
				'posting_date' => $stock_setting['posting_date'],
				'quantity' => $item['quantity'],
				'uom' => $item['item_uom'],
				'uom_quantity' => $basic_uom_quantity,
				'creator_id' => $creator['user_id'],
				'type' => $stock_setting['type'],
				'price' => $price,
			);
			$this->stock_movement_bl->insert_stock_movement($insert_stock_movement);
		}
	}
	
	public function generate_stock_setting_reference($stock_setting_id)
	{
		$date_created = $this->stock_setting_db->get_stock_setting_by_id($stock_setting_id)->row()->date_created;
		
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
		
		$query = $this->stock_setting_db->get_manual_stock_setting_list_by_date_created_range($initial_date, $date_created);
		
		$count = $query->num_rows();
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		$manual_stock_setting_reference = 'PS_'.$date.'-'.$sequence;
		
		return $manual_stock_setting_reference;
	}
	
	public function is_user_stock_setting_approver()
	{
		$user_id = $this->session->userdata('user_id');
		
		$query = $this->stock_setting_db->get_stock_setting_approver_by_user_id($user_id);
		
		if($query->num_rows() > 0){
			return TRUE;
		}
		else{
			return FALSE;
		}
	}
}
