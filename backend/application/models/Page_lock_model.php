<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Page_lock_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}

	public function insert_page_lock($data)
	{
		$insert = array(
			'session_id' => $this->session->session_id,
			'level' => $data['level']
		);
		
		if( isset($data['order_id']) )
		{
			$insert['order_id'] = $data['order_id'];
		}
		if( isset($data['delivery_id']) )
		{
			$insert['delivery_id'] = $data['delivery_id'];
		}
		
		$this->db->insert('page_locks', $insert);
	}
	
	public function delete_page_lock()
	{
		$this->db->delete(
			'page_locks',
			array(
				'session_id' => $this->session->session_id
			)
		);
	}
	
	public function get_page_lock_by_order_id($order_id)
	{
		return $this->db
			->where('level', 'O')
			->where('order_id', $order_id)
		->get('page_locks');
	}
	
	public function get_page_lock_by_delivery_id($delivery_id)
	{
		return $this->db
			->where('level', 'D')
			->where('delivery_id', $delivery_id)
		->get('page_locks');
	}
}