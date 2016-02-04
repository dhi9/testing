<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function change_password($data)
	{
		$user_id = $this->session->userdata('user_id');
	
		$this->db->update(
				'users',
				array(
						'password' => sha1($data['newPassword']."W@ve1ndonesia")
				),
				array(
						'user_id' => $user_id
				)
				);
	}
	
	public function delete_active_login_by_user_id($user_id)
	{
		$this->db->delete(
			'user_active_logins',
			array('user_id' => $user_id)
		);
	}
	
	public function delete_active_login_by_session_id($session_id)
	{
		$this->db->delete(
			'user_active_logins',
			array('session_id' => $session_id)
		);
	}
	
	public function delete_session_by_session_id($session_id)
	{
		$this->db->delete(
			'ci_sessions',
			array('id' => $session_id)
		);
	}
	
	/*
	public function delete_inactive_sessions() 
	{
		$this->db->where('id NOT IN (SELECT session_id FROM user_active_logins)');
		$this->db->delete('ci_sessions');
		
		$this->db->where('session_id NOT IN (SELECT id FROM ci_sessions)');
		$this->db->delete('user_active_logins');
	}
	 * 
	 */

	public function get_active_login_by_user_id($user_id)
	{
		return $this->db
		->where('user_id', $user_id)
		->get('user_active_logins');
	}
	
	public function get_active_login_by_session_id($session_id)
	{
		return $this->db
		->where('session_id', $session_id)
		->get('user_active_logins');
	}
	
	public function get_user($username, $password = NULL)
	{
		if($password != NULL)
		{
			$this->db->where('password', $password);
		}
		
		return $this->db
			->where('username', $username)
			->where('status', 'A')
		->get('users');
	}
	
	public function get_all_active_logins()
	{
		return $this->db->get('user_active_logins');
	}
	
	public function get_session_by_session_id($session_id)
	{
		return $this->db->get('user_active_logins');
	}
	
	public function get_users_list()
	{
		return $this->db
			->select('user_id, username')
		->get('users');
	}
		
	public function get_user_by_user_id($user_id)
	{
		return $this->db
			->where('user_id', $user_id)
		->get('users');
	}
	
	public function get_access_for_user($username)
	{
		return $this->db
			->select('access')
			->where('username', $username)
		->get('users');
	}
	
	public function get_user_permission_for_user($user_id)
	{
		return $this->db
			->select('*')
			->where('user_id', $user_id)
		->get('user_permissions');
	}
	
	public function get_department_for_user($username)
	{
		return $this->db
			->select('sales_departments')
			->where('username', $username)
		->get('users');
	}
	
	public function insert_user($data)
	{
		$insert = array(
				'username' => $data['username'],
				'password' => sha1($data['password']."W@ve1ndonesia"),
				'status' => 'A',
		);
		$this->db->insert('users', $insert);
	}
	
	public function insert_active_login($data)
	{
		$insert = array(
				'session_id' => $this->session->session_id,
				'user_id' => $data['user_id'],
				'username' => $data['username'],
				'login_datetime' => date("Y-m-d H:i:s")
		);
		$this->db->insert('user_active_logins', $insert);
	}
	
	public function is_user_still_login($user_id)
	{
		$query = $this->db
		->from('user_active_logins ual')
		->join('ci_sessions cs', 'cs.id = ual.session_id')
		->where('ual.user_id', $user_id)
		->get();
	
		if($query->num_rows() > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public function is_user_logged_in()
	{
		if($this->session->userdata('username') != NULL)
		{
			return true;
		}
	
		return false;
	}
	
	public function is_user_has_access($access_required)
	{
		
		if ($this->session->userdata('permissions') != NULL) {
			$acls = $this->session->userdata('permissions');
			//echo $acls;
			foreach($acls as $ac){
				if ($ac['permission_code'] == $access_required)
				{
					if ($ac['status'] == "A")
					{
						return true;
					}
				}
			}
			//echo $acls ;
			//$acls = $this->session->userdata('permissions');
			/*
			foreach ($acls as $ac){
				echo $ac;
				if ($ac['permission_code'] == $access_required)
				{
					return true;
				}
			}*/
		}
		/*
		if ($this->session->userdata('access') != NULL) {
			$acls = json_decode($this->session->userdata('access'), true);
				
			foreach ($acls as $ac)
			{
				if ($ac == $access_required)
				{
					return true;
				}
			}
		}
	*/
		return false;
	}
	
	public function is_user_has_department_code($department_code)
	{
		if ($this->session->userdata('access') != NULL) {
			$user_id = $this->session->userdata('user_id');
			$sales_departments = $this->get_user_by_user_id($user_id)->row()->sales_departments;
				
			$acls = $this->sales_departments_to_array_departments($sales_departments);
	
			foreach ($acls as $ac)
			{
				if ($ac == $department_code)
				{
					return true;
				}
			}
		}
	
		return false;
	}
	
	public function reset_password($data)
	{
		$this->db->update(
				'users',
				array(
						'password' => sha1($data['password']."W@ve1ndonesia")
				),
				array(
						'user_id' => $data['user_id']
				)
				);
	}
	
	public function sales_departments_to_array_departments($sales_departments)
	{
		if($sales_departments != NULL) {
			$sales_departments = json_decode($sales_departments, true);
			
			foreach($sales_departments as &$departments) {
				if($departments == "BUSA") $departments = "B";
				elseif($departments == "SUPERLAND") $departments = "S";
				elseif($departments == "CHARIS") $departments = "C";
				elseif($departments == "THERASPINE") $departments = "T";
				elseif($departments == "CUSHION") $departments = "U";
			}
		}
		
		return $sales_departments;
	}
}
