<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vehicleapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('vehicle_model','auditlog_model','user_model'));
	}
	
	public function get_vehicle_by_vehicle_id($vehicleId)
	{
		$data = $this->vehicle_model->get_vehicle_by_vehicle_id($vehicleId)->row_array();
		$feedback = array(
			'call_status' => 'success',
			'vehicleList' => $data
		);
		echo json_encode($feedback);
	}
	
	public function get_service_by_vehicle_id($vehicle_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$service_list = $this->vehicle_model->get_service_by_vehicle_id($vehicle_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'services_list' => $service_list
			);
		}
		echo json_encode($array);
	}
	
	public function get_vehicle_list(){
		$feedback = array(
			'call_status' => 'success',
			'vehicle_list' => $this->vehicle_model->get_vehicle_list()->result_array()
		);
		echo json_encode($feedback);
	}
	
	public function get_vehicle_type_list(){
		$feedback = array(
			'call_status' => 'success',
			'vehicle_type_list' => $this->vehicle_model->get_vehicle_type_list()->result_array()
		);
		echo json_encode($feedback);
	}
	
	public function insert_vehicle()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		/*else if (! $this->user_model->is_user_has_access("MASTERVEHICLE")) {
			$feedback = array(
				"call_status" => "error",
				"title" => "No Access",
				"text" => "User does not has access for this action"
			);
		}*/
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("vehicleapi","insert_vehicle",$json);
			
			$data = json_decode($json, true);
			
			$capabilities = array();
			foreach ($data['capabilities'] as $key => $value)
			{
				if($value == true)
				{
					array_push($capabilities, $key);
				}
			}
			$data['capabilities']=json_encode($capabilities);
			//$data['capabilities']=json_encode($data['capabilities']);
			$this->vehicle_model->insert_vehicle($data);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function insert_vehicle_service()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("MASTERVEHICLE")) {
			$feedback = array(
				"call_status" => "error",
				"title" => "No Access",
				"text" => "User does not has access for this action"
			);
		}*/
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("vehicleapi","insert_vehicle_service",$json);
			
			$data = json_decode($json, true);
			
			$this->vehicle_model->insert_vehicle_service($data);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		echo json_encode($array);
	}
	
	public function update_vehicle()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("MASTERVEHICLE")) {
			$feedback = array(
				"call_status" => "error",
				"title" => "No Access",
				"text" => "User does not has access for this action"
			);
		}*/
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("vehicleapi","update_vehicle",$json);
			
			$data = json_decode($json, true);
			
			$capabilities = array();
			foreach ($data['capabilities'] as $key => $value)
			{
				if($value == true)
				{
					array_push($capabilities, $key);
				}
			}
			
			$data['capabilities']=json_encode($capabilities);
			
			$update = array(
				"vehicle_id" => $data['vehicle_id'],
				"vehicle_plate" => $data['vehicle_plate'],
				"kir_number" => $data['kir_number'],
				"vehicle_type_id" => $data['vehicle_type_id'],
				"max_weight" => $data['max_weight'],
				"max_volume" => $data['max_volume'],
				"capabilities" => $data['capabilities'],
				"date_created" => $data['date_created'],
				"date_modified" => $data['date_modified'],
				"status" => $data['status'],
			);
			
			$this->vehicle_model->update_vehicle($update);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function update_service()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("MASTERVEHICLE")) {
			$feedback = array(
				"call_status" => "error",
				"title" => "No Access",
				"text" => "User does not has access for this action"
			);
		}*/
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("vehicleapi","update_service",$json);
			
			$data = json_decode($json, true);
			
			//$this->vendor_model->insert_vendor_history($data);
			$this->vehicle_model->update_service($data);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		echo json_encode($array);
	}
}
