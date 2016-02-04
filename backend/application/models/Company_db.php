<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Company_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_company()
	{
		return $this->db
			->from('company')
			->where('company_id', '1')
			->get();
	}

	public function insert_company($array)
	{

		$this->db->insert('company', $array);
	}

	public function update_company($data)
	{
		$this->db->update(
			'company',
			$data,
			array('company_id' => $data['company_id'])
		);
	}
	
}
