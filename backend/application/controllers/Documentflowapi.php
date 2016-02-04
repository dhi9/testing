<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Documentflowapi extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		
		$this->load->model(array('order_model', 'delivery_model', 'user_model'));
	}
        
  public function get_document_flow($order_reference)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else {
			$order = $this->order_model->get_order_by_order_reference($order_reference)->row_array();
			
			if (!is_null($order['date_created']))
			{
				$date = new DateTime($order['date_created']);
				$order['date_created'] = $date->format('d-m-Y');
			}
			
			if (!is_null($order['production_start_date']))
			{
				$date = new DateTime($order['production_start_date']);
				$order['production_start_date'] = $date->format('d-m-Y');
			}
			
			if (!is_null($order['production_completed_date']))
			{
				$date = new DateTime($order['production_completed_date']);
				$order['production_completed_date'] = $date->format('d-m-Y');
			}
			
			$delivery_requests = $this->delivery_model->get_delivery_requests_by_order_id($order['order_id'])->result_array();
			
			foreach($delivery_requests as $delivery_request)
			{
				if (!is_null($delivery_request['requested_delivery_date']))
				{
					$date = new DateTime($delivery_request['requested_delivery_date']);
					$delivery_request['requested_delivery_date'] = $date->format('d-m-Y');
				}
				
				$deliveries = $this->delivery_model->get_delivery_from_delivery_request($delivery_request['delivery_request_id'])->result_array();
				
				foreach($deliveries as $delivery)
				{
					if (!is_null($delivery['date_created']))
					{
						$date = new DateTime($delivery['date_created']);
						$delivery['date_created'] = $date->format('d-m-Y');
					}
					
					if (!is_null($delivery['loading_date']))
					{
						$date = new DateTime($delivery['loading_date']);
						$delivery['loading_date'] = $date->format('d-m-Y');
					}
					
					if (!is_null($delivery['actual_loading_date']))
					{
						$date = new DateTime($delivery['actual_loading_date']);
						$delivery['actual_loading_date'] = $date->format('d-m-Y');
					}
					
					if (!is_null($delivery['arrival_date']))
					{
						$date = new DateTime($delivery['arrival_date']);
						$delivery['arrival_date'] = $date->format('d-m-Y');
					}
					
					if (!is_null($delivery['confirmation_date']))
					{
						$date = new DateTime($delivery['confirmation_date']);
						$delivery['confirmation_date'] = $date->format('d-m-Y');
					}
					
					$delivery_request['deliveries'][] = $delivery;
				}
				
				$order['delivery_requests'][] = $delivery_request;
			}
			
			$feedback = array(
				'call_status' => 'success',
				'order' => $order
			);
		}
		
		echo json_encode($feedback);
	}
}
