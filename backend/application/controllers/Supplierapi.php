<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Supplierapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('supplier_model');
	}
	
	public function get_supplier_by_id($id){
		$feedback = array(
			'call_status' => 'success',
			'supplier' => $this->supplier_model->get_supplier_by_id($id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_supplier_list(){
		$feedback = array(
			'call_status' => 'success',
			'supplier_list' => $this->supplier_model->get_supplier_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
}
