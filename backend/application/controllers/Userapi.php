<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Userapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('user_model', 'auditlog_model', 'user_db', 'user_bl'));
	}
	
	public function login()
	{
		// ambil data dari post
		$input = json_decode(file_get_contents('php://input'),true);
		$data = json_decode($input['userdata'],true);
		
		$get_user = $this->user_model->get_user($data['username']);
		
		if($get_user->num_rows() > 0)
		{
			$password = sha1($data['password']."W@ve1ndonesia");
			
			$get_user = $this->user_model->get_user($data['username'], $password);
			
			if($get_user->num_rows() > 0)
			{
				$user = $get_user->row_array();
				$get_user_permission = $this->user_model->get_user_permission_for_user($user['user_id'])->result_array();	
				if($this->user_model->is_user_still_login($user['user_id']))
				{
					$feedback = array(
						'call_status' => 'error',
						"error_code" => "999",
						'user_id' => $user['user_id']
					);
				}
				else
				{
					$this->session->set_userdata('user_id', $user['user_id']);
					$this->session->set_userdata('username', $user['username']);
					$this->session->set_userdata('access', $user['access']);
					$this->session->set_userdata('permissions',$get_user_permission);
					
					$insert = array(
						'user_id' => $user['user_id'],
						'username' => $user['username']
					);
					$this->user_model->insert_active_login($insert);
					
					//$this->delete_unused_active_login();
					
					$feedback['call_status'] = 'success';
					$feedback['permission'] = $get_user_permission;
					$feedback['full_name'] = $get_user->row()->full_name;

				}
			}
			else
			{
				$feedback = array(
					'call_status' => 'error',
					"error_code" => "997",
					'error_message' => 'Password yang dimasukkan salah.'
				);
			}
		}
		else
		{
			$feedback = array(
				'call_status' => 'error',
				"error_code" => "998",
				'error_message' => 'Username tidak terdaftar.'
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function logout()
	{
		$session_id = $this->session->session_id;
		$this->db->delete('user_active_logins', array('session_id' => $session_id));
		
		$this->session->sess_destroy();
		
		$feedback['call_status'] = 'success';
		echo json_encode($feedback);
	}
	
	public function check_is_logged_on()
	{
		if($this->session->userdata('username') != NULL)
		{
			$feedback = array(
				"call_status" => "success",
				"is_logged_on" => 1
			);
		}
		else
		{
			$feedback = array(
				"call_status" => "success",
				"is_logged_on" => 0
			);
		}
		echo json_encode($feedback);
	}
	
	// disable this function because total_row can't show right number
	/*public function delete_unused_active_login()
	{
		$active_logins = $this->user_model->get_all_active_logins()->result_array();
		
		foreach($active_logins as $active_login)
		{
			$total_row = $this->db->where('id', $active_login['session_id'])->get('ci_sessions')->num_rows();
			
			if($total_row == 0)
			{
				$this->db->delete('user_active_logins', array('session_id' => $active_login['session_id']));
			}
		}
	}*/
	
	public function check_user_has_access_for_special_request() 
	{
		$this->check_user_has_access("SPECIALREQUEST");
	}
	
	public function check_user_has_access($access_name) 
	{
		if ($this->user_bl->is_user_has_access($access_name))
		{
			$feedback = array(
				"call_status" => "success",
				"has_access" => 1
			);
		}
		else
		{
			$feedback = array(
				"call_status" => "success",
				"has_access" => 0
			);
		}
		echo json_encode($feedback);
	}
	
	public function change_password()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$input = json_decode(file_get_contents('php://input'));
				
			$this->auditlog_model->insert_audit_log("userapi", "change_password", $input->passworddata);
				
			$data = json_decode($input->passworddata,true);
				
			$data['oldPassword'] = sha1($data['oldPassword']."W@ve1ndonesia");
				
			$user_id = $this->session->userdata('user_id');
				
			$user = $this->user_model->get_user_by_user_id($user_id)->row_array();
				
			if($user['password'] != $data['oldPassword'])
			{
				$feedback = array(
						"call_status" => "error",
						"error_message" => "Password Lama salah."
				);
			}
			else
			{
				$this->user_model->change_password($data);
	
				$feedback = array(
						"call_status" => "success"
				);
			}
		}
	
		echo json_encode($feedback);
	}
	
	public function delete_active_login()
	{
		// ambil data dari post
		$input = json_decode(file_get_contents('php://input'),true);
		$data = json_decode($input['userdata'],true);
	
		//$active_login = $this->user_model->get_active_login_by_user_id($data['user_id'])->row_array();
		$active_logins = $this->user_model->get_active_login_by_user_id($data['user_id'])->result();
	
		foreach ($active_logins as $active_login) {
			$this->user_model->delete_session_by_session_id($active_login->session_id);
		}
	
		$this->user_model->delete_active_login_by_user_id($data['user_id']);
	
		$feedback = array(
				"call_status" => "success"
		);
	
		echo json_encode($feedback);
	}
	
	public function get_user_list()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$feedback = array(
				"call_status" => "success",
				'user_list' => $this->user_db->get_user_list()->result_array()
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_all_access_for_user($username)
	{
		$main_access_list = array (
				"CUSTOMERSERVICE" => FALSE,
				"FLEETMANAGER" => FALSE,
				"SPECIALREQUEST" => FALSE,
				"ADMIN" => FALSE,
				"REPORT" => FALSE,
				"SALESAPPROVER" => FALSE
		);
	
		$result_array = $this->user_model->get_access_for_user($username)->result();
	
		if ($result_array!= null)
		{
			$acls = json_decode($result_array[0]->access, true);
				
			foreach ($acls as $ac)
			{
				$main_access_list[$ac] = TRUE;
			}
		}
	
		$feedback = array(
				"call_status" => "success",
				"access_list" => $main_access_list
		);
	
		echo json_encode($feedback);
	}
	
	public function get_all_department_for_user($username)
	{
		$main_department_list = array (
				"BUSA" => FALSE,
				"SUPERLAND" => FALSE,
				"CHARIS" => FALSE,
				"THERASPINE" => FALSE,
				"CUSHION" => FALSE
		);
	
		$sales_departments = $this->user_model->get_department_for_user($username)->row()->sales_departments;
	
		if ($sales_departments != null)
		{
			$acls = json_decode($sales_departments, true);
				
			foreach ($acls as $ac)
			{
				$main_department_list[$ac] = TRUE;
			}
		}
	
		$feedback = array(
				"call_status" => "success",
				"department_list" => $main_department_list
		);
	
		echo json_encode($feedback);
	}
	
	public function insert_user()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on",
				'title' => 'Tambah User Gagal',
				'text' => "User belum login",
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini.",
				'title' => 'Tambah User Gagal',
				'text' => "User tidak mempunyai hak untuk melakukan hal ini.",
			);
		}
		*/
		else {
			$json = file_get_contents('php://input');
			$data = json_decode($json, TRUE);
			
			if( empty($data['username']) ){
				$feedback = array(
					"call_status" => "error",
					'title' => 'Tambah User Gagal',
					'text' => "Username tidak boleh kosong",
				);
			}
			else{
				$query = $this->user_model->get_user($data['username']);
				
				if($query->num_rows() > 0)
				{
					$feedback = array(
						"call_status" => "error",
						'title' => 'Tambah User Gagal',
						'text' => "Username sudah ada.",
					);
				}
				else
				{
					$this->db->trans_start();
					
					$this->auditlog_model->insert_audit_log("userapi", "insert_user", $json);
					
					$data['password'] = sha1($data['password']."W@ve1ndonesia");
					$user_id = $this->user_db->insert_user($data);
					
					$this->user_bl->new_approval_for_user_id($user_id);
					$this->user_bl->new_access_list_for_user_id($user_id);
					
					$username = $data['username'];
					
					$this->db->trans_complete();
					
					if($this->db->trans_status() == FALSE){
						$array = array(
							"call_status" => "error",
							"error_message" =>"Terjadi kesalahan saat menghubungi database"
						);
					}
					else{
						$feedback = array(
							"call_status" => "success",
							'title' => 'Tambah User Sukses',
							'text' => "User $username berhasil ditambah.",
						);
					}
				}
			}
		}
		
		echo json_encode($feedback);
	}
	
	public function reset_password()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("userapi", "reset_password", $input->userdata);
			
			$data = json_decode($input->userdata,true);
			
			$this->user_model->reset_password($data);
		
			$feedback = array(
				"call_status" => "success"
			);
		}
			
		echo json_encode($feedback);
	}
	
	public function set_access()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("userapi", "set_access", $input->accessdata);
			
			$data = json_decode($input->accessdata,true);
			
			$access = array();
			foreach ($data['access'] as $key => $value)
			{
				if($value == 1)
				{
					array_push($access, $key);
				}
			}
			
			$this->db->update(
				'users',
				array(
					'access' => json_encode($access)
				),
				array('user_id' => $data['user_id'])
			);
			
			$feedback = array(
				"call_status" => "success"
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function set_department()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("ADMIN")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("userapi", "set_department", $input->departmentdata);
			
			$data = json_decode($input->departmentdata,true);
			
			$department = array();
			foreach ($data['department'] as $key => $value)
			{
				if($value == 1)
				{
					array_push($department, $key);
				}
			}
			
			$this->db->update(
				'users',
				array(
					'sales_departments' => json_encode($department)
				),
				array('user_id' => $data['user_id'])
			);
			
			$feedback = array(
				"call_status" => "success"
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_user_by_username($username)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"title" => "Not Logged In",
				"text" => "You must login first"
			);
		}
		else {
			$user = $this->user_db->get_user_by_username($username)->row_array();
			unset($user['password']);
			
			$user['access'] = $this->user_bl->get_user_access_by_user_id($user['user_id']);
			$user['approval'] = $this->user_bl->get_user_approval_by_user_id($user['user_id']);
			
			$feedback = array(
				"call_status" => "success",
				'user' => $user
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function is_username_available()
	{
		$username = file_get_contents('php://input');
		
		$num_rows = $this->user_db->get_user_by_username($username)->num_rows();
		
		if($num_rows > 0){
			$available = false;
		}
		else {
			$available = true;
		}
		$feedback = array(
			"call_status" => "success",
			'available' => $available
		);
		
		echo json_encode($feedback);
	}
	
	public function update_user()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"title" => "Not Logged In",
				"text" => "You must login first"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("USERMASTER")) {
			$feedback = array(
				"call_status" => "error",
				"title" => "No Access",
				"text" => "User does not has access for this action"
			);
		}
		*/
		else {
			$this->db->trans_start();
			
			$json = file_get_contents('php://input');
			
			$this->auditlog_model->insert_audit_log("userapi", "update_user", $json);
			
			$data = json_decode($json, true);
			
			$this->user_bl->update_user($data);
			
			$this->db->trans_complete();
			
			if ($this->db->trans_status() === FALSE){
				$feedback = array(
					"call_status" => "error",
					"title" => "Update User Gagal",
					"text" => "Terjadi masalah saat mengakses database."
				);
			}
			else{
				$feedback = array(
					"call_status" => "success",
					"title" => "Update User Berhasil",
					"text" => "User ".$data['username']." berhasil diubah."
				);
			}
		}
		
		echo json_encode($feedback);
	}
	
	public function php_array_to_json_array($data){
		$array = array();
		
		foreach($data as $key => $value){
			if ($value == 1){
				array_push($array, $key);
			}
		}
		
		return json_encode($array);
	}
	
	public function json_array_to_php_array($data){
		$array = array();
		
		$decoded = json_decode($data, true);
		
		foreach ($decoded as $row)
		{
			$array[$row] = TRUE;
		}
		
		return $array;
	}
}
