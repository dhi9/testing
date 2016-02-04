<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Warehouseapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('warehouse_model');
	}
	
	public function get_address_list(){
		$feedback = array(
			'call_status' => 'success',
			'address_list' => $this->warehouse_model->get_address_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
}
