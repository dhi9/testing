<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vehicle_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_vehicle_by_vehicle_id($vehicleId)
	{
		return $this->db->where('vehicle_id', $vehicleId)->get('vehicles');
	}
	
	public function get_service_by_vehicle_id($vehicle_id)
	{
		return $this->db
			->select('vs.*, v.vendor_name')
			->from('vehicle_services vs')
			->join('vendors v', 'v.vendor_id = vs.vendor_id')
			->where('vs.vehicle_id', $vehicle_id)
		->get();
	}

	public function get_vehicle_list()
	{
		return $this->db
			->select('vh.*, vn.vendor_name, vt.vehicle_type')
			->from('vehicles vh')
			->join('vendors vn', 'vn.vendor_id = vh.vendor_id')
			->join('vehicle_types vt', 'vt.vehicle_type_id = vh.vehicle_type_id')
		->get();
	}
	
	public function get_vehicle_type_list()
	{
		return $this->db->get('vehicle_types');
	}
	
	public function insert_vehicle($array)
	{
		if ( $this->db->insert('vehicles', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_vehicle_service($array)
	{
		if ( $this->db->insert('vehicle_services', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_vehicle($update)
	{
		$this->db->update(
			'vehicles',
			$update,
			array('vehicle_id' => $update['vehicle_id'])
		);
	}
	
	public function update_service($data)
	{
		$this->db->update(
			'vehicle_services',
			$data,
			array('vehicle_service_id' => $data['vehicle_service_id'])
		);
	}
}