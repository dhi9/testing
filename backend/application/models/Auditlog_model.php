<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auditlog_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function insert_audit_log($api_name, $function_name, $audit_data)
	{
		$array_insert = array(
			'user_id' => $this->session->userdata('user_id'),
			'audit_data' => $audit_data,
			'api_name' => $api_name,
			'function_name' => $function_name
		);
		
		$this->db->insert('audit_log', $array_insert);
	}

}
