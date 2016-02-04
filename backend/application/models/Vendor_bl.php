<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vendor_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('vendor_db');
	}
	
	public function generate_vendor_reference($vendor_id)
	{
		$date_created = $this->vendor_db->get_vendor_by_id($vendor_id)->row()->date_created;
		
		$year = date('Y', strtotime($date_created));
		
		$query = $this->vendor_db->get_vendor_list_by_date_created_year($year);
		$count = $query->num_rows();
		
		$sequence = str_pad($count, 4, "0", STR_PAD_LEFT);
		
		$vendor_reference = $year.'-V'.$sequence;
		
		return $vendor_reference;
	}
	
	public function insert_vendor_history($new_vendor)
	{
		$data_list = array(
			'address' => array('field' => 'Alamat', 'section' => ''),
			'city' => array('field' => 'Kota', 'section' => ''),
			'postcode' => array('field' => 'Kode Pos', 'section' => ''),
			'phone_number' => array('field' => 'No. Telp', 'section' => ''),
			'fax_number' => array('field' => 'Fax', 'section' => ''),
			'sales_pic' => array('field' => 'PIC Sales', 'section' => 'Detail AM Vendor'),
			'sales_email' => array('field' => 'Email', 'section' => 'Detail AM Vendor'),
			'payment_term_value' => array('field' => 'Term Pembayaran', 'section' => 'Detail Pembayaran'),
			'penalty_percent' => array('field' => 'Denda Keterlambatan', 'section' => 'Detail Pembayaran'),
			'payment_pic' => array('field' => 'PIC Keuangan', 'section' => 'Detail Pembayaran'),
			'payment_email' => array('field' => 'Email', 'section' => 'Detail Pembayaran'),
			'payment_account_number' => array('field' => 'Nomor Rek.', 'section' => 'Detail Pembayaran'),
			'payment_account_name' => array('field' => 'Nama di Rek.', 'section' => 'Detail Pembayaran'),
			'payment_bank_name' => array('field' => 'Nama Bank', 'section' => 'Detail Pembayaran'),
			'payment_bank_branch' => array('field' => 'Cabang', 'section' => 'Detail Pembayaran'),
			'status' => array('field' => 'Status', 'section' => 'Status Vendor'),
		);
		
		$old_vendor = $this->vendor_db->get_vendor_by_id($new_vendor['vendor_id'])->row_array();
		
		$now = date('Y-m-d H:i:s');
		
		foreach($data_list as $key => $value){
			if($old_vendor[$key] != $new_vendor[$key]){
				$insert = array(
					'vendor_id' => $new_vendor['vendor_id'],
					'user_id' => $this->session->userdata('user_id'),
					'section' => $value['section'],
					'field' => $value['field'],
					'old_data' => $old_vendor[$key],
					'new_data' => $new_vendor[$key],
					'date_created' => $now
				);
				$this->vendor_db->insert_vendor_update_history($insert);
			}
		}
	}
}