<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Orderapi extends CI_Controller {
	
	public function __construct() {
		parent::__construct();
		
		$this->load->model(array(
			'customer_model', 'order_model', 'delivery_model',
			'auditlog_model', 'update_history_model', 'status_model',
			'user_model', 'order_bl', 'inventory_bl', 'delivery_db',
			'purchase_bl', 'item_bl', 'company_db'
		));
	}
	
	public function approve_draft_order() {
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
			$data = json_decode(file_get_contents('php://input'));
			
			$draftdata = json_decode($data->draftdata, true);
			
			$this->auditlog_model->insert_audit_log("orderapi", "create_new_order", $draftdata['draft_data']);
			
			$orderdata = json_decode($draftdata['draft_data'], true);
			
			if(! $this->user_model->is_user_has_department_code($draftdata['product_type']))
			{
				$feedback = array(
						"call_status" => "error",
						//"error_code" => "702",
						"error_message" => "Bukan departemen user."
				);
			}
			else{
				if ($orderdata['customer_input_type'] == "N") {
					// masukin data customer
					$customer_id = $this->customer_model->insert_customer($orderdata['customer_details']);
				} elseif ($orderdata['customer_input_type'] == "U") {
					$this->customer_model->update_customer($orderdata['customer_details']);
					$customer_id = $orderdata['customer_details']['customer_id'];
				} else {
					$customer_id = $orderdata['customer_id'];
				}
	
				// masukin data order
				$array_order = array(
					'customer_id' => $customer_id,
					'product_type' => $draftdata['product_type'],
					'draft_id' => $draftdata['draft_id'],
					'status' => 'N'
				);
	
				if ( isset($orderdata['order_details']['customer_po']) )
				{
					$array_order['customer_po'] = $orderdata['order_details']['customer_po'];
				}
	
				if ( isset($orderdata['order_details']['special_request']) )
				{
					$array_order['special_request'] = $orderdata['order_details']['special_request'];
				}
				else
				{
					$array_order['special_request'] = 0;
				}
	
				$order_id = $this->order_model->insert_order($array_order);
	
				$update_history = array(
						'order_id' => $order_id,
						'update_level' => 'O',
						'update_description' => 'Order dibuat'
				);
				$this->update_history_model->insert_update_history($update_history);
				
				$this->order_bl->insert_order_item_list($order_id, $customer_id, $orderdata['order_details']['order_items']);
				
				// masukin data delivery request
				foreach ($orderdata['delivery_request_details'] as $delivery) {
					$array_delivery = array(
							'order_id' => $order_id,
							'requested_delivery_address' => $delivery['requested_delivery_address'],
							'requested_delivery_date' => date('Y-m-d', strtotime($delivery['requested_delivery_date'])),
							'status' => 'A'
					);
					$delivery_request_id = $this->delivery_model->insert_delivery_requests($array_delivery);
						
					// masukin ke database kalau alamatnya baru
					if ($delivery['is_new_address'] == 1) {
						$array_address = array(
								'customer_id' => $customer_id,
								'delivery_address' => $delivery['requested_delivery_address']
						);
						$this->customer_model->insert_delivery_address($array_address);
					}
						
					// masukin data delivery request items
					foreach ($delivery['requested_delivery_items'] as $delivery_item) {
						$array_delivery_item = array(
								'delivery_request_id' => $delivery_request_id,
								'item_code' => $delivery_item['item_code'],
								'quantity' => $delivery_item['quantity'],
								//'material_type' => $delivery_item['material_type'],
								//'remark' => $delivery_item['remark']
						);
						
						if(isset($delivery_item['material_type'])){
							$array_delivery_item['material_type'] = $delivery_item['material_type'];
						}
						if(isset($delivery_item['remark'])){
							$array_delivery_item['remark'] = $delivery_item['remark'];
						}
						
						if(isset($delivery_item['length_width_height'])){
							if($delivery_item['length_width_height'] != ""){
								$delivery_item['length_width_height'] = str_replace(' ', '', $delivery_item['length_width_height']);
								$delivery_item['length_width_height'] = str_replace('X', 'x', $delivery_item['length_width_height']);
								$delivery_item['length_width_height'] = str_replace('XX', 'x', $delivery_item['length_width_height']);
								$delivery_item['length_width_height'] = str_replace('Xx', 'x', $delivery_item['length_width_height']);
								$delivery_item['length_width_height'] = str_replace('xX', 'x', $delivery_item['length_width_height']);
								$delivery_item['length_width_height'] = str_replace('xx', 'x', $delivery_item['length_width_height']);
								$delivery_item['length_width_height'] = str_replace('.', ',', $delivery_item['length_width_height']);
								$size = explode('x', $delivery_item['length_width_height']);
								
								$array_delivery_item['length'] = $size[0];
								$array_delivery_item['width'] = $size[1];
								$array_delivery_item['height'] = $size[2];
							}
						};
						
						$this->delivery_model->insert_delivery_request_items($array_delivery_item);
					}
				}
	
				if ( isset($orderdata['order_details']['special_request']) && $orderdata['order_details']['special_request'] == 1)
				{
						
					$order_reference = $this->order_model->generate_order_reference_for_special_request($order_id);
				}
				else
				{
					$order_reference = $this->order_model->generate_order_reference($order_id);
				}
	
				$update_draft = array(
						'draft_id' => $draftdata['draft_id'],
						'draft_approver' => $this->session->userdata('user_id'),
						'status' => 'C'
				);
				$this->order_model->update_draft_order($update_draft);
			}
			
			// feedback API
			$feedback = array(
					"call_status" => "success",
					"order_id" => $order_id,
					"order_reference" => $order_reference
			);
		}
	
		echo json_encode($feedback);
	}
	
	public function create_new_order() {
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
			$data = json_decode(file_get_contents('php://input'));
			$this->auditlog_model->insert_audit_log("orderapi", "create_new_order", $data->orderdata);
			
			$orderdata = json_decode($data->orderdata, true);
			
			if ($orderdata['customer_input_type'] == "N") {
				// masukin data customer
				$customer_id = $this->customer_model->insert_customer($orderdata['customer_details']);
			} elseif ($orderdata['customer_input_type'] == "U") {
				$this->customer_model->update_customer($orderdata['customer_details']);
				$customer_id = $orderdata['customer_details']['customer_id'];
			} else {
				$customer_id = $orderdata['customer_id'];
			}
			
			// masukin data order
			$array_order = array(
				'customer_id' => $customer_id,
				'status' => 'N'
			);
			
			if ( isset($orderdata['order_details']['customer_po']) )
			{
				$array_order['customer_po'] = $orderdata['order_details']['customer_po'];
			}
			
			if ( isset($orderdata['order_details']['special_request']) )
			{
				$array_order['special_request'] = $orderdata['order_details']['special_request'];
			}
			else
			{
				$array_order['special_request'] = 0;
			}
			
			$order_id = $this->order_model->insert_order($array_order);
			
			$update_history = array(
				'order_id' => $order_id,
				'update_level' => 'O',
				'update_description' => 'Order dibuat'
			);
			$this->update_history_model->insert_update_history($update_history);
			
			// masukin data order item
			foreach ($orderdata['order_details']['order_items'] as $key) {
				$array_order_item = array(
					'order_id' => $order_id,
					'item_code' => $key['item_code'],
					'quantity' => $key['quantity'],
					'material_type' => $key['material_type'],
					'remark' => $key['remark']
				);
				$this->order_model->insert_order_items($array_order_item);
			}
			
			// masukin data delivery request
			foreach ($orderdata['delivery_request_details'] as $delivery) {
				$array_delivery = array(
					'order_id' => $order_id,
					'requested_delivery_address' => $delivery['requested_delivery_address'],
					'requested_delivery_date' => date('Y-m-d', strtotime($delivery['requested_delivery_date'])),
					'status' => 'A'
				);
				$delivery_request_id = $this->delivery_model->insert_delivery_requests($array_delivery);
				
				// masukin ke database kalau alamatnya baru
				if ($delivery['is_new_address'] == 1) {
					$array_address = array(
						'customer_id' => $customer_id,
						'delivery_address' => $delivery['requested_delivery_address']
					);
					$this->customer_model->insert_delivery_address($array_address);
				}
				
				// masukin data delivery request items
				foreach ($delivery['requested_delivery_items'] as $delivery_item) {
					$array_delivery_item = array(
						'delivery_request_id' => $delivery_request_id,
						'item_code' => $delivery_item['item_code'],
						'quantity' => $delivery_item['quantity'],
						'material_type' => $delivery_item['material_type'],
						'remark' => $delivery_item['remark']
					);
					$this->delivery_model->insert_delivery_request_items($array_delivery_item);
				}
			}
			
			if ( isset($orderdata['order_details']['special_request']) && $orderdata['order_details']['special_request'] == 1)
			{
				
				$order_reference = $this->order_model->generate_order_reference_for_special_request($order_id);
			}
			else
			{
				$order_reference = $this->order_model->generate_order_reference($order_id);
			}
			
			// feedback API
			$feedback = array(
				"call_status" => "success",
				"order_id" => $order_id,
				"order_reference" => $order_reference
			);
		}
		
		echo json_encode($feedback);
	}

	public function delete_draft_order() {
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
			$data = json_decode(file_get_contents('php://input'));
			$draftdata = json_decode($data->draftdata, true);
	
			if($draftdata['approver'])
			{
				$draftdata['draft_approver'] = $this->session->userdata('user_id');
			}
			$draftdata['status'] = 'X';
			$this->order_model->update_draft_order($draftdata);
	
			// feedback API
			$feedback = array(
					"call_status" => "success",
			);
		}
	
		echo json_encode($feedback);
	}
	public function save_order_notes() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
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
			$input = json_decode(file_get_contents('php://input'));

			$data = json_decode($input->orderdata, true);

			$this->order_model->update_order($data);

			$array = array(
					'call_status' => 'success',
					'data' => $data
			);
		}
	
		echo json_encode($array);
	}
	
	public function force_close_order() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
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
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->orderdata, true);
				
			$data['status'] = 'Z';
			$this->order_model->update_order($data);
				
			$delivery_requests = $this->delivery_model->get_delivery_requests_by_order_id($data['order_id'])->result_array();
				
			foreach($delivery_requests as $delivery_request)
			{
				$deliveries = $this->delivery_model->get_deliveries_by_delivery_request_id($delivery_request['delivery_request_id'])->result_array();
	
				foreach($deliveries as $delivery)
				{
					$this->delivery_model->change_delivery_status($delivery['delivery_id'], 'Z');
				}
	
				$this->delivery_model->change_delivery_request_status($delivery_request['delivery_request_id'], 'Z');
			}
				
			$array = array(
					'call_status' => 'success'
			);
		}
	
		echo json_encode($array);
	}
	
	public function get_active_orders() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
			// ambil daftar orders
			$orders = $this->order_model->get_active_orders()->result_array();
			
			// array kosong buat dipush
			$array_orders = array();
			
			foreach ($orders as $order) {
				$min_date = $this->db->select_min('requested_delivery_date')->where('order_id', $order['order_id'])->get('delivery_requests')->row()->requested_delivery_date;
				$num_delivery_requests = $this->db->where('order_id', $order['order_id'])->get('delivery_requests')->num_rows();
				$num_item_types = $this->db->where('order_id', $order['order_id'])->get('order_items')->num_rows();
				$customer = $this->db->where('customer_id', $order['customer_id'])->get('customers')->row_array();
				
				$array_temp = array(
					"order_id" => $order['order_id'],
					"order_reference" => $order['order_reference'],
					"next_requested_delivery_date" => $min_date,
					"no_of_delivery_requests" => $num_delivery_requests,
					"no_of_item_types" => 3,
					"customer_name" => $customer['customer_name'],
					"pic_name" => $customer['pic_name'],
					"date_created" => $order['date_created'],
					"date_modified" => $order['date_modified'],
					"production_completed_date" => $order['production_completed_date'],
					"status" => $order['status']
				);
				
				array_push($array_orders, $array_temp);
			}
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'orders' => $array_orders
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_completed_orders() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$orders = $this->order_model->get_completed_orders($data['start_date'], $data['end_date'])->result_array();
			
			// array kosong buat dipush
			$array_orders = array();
			
			foreach ($orders as $order) {
				$min_date = $this->db->select_min('requested_delivery_date')->where('order_id', $order['order_id'])->get('delivery_requests')->row()->requested_delivery_date;
				$num_delivery_requests = $this->db->where('order_id', $order['order_id'])->get('delivery_requests')->num_rows();
				$num_item_types = $this->db->where('order_id', $order['order_id'])->get('order_items')->num_rows();
				$customer = $this->db->where('customer_id', $order['customer_id'])->get('customers')->row_array();
				
				$array_temp = array(
					"order_id" => $order['order_id'],
					"order_reference" => $order['order_reference'],
					"next_requested_delivery_date" => $min_date,
					"no_of_delivery_requests" => $num_delivery_requests,
					"no_of_item_types" => 3,
					"customer_name" => $customer['customer_name'],
					"pic_name" => $customer['pic_name'],
					"date_created" => $order['date_created'],
					"date_modified" => $order['date_modified'],
					"production_completed_date" => $order['production_completed_date'],
					"status" => $order['status']
				);
				
				array_push($array_orders, $array_temp);
			}
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'orders' => $array_orders,
				'data' => $data
			);
		}
		
		echo json_encode($array);
	}
	public function get_rejected_orders() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$orders = $this->order_model->get_rejected_orders($data['start_date'], $data['end_date'])->result_array();
			
			// array kosong buat dipush
			$array_orders = array();
			
			foreach ($orders as $order) {
				$min_date = $this->db->select_min('requested_delivery_date')->where('order_id', $order['order_id'])->get('delivery_requests')->row()->requested_delivery_date;
				$num_delivery_requests = $this->db->where('order_id', $order['order_id'])->get('delivery_requests')->num_rows();
				$num_item_types = $this->db->where('order_id', $order['order_id'])->get('order_items')->num_rows();
				$customer = $this->db->where('customer_id', $order['customer_id'])->get('customers')->row_array();
				
				$array_temp = array(
					"order_id" => $order['order_id'],
					"order_reference" => $order['order_reference'],
					"next_requested_delivery_date" => $min_date,
					"no_of_delivery_requests" => $num_delivery_requests,
					"no_of_item_types" => 3,
					"customer_name" => $customer['customer_name'],
					"pic_name" => $customer['pic_name'],
					"date_created" => $order['date_created'],
					"date_modified" => $order['date_modified'],
					"production_completed_date" => $order['production_completed_date'],
					"status" => $order['status']
				);
				
				array_push($array_orders, $array_temp);
			}
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'orders' => $array_orders,
				'data' => $data
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_all_orders() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
			$input = json_decode(file_get_contents('php://input'));
			$data = json_decode($input->filterdata, true);
			
			$orders = $this->order_model->get_all_orders($data['start_date'], $data['end_date'])->result_array();
			
			// array kosong buat dipush
			$array_orders = array();
			
			foreach ($orders as $order) {
				$min_date = $this->db->select_min('requested_delivery_date')->where('order_id', $order['order_id'])->get('delivery_requests')->row()->requested_delivery_date;
				$num_delivery_requests = $this->db->where('order_id', $order['order_id'])->get('delivery_requests')->num_rows();
				$num_item_types = $this->db->where('order_id', $order['order_id'])->get('order_items')->num_rows();
				$customer = $this->db->where('customer_id', $order['customer_id'])->get('customers')->row_array();
				
				$array_temp = array(
					"order_id" => $order['order_id'],
					"order_reference" => $order['order_reference'],
					"next_requested_delivery_date" => $min_date,
					"no_of_delivery_requests" => $num_delivery_requests,
					"no_of_item_types" => 3,
					"customer_name" => $customer['customer_name'],
					"pic_name" => $customer['pic_name'],
					"date_created" => $order['date_created'],
					"date_modified" => $order['date_modified'],
					"production_completed_date" => $order['production_completed_date'],
					"status" => $order['status']
				);
				
				array_push($array_orders, $array_temp);
			}
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'orders' => $array_orders,
				'data' => $data
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_order($order_id) {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
			$order = $this->order_model->get_order($order_id)->row_array();
			
			$array = array(
				'call_status' => 'success',
				'order_details' => $order
			);
		}
		
		echo json_encode($array);
	}

	public function get_good_issue_items($order_id) {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
			$gi = $this->order_model->get_good_issue_items($order_id)->result_array();
			if (count($gi)>0) {
				# code...
			}
			for ($i=0; $i < count($gi); $i++) {
				$gi[$i]['uom_list'] = $this->item_db->get_item_uom_conversion_list_by_item_code($gi[$i]['item_code'])->result_array();
				$gi[$i]['is'] = "U";
			}

			$array = array(
				'call_status' => 'success',
				'good_issue_items' => $gi
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_order_detail($order_id) {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
			// ambil data order
			$order_detail = $this->order_model->get_order($order_id)->row_array();
			
			// buat data order items agar sesuai dengan struktur feedback API
			$order_detail['order_items'] = array();
			$order_items = $this->order_bl->get_order_item_list_by_order_id($order_id);
			foreach($order_items as $item){
				$item['uom_list'] = $this->item_db->get_item_uom_conversion_list_by_item_code($item['item_code'])->result_array();
				array_push($order_detail['order_items'], $item);
			}
			$delivery_request_details = $this->delivery_model->get_delivery_requests($order_id)->result_array();
			
			foreach ($delivery_request_details as &$delivery_request_detail) {
				$delivery_request_detail['HLPFIELD_is_edit_mode'] = 0;
				$delivery_request_detail['delivery_request_items'] = array();
				
				$delivery_request_items = $this->delivery_model->get_delivery_request_items($delivery_request_detail['delivery_request_id'])->result_array();
				
				foreach ($delivery_request_items as $delivery_request_item) {
					$array_temp = array(
						'item_code' => $delivery_request_item['item_code'],
						'item_name' => $this->item_model->bl_get_item_name_by_item_code($delivery_request_item['item_code']),
						'item_unit' => $this->item_model->bl_get_item_unit_by_item_code($delivery_request_item['item_code']),
						'quantity' => $delivery_request_item['quantity'],
						'material_type' => $delivery_request_item['material_type'],
						'remark' => $delivery_request_item['remark']
					);
					
					array_push($delivery_request_detail['delivery_request_items'], $array_temp);
				}
				
				$delivery_request_detail['deliveries'] = $this->delivery_model->get_delivery_from_delivery_request($delivery_request_detail['delivery_request_id'])->result_array();
				
				foreach ($delivery_request_detail['deliveries'] as &$delivery_row) {
					if ($delivery_request_detail['deliveries'] != null) {
						$delivery_row['delivery_items'] = $this->delivery_model->get_delivery_items($delivery_row['delivery_id'])->result_array();
					}
				}
			}
			
			$order = array();
			$order['customer_detail'] = $this->customer_model->get_customer($order_detail['customer_id'])->row_array();
			$order['order_detail'] = $order_detail;
			$order['delivery_request_details'] = $delivery_request_details;
			
			// feedback API
			$array = array(
				'call_status' => 'success',
				'order' => $order
			);
		}
		
		echo json_encode($array);
	}
	
	public function get_blocked_orders() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		} else {
			$array = array(
					'call_status' => 'success',
					'order_list' => $this->order_model->get_blocked_orders()->result_array()
			);
		}
	
		echo json_encode($array);
	}
	
	public function get_orders_to_deliver()
	{
		if ( ! $this->user_model->is_user_logged_in() )
		{
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
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
		else
		{
			$result = $this->order_model->get_orders_to_deliver()->result_array();
	
			$feedback = array(
					'call_status' => 'success',
					'orders' => $result
			);
		}
	
		echo json_encode($feedback);
	}
	
	public function get_draft_order_list() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$user_id = $this->session->userdata('user_id');
				/*
			if ($this->user_model->is_user_has_access("SALESAPPROVER")) {
				$sales_departments = $this->user_model->get_user_by_user_id($user_id)->row()->sales_departments;
					
				$department = $this->user_model->sales_departments_to_array_departments($sales_departments);
	
				$draft_list = $this->order_model->get_draft_order_list($department)->result_array();
			}
			else {
				$draft_list = $this->order_model->get_user_draft_order_list($user_id)->result_array();
			}
				*/
				$draft_list = $this->order_model->get_user_draft_order_list($user_id)->result_array();
				
				
			$array = array(
					'call_status' => 'success',
					'draft_list' => $draft_list
			);
				
			echo json_encode($array);
		}
	}
	
	public function get_draft_order_by_draft_id($draft_id) {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$array = array(
					'call_status' => 'success',
					'draft_order' => $this->order_model->get_draft_order_by_draft_id($draft_id)->row_array()
			);
			/*
			if ($this->user_model->is_user_has_access("SALESAPPROVER"))
			{
				$array['draft_order']['approver'] = true;
			}
			else{
				$array['draft_order']['approver'] = false;
			}
			*/
			$array['draft_order']['approver'] = true;
			echo json_encode($array);
		}
	}
	public function get_draft_order_cart_list() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$user_id = $this->session->userdata('user_id');
				
			$draft_list = $this->order_model->get_draft_order_cart_list($user_id)->result_array();
			$array = array(
					'call_status' => 'success',
					'draft_list' => $draft_list
			);
				
			echo json_encode($array);
		}
	}
	public function get_draft_order_cart_by_draft_id($draft_id) {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$data = $this->order_model->get_draft_order_cart_by_draft_id($draft_id)->row_array();
			$draft_data = $data['draft_data'];
			$array = array(
					'call_status' => 'success',
					'draft_order' => $data,
					'order' => $draft_data
			);
			/*
			if ($this->user_model->is_user_has_access("SALESAPPROVER"))
			{
				$array['draft_order']['approver'] = true;
			}
			else{
				$array['draft_order']['approver'] = false;
			}
			*/
			$array['draft_order']['approver'] = true;
			echo json_encode($array);
		}
	}
	public function get_own_draft_order_list() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$user_id = $this->session->userdata('user_id');
				
			$draft_list = $this->order_model->get_user_draft_order_list($user_id)->result_array();
				
			$array = array(
					'call_status' => 'success',
					'draft_list' => $draft_list
			);
				
			echo json_encode($array);
		}
	}
	
	public function get_own_active_draft_order_list() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$user_id = $this->session->userdata('user_id');
				
			$draft_list = $this->order_model->get_user_active_draft_order_list($user_id)->result_array();
				
			$array = array(
					'call_status' => 'success',
					'draft_list' => $draft_list
			);
				
			echo json_encode($array);
		}
	}
	
	public function get_own_changed_draft_order_list() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$user_id = $this->session->userdata('user_id');
				
			$draft_list = $this->order_model->get_user_changed_draft_order_list($user_id)->result_array();
				
			$array = array(
					'call_status' => 'success',
					'draft_list' => $draft_list
			);
				
			echo json_encode($array);
		}
	}
	
	public function get_department_draft_order_list() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
					"call_status" => "error",
					"error_code" => "701",
					"error_message" => "User not logged on"
			);
		}
		else {
			$user_id = $this->session->userdata('user_id');
			
			/*
			if (! $this->user_model->is_user_has_access("SALESAPPROVER")) {
				$draft_list = array();
			}
			else {
			*/
				$sales_departments = $this->user_model->get_user_by_user_id($user_id)->row()->sales_departments;
	
				$department = $this->user_model->sales_departments_to_array_departments($sales_departments);
	
				$draft_list = $this->order_model->get_draft_order_list()->result_array();
			//  }
				
			$array = array(
					'call_status' => 'success',
					'draft_list' => $draft_list
			);
				
			echo json_encode($array);
		}
	}
	
	public function update_production_dates() {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_message" => "User not logged on"
			);
		} else {
			$this->auditlog_model->insert_audit_log("orderapi", "update_production_dates", file_get_contents('php://input'));
			
			// ambil data dari post
			$data = json_decode(file_get_contents('php://input'), true);
			
			// update production date
			$this->db->update(
				'orders',
				array(
					"production_start_date" => $data['production_start_date'],
					"production_completed_date" => $data['production_completed_date']
				),
				array('order_id' => $data['order_id'])
			);
			
			$this->status_model->compute_new_status_ORDER($data['order_id']);
			
			// feedback API
			$array = array(
				'call_status' => 'success'
			);
		}
		
		echo json_encode($array);
	}
	
	public function update_draft_order() {
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
			$data = json_decode(file_get_contents('php://input'));
			$draftdata = json_decode($data->draftdata, true);
				
			if($draftdata['approver'])
			{
				$draftdata['draft_approver'] = $this->session->userdata('user_id');
				$draftdata['status'] = 'A';
			}
			else
			{
				$draftdata['status'] = 'A';
			}
			$this->order_model->update_draft_order($draftdata);
				
			// feedback API
			$feedback = array(
					"call_status" => "success",
			);
		}
	
		echo json_encode($feedback);
	}
	
	public function update_order() {
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
			$this->db->trans_start();
			
			$data['is_production_start_date_changed'] = null;
			$data['is_production_completed_date_changed'] = null;
			
			// ambil data dari post
			$input = json_decode(file_get_contents('php://input'));
			
			$this->auditlog_model->insert_audit_log("orderapi", "update_order", $input->orderdata);
			
			$data = json_decode($input->orderdata, true);
			
			if($this->order_model->is_order_forced_close($data['order_id']))
			{
				$feedback = array(
					"call_status" => "error",
					"error_code" => "501",
					"error_message" => "Order telah ditutup."
				);
			}
			else
			{
				// array untuk update database
				$update = array();
				$isComplete = FALSE;
				if ($data['is_production_start_date_changed'] == 1) {
					$update['production_start_date'] = $data['production_start_date'];
					
					$production_start_date_old_value = $this->update_history_model->get_old_value('orders', 'order_id', $data['order_id'], 'production_start_date');
					
					$update_history = array(
						'order_id' => $data['order_id'],
						'update_level' => 'O',
						'update_description' => 'Ubah tanggal mulai produksi',
						'old_value' => $production_start_date_old_value,
						'new_value' => $update['production_start_date']
					);
					$this->update_history_model->insert_update_history($update_history);
					
				}
				
				if ($data['is_production_completed_date_changed'] == 1) {
					$update['production_completed_date'] = $data['production_completed_date'];
					$isComplete = TRUE;
					$production_completed_date_old_value = $this->update_history_model->get_old_value('orders', 'order_id', $data['order_id'], 'production_completed_date');
					
					$update_history = array(
						'order_id' => $data['order_id'],
						'update_level' => 'O',
						'update_description' => 'Ubah tanggal selesai produksi',
						'old_value' => $production_completed_date_old_value,
						'new_value' => $update['production_completed_date']
					);
					$this->update_history_model->insert_update_history($update_history);
					
					$this->inventory_bl->add_stock_by_order($data['order_id'], $data['production_completed_date']);
				}
				
				// update production date
				$this->db->update(
					'orders', $update, array('order_id' => $data['order_id'])
				);
				
				$this->status_model->compute_new_status_ORDER($data['order_id']);
				
				// feedback API
				$feedback = array(
					'call_status' => 'success',
					'is_order_complete' => $isComplete
				);
			}
			
			$this->db->trans_complete();
		}
		
		echo json_encode($feedback);
	}
	
	public function update_good_issue() {
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
			//$this->db->trans_start();
			
			// ambil data dari post
			$input = json_decode(file_get_contents('php://input'));
			
			//$this->auditlog_model->insert_audit_log("orderapi", "update_order", $input->orderdata);
			
			$data = json_decode($input->orderdata, true);
			
			if($this->order_model->is_order_forced_close($data['order_id']))
			{
				$feedback = array(
					"call_status" => "error",
					"error_code" => "501",
					"error_message" => "Order telah ditutup."
				);
			}
			else
			{
				foreach ($data['items'] as $gi) {
					if($gi['is'] == "U"){
						$update = array(
							'order_item_delivery_id' => $gi['order_item_delivery_id'],
							'order_id' => $gi['order_id'],
							'item_code' => $gi['item_code'],
							'quantity' => $gi['quantity'],
							'site_id' => $gi['site_id'],
							'storage_id' => $gi['storage_id'],
							'bin_id' => $gi['bin_id'],
							'status' => $gi['status'],
							);
						$this->order_model->update_good_issue($update);
					}else{
						$insert = array(
							'order_id' => $gi['order_id'],
							'item_code' => $gi['item_code'],
							'quantity' => $gi['quantity'],
							'site_id' => $gi['site_id'],
							'storage_id' => $gi['storage_id'],
							'bin_id' => $gi['bin_id'],
							'status' => $gi['status'],
							'attributes' => $this->purchase_bl->array_to_cb((array)$gi['attributes'])
							);
						$this->order_db->insert_good_issue($insert);
					}
				}
				
				// array untuk update order database
				$update = array(
					"order_id" => $data['order_id']
				);
				if(isset($data['good_issue_date'])){
					$update['good_issue_date'] = $data['good_issue_date'];
				};
				if(isset($data['good_issue_remark'])){
					$update['good_issue_remark'] = $data['good_issue_remark'];
				};
				$update['good_issue_status'] = "X";	
				if(isset($data['confirmGoodsIssue']) == TRUE){
					$update['good_issue_status'] = "A";
					if($data['type'] == "K"){
						foreach($data['items'] as $i){
							$insert_consignment_stock = array(
								"customer_id"	=> $data['customer_id'],
								"delivery_address_id" => $data['delivery_address_id'],
								"item_code"	=> $i['item_code'],
								"quantity" => $i['quantity'],
								//"site_id" => $i['site_id'],
								//"storage_id" => $i['storage_id'],
								//"bin_id" => $i['bin_id']
								//"batch_id" => $i['batch_id']
							);
							if(! empty($i['attributes'])){
								$insert_consignment_stock['attributes'] = $this->purchase_bl->array_to_cb((array)$i['attributes']);
							}
							$this->inventory_db->insert_consignment_stock($insert_consignment_stock);
						}
					}else{
						foreach($data['items'] as $i){
							$gi = array(
								'item_code' => $i['item_code'],
								'site_id' => $i['site_id'],
								'storage_id' => $i['storage_id'],
								//'bin_id' => $item['bin_id'],
							);
							
							if(isset($i['bin_id'])){
								$gi['bin_id'] = $i['bin_id'];
							}
							if(isset($i['batch_id'])){
								$gi['batch_id'] = $i['batch_id'];
							}
							
							if(! empty($i['attributes'])){
								$gi['attributes'] = $this->purchase_bl->array_to_cb((array)$i['attributes']);
							}
							
							//$basic_uom_quantity = $this->item_bl->convert_to_basic_uom_quantity($i['item_code'], $i['quantity'], $i['item_unit']);
							$basic_uom_quantity = $i['quantity'];
							$this->inventory_bl->subtract_stock_quantity($gi, $basic_uom_quantity);
						}
					}
				};
				
				$this->order_model->update_order($update);
				

				// feedback API
				$feedback = array(
					'call_status' => 'success',
					'data' => $data,
					'good_issue_status' => $update['good_issue_status']
				);
			}
			
			//$this->db->trans_complete();
		}
		
		echo json_encode($feedback);
	}

	public function insert_draft_order()
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
			$data_draft = json_decode(file_get_contents('php://input'));
			$this->auditlog_model->insert_audit_log("orderapi", "create_new_order", $data_draft->orderdata);
				
			$draft_id = $this->order_bl->insert_draft_order($data_draft->orderdata);
				
			$draft_reference = $this->order_model->generate_draft_reference($draft_id);
				
			$update = array(
					'draft_id' => $draft_id,
					'draft_reference' => $draft_reference
			);
			$this->order_model->update_draft_order($update);
			
			$data = $this->order_model->get_draft_order_by_draft_id($draft_id)->row_array();
			
			$draft_data = json_decode($data['draft_data']);
			/*
			if ($this->user_model->is_user_has_access("SALESAPPROVER"))
			{
				$array['draft_order']['approver'] = true;
			}
			else{
				$array['draft_order']['approver'] = false;
			}
			*/
			$array['draft_order']['approver'] = true;
			
			$draftdata = $data;
			
			$orderdata = json_decode($data['draft_data'], true);
			
				if ($orderdata['customer_input_type'] == "N") {
					// masukin data customer
					$customer_id = $this->customer_model->insert_customer($orderdata['customer_details']);
				} elseif ($orderdata['customer_input_type'] == "U") {
					$this->customer_model->update_customer($orderdata['customer_details']);
					$customer_id = $orderdata['customer_details']['customer_id'];
				} else {
					$customer_id = $orderdata['customer_id'];
				}
				
				// masukin data order
				$array_order = array(
					'customer_id' => $customer_id,
					'order_type' => $draftdata['order_type'],
					'delivery_type' => $draft_data->delivery_type,
					//'delivery_type' => $draft_data['delivery_type'],
					'draft_id' => $draftdata['draft_id'],
					'status' => 'N'
				);
	
				if ( isset($orderdata['order_details']['customer_po']) )
				{
					$array_order['customer_po'] = $orderdata['order_details']['customer_po'];
				}
	
				if ( isset($orderdata['order_details']['special_request']) )
				{
					$array_order['special_request'] = $orderdata['order_details']['special_request'];
				}
				else
				{
					$array_order['special_request'] = 0;
				}
	
				$order_id = $this->order_db->insert_order($array_order);
				
				$update_history = array(
						'order_id' => $order_id,
						'update_level' => 'O',
						'update_description' => 'Order dibuat'
				);
				$this->update_history_model->insert_update_history($update_history);
				
				$this->order_bl->insert_order_item_list($order_id, $customer_id, $orderdata['order_details']['order_items']);
				
				// masukin data delivery request
				foreach ($orderdata['delivery_request_details'] as $delivery) {
					$array_delivery = array(
							'order_id' => $order_id,
							'requested_delivery_address' => $delivery['requested_delivery_address'],
							'requested_delivery_date' => date('Y-m-d', strtotime($delivery['requested_delivery_date'])),
							'status' => 'A'
					);
					$delivery_request_id = $this->delivery_model->insert_delivery_requests($array_delivery);
						
					// masukin ke database kalau alamatnya baru
					if ($delivery['is_new_address'] == 1) {
						$array_address = array(
								'customer_id' => $customer_id,
								'delivery_address' => $delivery['requested_delivery_address']
						);
						$this->customer_model->insert_delivery_address($array_address);
					}
						
					// masukin data delivery request items
					foreach ($delivery['requested_delivery_items'] as $delivery_item) {
						$array_delivery_item = array(
								'delivery_request_id' => $delivery_request_id,
								'item_code' => $delivery_item['item_code'],
								'quantity' => $delivery_item['quantity'],
								//'material_type' => $delivery_item['material_type'],
								//'remark' => $delivery_item['remark']
						);
						$array_attributes = array();
						foreach($delivery_item['attributes'] as $key => $val){
							array_push($array_attributes, "'$key'", "'$val'");
						}
						$array_delivery_item['attributes'] = implode(',', $array_attributes);
						
						if(isset($delivery_item['material_type'])){
							$array_delivery_item['material_type'] = $delivery_item['material_type'];
						}
						if(isset($delivery_item['remark'])){
							$array_delivery_item['remark'] = $delivery_item['remark'];
						}
						
						$this->delivery_db->insert_delivery_request_items($array_delivery_item);
					}
				}
	
				$order_reference = $this->order_model->generate_order_reference_with_order_type($order_id, $draftdata['order_type']);
				
				$update_draft = array(
						'draft_id' => $draftdata['draft_id'],
						'draft_approver' => $this->session->userdata('user_id'),
						'status' => 'C'
				);
				$this->order_model->update_draft_order($update_draft);
				
			// feedback API
			$feedback = array(
					"call_status" => "success",
					'draft_reference' => $draft_reference,
					'order_reference' => $order_reference,
			);
		}
	
		echo json_encode($feedback);
	}
	
	public function insert_draft_order_cart() {
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
			$data = json_decode(file_get_contents('php://input'));
			$this->auditlog_model->insert_audit_log("orderapi", "save_cart_order", $data->orderdata);
			$encodedData = json_decode($data->orderdata);
			$draft_id = $this->order_model->insert_draft_order_cart($data->orderdata);
				
			$draft_reference = $this->order_model->generate_draft_reference_cart($draft_id, $encodedData->order_type);
				
			$update = array(
					'draft_id' => $draft_id,
					'draft_reference' => $draft_reference,
			);
			$this->order_model->update_draft_order_cart($update);
				
			// feedback API
			$feedback = array(
					"call_status" => "success",
					'draft_reference' => $draft_reference,
			);
		}
		echo json_encode($feedback);
	}
	
	public function update_draft_order_cart() {
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
			$data = json_decode($json);
			$this->auditlog_model->insert_audit_log("orderapi", "save_cart_order", $json);
			$draft_data = json_decode($data->draft_data);
			$draft_reference = $this->order_model->generate_draft_reference_cart($data->draft_id, $draft_data->order_type);
				
			$update = array(
					'draft_id' => $data->draft_id,
					'draft_approver' => $draft_reference,
					'draft_data' => $data->draft_data,
					'draft_approver' => $data->draft_approver,
					'type' => $draft_data->order_type,
					'status' => $data->status,
			);
			
			$this->order_model->update_draft_order_cart($update);
				
			// feedback API
			$feedback = array(
					"call_status" => "success",
					'draft_reference' => $draft_reference,
			);
		}
		echo json_encode($feedback);
	}
	public function finish_draft_order_cart() {
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
			$data = json_decode($json);
			$this->auditlog_model->insert_audit_log("orderapi", "finish_cart_order", $json);
			//$draft_reference = $this->order_model->generate_draft_reference_cart($data->draft_id, $draft_data->order_type);
				
			$draft_data = json_decode($data->draft_data);
			$update = array(
					'draft_id' => $data->draft_id,
					'draft_approver' => $data->draft_reference,
					'draft_data' => $data->draft_data,
					'draft_approver' => $data->draft_approver,
					'type' => $draft_data->order_type,
					'status' => "C",
			);
			
			$this->order_model->update_draft_order_cart($update);
				
			// feedback API
			$feedback = array(
					"call_status" => "success",
					'draft_reference' => $data->draft_reference,
			);
		}
		echo json_encode($feedback);
	}
	public function need_changed_draft_order() {
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
			$data = json_decode(file_get_contents('php://input'));
			$draftdata = json_decode($data->draftdata, true);
				
			$draftdata['status'] = 'U';
			$this->order_model->update_draft_order($draftdata);
				
			// feedback API
			$feedback = array(
					"call_status" => "success",
			);
		}
	
		echo json_encode($feedback);
	}
	
	public function get_draft_approver_by_draft_id($draft_id) {
		if (! $this->user_model->is_user_logged_in()) {
			$array = array(
				"call_status" => "error",
				"error_code" => "701",
				"error_messaage" => "User not logged on"
			);
		}
		else {
			$array = array(
				'call_status' => 'success',
				'draft_approver' => $this->order_model->get_draft_approver_by_draft_id($draft_id)->row()->username
			);
			
			echo json_encode($array);
		}
	}
	
	public function pay_order(){
		$data = json_decode(file_get_contents('php://input'), true);
			
		$invoice = $this->order_db->get_sales_invoice_by_order_id($data['order_id']);
		if($invoice->num_rows() > 0 ){
			$feedback = array(
				"call_status" => "error",
				"error_code" => "409",
				"error_messages" => "Pembayaran Telah diterima/selesai"
			);
		}else{
			// update bahwa order sudah dibayar/lunas (X = belum lunas, P = lunas)
			/*
			$update_order = array(
				"payment_status" => "P"					  
			);
			$this->order_model->update_order($update_order);
			*/
			
			$company = $this->company_db->get_company()->row();
			$insert_invoice = array(
				"order_id" => $data['order_id'],
				"customer_id" => $data['customer_id'],
				"payment_type" => $data['payment_type'],
			);
			$invoice_id = $this->order_db->insert_sales_invoice($insert_invoice);
			$this->order_bl->generate_sales_invoice_reference($invoice_id);
			
			foreach($data['order_items'] as $item){
				$insert_invoice_item = array(
					"invoice_id" => $invoice_id,
					"item_code" => $item['item_code'],
					"quantity" => $item['quantity'],
					"item_unit" => $item['item_unit'],
					"cost" => $item['cost']
				);
				if(!empty($item['disc_percent'])){
					$insert_invoice_item['disc_percent'] = $item['disc_percent'];
				}
				if(!empty($item['disc_value'])){
					$insert_invoice_item['disc_value'] = $item['disc_value'];
				}
				$this->order_db->insert_sales_invoice_item($insert_invoice_item);
			}
			// feedback API
			$feedback = array(
					"call_status" => "success",
					"data" => $data,
					"invoice_id" => $invoice_id,
					"company" => $company
			);
		}
		
		
		echo json_encode($feedback);
	}
}
