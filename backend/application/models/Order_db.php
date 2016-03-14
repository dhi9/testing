<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Order_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('item_model');
	}
	
	public function change_order_status($order_id, $status)
	{
		return $this->db->update(
			'orders',
			array(
				'status' => $status
			),
			array('order_id' => $order_id)
		);
	}
	
	public function get_order_list()
	{
		return $this->db
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_active_orders()
	{
		return $this->db
			->where_not_in('status', array('Z', 'X', 'C'))
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_completed_orders($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('date_created <', $end_date);
		}
		
		return $this->db
			->where('status', 'C')
			->where('status !=', 'Z')
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_all_orders($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('date_created <', $end_date);
		}
		
		return $this->db
			->where_not_in('status', array('Z', 'X'))
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_order($order_id)
	{
		return $this->db->where('order_id', $order_id)->get('orders');
	}
	
	public function get_order_by_id($order_id)
	{
		return $this->db->where('order_id', $order_id)->get('orders');
	}
	
	public function get_order_between_date($start_date = NULL, $end_date=NULL)
	{
		return $this->db->where('date_created >=', $start_date)
						->where('date_created <=', $end_date)
						->get('orders');
	}
	
	public function get_order_items($order_id)
	{
		/*return $this->db
			->where('order_id', $order_id)
		->get('order_items');*/
		
		return $this->db->query("
			SELECT *, COLUMN_JSON(attributes) AS `attributes`
			FROM `order_items`
			WHERE `order_id` = '$order_id'
		");
	}
	
	public function get_order_item_list_by_order_id($order_id)
	{
		/*
		return $this->db
			->where('order_id', $order_id)
		->get('order_items');
		*/
		return $this->db->query("
			SELECT *, COLUMN_JSON(attributes) AS `attributes`
			FROM `order_items`
			WHERE `order_id` = '$order_id'
		");
	}
	
	public function get_blocked_orders()
	{
		return $this->db
			->select('o.order_reference, c.customer_name, c.pic_name, min(dr.requested_delivery_date) as requested_delivery_date, c.customer_id')
			->from('orders o')
			->join('customers c', 'c.customer_id = o.customer_id')
			->join('delivery_requests dr', 'dr.order_id = o.order_id')
			->where('c.is_credit_blocked', 1)
			->group_by('o.order_reference, c.customer_name, c.pic_name')
		->get();
	}
	
	public function get_orders_to_deliver()
	{
		return $this->db
			->select('
				o.order_id, MIN(dr.requested_delivery_date) as requested_date,
				c.customer_name, o.status,
				o.order_reference, o.production_completed_date
			')
			->from('orders o')
			->where_in('o.status', array('R','B','D'))
			->join('delivery_requests dr', 'dr.order_id = o.order_id')
			->join('customers c', 'c.customer_id = o.customer_id')
			->group_by('o.order_id')
			->order_by('requested_date')
		->get();
	}
	
	public function get_order_by_order_reference($order_reference)
	{
		return $this->db
			->where('order_reference', $order_reference)
		->get('orders');
	}
	
	public function get_draft_order_list($department)
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_orders do')
			->join('users user_creator','user_creator.user_id = do.draft_creator', 'left')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			->where_in('do.product_type', $department)
			->where_in('do.status', array('A'))
		->get();
	}
	
	public function get_user_draft_order_list($user_id)
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_orders do')
			->join('users user_creator','user_creator.user_id = do.draft_creator')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			->where('do.draft_creator', $user_id)
			->where_not_in('do.status', array('C', 'X'))
		->get();
	}
	
	public function get_user_active_draft_order_list($user_id)
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_orders do')
			->join('users user_creator','user_creator.user_id = do.draft_creator')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			->where('do.draft_creator', $user_id)
			->where_in('do.status', array('A'))
			->where_not_in('do.status', array('C', 'X'))
		->get();
	}
	
	public function get_user_changed_draft_order_list($user_id)
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_orders do')
			->join('users user_creator','user_creator.user_id = do.draft_creator')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			->where('do.draft_creator', $user_id)
			->where_in('do.status', array('U'))
			->where_not_in('do.status', array('C', 'X'))
		->get();
	}
	
	public function get_draft_order_by_draft_id($draft_id)
	{
		return $this->db
			->where('draft_id', $draft_id)
		->get('draft_orders');
	}
	
	public function insert_order($array)
	{
		if ( $this->db->insert('orders', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_order_items($array)
	{
		$column_list = ["order_id", "item_code", "length", "width", "height", "quantity", "material_type", "remark", "child_items", "attributes", "cost", "disc_percent", "disc_value"];
		
		$data = array();
		foreach($column_list as $column){
			if(isset($array[$column])){
				$data[$column] = $array[$column];
			}
		}
		
		if ( $this->db->insert('order_items', $data) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_draft_order($data)
	{
		$array = json_decode($data, true);
		
		$insert = array(
			'draft_creator' => $this->session->userdata('user_id'),
			'draft_data' => $data,
			'product_type' => $array['product_type'],
			'status' => 'A'
		);
		
		if ( $this->db->insert('draft_orders', $insert) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_good_issue($data)
	{
		if(! empty($data['attributes'])){
			$attributes = $data['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($data['attributes']);
		}
		
		if ( $this->db->insert('order_item_delivery', $data) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_order($data)
	{
		$this->db->update(
			'orders',
			$data,
			array('order_id' => $data['order_id'])
		);
	}
	
	public function update_good_issue($data)
	{
		$this->db->update(
			'order_item_delivery',
			$data,
			array('order_item_delivery_id' => $data['order_item_delivery_id'])
		);
	}
	
	public function update_draft_order($data)
	{
		unset($data['approver']);
		
		$this->db->update(
			'draft_orders',
			$data,
			array('draft_id' => $data['draft_id'])
		);
	}
	
	public function get_draft_approver_by_draft_id($draft_id)
	{
		return $this->db
			->from('draft_orders do')
			->join('users u', 'u.user_id = do.draft_approver')
			->where('do.draft_id', $draft_id)
		->get();
	}
	
	public function get_sales_invoice_by_order_id($order_id)
	{
		return $this->db
			->where('order_id', $order_id)
		->get('sales_invoices');
	}
	public function get_sales_invoice_items_by_invoice_id($invoice_id)
	{
		return $this->db
			->select("*, COLUMN_JSON(attributes) as attributes")
			->from("sales_invoice_items")
			->where("invoice_id", $invoice_id)
		->get();
	}
	
	public function insert_sales_invoice($array)
	{
		if ( $this->db->insert('sales_invoices', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_sales_invoice_item($array)
	{
		if(! empty($array['attributes'])){
			$attributes = $array['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($array['attributes']) ;
		}
		
		if ( $this->db->insert('sales_invoice_items', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function count_not_completed_order()
	{
		return $this->db->where('status !=', 'C')->count_all_results('orders');
	}
	
	public function total_today_available_stock_value()
	{
		$stock_list = $this->db
			->select('is.item_code, SUM(is.quantity) as quantity, i.value_amount')
			->from('inventory_stocks as is')
			->join('items as i', 'i.item_code = is.item_code', 'left')
			->group_by('is.item_code')
		->get()->result_array();
		
		$total = 0;
		foreach($stock_list as $stock){
			$total += $stock['quantity'] * $stock['value_amount'];
		}
		
		return $total;
	}
}