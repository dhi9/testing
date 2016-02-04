<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Delivery_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function cancel_delivery_request($delivery_request_id)
	{
		return $this->db->update(
			'delivery_requests',
			array(
				'status' => 'X'
			),
			array('delivery_request_id' => $delivery_request_id)
		);
	}
	
	public function cancel_delivery($delivery_id)
	{
		return $this->db->update(
			'deliveries',
			array(
				'status' => 'X'
			),
			array('delivery_id' => $delivery_id)
		);
	}
	
	public function change_delivery_status($delivery_id, $status)
	{
		return $this->db->update(
			'deliveries',
			array(
				'status' => $status
			),
			array('delivery_id' => $delivery_id)
		);
	}
	
	public function change_delivery_request_status($delivery_request_id, $status)
	{
		return $this->db->update(
			'delivery_requests',
			array(
				'status' => $status
			),
			array('delivery_request_id' => $delivery_request_id)
		);
	}
	
	public function check_actual_loading_date_not_empty($delivery_id)
	{
		$delivery = $this->get_delivery($delivery_id)->row_array();
		
		if($delivery['actual_loading_date'] != NULL && $delivery['actual_loading_date'] != '')
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public function count_delivery_quantity($delivery_id)
	{
		return $this->db
			->select('SUM(quantity_sent_actual) AS quantity_sent_actual, SUM(quantity_received) AS quantity_received')
			->from('delivery_items')
			->where('delivery_id', $delivery_id)
			->group_by('delivery_id')
		->get();
	}
	
	public function get_delivery_list()
	{
		return $this->db->get('deliveries');
	}
	
	public function get_non_special_delivery_list_by_date_created_range($start_date, $end_date)
	{
		if($start_date != NULL)
		{
			$this->db->where('date_created >', $start_date);
		}
		if($end_date != NULL)
		{
			$this->db->where('date_created <=', $end_date);
		}
		
		$this->db->where('IFNULL(special_request, 0) = ', 0);
		
		return $this->get_delivery_list();
	}
	
	public function get_special_delivery_list_by_date_created_range($start_date, $end_date)
	{
		if($start_date != NULL)
		{
			$this->db->where('date_created >', $start_date);
		}
		if($end_date != NULL)
		{
			$this->db->where('date_created <=', $end_date);
		}
		
		$this->db->where('IFNULL(special_request, 0) = ', 1);
		
		return $this->get_delivery_list();
	}
	
	public function get_delivery($delivery_id)
	{
		return $this->db->where('delivery_id', $delivery_id)->get('deliveries');
	}
	
	public function get_delivery_by_id($delivery_id)
	{
		return $this->db->where('delivery_id', $delivery_id)->get('deliveries');
	}
	
	public function get_delivery_from_delivery_request($delivery_request_id)
	{
		return $this->db->where('delivery_request_id', $delivery_request_id)->get('deliveries');
	}
	
	public function get_delivery_items($delivery_id)
	{
		return $this->db
			->from('delivery_items di')
			->join('items i', 'i.item_code = di.item_code')
			->where('delivery_id', $delivery_id)
		->get();
	}
	
	public function get_delivery_item_list_by_delivery_id($delivery_id)
	{
		return $this->db
			->from('delivery_items di')
			->join('items i', 'i.item_code = di.item_code')
			->where('delivery_id', $delivery_id)
		->get();
	}
	
	public function get_delivery_requests($order_id)
	{
		return $this->db
			->select('
				delivery_request_id,
				requested_delivery_date,
				requested_delivery_address,
				notes,
				status
			')
			->where('order_id', $order_id)
		->get('delivery_requests');
	}
	
	public function get_delivery_request($delivery_request_id)
	{
		return $this->db
			->select('
				delivery_request_id,
				order_id,
				requested_delivery_date,
				requested_delivery_address,
				notes,
				status
			')
			->where('delivery_request_id', $delivery_request_id)
		->get('delivery_requests');
	}
	
	public function get_delivery_request_items($delivery_request_id)
	{
		return $this->db
			->select('item_code, quantity, material_type, remark')
			->where('delivery_request_id', $delivery_request_id)
		->get('delivery_request_items');
	}
	
	public function get_deliveries_by_delivery_request_id($delivery_request_id)
	{
		return $this->db
			->from('deliveries')
			->where('delivery_request_id', $delivery_request_id)
		->get();
	}
	
	public function get_delivery_requests_by_order_id($order_id)
	{
		return $this->db->where('order_id', $order_id)->get('delivery_requests');
	}
	
	public function get_today_deliveries()
	{
		return $this->db
			->select('o.order_reference, d.delivery_reference, c.customer_name')
			->from('deliveries d')
			->join('orders o', 'o.order_id = d.order_id')
			->join('customers c', 'c.customer_id = o.customer_id')
			->where('DAY(d.loading_date) = DAY(NOW())')
			->where('MONTH(d.loading_date) = MONTH(NOW())')
			->where('YEAR(d.loading_date) = YEAR(NOW())')
			->where_not_in('d.status', array('X', 'Z'))
			->order_by('d.loading_date')
		->get();
	}
	
	public function get_next_7_days_deliveries()
	{
		$tomorrow = date("Y-m-d", strtotime("+1 day")).' 00:00:00';		
		$next_week = date("Y-m-d", strtotime("+8 day")).' 00:00:00';
		
		return $this->db
			->select('o.order_reference, d.delivery_reference, c.customer_name, d.loading_date')
			->from('deliveries d')
			->join('orders o', 'o.order_id = d.order_id')
			->join('customers c', 'c.customer_id = o.customer_id')
			->where("d.loading_date BETWEEN '$tomorrow' AND '$next_week'")
			->order_by('d.loading_date')
		->get();
	}
	
	public function get_not_returned_deliveries()
	{
		return $this->db
			->from('deliveries')
			->where_in('status', array('L', 'S'))
		->get();
	}
	
	public function get_delivery_requests_by_month($year_month)
	{
		$year_month = date("Y-m", strtotime($year_month));
		
		return $this->db
			->from('delivery_requests')
			->like('date_created', $year_month, "after")
		->get();
	}
	
	public function get_delivery_report($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('d.date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('d.date_created <', $end_date);
		}
		
		return $this->db
			->select('*, d.status as delivery_status')
			->from('customers c')
			->join('orders o', 'o.customer_id = c.customer_id')
			->join('delivery_requests dr', 'dr.order_id = o.order_id')
			->join('deliveries d', 'd.delivery_request_id = dr.delivery_request_id')
			->where('d.status !=', 'Z')
		->get();
	}
	
	public function get_travel_letter_report($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('d.date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('d.date_created <', $end_date);
		}
		
		return $this->db
			->select('*, d.status as delivery_status')
			->from('customers c')
			->join('orders o', 'o.customer_id = c.customer_id')
			->join('delivery_requests dr', 'dr.order_id = o.order_id')
			->join('deliveries d', 'd.delivery_request_id = dr.delivery_request_id')
			->where('d.status !=', 'Z')
		->get();
	}
	
	public function get_on_time_delivery_report($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('d.date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('d.date_created <', $end_date);
		}
		
		return $this->db
			->select('*, d.status as delivery_status')
			->from('customers c')
			->join('orders o', 'o.customer_id = c.customer_id')
			->join('delivery_requests dr', 'dr.order_id = o.order_id')
			->join('deliveries d', 'd.delivery_request_id = dr.delivery_request_id')
			->where('d.status !=', 'Z')
		->get();
	}
	
	public function get_active_deliveries($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('d.date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('d.date_created <', $end_date);
		}
		
		return $this->db
			->select('
				d.delivery_id, o.order_id, c.customer_id,
				d.delivery_reference, d.loading_date, c.customer_name,
				c.pic_name, d.status, o.order_reference, o.date_created as order_date_created
			')
			->from('deliveries d')
			->join('orders o', 'o.order_id = d.order_id')
			->join('customers c', 'c.customer_id = o.customer_id')
			->where_not_in('d.status', array('X', 'Z', 'C'))
			->order_by('d.date_updated DESC')
		->get();
	}
	
	public function get_not_completed_deliveries($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('d.date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('d.date_created <', $end_date);
		}
		
		return $this->db
			->select('
				d.delivery_id, o.order_id, c.customer_id,
				d.delivery_reference, d.loading_date, c.customer_name,
				c.pic_name, d.status, o.order_reference, o.date_created as order_date_created
			')
			->from('deliveries d')
			->join('orders o', 'o.order_id = d.order_id')
			->join('customers c', 'c.customer_id = o.customer_id')
			->where_not_in('d.status', array('X', 'Z', 'C'))
			->order_by('d.date_updated DESC')
		->get();
	}
	
	public function get_completed_deliveries($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('d.date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('d.date_created <', $end_date);
		}
		
		return $this->db
			->select('
				d.delivery_id, o.order_id, c.customer_id,
				d.delivery_reference, d.loading_date, c.customer_name,
				c.pic_name, d.status, o.order_reference, o.date_created as order_date_created
			')
			->from('deliveries d')
			->join('orders o', 'o.order_id = d.order_id')
			->join('customers c', 'c.customer_id = o.customer_id')
			->where_in('d.status', array('C'))
			->order_by('d.date_updated DESC')
		->get();
	}
	
	public function insert_delivery($array)
	{
		if ( $this->db->insert('deliveries', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_delivery_requests($array)
	{
		if ( $this->db->insert('delivery_requests', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_delivery_request_items($array)
	{
		if(! empty($array['attributes'])){
			$attributes = $array['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($array['attributes']);
		}
		
		if ( $this->db->insert('delivery_request_items', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function get_delivery_request_list()
	{
		return $this->db
			->select('dr.*, o.order_reference, o.date_created as date_created_order, c.customer_name')
			->from('delivery_requests dr')
			->join('orders o', 'o.order_id = dr.order_id', 'left')
			->join('customers c', 'c.customer_id = o.customer_id', 'left')
			->order_by('dr.order_id, dr.date_created')
			->where('dr.status !=', 'X')
		->get();
	}
	
	public function get_delivery_request_by_id($delivery_request_id)
	{
		return $this->db
			->select('dr.*, o.order_reference, o.date_created as order_date_created, o.date_modified as order_date_modified, c.customer_name, c.customer_id')
			->from('delivery_requests dr')
			->join('orders o', 'o.order_id = dr.order_id', 'left')
			->join('customers c', 'c.customer_id = o.customer_id', 'left')
			->where('dr.delivery_request_id', $delivery_request_id)
		->get();
	}
	
	public function get_delivery_request_list_by_order_id($order_id)
	{
		return $this->db
			->where('order_id', $order_id)
		->get('delivery_requests');
	}
}