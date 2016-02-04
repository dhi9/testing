<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reportapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('delivery_model','user_model'));
	}
	
	public function get_delivery_report()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("REPORT")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$report = $this->delivery_model->get_delivery_report($data['start_date'], $data['end_date'])->result_array();
			
			foreach($report as &$row)
			{
				$quantity = $this->delivery_model->count_delivery_quantity($row['delivery_id'])->row_array();
				
				$row['quantity_sent_actual'] = $quantity['quantity_sent_actual'];
				$row['quantity_received'] = $quantity['quantity_received'];	
			}
			
			$feedback = array(
				"call_status" => "success",
				'report' => $report
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_travel_letter_report()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("REPORT")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$report = $this->delivery_model->get_travel_letter_report($data['start_date'], $data['end_date'])->result_array();
			
			$feedback = array(
				"call_status" => "success",
				'report' => $report
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_on_time_delivery_report()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("REPORT")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$report = $this->delivery_model->get_on_time_delivery_report($data['start_date'], $data['end_date'])->result_array();
			
			foreach($report as &$row)
			{
				$datetime1 = date_create($row['requested_delivery_date']);
				$datetime2 = date_create($row['confirmation_date']);
				$interval = date_diff($datetime1, $datetime2);
				$row['otd_duration'] = $interval->format('%a');
				
				if($row['otd_duration'] == 0)
				{
					$row['otd'] = 'OT';
					$row['otd_percent'] = 100;
				}
				else
				{
					$row['otd'] = 'LT';
					$row['otd_percent'] = 0;
				}
			}
			
			$feedback = array(
				"call_status" => "success",
				'report' => $report
			);
		}
		
		echo json_encode($feedback);
	}
}