<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Purchase_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('purchase_db', 'inventory_bl', 'vendor_db'));
	}
	
	public function approve_draft_purchase_item($data)
	{
		$insert_purchase = array(
			'vendor_id' => $data['supplier_id'],
			'currency' => $data['currency'],
			'approver_id' => $this->session->userdata('user_id'),
			'requests_creator' => $data['draft_creator'],
			'requests_reference' => $data['draft_reference'],
			'supplier_email' => $data['supplier_email'],
			'type' => 'PR',
			'status' => 'P'
		);
		$requests_id = $this->purchase_db->insert_purchase($insert_purchase);
		
		foreach($data['item_request_list'] as $item_request) {
			$insert_purchase_item_request = array(
				'requests_id' => $requests_id,
				'item_code' => $item_request['item_code'],
				'quantity' => $item_request['quantity'],
				'item_unit' => $item_request['item_unit'],
				'remark' => @$item_request['remark'],
				'cost' => $item_request['cost'],
			);
			$this->purchase_db->insert_purchase_item($insert_purchase_item_request);
		}
			
		foreach($data['delivery_request_list'] as $delivery_request) {
			$insert_purchase_delivery_request = array(
				'requests_id' => $requests_id,
				'warehouse_id' => $delivery_request['warehouse_id'],
				'remark' => $delivery_request['remark'],
				'requested_date' => date($delivery_request['date']),
				'status' => 'A'
			);
			$requests_delivery_request_id = $this->purchase_db->insert_purchase_delivery_request($insert_purchase_delivery_request);

			foreach($delivery_request['item_delivery_request_list'] as $item_delivery_request) {
				$insert_item_delivery_request = array(
					'requests_delivery_request_id' => $requests_delivery_request_id,
					'item_code' => $item_delivery_request['item_code'],
					'quantity' => $item_delivery_request['quantity'],
					'item_unit' => $item_delivery_request['item_unit'],
				);
				$this->purchase_db->insert_purchase_delivery_request_item($insert_item_delivery_request);
			}
		}
			
		$update_draft = array(
			'draft_reference' => $data['draft_reference'],
			'status' => 'P'
		);
		$this->purchase_db->update_draft_purchase_by_reference($data['draft_reference'], $update_draft);
	}
	
	public function approve_draft_purchase_service($data)
	{
		$insert_purchase = array(
			'vendor_id' => $data['supplier_id'],
			'currency' => $data['currency'],
			'approver_id' => $this->session->userdata('user_id'),
			'requests_creator' => $data['draft_creator'],
			'requests_reference' => $data['draft_reference'],
			'supplier_email' => $data['supplier_email'],
			'type' => 'SR',
			'status' => 'P'
		);
		$requests_id = $this->purchase_db->insert_purchase($insert_purchase);
			
		foreach($data['item_request_list'] as $item_request) {
			$insert_purchase_item_request = array(
				'requests_id' => $requests_id,
				'service_name' => $item_request['item_name'],
				'quantity' => $item_request['quantity'],
				'remark' => @$item_request['remark'] ? : '',
				'cost' => $item_request['cost'],
			);
			$this->purchase_db->insert_purchase_service($insert_purchase_item_request);
		}
			
		foreach($data['delivery_request_list'] as $delivery_request) {
			$insert_purchase_delivery_request = array(
				'requests_id' => $requests_id,
				'warehouse_id' => $delivery_request['warehouse_id'],
				'remark' => $delivery_request['remark'],
				'requested_date' => date($delivery_request['date']),
				'status' => 'A'
			);
			$requests_delivery_request_id = $this->purchase_db->insert_purchase_delivery_request($insert_purchase_delivery_request);
		}
			
		$update_draft = array(
			'draft_reference' => $data['draft_reference'],
			'status' => 'P'
		);
		echo $this->purchase_db->update_draft_purchase_by_reference($data['draft_reference'], $update_draft);
	}
	
	public function insert_draft_purchase_item($json, $data)
	{
		$insert = array(
			'draft_creator' => $this->session->userdata('user_id'),
			'draft_data' => $json,
			'draft_approver' =>$data['approver_id'],
			'type' => 'P',
			'status' => $data['status'],
		);
		$draft_id = $this->purchase_db->insert_draft_requests($insert);
		
		$draft_reference = $this->purchase_bl->generate_draft_reference($draft_id, 'P');
		
		$update = array(
			'draft_id' => $draft_id,
			'draft_reference' => $draft_reference
		);
		$this->purchase_model->update_draft_order($update);
		
		return $draft_reference;
	}
	
	public function insert_draft_purchase_service($data, $json)
	{
		$insert = array(
			'draft_creator' => $this->session->userdata('user_id'),
			'draft_data' => $json,
			'draft_approver' =>$data['approver_id'],
			'type' => 'S',
			'status' => $data['status'],
		);
		$draft_id = $this->purchase_model->insert_draft_requests($insert);
		
		$draft_reference = $this->purchase_model->generate_draft_reference($draft_id, 'S');
		
		$update = array(
			'draft_id' => $draft_id,
			'draft_reference' => $draft_reference
		);
		$this->purchase_model->update_draft_order($update);
		
		return $draft_reference;
	}
	
	public function change_good_received_format($data)
	{
		$actual_good_received = array();
		
		foreach ($data as $goodRecieved){
			if(!empty($goodRecieved['auto_batch']) && ($goodRecieved['auto_batch'] == true)){
				$base_uom_quantity = $this->item_bl->convert_to_base_uom_quantity($goodRecieved['item_code'], $goodRecieved['quantity'], $goodRecieved['item_unit']);
				
				$count = 1;
				while($base_uom_quantity > 0){
					$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
					$insert_batch['batch_reference'] = $goodRecieved['mass_batch_reference'].$sequence;
					
					if($base_uom_quantity < $goodRecieved['batch_limit']){
						$goodRecieved['quantity'] = $base_uom_quantity;
					}
					else{
						$goodRecieved['quantity'] = $goodRecieved['batch_limit'];
					}
					
					array_push($actual_good_received, $goodRecieved);
					
					$count++;
					$base_uom_quantity -= $goodRecieved['batch_limit'];
				}
			}
			else{
				array_push($actual_good_received, $goodRecieved);
			}
		}
		
		return $actual_good_received;
	}
	
	public function insert_purchase_delivery_items($data)
	{
		$gr = array();
		
		foreach($data as $good_received){
			$query_batch = $this->purchase_db->get_batch_by_reference($good_received['batch_reference']);
			if($query_batch->num_rows() > 0){
				$batch_id = $query_batch->row()->batch_id;
			}
			else{
				$insert_batch = array(
					'batch_reference' => @$good_received['batch_reference'],
					'item_code' => @$good_received['item_code'],
					'production_date' => @$good_received['production_date'],
					'expired_date' => @$good_received['expired_date'],
					'good_receive_date' => @$good_received['date_recieved'],
					'remark' => @$good_received['remark'],
				);
				$batch_id = $this->purchase_db->insert_batch($insert_batch);
			}
			
			$insert_good_recieved = array(
				'requests_delivery_request_id' => $good_received['requests_delivery_request_id'],
				'item_code' => $good_received['item_code'],
				'item_unit' => $good_received['item_unit'],
				'quantity' => $good_received['quantity'],
				'date_recieved' => $good_received['date_recieved'],
				'site_id' => @$good_received['site_id'],
				'storage_id' => @$good_received['storage_id'],
				'bin_id' => @$good_received['bin_id'],
				'batch_id' => @$batch_id,
				'attributes' => $this->purchase_bl->array_to_cb($good_received['attributes']),
				'remark' => @$good_received['remark'],
			);
			$purchase_delivered_item_id = $this->purchase_db->insert_delivered_items($insert_good_recieved);
			
			$this->inventory_bl->add_stock_quantity($insert_good_recieved, $good_received['quantity']);
			
			$insert_good_recieved['attributes'] = $good_received['attributes'];
			array_push($gr, $insert_good_recieved);
			
			$purchase = $this->purchase_db->get_purchase_by_purchase_delivery_request_id($good_received['requests_delivery_request_id'])->row_array();
			$base_uom_quantity = $this->item_bl->convert_to_base_uom_quantity($good_received['item_code'], $good_received['quantity'], $good_received['item_unit']);
			
			$insert_stock_movement = array(
				'item_code' => $good_received['item_code'],
				//'document_number' => 'D',
				'document_reference' => $purchase['requests_reference'],
				'site_id' => @$good_received['site_id'],
				'storage_id' => @$good_received['storage_id'],
				'bin_id' => @$good_received['bin_id'],
				'batch_id' => @$batch_id,
				'attributes' => $this->purchase_bl->array_to_cb($good_received['attributes']),
				'remark' => @$good_received['remark'],
				'posting_date' => $good_received['date_recieved'],
				'quantity' => $good_received['quantity'],
				'uom' => $good_received['item_unit'],
				'base_uom_quantity' => $base_uom_quantity,
				//'email' => ,
				'type' => 'VGR1',
				//'price' => ,
			);
			$this->stock_movement_db->insert_stock_movement($insert_stock_movement);
		}
		
		return $gr;
	}
	
	public function generate_draft_reference($draft_id, $type)
	{
		$query_draft = $this->purchase_db->get_draft_purchase_by_id($draft_id);
		
		if($query_draft->num_rows() > 0)
		{
			$date_created = $query_draft->row()->date_created;
			$date = date('Y-m-d', strtotime($date_created));
		}
		else
		{
			$date = date('Y-m-d');
		}
		
		$initial_date = $date.' 00:00:00';
		
		$query = $this->purchase_db->get_draft_purchase_by_date_created_range($initial_date, $date_created, $type);
		$company = $this->company_db->get_company()->row_array();
		$count = $query->num_rows();
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		if($type = "P"){
			$prefix = $company['order_po_prefix'];
		}else{
			$prefix = $company['order_so_prefix'];
		}
		$draft_reference = $prefix.'_'.$date.'-'.$sequence;
		
		$data = array(
			'draft_reference' => $draft_reference
		);
		
		/*$this->db->where('draft_id', $draft_id);
		$this->db->update('draft_requests', $data);*/
		$this->purchase_db->update_draft_purchase_by_id($draft_id, $data);
		
		return $draft_reference;
	}
	
	public function generate_pdf(){
		$random = random_string('numeric', 3);
		$filename = "REPORT$random - PURCHASE";
		$result = $this->purchase_model->get_users_list();           
		$data['purchases'] = $result;
		// As PDF creation takes a bit of memory, we're saving the created file in /downloads/reports/
		$pdfFilePath = FCPATH."/docs/".$filename.".pdf";
		$data['page_title'] = 'REPORT'; // pass data to the view
		
		if (file_exists($pdfFilePath) == FALSE)
		{
			ini_set('memory_limit','32M'); // boost the memory limit if it's low <img class="emoji" draggable="false" alt="ðŸ˜‰" src="https://s.w.org/images/core/emoji/72x72/1f609.png">
			$html = $this->load->view('pdf', $data, true); // render the view into HTML
			 
			$this->load->library('pdf');
			$pdf = $this->pdf->load('','A4',9,'dejavusans');
			$pdf->SetFooter('WVI'.'|{PAGENO}|'.date(DATE_RFC822)); // Add a footer for good measure <img class="emoji" draggable="false" alt="ðŸ˜‰" src="https://s.w.org/images/core/emoji/72x72/1f609.png">
			$pdf->WriteHTML($html); // write the HTML into the PDF
			$pdf->Output($pdfFilePath, 'F'); // save to file because we can
		}
		return $filename;
	}
	
	public function send_email($to, $cc, $pdf)
	{
		$this->load->library('email');
		$this->email->from('test@waveconsulting.co.id', 'TEST REPORT PDF');
		$this->email->to($to);
		$this->email->cc($cc); 
		$this->email->subject('subject');
		$this->email->message("content.");
		if($pdf !=0){
			$this->email->attach('docs/'.$pdf.'.pdf');	
		}
		$this->email->send();
	}
	
	public function add_inventory_stock($data)
	{
		$query = $this->purchase_db->get_inventory_stock_by_data($data);
		
		if($query->num_rows() > 0){
			$stock = $query->row_array();
			$data['quantity'] = $stock['quantity'] + $data['quantity'];
			$this->purchase_db->update_inventory_stock_by_data($data);
		}
		else{
			$this->purchase_db->insert_inventory_stock($data);
		}
	}
	
	public function subtract_inventory_stock($data)
	{
		$query = $this->purchase_db->get_inventory_stock_by_data($data);
		
		if($query->num_rows() > 0){
			$stock = $query->row_array();
			$data['quantity'] = $stock['quantity'] - $data['quantity'];
			$this->purchase_db->update_inventory_stock_by_data($data);
		}
		else{
			$this->purchase_db->insert_inventory_stock($data);
		}
	}
	
	public function json_to_cc($json)
	{
		$str = str_replace("{", "", $json);
		$str = str_replace("}", "", $str);
		$str = str_replace(":", ",", $str);
		return $str;
	}
	
	public function json_to_cb($json)
	{
		$array = json_decode($json, true);
		
		$test = array();
		foreach($array as $key => $value){
			array_push($test, $key, $value);
		}
		
		return "'".implode("','", $test)."'";
	}
	
	public function array_to_cb($array)
	{
		$test = array();
		foreach($array as $key => $value){
			array_push($test, $key, $value);
		}
		
		return "'".implode("','", $test)."'";
	}
	
	public function get_purchase_discussion_list()
	{
		$purchase_list = $this->purchase_db->get_purchase_discussion_list()->result_array();
		
		foreach($purchase_list as &$purchase){
			$draft = json_decode($purchase['draft_data'], true);
			
			$purchase['vendor'] = $this->vendor_db->get_vendor_by_id($draft['supplier_id'])->row_array();
		}
		
		return $purchase_list;
	}
	
	public function get_this_year_purchase_total_price()
	{
		$purchase_list = $this->purchase_db->get_this_year_purchase_list()->result_array();
		
		$item_total_price = 0;
		$service_total_price = 0;
		foreach($purchase_list as $purchase){
			if($purchase['type'] == 'PR'){
				$item_price = $this->purchase_bl->get_purchase_total_price_by_id($purchase['requests_id']);
				$item_total_price += $item_price;
			}
			else{
				$service_price = $this->purchase_bl->get_purchase_total_price_by_id($purchase['requests_id']);
				$service_total_price += $service_price;
			}
		}
		
		return array($item_total_price, $service_total_price);
	}
	
	public function get_purchase_total_price_by_id($purchase_id)
	{
		$purchase = $this->db
			->where('requests_id', $purchase_id)
		->get('requests')->row_array();
		
		$total_price = 0;
		
		if($purchase['type'] == 'PR'){
			$item_list = $this->db
				->where('requests_id', $purchase_id)
			->get('request_items')->result_array();
			
			foreach($item_list as $item){
				$price = $item['quantity'] * $item['cost'];
				$total_price += $price;
			}
		}
		else{
			$service_list = $this->db
				->where('requests_id', $purchase_id)
			->get('request_services')->result_array();
			
			foreach($service_list as $service){
				$price = $service['quantity'] * $service['cost'];
				$total_price += $price;
			}
		}
		
		return $total_price;
	}
}