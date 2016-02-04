<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Deliveryapi extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array(
			'delivery_model', 'order_model', 'customer_model',
			'auditlog_model', 'update_history_model', 'status_model',
			'user_model', 'inventory_bl', 'delivery_db', 'delivery_bl'
		));
	}
	
	public function cancel_delivery()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("FLEETMANAGER")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			// ambil data dari post
			$data = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("deliveryapi","cancel_delivery",$data->deliverydata);
			
			$deliverydata = json_decode($data->deliverydata, true);
			
			$order_id = $this->delivery_model->get_delivery($deliverydata['delivery_id'])->row()->order_id;
			
			if( $this->order_model->is_order_forced_close($order_id) )
			{
				$feedback = array(
					"call_status" => "error",
					"error_code" => "501",
					"error_message" => "Order telah ditutup."
				);
			}
			else
			{
				if( $this->delivery_model->check_actual_loading_date_not_empty($deliverydata['delivery_id']) )
				{
					$feedback = array(
						"call_status" => "error",
						"error_code" => "831",
						"error_message" =>"Pengiriman yang sudah berjalan tidak dapat dibatalkan"
					);
				}
				else
				{
					// update tabel
					$this->delivery_model->cancel_delivery($deliverydata['delivery_id']);
					
					// feedback API
					$feedback = array(
						'call_status' => 'success'
					);
				}
			}
		}
		
		echo json_encode($feedback);
	}
	
	public function cancel_delivery_request()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
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
			// ambil data dari post
			$data = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("deliveryapi","cancel_delivery_request",$data->deliverydata);
			
			$deliverydata = json_decode($data->deliverydata, true);
			
			$order_id = $this->delivery_model->get_delivery_request($deliverydata['delivery_request_id'])->row()->order_id;
			
			if($this->order_model->is_order_forced_close($order_id))
			{
				$feedback = array(
					"call_status" => "error",
					"error_code" => "501",
					"error_message" => "Order telah ditutup."
				);
			}
			else
			{
				if(! $this->delivery_model->is_all_delivery_request_deliveries_not_active($deliverydata['delivery_request_id']) )
				{
					$feedback = array(
						"call_status" => "error",
						"error_code" => "821",
						"error_message" =>"Rencana pengiriman yang mempunyai pengiriman aktif tidak dapat dibatalkan, harap batalkan dulu pengiriman nya"
					);
				}
				else
				{
					$update_history = array(
						'delivery_request_id' => $deliverydata['delivery_request_id'],
						'update_level' => 'R',
						'update_description' => 'Rencana pengiriman dibatalkan'
					);
					$this->update_history_model->insert_update_history($update_history);
					
					// update tabel
					$this->delivery_model->cancel_delivery_request($deliverydata['delivery_request_id']);
					
					// feedback API
					$feedback = array(
						'call_status' => 'success'
					);
				}
			}
		}
		
		echo json_encode($feedback);
	}
	
	public function create_new_delivery()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("FLEETMANAGER")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			// ambil data dari post
			$data = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("deliveryapi","create_new_delivery",$data->deliverydata);
			
			$deliverydata= json_decode($data->deliverydata, true);
			
			if( $this->order_model->is_order_forced_close($deliverydata['order_id']) )
			{
				$feedback = array(
					"call_status" => "error",
					"error_code" => "501",
					"error_message" => "Order telah ditutup."
				);
			}
			else
			{
				$order = $this->order_model->get_order($deliverydata['order_id'])->row();
				$customer_id = $order->customer_id;
				
				if($this->customer_model->is_customer_credit_blocked($customer_id))
				{
					$feedback = array(
						"call_status" => "error",
						"error_code" => "801",
						"error_message" =>"Customer credit blocked."
					);
				}
				else
				{
					// masukin ke database kalau alamatnya baru
					if(isset($deliverydata['is_new_address']) == 1)
					{
						$array_address = array(
							'customer_id' => $customer_id,
							'delivery_address' => $deliverydata['delivery_address'],
							'description' => $deliverydata['delivery_address_description']
						);
						$deliverydata['delivery_address_id'] = $this->customer_model->insert_delivery_address($array_address);
					}
					
					// masukin data delivery
					$array_delivery = array(
						"order_id" => $deliverydata['order_id'],
						"delivery_request_id" => $deliverydata['delivery_request_id'],
						"delivery_address_id" => $deliverydata['delivery_address_id'],
						"loading_date" => $deliverydata['requested_delivery_date'],
						"reciever" => $deliverydata['reciever'],
						//"vendor_id" => $deliverydata['vendor_id'],
						//"delivery_provider" => $deliverydata['delivery_provider'],
						//"delivery_source" => $deliverydata['delivery_source'],
						//"truck_code" => $deliverydata['truck_code'],
						"driver_name" => $deliverydata['driver_name'],
						"notes" => $deliverydata['notes'],
						"status" => $deliverydata['status']
					);
					
					if($order->special_request == 1)
					{
						$array_delivery['special_request'] = 1;
					}
					else
					{
						$array_delivery['special_request'] = 0;
					}
					
					$delivery_id = $this->delivery_model->insert_delivery($array_delivery);
					
					$update_history = array(
						'order_id' => $deliverydata['order_id'],
						'delivery_request_id' => $deliverydata['delivery_request_id'],
						'delivery_id' => $delivery_id,
						'update_level' => 'D',
						'update_description' => 'Pengiriman dibuat'
					);
					$this->update_history_model->insert_update_history($update_history);
					$this->delivery_db->change_delivery_request_status($deliverydata['delivery_request_id'], "D");
					
					// masukin data delivery items
					foreach($deliverydata['delivery_request_items'] as $item)
					{
						$array_item = array(
							'delivery_id' => $delivery_id,
							'item_code' => $item['item_code'],
							'quantity_sent' => $item['quantity'],
							'material_type' => $item['material_type'],
							'remark' => $item['remark']
						);
						$this->db->insert('delivery_items', $array_item);
					}
					
					// masukin delivery reference
					
					if ($array_delivery['special_request'] == 1) 
					{
						$delivery_reference = $this->delivery_model->generate_delivery_reference_for_special_request($delivery_id);
					}
					else
					{
						$delivery_reference = $this->delivery_model->generate_delivery_reference($delivery_id);
					}
					
					$this->db->update(
						'deliveries',
						array('delivery_reference' => $delivery_reference),
						array('delivery_id' => $delivery_id)
					);
					
					// feedback API
					$feedback = array(
						'call_status' => 'success',
						'delivery_id' => $delivery_id,
						'delivery_reference' => $delivery_reference
					);
				}
			}
		}
		
		echo json_encode($feedback);
	}
	
	public function create_order_delivery()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("FLEETMANAGER")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			// ambil data dari post
			$data = json_decode(file_get_contents('php://input'));
			
			//$this->auditlog_model->insert_audit_log("deliveryapi","create_new_delivery",$data->deliverydata);
			
			$deliverydata= json_decode($data->deliverydata, true);
			
			if( $this->order_model->is_order_forced_close($deliverydata['order_id']) )
			{
				$feedback = array(
					"call_status" => "error",
					"error_code" => "501",
					"error_message" => "Order telah ditutup."
				);
			}
			else
			{
				$isExist = $this->delivery_model->get_delivery_by_order_id($deliverydata['order_id'])->num_rows();
				if($isExist > 0){
					$feedback = array(
							"call_status" => "error",
							"error_code" => "405",
							"error_message" =>"Delivery Already Exist."
						);
				}else{
					$order = $this->order_model->get_order($deliverydata['order_id'])->row();
					$customer_id = $order->customer_id;
					
					if($this->customer_model->is_customer_credit_blocked($customer_id))
					{
						$feedback = array(
							"call_status" => "error",
							"error_code" => "801",
							"error_message" =>"Customer credit blocked."
						);
					}
					else
					{
						foreach($deliverydata['deliveries'] as $delivery){
							
							// masukin data delivery
							$array_delivery = array(
								"order_id" => $deliverydata['order_id'],
								"delivery_request_id" => $delivery['delivery_request_id'],
								//"delivery_address" => $deliverydata['delivery_address'],
								"loading_date" => $delivery['requested_delivery_date'],
								//"reciever" => $deliverydata['reciever'],
								//"vendor_id" => $deliverydata['vendor_id'],
								//"delivery_provider" => $deliverydata['delivery_provider'],
								//"delivery_source" => $deliverydata['delivery_source'],
								//"truck_code" => $deliverydata['truck_code'],
								//"driver_name" => $deliverydata['driver_name'],
								//"notes" => $deliverydata['notes'],
								"status" => $delivery['status']
							);
							
							if($order->special_request == 1)
							{
								$array_delivery['special_request'] = 1;
							}
							else
							{
								$array_delivery['special_request'] = 0;
							}
							
							$delivery_id = $this->delivery_model->insert_delivery($array_delivery);
							
							$update_history = array(
								'order_id' => $deliverydata['order_id'],
								'delivery_request_id' => $delivery['delivery_request_id'],
								'delivery_id' => $delivery_id,
								'update_level' => 'D',
								'update_description' => 'Pengiriman dibuat'
							);
							$this->update_history_model->insert_update_history($update_history);
							
							// masukin ke database kalau alamatnya baru
							/*
							if($delivery['is_new_address'] == 1)
							{
								$array_address = array(
									'customer_id' => $customer_id,
									'delivery_address' => $delivery['delivery_address']
								);
								$this->customer_model->insert_delivery_address($array_address);
							}
							*/
							
							// masukin data delivery items
							foreach($delivery['delivery_request_items'] as $item)
							{
								$array_item = array(
									'delivery_id' => $delivery_id,
									'item_code' => $item['item_code'],
									'quantity_sent' => $item['quantity'],
									//'material_type' => $item['material_type'],
									'remark' => $item['remark']
								);
								$this->db->insert('delivery_items', $array_item);
							}
							
							// masukin delivery reference
							
							if ($array_delivery['special_request'] == 1) 
							{
								$delivery_reference = $this->delivery_model->generate_delivery_reference_for_special_request($delivery_id);
							}
							else
							{
								$delivery_reference = $this->delivery_model->generate_delivery_reference($delivery_id);
							}
							
							$this->db->update(
								'deliveries',
								array('delivery_reference' => $delivery_reference),
								array('delivery_id' => $delivery_id)
							);
							
							// feedback API
							
						}
						$feedback = array(
							'call_status' => 'success',
							'delivery_id' => $delivery_id,
							'delivery_reference' => $delivery_reference
						);
					}
				}
			}
			
		}
		
		echo json_encode($feedback);
	}
	
	public function get_delivery_detail($delivery_id)
	{  
		if (! $this->user_model->is_user_logged_in()) {
			$return_array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {    
			$delivery = $this->delivery_model->get_delivery($delivery_id)->row_array();
			$delivery_request = $this->delivery_model->get_delivery_requests($delivery['order_id'])->row_array();
			$order = $this->order_model->get_order($delivery['order_id'])->row_array();
			
			$array = array(
				"delivery_id" => $delivery_id,
				"delivery_reference" => $delivery['delivery_reference'],
				"delivery_request_detail" => $delivery_request,
				"order_detail" => $order,
				"customer_detail" => $this->customer_model->get_customer($order['customer_id'])->row_array(),
				"delivery_detail" => $delivery
			);
			
			$array['delivery_request_detail']['delivery_request_items'] = $this->delivery_model->get_delivery_request_items($delivery_request['delivery_request_id'])->result_array();
			
			$array['order_detail']['order_items'] = $this->order_model->get_order_items($delivery['order_id'])->result_array();
			
			$array['delivery_detail']['delivery_items'] = $this->delivery_model->get_delivery_items($delivery_id)->result_array();
			
			$return_array = array(
					"call_status" => "success",
					"delivery" => $array
			);
		}
		
		echo json_encode($return_array);
	}
	
	public function get_delivery_detail_by_reference($reference)
	{  
		if (! $this->user_model->is_user_logged_in()) {
			$return_array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {    
			$delivery = $this->delivery_model->get_delivery_by_reference($reference)->row_array();
			$delivery_request = $this->delivery_model->get_delivery_requests($delivery['order_id'])->row_array();
			$order = $this->order_model->get_order($delivery['order_id'])->row_array();
			$delivery_id = $delivery['delivery_id'];
			$array = array(
				"delivery_id" => $delivery_id,
				"delivery_reference" => $delivery['delivery_reference'],
				"delivery_request_detail" => $delivery_request,
				"order_detail" => $order,
				"customer_detail" => $this->customer_model->get_customer($order['customer_id'])->row_array(),
				"delivery_detail" => $delivery
			);
			
			$array['delivery_request_detail']['delivery_request_items'] = $this->delivery_model->get_delivery_request_items($delivery_request['delivery_request_id'])->result_array();
			
			$array['order_detail']['order_items'] = $this->order_model->get_order_items($delivery['order_id'])->result_array();
			
			$array['delivery_detail']['delivery_items'] = $this->delivery_model->get_delivery_items($delivery_id)->result_array();
			
			$return_array = array(
					"call_status" => "success",
					"delivery" => $array,
					"reference" => $reference
			);
		}
		
		echo json_encode($return_array);
	}
	
	public function get_delivery_items_by_delivery_id($delivery_id)
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$array = array(
				"call_status" => "success",
				"delivery_item_list" => $this->delivery_model->get_delivery_items($delivery_id)->result_array()
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_active_deliveries()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$deliveries = $this->delivery_model->get_active_deliveries($data['start_date'], $data['end_date'])->result_array();
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'delivery_list' => $deliveries
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_not_completed_deliveries()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$deliveries = $this->delivery_model->get_not_completed_deliveries($data['start_date'], $data['end_date'])->result_array();
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'delivery_list' => $deliveries
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_completed_deliveries()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$deliveries = $this->delivery_model->get_completed_deliveries($data['start_date'], $data['end_date'])->result_array();
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'delivery_list' => $deliveries
			);
		}
		
		echo json_encode($array);
	}

	public function get_active_deliveries_for_stat()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		else {
			$deliveries = $this->delivery_model->get_active_deliveries()->result_array();
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'delivery_list' => $deliveries
			);
		}
		
		echo json_encode($array);
	}
	
	public function insert_delivery_request()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" =>"User not logged on"
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
			// ambil data dari post
			$data = json_decode(file_get_contents('php://input'));
				
			$this->auditlog_model->insert_audit_log("deliveryapi","insert_delivery_request",$data->deliverydata);
				
			$deliverydata = json_decode($data->deliverydata, true);
				
			if($this->order_model->is_order_forced_close($deliverydata['order_id']))
			{
				$feedback = array(
						"call_status" => "error",
						"error_code" => "501",
						"error_message" => "Order telah ditutup."
				);
			}
			else
			{
				$input = array(
						'order_id' => $deliverydata['order_id'],
						'requested_delivery_date' => $deliverydata['requested_delivery_date'],
						'requested_delivery_address' => $deliverydata['requested_delivery_address'],
						'status' => 'A'
				);
	
				// masukkkan ke tabel
				$delivery_request_id = $this->delivery_model->insert_delivery_requests($input);
	
				$update_history = array(
						'delivery_request_id' => $delivery_request_id,
						'update_level' => 'R',
						'update_description' => 'Rencana pengiriman dibuat'
				);
				$this->update_history_model->insert_update_history($update_history);
	
				foreach($deliverydata['delivery_request_items'] as $item)
				{
					$input_item = array(
							'delivery_request_id' => $delivery_request_id,
							'item_code' => $item['item_code'],
							'quantity' => $item['quantity'],
							'material_type' => $item['material_type'],
							'remark' => $item['remark']
					);
						
					$this->db->insert('delivery_request_items', $input_item);
				}
	
				// feedback API
				$feedback = array(
						'call_status' => 'success',
						'delivery_request_id' => $delivery_request_id
				);
			}
		}
	
		echo json_encode($feedback);
	}
	
	public function update_delivery()
	{
		if (! $this->user_model->is_user_logged_in()) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" =>"User not logged on"
			);
		}
		/*
		else if (! $this->user_model->is_user_has_access("FLEETMANAGER")) {
			$feedback = array(
				"call_status" => "error",
				"error_code" => "702",
				"error_message" => "User tidak mempunyai hak untuk melakukan hal ini."
			);
		}
		*/
		else {
			$data['is_actual_loading_date_changed'] = null;
			$data['is_arrival_date_changed'] = null;
			$data['is_confirmation_date_changed'] = null;
			
			// ambil data dari post
			$input = json_decode(file_get_contents('php://input'));
			
			$this->db->trans_start();
			
			$this->auditlog_model->insert_audit_log("deliveryapi","update_delivery",$input->deliverydata);
			
			$data = json_decode($input->deliverydata,true);
			
			$order_id = $this->delivery_model->get_delivery($data['delivery_id'])->row()->order_id;
			
			if( $this->order_model->is_order_forced_close($order_id) )
			{
				$feedback = array(
					"call_status" => "error",
					"error_code" => "501",
					"error_message" => "Order telah ditutup."
				);
			}
			else
			{
				$delivery_id = $data['delivery_id'];
				$old_data = $this->delivery_model->get_delivery($delivery_id)->row_array();
				
				// array untuk update database
				$update = array();
				
				if($data['is_actual_loading_date_changed'] == 1)
				{
					$update['actual_loading_date'] = $data['actual_loading_date'];
					
					$actual_loading_date_old_value = $this->update_history_model->get_old_value('deliveries', 'delivery_id', $data['delivery_id'], 'actual_loading_date');
					
					$update_history = array(
						'delivery_id' => $data['delivery_id'],
						'update_level' => 'D',
						'update_description' => 'Ubah tanggal pemuatan aktual',
						'old_value' => $actual_loading_date_old_value,
						'new_value' => $update['actual_loading_date']
					);
					$this->update_history_model->insert_update_history($update_history);
					
					$this->inventory_bl->subtract_stock_by_delivery($data['delivery_id'], $data['actual_loading_date']);
				}
				
				if($data['is_arrival_date_changed'] == 1)
				{
					$update['arrival_date'] = $data['arrival_date'];
					
					$arrival_date_old_value = $this->update_history_model->get_old_value('deliveries', 'delivery_id', $data['delivery_id'], 'arrival_date');
					
					$update_history = array(
						'delivery_id' => $data['delivery_id'],
						'update_level' => 'D',
						'update_description' => 'Ubah tanggal pengiriman tiba',
						'old_value' => $arrival_date_old_value,
						'new_value' => $update['arrival_date']
					);
					$this->update_history_model->insert_update_history($update_history);
				}
				
				if($data['is_confirmation_date_changed'] == 1)
				{
					$update['confirmation_date'] = $data['confirmation_date'];
					
					$confirmation_date_old_value = $this->update_history_model->get_old_value('deliveries', 'delivery_id', $data['delivery_id'], 'confirmation_date');
					
					$update_history = array(
						'delivery_id' => $data['delivery_id'],
						'update_level' => 'D',
						'update_description' => 'Ubah tanggal surat jalan kembali',
						'old_value' => $confirmation_date_old_value,
						'new_value' => $update['confirmation_date']
					);
					$this->update_history_model->insert_update_history($update_history);
				}
				
				if (!empty($update))
				{
					$update['date_updated'] = date("Y-m-d H:i:s");
					
					// update production date
					$this->db->update(
						'deliveries',
						$update,
						array('delivery_id' => $data['delivery_id'])
					);
				}
				
				$update_history = array(
					'delivery_id' => $data['delivery_id'],
					'update_level' => 'O',
					'update_description' => 'Ubah informasi pengiriman barang'
				);
				$this->update_history_model->insert_update_history($update_history);
				
				foreach($data['delivery_items'] as $item)
				{
					$update_item = array(
							'material_type' => $item['material_type'],
							'remark' => $item['remark'],
							'quantity_sent' => $item['quantity_sent'],
							'quantity_sent_actual' => $item['quantity_sent_actual'],
							'quantity_received' => $item['quantity_received'],
							'explaination_type' => $item['explaination_type'],
							'explaination_description' => $item['explaination_description']
					);
					
					$this->db->update(
							'delivery_items',
							$update_item,
							array('delivery_item_id' => $item['delivery_item_id'])
							);
				}
				
				$this->status_model->compute_new_status_DELIVERY($data['delivery_id'], $data['delivery_items']);
				$this->status_model->compute_new_status_DELIVERY_REQUEST($old_data['delivery_request_id']);
				$this->status_model->compute_new_status_ORDER($old_data['order_id']);
				
				// feedback API
				$feedback = array(
					'call_status' => 'success'
				);
			}
			
			$this->db->trans_complete();
		}
		
		echo json_encode($feedback);
	}
	
	public function get_delivery_request_list()
	{
		$feedback = array(
			'call_status' => 'success',
			'delivery_request_list' => $this->delivery_bl->get_delivery_request_list(),
		);
		echo json_encode($feedback);
	}
	
	public function get_delivery_request_by_id($delivery_request_id)
	{
		$feedback = array(
			'call_status' => 'success',
			'delivery_request' => $this->delivery_bl->get_delivery_request_by_id($delivery_request_id),
		);
		echo json_encode($feedback);
	}
}
