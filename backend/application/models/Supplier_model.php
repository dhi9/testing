<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Supplier_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}

	public function get_supplier_by_id($id)
	{
		return $this->db
			->where('supplier_id', $id)
		->get('suppliers');
	}
	
	public function get_supplier_list()
	{
		return $this->db->get('suppliers');
	}
}