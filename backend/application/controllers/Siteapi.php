<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Siteapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('site_model','auditlog_model', 'user_model', 'site_db', 'customer_db', 'item_model'));
	}
	
	public function get_site_by_reference($reference){
		$feedback = array(
			'call_status' => 'success',
			'site' => $this->site_model->get_site_by_reference($reference)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_site_by_id($id){
		$feedback = array(
			'call_status' => 'success',
			'site' => $this->site_model->get_site_by_id($id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_site_history_list_by_site_id($site_id){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->site_model->get_site_history_list_by_site_id($site_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'history_list' => $history_list
			);
		}
		
		echo json_encode($array);
	}

	public function get_site_list(){
		$feedback = array(
				'call_status' => 'success',
				'site_list' => $this->site_model->get_site_list()->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_active_site_list(){
		$feedback = array(
				'call_status' => 'success',
				'site_list' => $this->site_model->get_active_site_list()->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_site_consignment_list(){
		$feedback = array(
				'call_status' => 'success',
				'site_list' => $this->site_db->get_site_consignment_list()->result_array()
		);
	
		echo json_encode($feedback);
	}
    
    public function get_site_non_consignment_list(){
		$feedback = array(
				'call_status' => 'success',
				'site_list' => $this->site_db->get_site_non_consignment_list()->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_site_consignment_list_by_customer_id($customerId){
		$feedback = array(
				'call_status' => 'success',
				'site_list' => $this->site_db->get_site_consignment_list_by_customer_id($customerId)->result_array()
		);
	
		echo json_encode($feedback);
	}

	public function get_movement_code_list(){
		$feedback = array(
				'call_status' => 'success',
				'movement_code_list' => $this->site_model->get_movement_code_list()->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_site_location_list_by_site_id($site_id){
		$feedback = array(
			'call_status' => 'success',
			'location_list' => $this->site_model->get_site_location_list_by_site_id($site_id)->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_site_location_list_by_mass_site_id($data){
		$array = explode('-', $data);
		$storage= array();
		foreach ($array as $a){
			$site = $this->item_model->get_site_id_by_site_reference($a)->row_array();
			$storage_result = $this->site_model->get_site_location_list_by_site_id($site['site_id'])->result_array();
			foreach($storage_result as $sr){
				array_push($storage, $sr);
			}
		}
		
		$feedback = array(
			'call_status' => 'success',
			'location_list' => $storage
		);
		
		echo json_encode($feedback);
	}
	public function get_storage_list_by_site_id($site_id){
		$feedback = array(
				'call_status' => 'success',
				'storage_list' => $this->site_model->get_storage_list_by_site_id($site_id)->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_storage_by_id($storage_id){
		$feedback = array(
			'call_status' => 'success',
			'storage' => $this->site_model->get_storage_by_id($storage_id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_site_bin_list_by_storage_id($storage_id){
		$feedback = array(
			'call_status' => 'success',
			'bin_list' => $this->site_model->get_site_bin_list_by_storage_id($storage_id)->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_bin_by_id($id){
		$feedback = array(
			'call_status' => 'success',
			'bin' => $this->site_model->get_bin_by_id($id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_storage_history_list_by_storage_id($storage_id){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->site_model->get_storage_history_list_by_storage_id($storage_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'history_list' => $history_list
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_bin_history_list_by_bin_id($bin_id){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$history_list = $this->site_model->get_bin_history_list_by_bin_id($bin_id)->result_array();
			
			$array = array(
				'call_status' => 'success',
				'history_list' => $history_list
			);
		}
		
		echo json_encode($array);
	}	
	
	public function insert_site(){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$json = file_get_contents('php://input');
			$data = json_decode($json, true);
			
			if( empty($data['site_reference']) ){
				$array = array(
					'call_status' => 'error',
					'error_message' => 'Site ID tidak boleh kosong',
				);
			}
			else{
				$num_rows = $this->site_model->get_site_by_reference($data['site_reference'])->num_rows();
				
				if($num_rows > 0){
					$array = array(
						'call_status' => 'error',
						'error_message' => 'Site ID sudah ada di database'
					);
				}
				else{
					$this->db->trans_start();
			
					$site_id = $this->site_model->insert_site($data);
					
					$this->auditlog_model->insert_audit_log("siteapi","insert_site",$json);
					
					$insert = array(
						'site_id' => $site_id,
						'user_id' => $this->session->userdata('user_id'),
						'new_data' => 'Data Baru'
					);
					$this->site_model->insert_site_update_history($insert);
					
					$this->db->trans_complete();
					
					if($this->db->trans_status() == FALSE){
						$array = array(
							"call_status" => "error",
							"error_message" =>"Terjadi kesalahan saat menghubungi database"
						);
					}
					else{
						$array = array(
							'call_status' => 'success'
						);
					}
				}
			}
		}
		
		echo json_encode($array);
	}
	
	public function insert_storage(){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("siteapi","insert_storage",$json);
				
			$data = json_decode($json, true);
			
			$query = $this->site_db->get_storage_by_name($data['storage_name']);
			
			if($query->num_rows() > 0){
				$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"Nama Lokasi sudah ada di database."
				);
			}
			else{
				$storage_id = $this->site_model->insert_storage($data);
				//$this->storage_model->generate_storage_reference($storage_id);
				
				$insert = array(
					'storage_id' => $storage_id,
					'user_id' => $this->session->userdata('user_id'),
					'new_data' => 'Data Baru'
				);
				$this->site_model->insert_storage_update_history($insert);
					
				// feedback API
				$array = array(
					'call_status' => 'success'
				);
			}
		}
	
		echo json_encode($array);
	}
	
	public function insert_bin(){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
	
			$this->auditlog_model->insert_audit_log("siteapi","insert_bin",$json);
	
			$data = json_decode($json, true);
	
			$bin_id = $this->site_model->insert_bin($data);
	
			// feedback API
			$array = array(
					'call_status' => 'success'
			);
		}
	
		echo json_encode($array);
	}
	
	public function update_storage(){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("storageapi","update_storage",$json);
				
			$data = json_decode($json, true);
				
			$this->site_model->insert_storage_history($data);
			$this->site_model->update_storage($data);
				
				
			// feedback API
			$array = array(
					'call_status' => 'success'
			);
		}
	
		echo json_encode($array);
	}
	
	public function update_site(){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("siteapi","update_site",$json);
				
			$data = json_decode($json, true);
				
			$this->site_model->insert_site_history($data);
			
			
			if($data['consignment'] == true){
				if($data['old_customer_id'] !== NULL){
					$updateCustomer = array(
					'customer_id' => $data['old_customer_id'],
					'site_id' => NULL,
					);
					$this->customer_db->update_customer($updateCustomer);
				}
				$updateCustomer = array(
					'customer_id' => $data['customer_id'],
					'site_id' => $data['site_id'],
				);
				$this->customer_db->update_customer($updateCustomer);
			}else{
				$updateCustomer = array(
					'customer_id' => $data['old_customer_id'],
					'site_id' => NULL,
				);
				$this->customer_db->update_customer($updateCustomer);
			}
			unset($data['old_customer_id']);
			$this->site_model->update_site($data);
			// feedback API
			$array = array(
					'call_status' => 'success',
			);
		}
	
		echo json_encode($array);
	}
	
	public function update_bin(){
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
			);
		}
		else {
			// ambil data dari post
			$json = file_get_contents('php://input');
				
			$this->auditlog_model->insert_audit_log("binapi","update_bin",$json);
				
			$data = json_decode($json, true);
				
			$this->site_model->insert_bin_history($data);
			$this->site_model->update_bin($data);
				
				
			// feedback API
			$array = array(
					'call_status' => 'success'
			);
		}
	
		echo json_encode($array);
	}
	
	public function get_site_location_list(){
		$feedback = array(
			'call_status' => 'success',
			'location_list' => $this->site_model->get_site_location_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_storage_list(){
		$feedback = array(
			'call_status' => 'success',
			'storage_list' => $this->site_model->get_storage_location_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_bin_list_by_item_code_storage_id($item_code, $storage_id){
		$feedback = array(
			'call_status' => 'success',
			'bin_list' => $this->site_model->get_bin_list_by_item_code_storage_id($item_code, $storage_id)->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function stock_card_pdf($batch_reference){
		
		$data = " ";
		
		//$random = random_string('numeric', 3);
		//$filename = "REPORT$random - PURCHASE";
		$filename = "STOCK CARD";
		$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
		//if (file_exists($pdfFilePath) == FALSE) {
			ini_set('memory_limit','32M'); 
			$html = $this->load->view('pdf-stock-card', $data, true);
			 
			$this->load->library('pdf');
			$pdf = $this->pdf->load('','A4',9,'dejavusans');
			//$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
			$pdf->WriteHTML($html); 
			ob_clean();
			//$pdf->Output($filename.".pdf", 'D');
			$pdf->Output($filename.".pdf", 'F');
			$pdf->Output();
			//force_download($filename.".pdf","./docs/".$filename.".pdf");
			
		//}
		
	}
}
