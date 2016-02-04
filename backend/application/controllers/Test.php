<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Test extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('inventory_bl');
	}
	
	public function index()
	{
		$a = $this->inventory_bl->get_attribute_value_list_by_attribute_name('Panjang');
		echo print_r($a);
		//echo $this->load->view('tes', $data, true);
	}
}
