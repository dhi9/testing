<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('user_db');
	}
	
	public function generate_user_reference($user_id)
	{
		$date_created = $this->user_db->get_user_by_id($user_id)->row()->date_created;
		
		$year = date('Y', strtotime($date_created));
		
		$query = $this->user_db->get_user_list_by_date_created_year($year);
		$count = $query->num_rows();
		
		$sequence = str_pad($count, 4, "0", STR_PAD_LEFT);
		
		$user_reference = $year.'-V'.$sequence;
		
		return $user_reference;
	}
	
	public function insert_user_history($new_user)
	{
		$data_list = array(
			'address' => array('field' => 'Alamat', 'section' => ''),
			'city' => array('field' => 'Kota', 'section' => ''),
			'postcode' => array('field' => 'Kode Pos', 'section' => ''),
			'phone_number' => array('field' => 'No. Telp', 'section' => ''),
			'fax_number' => array('field' => 'Fax', 'section' => ''),
			'sales_pic' => array('field' => 'PIC Sales', 'section' => 'Detail AM User'),
			'sales_email' => array('field' => 'Email', 'section' => 'Detail AM User'),
			'payment_term_value' => array('field' => 'Term Pembayaran', 'section' => 'Detail Pembayaran'),
			'penalty_percent' => array('field' => 'Denda Keterlambatan', 'section' => 'Detail Pembayaran'),
			'payment_pic' => array('field' => 'PIC Keuangan', 'section' => 'Detail Pembayaran'),
			'payment_email' => array('field' => 'Email', 'section' => 'Detail Pembayaran'),
			'payment_account_number' => array('field' => 'Nomor Rek.', 'section' => 'Detail Pembayaran'),
			'payment_account_name' => array('field' => 'Nama di Rek.', 'section' => 'Detail Pembayaran'),
			'payment_bank_name' => array('field' => 'Nama Bank', 'section' => 'Detail Pembayaran'),
			'payment_bank_branch' => array('field' => 'Cabang', 'section' => 'Detail Pembayaran'),
			'status' => array('field' => 'Status', 'section' => 'Status User'),
		);
		
		$old_user = $this->user_db->get_user_by_id($new_user['user_id'])->row_array();
		
		$now = date('Y-m-d H:i:s');
		
		foreach($data_list as $key => $value){
			if($old_user[$key] != $new_user[$key]){
				$insert = array(
					'user_id' => $new_user['user_id'],
					'user_id' => $this->session->userdata('user_id'),
					'section' => $value['section'],
					'field' => $value['field'],
					'old_data' => $old_user[$key],
					'new_data' => $new_user[$key],
					'date_created' => $now
				);
				$this->user_db->insert_user_update_history($insert);
			}
		}
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
	
	public function insert_user($data)
	{
		$query = $this->user_db->get_user_by_username($data['username']);
			
		if($query->num_rows() > 0)
		{
			$feedback = array(
				"call_status" => "error",
				//'error_message' => 'Username sudah ada.',
				'title' => 'Tambah User Gagal',
				'text' => "Username sudah ada.",
			);
		}
		else
		{
			$data['password'] = sha1($data['password']."W@ve1ndonesia");
			$user_id = $this->user_db->insert_user($data);
			
			$this->user_bl->new_access_list_for_user_id($user_id);
			$this->user_bl->new_approval_for_user_id($user_id);
			
			$username = $data['username'];
			
			$feedback = array(
				"call_status" => "success",
				'title' => 'Tambah User Sukses',
				'text' => "User $username berhasil ditambah.",
			);
		}
		
		return $feedback;
	}
	
	public function update_user($data)
	{
		$this->user_bl->update_user_access($data['user_id'], $data['access']);
		unset($data['access']);
		
		$this->user_db->update_user_approval($data['approval']);
		unset($data['approval']);
		
		if (isset($data['password'])){
			$data['password'] = sha1($data['password']."W@ve1ndonesia");
			unset($data['repeatPassword']);
		}
		
		$this->user_db->update_user($data);
	}
	
	public function get_user_approval_by_user_id($user_id)
	{
		$approval = $this->user_db->get_user_approval_by_user_id($user_id)->row_array();
		
		foreach($approval as $key => $value){
			if($approval[$key] > 1){
				$approval[$key] = (float) $approval[$key];
			}
			else{
				if($approval[$key] == '1'){
					$approval[$key] = TRUE;
				}
				elseif($approval[$key] == '0'){
					$approval[$key] = FALSE;
				}
				else{
					$approval[$key] = 0;
				}
			}
		}
		
		return $approval;
	}
	
	public function get_user_access_by_user_id($user_id)
	{
		$access_list = $this->user_db->get_user_access_by_user_id($user_id)->result_array();
		$data = array();
		foreach($access_list as $access){
			if($access['status'] == 'A'){
				$data[$access['permission_code']] = TRUE;
			}
			else{
				$data[$access['permission_code']] = FALSE;
			}
		}
		return $data;
	}
	
	public function update_user_access($user_id, $access_list)
	{
		foreach($access_list as $key => $value){
			$query = $this->db->get_where(
				'user_permissions',
				array(
					'user_id' => $user_id,
					'permission_code' => $key,
				)
			);
			
			$data = array(
				'user_id' => $user_id,
				'permission_code' => $key,
			);
			
			if($value == 1){
				$data['status'] = 'A';
			}
			else {
				$data['status'] = 'X';
			}
			
			if($query->num_rows() > 0){
				$this->user_db->update_user_access($data);
			}
			else{
				$this->user_db->insert_user_access($data);
			}
		}
	}
	
	public function new_access_list_for_user_id($user_id)
	{
		$access_list = ["DASHBOARD","BUATSALESORDER","SALESORDERTROLI","SALESORDERAKTIF","BUATPURCHASEREQUEST","BUATSERVICEREQUEST","BUATSTOCKTRANSFERORDER","APPROVEREQUEST","ORDERAKTIF","STOCKSTATUS","STOCKOPNAME","PENGIRIMAN","ATURDOKUMEN","PENGIRIMANBARU","PENGIRIMANAKTIF","CREDITBLOCK","LAPORANADJUSTMENT","LAPORANPENJUALANHARIAN","LAPORANPELANGGAN","CUSTOMERMASTER","STOCKMASTER","VENDORMASTER","USERMASTER","SITEMASTER","ATTRIBUTEMASTER","BANKMASTER","CATEGORYMASTER","COMPANYMASTER"];
		
		foreach($access_list as $access){
			$data = array(
				'user_id' => $user_id,
				'permission_code' => $access,
				'status' => 'X'
			);
			$this->user_db->insert_user_access($data);
		}
	}
	
	public function new_approval_for_user_id($user_id)
	{
		$data = array(
			'user_id' => $user_id,
		);
		$this->user_db->insert_user_approval($data);
	}
	
	public function is_user_has_access($access_required)
	{
		$num_rows = $this->db
			->where('permission_code', $access_required)
			->where('status', 'A')
		->get('user_permissions')->num_rows();
		
		//if($num_rows > 0){ return TRUE; }
		//else { return FALSE; }
		return true;
	}
}