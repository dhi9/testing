<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Purchaseapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('purchase_model', 'auditlog_model', 'user_model', 'site_model', 'purchase_bl', 'site_db', 'stock_movement_db', 'inventory_db', 'inventory_bl', 'vendor_model', 'warehouse_model', 'company_db', 'user_db', 'item_bl'));
		$this->load->helper('url');
		$this->load->helper('string');
		$this->load->helper('download');
		$this->load->library('email');
	}
	
	public function approve_draft_order() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else {
			$json = file_get_contents('php://input');
			
			//$this->db->trans_start();
			
			$this->auditlog_model->insert_audit_log("purchaseapi", "approve_draft_purchase", $json);
			
			$data = json_decode($json, true);
				
			$insert_purchase = array(
					'vendor_id' => $data['supplier_id'],
					'currency' => $data['currency'],
					'approver_id' => $this->session->userdata('user_id'),
					'requests_creator' => $data['draft_creator'],
					'requests_reference' => $data['draft_reference'],
					'date_created' => $data['date_modified'],
					'supplier_email' => $data['supplier_email'],
					'type' => 'PR',
					'status' => 'P'
			);
			$requests_id = $this->purchase_model->insert_requests($insert_purchase);
			
			foreach($data['item_request_list'] as $item_request) {
				if(!isset($item_request['remark'])){
					$item_request['remark'] = "";
				}
				/*$insert_purchase_item_request = array(
					'requests_id' => $requests_id,
					'item_code' => $item_request['item_code'],
					//'attributes' => @$item_request['attributes'],
					'quantity' => $item_request['quantity'],
					'item_unit' => $item_request['item_unit'],
					'remark' => $item_request['remark'],
					'cost' => $item_request['cost'],
				);
				$this->purchase_model->insert_requests_item_request($insert_purchase_item_request);*/
				
				$item_code = $item_request['item_code'];
				$attributes = $this->purchase_bl->json_to_cb($item_request['attributes']);
				$quantity = $item_request['quantity'];
				$item_unit = $item_request['item_unit'];
				$remark = $item_request['remark'];
				$cost = $item_request['cost'];
				
				$this->db->query("
					INSERT INTO request_items (requests_id, item_code, attributes, quantity, item_unit, remark, cost)
					VALUES ($requests_id, '$item_code', COLUMN_CREATE($attributes), $quantity, '$item_unit', '$remark', $cost)
				");
			}
			
			foreach($data['delivery_request_list'] as $delivery_request) {
				$delivery_request['date'] = $delivery_request['date'] ? $delivery_request['date'] : '';
				$insert_purchase_delivery_request = array(
						'requests_id' => $requests_id,
						'site_id' => $delivery_request['site_id'],
						'remark' => $delivery_request['remark'],
						'requested_date' => date($delivery_request['date']),
						'status' => 'A'
				);
				$requests_delivery_request_id = $this->purchase_model->insert_requests_delivery_request($insert_purchase_delivery_request);
	
				foreach($delivery_request['item_delivery_request_list'] as $item_delivery_request) {
					$insert_item_delivery_request = array(
							'requests_delivery_request_id' => $requests_delivery_request_id,
							'item_code' => $item_delivery_request['item_code'],
							'attributes' => @$item_delivery_request['attributes'],
							'quantity' => $item_delivery_request['quantity'],
							'item_unit' => $item_delivery_request['item_unit'],
					);
					$this->purchase_model->insert_request_delivery_request_items($insert_item_delivery_request);
				}
			}
				
			$update_draft = array(
					'draft_reference' => $data['draft_reference'],
					'status' => 'P'
			);
				
			$this->purchase_model->update_draft_purchase($update_draft);
			
			if($data['send_email'] == true){
				$ActiveRequestDetail = $this->purchase_model->get_active_requests_by_requests_reference($data['draft_reference'])->row_array();
				$ActiveRequestVendorDetail = $this->vendor_model->get_vendor_by_id($ActiveRequestDetail['vendor_id'])->row_array();
				$ActiveItemRequestList = $this->purchase_model->get_active_item_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
				$ActiveDeliveryRequestList = $this->purchase_model->get_active_delivery_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
				$ActiveDeliveryAddressList = $this->purchase_model->get_site_list()->result_array();
				$ActiveDeliveryRequestItemList = array();
				$i = 1;
				foreach($ActiveDeliveryRequestList as $key){
					$items = $this->purchase_model->get_active_delivery_requests_items_by_requests_delivery_request_id($key['requests_delivery_request_id'])->result_array();
					foreach($items as $item){
						$item['plan'] = $i;
						$item['requested_date'] = $key['requested_date'];
						$item['remark'] = $key['remark'];
						$item['site_id'] = $key['site_id'];
						array_push($ActiveDeliveryRequestItemList, $item);
					}
					$i +=1;
				}
				
				$ActiveCompanyDetail = $this->company_db->get_company()->row();
				$ActiveCompanyDetail->img = "<img src='".$ActiveCompanyDetail->order_image."'>";
				$data['ActiveRequestDetail'] = $ActiveRequestDetail;
				$data['ActiveCompanyDetail'] = $ActiveCompanyDetail;
				$data['ActiveRequestVendorDetail'] = $ActiveRequestVendorDetail;
				$data['ActiveItemRequestList'] = $ActiveItemRequestList;
				$data['ActiveDeliveryRequestList'] = $ActiveDeliveryRequestList;
				$data['ActiveDeliveryAddressList'] = $ActiveDeliveryAddressList;
				$data['ActiveDeliveryRequestItemList'] = $ActiveDeliveryRequestItemList;
				
				$filename = $data['draft_reference'];
		
				$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
				
				//if (file_exists($pdfFilePath) == FALSE) {
					ini_set('memory_limit','32M');
					$html = $this->load->view('pdf-po', $data, true);
					 
					$this->load->library('pdf');
					$pdf = $this->pdf->load('','A4',9,'dejavusans');
					//$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
					$pdf->WriteHTML($html); 
					
					$pdf->Output($pdfFilePath, 'F'); 
					$this->purchase_model->send_email($data['supplier_email'],$filename);
				//}
			}
			// feedback API
			$feedback = array(
					"call_status" => "success",
					"draft_reference" => $data['draft_reference'],
					"requests_id" => $requests_id,
					"update" => $update_draft
					//"order_id" => $order_id,
					//"order_reference" => $order_reference
			);
		}
		echo json_encode($feedback);
	}
	
	public function approve_draft_service_order() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else {
			$json = file_get_contents('php://input');
			
			//$this->db->trans_start();
			
			$this->auditlog_model->insert_audit_log("purchaseapi", "approve_draft_service", $json);
			
			$data = json_decode($json, true);
				
			$insert_purchase = array(
					'vendor_id' => $data['supplier_id'],
					'currency' => $data['currency'],
					'approver_id' => $this->session->userdata('user_id'),
					'requests_creator' => $data['draft_creator'],
					'requests_reference' => $data['draft_reference'],
					'date_created' => $data['date_modified'],
					'supplier_email' => $data['supplier_email'],
					'type' => 'SR',
					'status' => 'P'
			);
			$requests_id = $this->purchase_model->insert_requests($insert_purchase);
				
			foreach($data['item_request_list'] as $item_request) {
				$insert_purchase_item_request = array(
						'requests_id' => $requests_id,
						'service_name' => $item_request['item_name'],
						'quantity' => $item_request['quantity'],
						'remark' => @$item_request['remark'] ? : '',
						'cost' => $item_request['cost'],
				);
				$this->purchase_model->insert_service_item_request($insert_purchase_item_request);
			}
				
			foreach($data['delivery_request_list'] as $delivery_request) {
				$insert_purchase_delivery_request = array(
						'requests_id' => $requests_id,
						'site_id' => $delivery_request['site_id'],
						'remark' => $delivery_request['remark'],
						'requested_date' => date(@$delivery_request['date']),
						'status' => 'A'
				);
				$requests_delivery_request_id = $this->purchase_model->insert_requests_delivery_request($insert_purchase_delivery_request);
			}
				
			$update_draft = array(
					'draft_reference' => $data['draft_reference'],
					'status' => 'P'
			);
				
			$this->purchase_model->update_draft_purchase($update_draft);
			
			if($data['send_email'] == true){
				$ActiveRequestDetail = $this->purchase_model->get_active_requests_by_requests_reference($data['draft_reference'])->row_array();
				$ActiveRequestVendorDetail = $this->vendor_model->get_vendor_by_id($ActiveRequestDetail['vendor_id'])->row_array();
				$ActiveItemRequestList = $this->purchase_model->get_active_item_service_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
				$ActiveDeliveryRequestList = $this->purchase_model->get_active_delivery_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
				$ActiveDeliveryAddressList = $this->purchase_model->get_site_list()->result_array();
				
				$ActiveCompanyDetail = $this->company_db->get_company()->row();
				$ActiveCompanyDetail->img = "<img src='".$ActiveCompanyDetail->order_image."'>";
				$data['ActiveRequestDetail'] = $ActiveRequestDetail;
				$data['ActiveCompanyDetail'] = $ActiveCompanyDetail;
				$data['ActiveRequestVendorDetail'] = $ActiveRequestVendorDetail;
				$data['ActiveItemRequestList'] = $ActiveItemRequestList;
				$data['ActiveDeliveryRequestList'] = $ActiveDeliveryRequestList;
				$data['ActiveDeliveryAddressList'] = $ActiveDeliveryAddressList;
				$filename = $data['draft_reference'];
		
				$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
				
				//if (file_exists($pdfFilePath) == FALSE) {
					ini_set('memory_limit','32M');
					$html = $this->load->view('pdf-so', $data, true);
					 
					$this->load->library('pdf');
					$pdf = $this->pdf->load('','A4',9,'dejavusans');
					//$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
					$pdf->WriteHTML($html); 
					
					$pdf->Output($pdfFilePath, 'F'); 
					$this->purchase_model->send_email($data['supplier_email'],$filename);
				//}
			}
			
			// feedback API
			$feedback = array(
					"call_status" => "success",
					"draft_reference" => $data['draft_reference'],
			);
		}
		echo json_encode($feedback);
	}
	public function create_pdf($request_reference){
		
		$ActiveRequestDetail = $this->purchase_model->get_active_requests_by_requests_reference($request_reference)->row_array();
		$ActiveRequestVendorDetail = $this->vendor_model->get_vendor_by_id($ActiveRequestDetail['vendor_id'])->row_array();
		$ActiveItemRequestList = $this->purchase_model->get_active_item_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
		$ActiveDeliveryRequestList = $this->purchase_model->get_active_delivery_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
		$ActiveDeliveryAddressList = $this->purchase_model->get_site_list()->result_array();
		$ActiveDeliveryRequestItemList = array();
		$i = 1;
		foreach($ActiveDeliveryRequestList as $key){
			$items = $this->purchase_model->get_active_delivery_requests_items_by_requests_delivery_request_id($key['requests_delivery_request_id'])->result_array();
			foreach($items as $item){
				$item['plan'] = $i;
				$item['requested_date'] = $key['requested_date'];
				$item['remark'] = $key['remark'];
				$item['site_id'] = $key['site_id'];
				array_push($ActiveDeliveryRequestItemList, $item);
			}
			$i +=1;
		}
		$ActiveCompanyDetail = $this->company_db->get_company()->row();
		$ActiveCompanyDetail->img = "<img src='".$ActiveCompanyDetail->order_image."'>";
		$data['ActiveRequestDetail'] = $ActiveRequestDetail;
		$data['ActiveCompanyDetail'] = $ActiveCompanyDetail;
		$data['ActiveRequestVendorDetail'] = $ActiveRequestVendorDetail;
		$data['ActiveItemRequestList'] = $ActiveItemRequestList;
		$data['ActiveDeliveryRequestList'] = $ActiveDeliveryRequestList;
		$data['ActiveDeliveryAddressList'] = $ActiveDeliveryAddressList;
		$data['ActiveDeliveryRequestItemList'] = $ActiveDeliveryRequestItemList;
		$random = random_string('numeric', 3);
		$filename = "REPORT$random - PURCHASE";

		$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
		//if (file_exists($pdfFilePath) == FALSE) {
			ini_set('memory_limit','-1');
			ini_set('max_execution_time', 600);
			$html = $this->load->view('pdf-po-active', $data, true);
			 
			$this->load->library('pdf');
			$pdf = $this->pdf->load('','A4',9,'dejavusans');
			//$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
			$pdf->WriteHTML($html); 
			ob_clean();
			$pdf->Output($request_reference.".pdf", 'D');
			//$pdf->Output($request_reference.".pdf", 'F');
			//$pdf->Output();
			//force_download($filename.".pdf","./docs/".$filename.".pdf");
			
		//}
		
	}
	
	public function create_pdf_service($request_reference){
		
		$ActiveRequestDetail = $this->purchase_model->get_active_requests_by_requests_reference($request_reference)->row_array();
		$ActiveRequestVendorDetail = $this->vendor_model->get_vendor_by_id($ActiveRequestDetail['vendor_id'])->row_array();
		$ActiveItemRequestList = $this->purchase_model->get_active_item_service_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
		$ActiveDeliveryRequestList = $this->purchase_model->get_active_delivery_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
		$ActiveDeliveryAddressList = $this->purchase_model->get_site_list()->result_array();
		
		$ActiveCompanyDetail = $this->company_db->get_company()->row();
		$ActiveCompanyDetail->img = "<img src='".$ActiveCompanyDetail->order_image."'>";
		$data['ActiveRequestDetail'] = $ActiveRequestDetail;
		$data['ActiveCompanyDetail'] = $ActiveCompanyDetail;
		$data['ActiveRequestVendorDetail'] = $ActiveRequestVendorDetail;
		$data['ActiveItemRequestList'] = $ActiveItemRequestList;
		$data['ActiveDeliveryRequestList'] = $ActiveDeliveryRequestList;
		$data['ActiveDeliveryAddressList'] = $ActiveDeliveryAddressList;
		
		
		$random = random_string('numeric', 3);
		$filename = "REPORT$random - PURCHASE";

		$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
		//if (file_exists($pdfFilePath) == FALSE) {
			ini_set('memory_limit','32M'); 
			$html = $this->load->view('pdf-so-active', $data, true);
			 
			$this->load->library('pdf');
			$pdf = $this->pdf->load('','A4',9,'dejavusans');
			//$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
			$pdf->WriteHTML($html); 
			ob_clean();
			$pdf->Output($request_reference.".pdf", 'D');
			//$pdf->Output($request_reference.".pdf", 'F');
			//$pdf->Output();
			//force_download($filename.".pdf","./docs/".$filename.".pdf");
			
		//}
		
	}
	
	public function create_stock_card($purchase_delivered_item_id)
	{
		$data['item'] = $this->purchase_db->get_delivered_item_by_id($purchase_delivered_item_id)->row_array();
		
		$data['stock_list'] = $this->db
			->select('sm.*, i.item_unit')
			->from('stock_movements sm')
			->join('items i', 'i.item_code = sm.item_code', 'left')
			->where('sm.site_id', $data['item']['site_id'])
			->where('sm.batch_id', $data['item']['batch_id'])
			->order_by('sm.stock_movement_id desc')
		->get()->result_array();
		
		$data['stock_status_url'] = 'test';
		
		//$this->load->view('pdf-stock-card', $data);
		$random = random_string('numeric', 3);
		$filename = "STOCK CARD";
		//$data = "";
		$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
		//if (file_exists($pdfFilePath) == FALSE) {
			//ini_set('memory_limit','-1');
			//ini_set('max_execution_time', 600);
			$html = $this->load->view('pdf-stock-card', $data, true);
			 
			$this->load->library('pdf');
			$pdf = $this->pdf->load('','A4',9,'dejavusans');
			//$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
			$pdf->WriteHTML($html); 
			ob_clean();
			$pdf->Output($filename.".pdf", 'D');
			//$pdf->Output($request_reference.".pdf", 'F');
			//$pdf->Output();
			//force_download($filename.".pdf","./docs/".$filename.".pdf");
			
		//}
		
	}
	
	public function create_gr_report(){
		
		$random = random_string('numeric', 3);
		$filename = "GR REPORT";
		$data = "";
		$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
		//if (file_exists($pdfFilePath) == FALSE) {
			ini_set('memory_limit','-1');
			ini_set('max_execution_time', 600);
			$html = $this->load->view('pdf-gr-report', $data, true);
			 
			$this->load->library('pdf');
			$pdf = $this->pdf->load('','A4',9,'dejavusans');
			//$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
			$pdf->WriteHTML($html); 
			ob_clean();
			$pdf->Output($request_reference.".pdf", 'D');
			//$pdf->Output($request_reference.".pdf", 'F');
			//$pdf->Output();
			//force_download($filename.".pdf","./docs/".$filename.".pdf");
			
		//}
		
	}
	public function delete_draft_order() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else {
			$data = file_get_contents('php://input');
			
			$update_change = array(
				'draft_reference' => $data,
				'status' => 'X'
			);
			$this->purchase_db->update_draft_purchase_by_reference($data, $update_change);
			
			// feedback API
			$feedback = array(
				"call_status" => "success",
				"draft_reference" => $data,
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_draft_by_id($id) {
		$feedback = array(
			'call_status' => 'success',
			'draft' => $this->purchase_db->get_draft_by_id($id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_draft_purchase_by_draft_reference($draft_reference) {
		$feedback = array(
			'call_status' => 'success',
			'draft_purchase' => $this->purchase_db->get_draft_purchase_by_draft_reference($draft_reference)->row_array(),
			'login_as' => $this->session->userdata('user_id'),
		);
		
		echo json_encode($feedback);
	}
	
	public function get_purchase_by_draft_reference($draft_reference) {
		$feedback = array(
			'call_status' => 'success',
			'purchase' => $this->purchase_db->get_purchase_by_draft_reference($draft_reference)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_purchase_request_by_id($id) {
		$feedback = array(
			'call_status' => 'success',
			'purchase_request' => $this->purchase_db->get_purchase_request_by_id($id)->row_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_purchase_request_list_by_id($id) {
		$feedback = array(
			'call_status' => 'success',
			'purchase_request_list' => $this->purchase_db->get_purchase_by_approver_id($user_id)->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_users_list()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else {
			$feedback = array(
				"call_status" => "success",
				'users_list' => $this->purchase_db->get_users_list()->result_array()
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_site_list()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else {
			$feedback = array(
				"call_status" => "success",
				'site_list' => $this->site_db->get_site_list()->result_array()
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_storage_list()
	{
		if(! $this->user_model->is_user_logged_in()) {
			$feedback = array (
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else{
			$feedback = array(
				"call_status" => "success",
				"storage_list" => $this->purchase_db->get_storage_list()->result_array()
			);
		}
		echo json_encode($feedback);
	}
	
	public function get_bin_list()
	{
		if(! $this->user_model->is_user_logged_in()) {
			$feedback = array (
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else{
			$feedback = array(
				"call_status" => "success",
				"bin_list" => $this->purchase_db->get_bin_list()->result_array()
			);
		}
		echo json_encode($feedback);
	}

	public function get_batch_list()
	{
		if(! $this->user_model->is_user_logged_in()) {
			$feedback = array (
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		else{
			$feedback = array(
				"call_status" => "success",
				"batch_list" => $this->purchase_db->get_batch_list()->result_array()
			);
		}
		echo json_encode($feedback);
	}
	
	public function get_request()
	{
		$user_id = $this->session->userdata('user_id');
		$feedback = array(
			'call_status' => 'success',
			'request_list' => $this->purchase_db->get_request()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_request_by_approver_id()
	{
		$user_id = $this->session->userdata('user_id');
		
		$feedback = array(
			'call_status' => 'success',
			'request_list' => $this->purchase_db->get_request_by_approver_id($user_id)->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_approved_request_by_approver_id()
	{
		$user_id = $this->session->userdata('user_id');
		
		$feedback = array(
			'call_status' => 'success',
			'request_list' => $this->purchase_db->get_approved_request_by_approver_id()->result_array(),
		);
		
		echo json_encode($feedback);
	}
	
	public function get_active_requests_list()
	{
		$feedback = array(
			'call_status' => 'success',
			'request_list' => $this->purchase_db->get_active_requests_list()->result_array(),
		);
		
		echo json_encode($feedback);
	}
	
	public function get_completed_requests_list() {
		$feedback = array(
			'call_status' => 'success',
			'request_list' => $this->purchase_model->get_completed_requests_list()->result_array()
		);
		
		echo json_encode($feedback);
	}
	
	public function get_active_requests_by_requests_reference($draft_reference) {
		$feedback = array(
			'call_status' => 'success',
			'requests' => $this->purchase_db->get_active_requests_by_requests_reference($draft_reference)->row_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_active_item_requests_by_requests_id($requests_id)
	{
		$item = $this->purchase_db->get_active_item_requests_by_requests_id($requests_id)->result_array();
		
		$received_quantity = array(
			'received_quantity' => 0,
		);
		
		foreach ($item as $i){
			array_push($i, $received_quantity);
		}
		
		$feedback = array(
			'call_status' => 'success',
			'item_requests' => $item
		);
	
		echo json_encode($feedback);
	}
	
	public function get_active_delivery_requests_by_requests_id($requests_id) {
		$feedback = array(
			'call_status' => 'success',
			'delivery_requests' => $this->purchase_db->get_active_delivery_requests_by_requests_id($requests_id)->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_active_delivery_requests_by_delivery_requests_id($delivery_requests_id) {
		$feedback = array(
			'call_status' => 'success',
			'delivery_requests' => $this->purchase_db->get_active_delivery_requests_by_delivery_requests_id($delivery_requests_id)->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_active_delivery_requests_items_by_requests_delivery_request_id($requests_delivery_request_id) {
		$item = $this->purchase_model->get_active_delivery_requests_items_by_requests_delivery_request_id($requests_delivery_request_id)->result_array();
		$index = 0;
		
		foreach ($item as $i){
			$item[$index]['received_quantity'] = 0;
			$index+=1;
		}
		
		$feedback = array(
			'call_status' => 'success',
			'delivery_requests_items' => $item
		);
	
		echo json_encode($feedback);
	}
	
	public function get_delivered_items_list_by_requests_delivery_request_id($requests_delivery_request_id)
	{
		$feedback = array(
			'call_status' => 'success',
			'delivered_items_list' => $this->purchase_db->get_delivered_items_list_by_requests_delivery_request_id($requests_delivery_request_id)->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_active_item_service_requests_by_requests_id($requests_id)
	{
		$feedback = array(
			'call_status' => 'success',
			'item_requests' => $this->purchase_db->get_active_item_service_requests_by_requests_id($requests_id)->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function get_completed_service_by_requests_delivery_request_id($requests_delivery_request_id)
	{
		$feedback = array(
			'call_status' => 'success',
			'completed_service' => $this->purchase_db->get_completed_service_by_requests_delivery_request_id($requests_delivery_request_id)->result_array()
		);
	
		echo json_encode($feedback);
	}
	
	public function insert_draft_purchase()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$json = file_get_contents('php://input');
			
			$this->db->trans_start();
			
			$this->auditlog_model->insert_audit_log("purchaseapi", "insert_draft_purchase", $json);
			
			$data = json_decode($json, true);
			
			$draft_reference = $this->purchase_bl->insert_draft_purchase_item($json, $data);
			
			$this->db->trans_complete();
			
			if ($this->db->trans_status() === FALSE)
			{
				$feedback = array(
					"call_status" => "error",
					//"error_code" => "701",
					"error_message" => "Terjadi kesalahan dengan database."
				);
			}
			else
			{
				$feedback = array(
					"call_status" => "success",
					"draft_reference" => $draft_reference,
				);
			}		
		}
		
		echo json_encode($feedback);
	}
	
	public function insert_draft_service()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$json = file_get_contents('php://input');
			
			$this->db->trans_start();
			
			$this->auditlog_model->insert_audit_log("purchaseapi", "insert_draft_service", $json);
			
			$data = json_decode($json, true);
			
			$draft_reference = $this->purchase_bl->insert_draft_purchase_service($data, $json);
			
			$this->db->trans_complete();
			
			if ($this->db->trans_status() === FALSE)
			{
				$feedback = array(
					"call_status" => "error",
					//"error_code" => "701",
					"error_message" => "Terjadi kesalahan dengan database."
				);
			}
			else
			{
				$feedback = array(
					"call_status" => "success",
					"draft_reference" => $draft_reference,
				);
			}
		}
		
		echo json_encode($feedback);
	}
	
	public function insert_delivered_items()
	{
		$data = json_decode(file_get_contents('php://input'),true);
		
		$actual_good_received = $this->purchase_bl->change_good_received_format($data);
		
		$gr = $this->purchase_bl->insert_purchase_delivery_items($actual_good_received);
		
		//$this->db->trans_start();
		
		//$this->purchase_bl->insert_purchase_delivery_items($data);
		
		//$this->db->trans_complete();
		
		$feedback = array(
			"call_status" => "success",
			"data" => $data,
			"gr" => $gr,
		);
		echo json_encode($feedback);
	}
	
	public function insert_completed_service()
	{
		$serviceExecution = json_decode(file_get_contents('php://input'),true);
		
		$insert_service_execution = array(
			'requests_delivery_request_id' => $serviceExecution['requests_delivery_request_id'] ,
			'confirmed_by' => $this->session->userdata('user_id'),
			'date_completed' => $serviceExecution['date_completed'] ,
			'remark' => $serviceExecution['remark'] ,
		);
		$complete = $this->purchase_model->insert_completed_service($insert_service_execution);
		
		$feedback = array(
			"call_status" => "success",
			"completed_service" => $complete
		);
		echo json_encode($feedback);
	}
	
	public function is_user_approver()
	{
		$data = json_decode(file_get_contents('php://input'), true);
		$user_id = $this->session->userdata('user_id');
		$num_rows = $this->purchase_model->get_draft_by_id_and_approver_id($data['draft_id'], $user_id)->num_rows();
		
		if($num_rows){
			$approver = true;
		}
		else{
			if($data['currency'] == "idr"){
				if($data['type'] == "PO"){
					$by = "po_max_idr";
				}else{
					$by = "so_max_idr";
				}
			}elseif($data['currency'] == "usd"){
				if($data['type'] == "PO"){
					$by = "po_max_usd";
				}else{
					$by = "so_max_usd";
				}
			}else{
				if($data['type'] == "PO"){
					$by = "po_max_eur";
				}else{
					$by = "so_max_eur";
				}
			}
			$user = $this->purchase_model->get_users_by_user_id($user_id, $by)->row()->$by;
			$users = $this->purchase_model->get_users_by_user_id($data['draft_approver'], $by)->row()->$by;
			if($user > $users){
				$approver = true;
			}else{
				$approver = false;
			}
		}
		
		$feedback = array(
			'call_status' => 'success',
			'approver' => $approver,
			'num_row' => $num_rows,
			'data' => $data,
		);
		
		echo json_encode($feedback);
	}
	
	public function is_purchase_requests_complete($requests_id)
	{
		$requests_active = $this->purchase_model->get_purchase_delivery_requests_by_requests_id($requests_id)->result_array();
		$requests_complete = $this->purchase_model->get_completed_purchase_delivery_requests_by_requests_id($requests_id)->result_array();
	
		if($requests_active == $requests_complete){
			$update = array(
					'requests_id' => $requests_id,
					'date_modified' => date('Y-m-d'),
					'status' => 'C',
			);
			$this->purchase_model->update_purchase_request_to_complete_purchase_request($update);
		}
	
		$feedback = array(
				'call_status' => 'success',
		);
	
		echo json_encode($feedback);
	}
	
	public function need_changed_draft_order()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
		$feedback = array(
		"call_status" => "error",
		"error_code" => "702",
		"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
		);
		}*/
		else {
			$data = json_decode(file_get_contents('php://input'), true);
				
			$update_change = array(
					'draft_reference' => $data['draft_reference'],
					'status' => 'C'
			);
				
			$this->purchase_model->update_draft_purchase($update_change);
				
			// feedback API
			$feedback = array(
					"call_status" => "success",
					"draft_reference" => $data['draft_reference'],
			);
		}
	
		echo json_encode($feedback);
	}
	
	public function send_email($to){
		$random = random_string('numeric', 3);
		//$filename = "REPORT$random - PURCHASE";
		$filename = "REPORT$random - PURCHASE";
		$data= "data";

		$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
		
		//if (file_exists($pdfFilePath) == FALSE) {
			ini_set('memory_limit','32M'); 
			$html = $this->load->view('pdf-po', $data, true);
			 
			$this->load->library('pdf');
			$pdf = $this->pdf->load('','A4',9,'dejavusans');
			//$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
			$pdf->WriteHTML($html); 
			
			$pdf->Output($pdfFilePath, 'F'); 
			$this->purchase_model->send_email($to,'',$filename);
			
		//}

	}
	public function test($request_reference){
		$data['ActiveCompanyDetail'] = $this->company_db->get_company()->row();
		$this->load->view("logo", $data);
	}
	
	public function update_draft_order() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}*/
		else {
			$json = file_get_contents('php://input');
			
			//$this->auditlog_model->insert_audit_log("purchaseapi", "insert_draft_purchase", $json);
			
			$data = json_decode($json, true);
			
			$update = array(
				'draft_data' => $json,
				'status' => 'A',
				'draft_reference' => $data['draft_reference'],
				//'product_type' => $array['product_type']
			);
			$this->purchase_model->update_draft_purchase($update);
			
			// feedback API
			$feedback = array(
				"call_status" => "success",
				'draft_reference' => $data['draft_reference'],
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function update_completed_delivery_request() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
		$feedback = array(
		"call_status" => "error",
		"error_code" => "702",
		"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
		);
		}*/
		else {
			$json = file_get_contents('php://input');
			
			//$this->auditlog_model->insert_audit_log("purchaseapi", "insert_draft_purchase", $json);
			
			$deliveryRequestsId = json_decode($json, true);
			
			$update = array(
				'requests_delivery_request_id' => $deliveryRequestsId,
				'status' => 'C',
			);
			$this->purchase_model->update_completed_delivery_request($update);
			
			// feedback API
			$feedback = array(
				"call_status" => "success",
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function update_locations_delivered_request_item() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
		$feedback = array(
		"call_status" => "error",
		"error_code" => "702",
		"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
		);
		}*/
		else {
			$json = file_get_contents('php://input');
			
			//$this->auditlog_model->insert_audit_log("purchaseapi", "insert_draft_purchase", $json);
			
			$data = json_decode($json, true);
			
			$update = array(
				'purchase_delivered_item_id' => $data['purchase_delivered_item_id'],
				'site_id' => $data['site_id'],
				'storage_id' => $data['storage_id'],
				'bin_id' => $data['bin_id'],
			);
			$this->purchase_model->update_locations_delivered_request_item($update);
			$this->purchase_model->update_locations_inventory_stock($update);
			
			// feedback API
			$feedback = array(
				"call_status" => "success",
				'data' => $update,
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function update_batch_delivered_request_item() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
		$feedback = array(
		"call_status" => "error",
		"error_code" => "702",
		"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
		);
		}*/
		else {
			$json = file_get_contents('php://input');
			
			//$this->auditlog_model->insert_audit_log("purchaseapi", "insert_draft_purchase", $json);
				
			$data = json_decode($json, true);
				
			$update = array(
					'batch_id' => $data['batch_id'],
					'batch_reference' => $data['batch_reference'],
					'production_date' => $data['production_date'],
					'expired_date' => $data['expired_date']
			);
			$this->purchase_model->update_batch_delivered_request_item($update);
				
			// feedback API
			$feedback = array(
					"call_status" => "success",
					'data' => $update,
			);
		}
	
		echo json_encode($feedback);
	}
	
	public function update_remark_delivered_request_item() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
		$feedback = array(
		"call_status" => "error",
		"error_code" => "702",
		"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
		);
		}*/
		else {
			$json = file_get_contents('php://input');
			
			//$this->auditlog_model->insert_audit_log("purchaseapi", "insert_draft_purchase", $json);
			
			$data = json_decode($json, true);
			
			$update = array(
				'purchase_delivered_item_id' => $data['purchase_delivered_item_id'],
				'remark' => $data['remark'],
			);
			$this->purchase_model->update_remark_delivered_request_item($update);
			
			// feedback API
			$feedback = array(
				"call_status" => "success",
				'data' => $update,
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_approver($amount, $currency, $type){
		
		$approver = $this->purchase_db->get_approver($amount, $currency, $type)->row_array();
		$user = $this->user_db->get_user_by_id($approver['user_id'])->row_array();
		$feedback = array(
				"call_status" => "success",
				"approver" => $approver,
				"user" => $user,
			);
		echo json_encode($feedback);
	}
	
	public function update_service_request_to_complete_service_request() {
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}/*
		else if (! $this->user_model->is_user_has_access("CUSTOMERSERVICE")) {
		$feedback = array(
		"call_status" => "error",
		"error_code" => "702",
		"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
		);
		}*/
		else {
			$json = file_get_contents('php://input');
			
			//$this->auditlog_model->insert_audit_log("purchaseapi", "insert_draft_purchase", $json);
			
			$requestsReference = json_decode($json, true);
			
			$update = array(
				'requests_reference' => $json,
				'date_modified' => date('Y-m-d'),
				'status' => 'C',
			);
			$this->purchase_model->update_service_request_to_complete_service_request($update);
			
			// feedback API
			$feedback = array(
				"call_status" => "success",
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function atest (){
		$arr = array('Color'=> 'merah', 'Panjang'=> 10);
		$attributes = $arr;
		$insert_good_recieved = array(
			'item_code' => 'A160',
			'site_id' => 1,	
			'storage_id' => 1,
			'bin_id' => 1,	
			'batch_id' =>1,	
			'quantity' =>1,		
			'attributes' => $attributes
		);
		$quantity = 1;
		if($quantity != NULL){
				//$this->inventory_db->insert_inventory($insert_good_recieved);
			$query = $this->inventory_db->get_stock_by_data($insert_good_recieved);
			var_dump($query->result_array());
			/*
			if($query->num_rows() > 0){
				$changed_quantity = $query->row()->quantity + $quantity;
				$this->inventory_db->update_stock_by_data($data, $changed_quantity);
			}
			else{
				$data['quantity'] = $quantity;
				$this->inventory_db->insert_inventory($data);
			}
			*/
			
		}
		//$this->inventory_bl->add_stock_quantity($insert_good_recieved, $quantity);
	}
	
	public function get_purchase_discussion_list()
	{
		$feedback = array(
			"call_status" => "success",
			'purchase_list' => $this->purchase_bl->get_purchase_discussion_list(),
		);
		
		echo json_encode($feedback);
	}
}