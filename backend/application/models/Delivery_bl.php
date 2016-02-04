<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Delivery_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('delivery_db', 'stats_model'));
	}
	
	public function count_delivery_requests_accuracy()
	{
		$dates = $this->stats_model->get_last_12_months_dates();
		foreach($dates as $date)
		{
			$query = $this->delivery_db->get_delivery_requests_by_month($date);
			$delivery_requests = $query->result_array();
			$num_rows = $query->num_rows();
				
			if($num_rows > 0)
			{
				$month_accuracy = 0;
				foreach($delivery_requests as $delivery_request)
				{
					$accurate = $this->is_delivery_request_accurate($delivery_request['delivery_request_id']);
						
					if($accurate) $month_accuracy += 1;
				}
				
				$accuracy_data[] = floor($month_accuracy/$num_rows*100);
			}
		}
		
		return $accuracy_data;
	}
	
	public function generate_delivery_reference($delivery_id)
	{
		$date_created = $this->delivery_db->get_delivery_by_id($delivery_id)->row()->date_created;
		
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
		
		$query = $this->delivery_db->get_non_special_delivery_list_by_date_created_range($initial_date, $date_created);
		$count = $query->num_rows();
		
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		return 'SJ-'.$date.'-'.$sequence;
	}
	
	public function generate_delivery_reference_for_special_request($delivery_id)
	{
		$date_created = $this->delivery_db->get_delivery_by_id($delivery_id)->row()->date_created;
		
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
		
		$query = $this->delivery_db->get_special_delivery_list_by_date_created_range($initial_date, $date_created);
		$count = $query->num_rows();
		
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		return 'SOSJ-'.$date.'-'.$sequence;
	}
	
	public function is_all_delivery_request_deliveries_not_active($delivery_request_id)
	{
		$deliveries = $this->delivery_db->get_deliveries_by_delivery_request_id($delivery_request_id)->result_array();
		
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
		$requested_delivery_date = $this->delivery_db->get_delivery_request($delivery_request_id)->row()->requested_delivery_date;
		$requested_delivery_date = date("Y-m-d", strtotime($requested_delivery_date));
		
		$accurate = false;
		$deliveries = $this->delivery_db->get_deliveries_by_delivery_request_id($delivery_request_id)->result_array();
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
	
	public function get_delivery_request_list()
	{
		$delivery_request_list = $this->delivery_db->get_delivery_request_list()->result_array();
		
		$tmp_order_id = 0;
		foreach($delivery_request_list as &$delivery_request){
			if($tmp_order_id == $delivery_request['order_id']){
				$sequence++;
			}
			else{
				$tmp_order_id = $delivery_request['order_id'];
				$sequence = 1;
			}
			$delivery_request['sequence'] = $sequence;
			
			$delivery_request['delivery_request_total'] = $this->db->where('order_id', $delivery_request['order_id'])->get('delivery_requests')->num_rows();
		}
		
		return $delivery_request_list;
	}
	
	public function get_delivery_request_by_id($delivery_request_id)
	{
		$delivery_request = $this->delivery_db->get_delivery_request_by_id($delivery_request_id)->row_array();
		$query = $this->delivery_db->get_delivery_request_list_by_order_id($delivery_request['order_id']);
		$delivery_request['delivery_request_items'] = $this->delivery_db->get_delivery_request_items($delivery_request_id)->result_array();
		$tmp_id = 0;
		$sequence = 0;
		foreach($query->result_array() as &$row){
			$sequence++;
			if($tmp_id == $row['delivery_request_id']){
				break;
			}
		}
		if($delivery_request['status'] == 'D'){
			$delivery = $this->delivery_db->get_deliveries_by_delivery_request_id($delivery_request_id);
			if($delivery->num_rows() > 0){
				$delivery_array = $delivery->row_array();
				$delivery_request['delivery_reference'] = $delivery_array['delivery_reference'];
				$delivery_request['delivery_address_id'] = $delivery_array['delivery_address_id'];
				$delivery_request['loading_date'] = $delivery_array['loading_date'];
				$delivery_request['reciever'] = $delivery_array['reciever'];
				$delivery_request['driver_name'] = $delivery_array['driver_name'];
			}
		}
		$total = $query->num_rows();
		$delivery_request['delivery_plan'] = "$sequence dari $total";
		
		return $delivery_request;
	}
}