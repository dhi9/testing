<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Statsapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('stats_model', 'purchase_db', 'order_db'));
	}
	
	public function get_monthly_stats()
	{
		$order_data = $this->stats_model->count_monthly_order()->result_array();
		$delivery_data = $this->stats_model->count_monthly_delivery()->result_array();
		
		$total_monthly_order = array();
		$months = array();
		foreach($order_data as $row)
		{
			array_push($total_monthly_order, $row['total']);
			
			$monthName = date("F", mktime(0, 0, 0, $row['month'], 10));
			//$monthName = jdmonthname($row['month'] , CAL_MONTH_GREGORIAN_LONG);
			array_push($months, $monthName);
		}
		
		$total_monthly_delivery = array();
		foreach($delivery_data as $row)
		{
			array_push($total_monthly_delivery, $row['total']);
		}
		
		$feedback = array(
			"call_status" => "success",
			'months' => array_reverse($months),
			'total_monthly_order' => array_reverse($total_monthly_order),
			'total_monthly_delivery' => array_reverse($total_monthly_delivery),
			'delivery_requests_accuracy' => array_reverse($this->delivery_model->count_delivery_requests_accuracy())
		);
		
		echo json_encode($feedback);
	}
	
	public function get_today_delivery_stats()
	{
		$feedback = array(
			"call_status" => "success",
			'stats' => $this->stats_model->count_delivery_by_status()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_today_deliveries()
	{
		$feedback = array(
			"call_status" => "success",
			'today_deliveries' => $this->delivery_model->get_today_deliveries()->result_array(),
			'active_deliveries' => $this->delivery_model->get_active_deliveries()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_not_returned_deliveries()
	{
		$feedback = array(
			"call_status" => "success",
			'deliveries' => $this->delivery_model->get_not_returned_deliveries()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function count_delivery_requests_accuracy()
	{
		$feedback = array(
			"call_status" => "success",
			'accuracy_data' => $this->delivery_model->count_delivery_requests_accuracy()
		);
		
		echo json_encode($feedback);
	}
	
	public function count_not_completed_data()
	{
		$feedback = array(
			"call_status" => "success",
			'not_approved_purchase_item' => $this->purchase_db->count_not_approved_purchase_item(),
			'not_approved_purchase_service' => $this->purchase_db->count_not_approved_purchase_service(),
			'not_completed_purchase' => $this->purchase_db->count_not_completed_purchase(),
			'not_completed_order' => $this->order_db->count_not_completed_order(),
		);
		
		echo json_encode($feedback);
	}
}