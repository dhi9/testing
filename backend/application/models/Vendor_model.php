<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vendor_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function generate_vendor_reference($vendor_id)
	{
		$date_created = $this->db->where('vendor_id', $vendor_id)->get('vendors')->row()->date_created;

		$year = date('Y', strtotime($date_created));
		
		$query = $this->db
			->where("YEAR(date_created)", $year)
		->get('vendors');
		$count = $query->num_rows();

		$sequence = str_pad($count, 4, "0", STR_PAD_LEFT);

		$vendor_reference = $year.'-V'.$sequence;

		$data = array(
			'vendor_reference' => $vendor_reference
		);

		$this->db->where('vendor_id', $vendor_id);
		$this->db->update('vendors', $data);

		return $vendor_reference;
	}
	
	public function get_vendor_by_id($id)
	{
		return $this->db->where('vendor_id', $id)->get('vendors');
	}
	
	public function get_vendor_by_reference($reference)
	{
		return $this->db->where('vendor_reference', $reference)->get('vendors');
	}
	
	public function get_vendor_history_list_by_vendor_id($vendor_id)
	{
		return $this->db
			->select('*, vuh.date_created as datetime')
			->from('vendor_update_history vuh')
			->join('users u','u.user_id = vuh.user_id')
			->where('vendor_id', $vendor_id)
			->order_by('vuh.date_created desc')
		->get();
	}

	public function get_vendor_list()
	{
		return $this->db->get('vendors');
	}

	public function get_all_vendor()
	{
		return $this->db
			->select('*')
			->get('vendors');
	}

	public function get_vendor($vendor_id)
	{
		return $this->db
			->select('
					vendor_id,
					vendor_reference,
					vendor_name,
					sales_pic,
					address,
					city,
					postcode,
					phone_number,
					fax_number,
					sales_email,
						
				')
			->where('vendor_id', $vendor_id)
		->get('vendor');
	}
	
	public function insert_vendor($array)
	{
		if ( $this->db->insert('vendors', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
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
		
		$old_vendor = $this->get_vendor_by_id($new_vendor['vendor_id'])->row_array();
		
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
				$this->insert_vendor_update_history($insert);
			}
		}
	}
	
	public function insert_vendor_update_history($array)
	{
		if ( $this->db->insert('vendor_update_history', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function update_vendor($data)
	{
		$this->db->update(
			'vendors',
			$data,
			array('vendor_id' => $data['vendor_id'])
		);
	}
}