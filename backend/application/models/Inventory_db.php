<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inventory_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_stock_setting_list()
	{
		return $this->db->get('manual_stock_settings');
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
		return $this->db
			->where('manual_stock_setting_id', $id)
		->get('manual_stock_setting_items');
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
		if (
			//$this->db->insert('manual_stock_setting_items', $array)
			
			// field no yet (bin_id, batch_id, remark)
			$this->db->query("INSERT INTO `manual_stock_setting_items`(
								`manual_stock_setting_id`,
								`item_code`,
								`item_name`,
								`item_uom`,
								`quantity`,
								`attributes`
							 )
							VALUES (
								".$array['manual_stock_setting_id'].",
								'".$array['item_code']."',
								'".$array['item_name']."',
								'".$array['item_uom']."',
								".$array['quantity'].",
								COLUMN_CREATE(".implode(",", $array['attributes']).")
								)"
							)
			)
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
	
	public function reject_stock_setting_by_reference($data)
	{
		$this->db->update(
			'manual_stock_settings',
			$data,
			array('manual_stock_setting_reference' => $data['manual_stock_setting_reference'])
		);
	}
	
	public function get_manual_stock_setting_list_by_date_created_range($start_date, $end_date)
	{
		if($start_date != NULL)
		{
			$this->db->where('date_created >', $start_date);
		}
		if($end_date != NULL)
		{
			$this->db->where('date_created <=', $end_date);
		}
		
		return $this->get_stock_setting_list();
	}
	
	public function get_stock_by_data($data)
	{
		if (! empty( $data['item_code'] )) {
			$this->db->where('item_code', $data['item_code']);
		}
		
		if (! empty( $data['site_id'] )) {
			$this->db->where('site_id', $data['site_id']);
		}
		
		if (! empty( $data['storage_id'] )) {
			$this->db->where('storage_id', $data['storage_id']);
		}
		
		if (! empty( $data['bin_id'] )) {
			$this->db->where('bin_id', $data['bin_id']);
		}
		
		if (! empty( $data['batch_id'] )) {
			$this->db->where('batch_id', $data['batch_id']);
		}
		
		if (! empty( $data['attributes'] )) {
			$attributes = $data['attributes'];
			$this->db->where("attributes = COLUMN_CREATE($attributes)");
		}
		
		return $this->db->get('inventory_stocks');
	}
	
	public function update_stock_by_data($data, $quantity)
	{
		$array_where = array();
		
		if (! empty( $data['item_code'] )) {
			$array_where['item_code'] = $data['item_code'];
		}
		
		if (! empty( $data['site_id'] )) {
			$array_where['site_id'] = $data['site_id'];
		}
		
		if (! empty( $data['storage_id'] )) {
			$array_where['storage_id'] = $data['storage_id'];
		}
		
		if (! empty( $data['bin_id'] )) {
			$array_where['bin_id'] = $data['bin_id'];
		}
		
		if (! empty( $data['batch_id'] )) {
			$array_where['batch_id'] = $data['batch_id'];
		}
		
		if(! empty($data['attributes'])){
			$attributes = $data['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($data['attributes']) ;
		}
		
		$this->db->update(
			'inventory_stocks',
			array('quantity' => $quantity),
			$array_where
		);
	}
	
	public function insert_inventory($array)
	{
		if (! empty( $array['requests_delivery_request_id'] )) {
			unset($array['requests_delivery_request_id']);
		}
			
		if (! empty( $array['item_unit'] )) {
			unset($array['item_unit']);
		}
		if (! empty( $array['date_recieved'] )) {
			unset($array['date_recieved']);
		}
		//if (! empty( $array['remark'] )) {
			unset($array['remark']);
		//}
		
		if(empty($array['bin_id'])){
			$array['bin_id'] = NULL;
		}
		
		if($array['storage_id'] == ''){
			$array['storage_id'] = NULL;
		}
		/*if($array['bin_id'] == ''){
			$array['bin_id'] = NULL;
		}
		if($array['batch_id'] == ''){
			$array['batch_id'] = NULL;
		}*/
		
		if(! empty($array['attributes'])){
			$attributes = $array['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($array['attributes']) ;
		}
		
		if ( $this->db->insert('inventory_stocks', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function get_opname_by_creator_id($id)
	{
		return $this->db
			->select('so.*, u.username as opname_creator')
			->from('stock_opname so')
			->join('users u', 'u.user_id = so.opname_creator_id')
			->where('so.opname_creator_id', $id)
		->get();
	}
	
	public function get_opname_list()
	{
		return $this->db
			->select('so.*, u.username as opname_creator, s.site_name,')
			->from('stock_opname so')
			->join('users u', 'u.user_id = so.opname_creator_id')
			->join('sites s', 's.site_id = so.site_id')
		->get();
	}
	
	public function get_opname_detail($stock_opname_id)
	{
		return $this->db
			->select('so.*, u.username as opname_creator, s.site_name,')
			->from('stock_opname so')
			->where('stock_opname_id', $stock_opname_id)
			->join('users u', 'u.user_id = so.opname_creator_id')
			->join('sites s', 's.site_id = so.site_id')
		->get();
	}
	
	public function get_opname_item_list($stock_opname_id)
	{
		return $this->db
			->select('so.*, s.site_name, b.batch_reference')
			->from('stock_opname_items so')
			->where('stock_opname_id', $stock_opname_id)
			->join('sites s', 's.site_id = so.site_id')
			->join('batchs b', 'b.batch_id = so.batch_id')
		->get();
	}
	
	public function insert_stock_opname($array)
	{
		if ( $this->db->insert('stock_opname', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_stock_opname_item($array)
	{
		if ( $this->db->insert('stock_opname_items', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_stock_item($data)
	{
		$this->db->update(
			'stock_opname_items',
			$data,
			array('stock_opname_item_id' => $data['stock_opname_item_id'])
		);
	}
	
	public function get_stock_display()
	{
		/*
		return $this->db
			// ->select('is.*, u.username as opname_creator, s.site_name,')
			 ->from('inventory_stocks is')
			 ->join('sites s', 's.site_id = is.site_id')
			 ->join('items i', 'i.item_code = is.item_code')
		->get();
		*/
		return $this->db->query("
					SELECT	*, COLUMN_JSON(attributes) as attributes
					FROM inventory_stocks
					LEFT JOIN
						sites ON sites.site_id=inventory_stocks.site_id
					LEFT JOIN
						storage_locations ON storage_locations.storage_id=inventory_stocks.storage_id
					LEFT JOIN
						bin_locations ON bin_locations.bin_id=inventory_stocks.bin_id		 
				");
	}
	public function get_stock_display_by_filter($data)
	{
		//$this->db->select("*, COUNT(it.tag_id) as tags, COLUMN_JSON(inven.attributes) as attributes");
		if($data['count_tags'] > 0){
			$this->db->select("*, COUNT(it.tag_id) as tags, COLUMN_JSON(inven.attributes) as attributes");
		}else{
			$this->db->select("*, COLUMN_JSON(inven.attributes) as attributes");
		}
		$this->db->from("inventory_stocks inven");
		$this->db->join("sites s", "s.site_id = inven.site_id", "left");
		$this->db->join("storage_locations sl", "sl.storage_id = inven.storage_id", "left");
		$this->db->join("bin_locations b", "b.bin_id = inven.bin_id", "left");
		if($data['count_tags'] > 0){
			$this->db->join("item_tags it", "it.item_code = inven.item_code", "left");
			$this->db->where("it.status", "A");
			$this->db->where_in("it.tag_id", array(implode(',', $data['tags'])));
		}
		if($data['site_id'] != 0){
			$this->db->where("inven.site_id", $data['site_id']);
		}
		
		$this->db->group_by("inven.inventory_stock_id");
		if($data['count_tags'] > 0){
			$this->db->having("tags >= ".$data['count_tags']."");
		}
		return $this->db->get();
	}
	
	public function get_inventory_report_by_filter($data)
	{
		//$this->db->select("*, COUNT(it.tag_id) as tags, COLUMN_JSON(inven.attributes) as attributes");
		
			$this->db->select("*, COLUMN_JSON(inven.attributes) as attributes");
		
		$this->db->from("inventory_stocks inven");
		$this->db->join("sites s", "s.site_id = inven.site_id", "left");
		$this->db->join("storage_locations sl", "sl.storage_id = inven.storage_id", "left");
		$this->db->join("bin_locations b", "b.bin_id = inven.bin_id", "left");
		
		if(!empty($data['site_id'])){
			$this->db->where_in("inven.site_id", array(implode(',', $data['site_id'])));
		}
		if(!empty($data['storage_id'])){
			$this->db->where_in("inven.storage_id", array(implode(',', $data['storage_id'])));
		}
		
		$this->db->group_by("inven.inventory_stock_id");
		
		return $this->db->get();
	}
	
	public function get_stock_movements($site_id, $start_date, $end_date)
	{
		return $this->db
			->where('site_id', $site_id)
			->where('date_created >=', $start_date)
			->where('date_created <=', $end_date)
			->where('type', 'VGR1')
			->order_by('date_created desc')
		->get('stock_movements');
	}
	
	public function is_opname_exist($opname_date, $site_id)
	{
		return $this->db
			->where('opname_date', $opname_date)
			->where('site_id', $site_id)
			->get('stock_opname');
	}
	
	public function insert_consignment_stock($data)
	{
		if(! empty($data['attributes'])){
			$attributes = $data['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($data['attributes']);
		}
		
		if ( $this->db->insert('consignment_stocks', $data) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_consignment_stock($data, $quantity)
	{
		if(! empty($data['attributes'])){
			$attributes = $data['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($data['attributes']);
		}
		
		$this->db->update(
			'consignment_stocks',
			array('quantity' => $quantity),
			$data
		);
	}
	
	public function get_all_inventory_by($where)
	{
		$this->db->select('is.*, b.batch_reference, s.site_reference, sl.storage_name, bn.bin_name');
		//$this->db->select('is.*, s.site_reference, sl.storage_name');
		$this->db->from('inventory_stocks is');
		$this->db->join('batchs b', 'b.batch_id = is.batch_id', 'left');
		$this->db->join('sites s', 's.site_id = is.site_id', 'left');
		$this->db->join('storage_locations sl', 'sl.storage_id = is.storage_id', 'left');
		$this->db->join('bin_locations bn', 'bn.bin_id = is.bin_id', 'left');
		
		if(!empty($where['item_code'])){
			$this->db->where('is.item_code', $where['item_code']);
		}
		if(!empty($where['site_id'])){
			$this->db->where_in('is.site_id', $where['site_id']);
		}
		if(!empty($where['storage_id'])){
			$this->db->where_in('is.storage_id', $where['storage_id']);
		}
		
		$this->db->order_by('is.item_code, is.site_id, is.storage_id, is.bin_id');
		
		return $this->db->get();
	}
}
