<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kioskapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('purchase_db', 'order_db', 'item_db'));
	}
	
	public function check_data($data){
		
		$feedback = array(
			'call_status' => 'success',
			'purchase' => $this->purchase_db->get_purchase_by_draft_reference($data)->row_array(),
			'order' => $this->order_db->get_order_by_order_reference($data)->row_array(),
			'item' => $this->item_db->get_item_by_item_code($data)->row_array()
		);

		echo json_encode($feedback);
	}
	
}