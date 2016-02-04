<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Updatehistoryapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('update_history_model', 'user_model');
	}
	
	public function get_order_update_history($order_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else {
			$feedback = array(
				'call_status' => 'success',
				'order_update_history_list' => $this->update_history_model->get_orders_by_order_id($order_id)->result_array()
			);
		}
		echo json_encode($feedback);    
	}
	
	public function get_delivery_update_history($delivery_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else {
			$feedback = array(
				'call_status' => 'success',
				'delivery_update_history_list' => $this->update_history_model->get_deliveries_by_delivery_id($delivery_id)->result_array()
			);
			echo json_encode($feedback);
		}
	}
}
