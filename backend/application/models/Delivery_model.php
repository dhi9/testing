<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Delivery_model extends CI_Model {

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
	
	public function count_delivery_requests_accuracy()
	{
		$dates = $this->stats_model->get_last_12_months_dates();
		foreach($dates as $date)
		{
			$query = $this->delivery_model->get_delivery_requests_by_month($date);
			$delivery_requests = $query->result_array();
			$num_rows = $query->num_rows();
				
			if($num_rows > 0)
			{
				$month_accuracy = 0;
				foreach($delivery_requests as $delivery_request)
				{
					$accurate = $this->delivery_model->is_delivery_request_accurate($delivery_request['delivery_request_id']);
						
					if($accurate) $month_accuracy += 1;
				}
	
				$accuracy_data[] = floor($month_accuracy/$num_rows*100);
			}
		}
	
		return $accuracy_data;
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
	
	public function get_delivery($delivery_id)
	{
		return $this->db->where('delivery_id', $delivery_id)->get('deliveries');
	}
	
	public function get_delivery_by_reference($reference)
	{
		return $this->db->where('delivery_reference', $reference)->get('deliveries');
	}
	
	public function get_delivery_by_order_id($order_id)
	{
		return $this->db->where('order_id', $order_id)->get('deliveries');
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
	
	public function generate_delivery_reference($delivery_id)
	{
		// ambil date created dari tabel delivery berdasarkan delivery id
		$date_created = $this->db->where('delivery_id', $delivery_id)->get('deliveries')->row()->date_created;
	
		// bikin initial date
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
	
		// hitung jumlah date created yang sama
		$query = $this->db
		->where('date_created <=', $date_created)
		->where('date_created >', $initial_date)
		->where('IFNULL(special_request, 0) = ', 0)
		->get('deliveries');
		$count = $query->num_rows();
	
		// buat urutannya
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
	
		return 'SJ-'.$date.'-'.$sequence;
	}
	
	public function generate_delivery_reference_for_special_request($delivery_id)
	{
		// ambil date created dari tabel delivery berdasarkan delivery id
		$date_created = $this->db->where('delivery_id', $delivery_id)->get('deliveries')->row()->date_created;
	
		// bikin initial date
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
	
		// hitung jumlah date created yang sama
		$query = $this->db
		->where('date_created <=', $date_created)
		->where('date_created >', $initial_date)
		->where('IFNULL(special_request, 0) = ', 1)
		->get('deliveries');
		$count = $query->num_rows();
	
		// buat urutannya
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
	
		return 'SOSJ-'.$date.'-'.$sequence;
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
		//if ( $this->db->insert('delivery_request_items', $array) )
		if(
			$this->db->query("
					INSERT INTO delivery_request_items (
						delivery_request_id,
						item_code,
						quantity,
						attributes,
						remark
					)VALUES (
						".$array['delivery_request_id'].",
						'".$array['item_code']."',
						".$array['quantity'].",
						COLUMN_CREATE(".$array['attributes']."),
						'".$array['remark']."'
					)
				")
		)
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function is_all_delivery_request_deliveries_not_active($delivery_request_id)
	{
		$deliveries = $this->get_deliveries_by_delivery_request_id($delivery_request_id)->result_array();
	
		$not_active = true;
	
		foreach($deliveries as $delivery)
		{
			if($delivery['status'] != 'X')
			{
				$not_active = false;
				break;
			}
		}
	
		return $not_active;
	}
	
	public function is_delivery_request_accurate($delivery_request_id)
	{
		$requested_delivery_date = $this->get_delivery_request($delivery_request_id)->row()->requested_delivery_date;
		$requested_delivery_date = date("Y-m-d", strtotime($requested_delivery_date));
	
		$accurate = false;
		$deliveries = $this->get_deliveries_by_delivery_request_id($delivery_request_id)->result_array();
		foreach($deliveries as $delivery)
		{
			$arrival_date = date("Y-m-d", strtotime($delivery['arrival_date']));
				
			if($arrival_date == $requested_delivery_date)
			{
				$accurate = true;
			}
		}
	
		return $accurate;
	}
}