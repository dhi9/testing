<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reportapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('delivery_model','user_model', 'stock_movement_bl', 'stock_movement_db', 'site_db'));
	}
	
	public function get_delivery_report()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("REPORT")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$report = $this->delivery_model->get_delivery_report($data['start_date'], $data['end_date'])->result_array();
			
			foreach($report as &$row)
			{
				$quantity = $this->delivery_model->count_delivery_quantity($row['delivery_id'])->row_array();
				
				$row['quantity_sent_actual'] = $quantity['quantity_sent_actual'];
				$row['quantity_received'] = $quantity['quantity_received'];	
			}
			
			$feedback = array(
				"call_status" => "success",
				'report' => $report
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_travel_letter_report()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("REPORT")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$report = $this->delivery_model->get_travel_letter_report($data['start_date'], $data['end_date'])->result_array();
			
			$feedback = array(
				"call_status" => "success",
				'report' => $report
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_on_time_delivery_report()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("REPORT")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$report = $this->delivery_model->get_on_time_delivery_report($data['start_date'], $data['end_date'])->result_array();
			
			foreach($report as &$row)
			{
				$datetime1 = date_create($row['requested_delivery_date']);
				$datetime2 = date_create($row['confirmation_date']);
				$interval = date_diff($datetime1, $datetime2);
				$row['otd_duration'] = $interval->format('%a');
				
				if($row['otd_duration'] == 0)
				{
					$row['otd'] = 'OT';
					$row['otd_percent'] = 100;
				}
				else
				{
					$row['otd'] = 'LT';
					$row['otd_percent'] = 0;
				}
			}
			
			$feedback = array(
				"call_status" => "success",
				'report' => $report
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function get_stock_report()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("REPORT")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$data = json_decode(file_get_contents('php://input'), true);
			
			//$movements_code = $this->stock_movement_db->get_movement_code_list()->result_array();
			
			$data['searchDateFrom'] = date('Y-m-d', strtotime($data['searchDateFrom'] . " +1 days")).' 00:00:00';
			$data['searchDateTo'] = date('Y-m-d', strtotime($data['searchDateTo'] . " +1 days")).' 23:59:59';
			//$data['searchDateTo'] = date('Y-m-d',strtotime($data['searchDateTo'] . " +1 days"));
			
			$stock = $this->stock_movement_bl->get_stock_report($data);
			
			$group_stock = $this->stock_movement_db->get_group_stock_movement_list_by_search($data)->result_array();
			
			$countQuantityStock = $this->stock_movement_db->get_sum_stock_movement_list_by_search($data)->result_array();
			
			$regroup_stock = array();
			$result = array();
			
			foreach($group_stock as $g){
				$group_array = array(
					"item_code" => $g['item_code'],
					"attributes" => $g['attributes'],
					"uom" => $g['uom'],
					"items" => array(),
					"quantity_start" => 0,
					"quantity_end" => 0
				);
				foreach($countQuantityStock as $gg){
					if($g['item_code'] == $gg['item_code'] && $g['attributes'] == $gg['attributes']){
						$group_array['quantity_start'] += intval($gg['VGR1']);
						$group_array['quantity_start'] += intval($gg['VPS1']);
					}
				}
				array_push($regroup_stock, $group_array);
			}
			
			foreach($regroup_stock as $gs){
				$stock_array = array(
					"item_code" => $gs['item_code'],
					"attributes" => $gs['attributes'],
					"uom" => $gs['uom'],
					"items" => array(),
					"quantity_start" => $gs['quantity_start'],
					"quantity_end" => 0
				);
				foreach($stock as $s){
					if($stock_array['item_code'] == $s['item_code']
					   && $stock_array['attributes'] == $s['attributes']){
						$movements_code = array("VGR1", "VPS1");
						if (in_array($s['type'], $movements_code)){
							$stock_array['quantity_end'] += intval($s['base_uom_quantity']);
						}else{
							$stock_array['quantity_end'] -= intval($s['base_uom_quantity']);
						}
						array_push($stock_array['items'], $s);
					}
				}
				$stock_array['quantity_end'] += $stock_array['quantity_start'];
				array_push($result, $stock_array);
			}
			$site = $this->site_db->get_site_by_id($data['searchSite'])->row_array();
			$feedback = array(
				"call_status" => "success",
				"result" => $result,
				"report" => array("site" => $site, "date_from" => $data['searchDateFrom'], "date_to" => $data['searchDateTo'])
			);
		}
		
		echo json_encode($feedback);
	}
	
	public function export_stock_report(){
		
		//$data = file_get_contents('php://input');
		if(isset($_POST['json'])){
			$data = json_decode($_POST['json'], true);
			//$data = json_decode($string_json, true);
			//$random = random_string('numeric', 3);
			$filename = "STOCK REPORT - ".$data['report']['site']['site_reference'];
			//$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
			//if (file_exists($pdfFilePath) == FALSE) {
				//ini_set('memory_limit','32M'); 
				$html = $this->load->view('pdf-stock-report', $data, true);
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
		
	}
}