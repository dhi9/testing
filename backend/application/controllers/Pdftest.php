<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pdftest extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->library('pdf');
	}
	
	public function index(){
		echo "test";
	}
	
	public function create_pdf($request_reference){
		
		$ActiveRequestDetail = $this->purchase_model->get_active_requests_by_requests_reference($request_reference)->row_array();
		$ActiveRequestVendorDetail = $this->vendor_model->get_vendor_by_id($ActiveRequestDetail['vendor_id'])->row_array();
		$ActiveItemRequestList = $this->purchase_model->get_active_item_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
		$ActiveDeliveryRequestList = $this->purchase_model->get_active_delivery_requests_by_requests_id($ActiveRequestDetail['requests_id'])->result_array();
		
		$data['ActiveRequestDetail'] = $ActiveRequestDetail;
		$data['ActiveRequestVendorDetail'] = $ActiveRequestVendorDetail;
		$data['ActiveItemRequestList'] = $ActiveItemRequestList;
		$data['ActiveDeliveryRequestList'] = $ActiveDeliveryRequestList;
		
		
		$random = random_string('numeric', 3);
		$filename = "REPORT$random - PURCHASE";

		$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
		//if (file_exists($pdfFilePath) == FALSE) {
			ini_set('memory_limit','32M'); 
			$html = $this->load->view('pdf-po', $data, true);
			 
			$this->load->library('pdf');
			$pdf = $this->pdf->load('','A4',9,'dejavusans');
			$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822));
			$pdf->WriteHTML($html); 
			ob_clean();
			$pdf->Output($request_reference.".pdf", 'D');
			//force_download($filename.".pdf","./docs/".$filename.".pdf");
			
		//}
		
	}
	
	
	
	
}
