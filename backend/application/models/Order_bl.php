<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Order_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('item_model', 'order_db', 'purchase_bl'));
	}
	
	public function generate_order_reference($order_id)
	{
		// ambil date created dari tabel order berdasarkan order id
		$date_created = $this->db->where('order_id', $order_id)->get('orders')->row()->date_created;
		
		// bikin initial date
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
		
		// hitung jumlah date created yang sama
		$query = $this->db
			->where('date_created <=', $date_created)
			->where('date_created >', $initial_date)
			->where('IFNULL(special_request, 0) = ', 0)
		->get('orders');
		$count = $query->num_rows();
		
		// buat urutannya
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		$order_reference = $date.'-'.$sequence;
		
		$data = array(
			'order_reference' => $order_reference
		);
		
		$this->db->where('order_id', $order_id);
		$this->db->update('orders', $data);
		
		return $order_reference;
	}
	
	public function generate_order_reference_for_special_request($order_id)
	{
		// ambil date created dari tabel order berdasarkan order id
		$date_created = $this->db->where('order_id', $order_id)->get('orders')->row()->date_created;
		
		// bikin initial date
		$date = date('Y-m-d', strtotime($date_created));
		$initial_date = $date.' 00:00:00';
		
		// hitung jumlah date created yang sama
		$query = $this->db
			->where('date_created <=', $date_created)
			->where('date_created >', $initial_date)
			->where('IFNULL(special_request, 0) = ', 1)
		->get('orders');
		$count = $query->num_rows();
		
		// buat urutannya
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		$order_reference = 'SO'.$date.'-'.$sequence;
		
		$data = array(
			'order_reference' => $order_reference
		);
		
		$this->db->where('order_id', $order_id);
		$this->db->update('orders', $data);
		
		return $order_reference;
	}
	
	public function generate_draft_reference($draft_id)
	{
		// ambil date created dari tabel draft berdasarkan draft id
		$query = $this->db->where('draft_id', $draft_id)->get('draft_orders');
		if($query->num_rows() > 0)
		{
			$date_created = $query->row()->date_created;
			$date = date('Y-m-d', strtotime($date_created));
		}
		else
		{
			$date = date('Y-m-d');
		}
		
		$initial_date = $date.' 00:00:00';
		
		// hitung jumlah date created yang sama
		$query = $this->db
		->where('date_created <=', $date_created)
		->where('date_created >', $initial_date)
		->get('draft_orders');
		$count = $query->num_rows();
		
		// buat urutannya
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		$draft_reference = 'DRAFT_'.$date.'-'.$sequence;
		
		$data = array(
			'draft_reference' => $draft_reference
		);
		
		$this->db->where('draft_id', $draft_id);
		$this->db->update('draft_orders', $data);
		
		return $draft_reference;
	}
	
	public function is_order_forced_close($order_id)
	{
		$order = $this->get_order($order_id)->row_array();
		
		if($order['status'] == 'Z') return TRUE;
		else return FALSE;
	}
	
	public function get_order_item_list_by_order_id($order_id)
	{
		$array_item_list = array();
		
		$item_list = $this->order_db->get_order_items($order_id)->result_array();
		
		foreach ($item_list as $item) {
			if($item['child_items'] == NULL){
				$item['item_name'] = $this->item_model->get_item_by_item_code($item['item_code'])->row()->item_name;
				//echo $this->db->last_query();
				$item['item_unit'] = $this->item_model->get_item_by_item_code($item['item_code'])->row()->item_unit;
				$item['level'] = 'S';
			}
			else{
				$item['item_name'] = $this->item_model->get_combined_item_by_item_code($item['item_code'])->row()->item_name;
				$item['item_unit'] = $this->item_model->get_combined_item_by_item_code($item['item_code'])->row()->item_unit;
				$item['children'] = json_decode($item['child_items']);
				$item['level'] = 'E';
				
				unset($item['child_items']);
				unset($item['order_id']);
				unset($item['order_items_id']);
			}
			
			array_push($array_item_list, $item);
		}
		
		return $array_item_list;
	}
	
	/*public function insert_order_item_list($order_id, $customer_id, $item_list)
	{
		foreach ($item_list as $item) {
			if($item['level'] == 'N'){
				$item['customer_id'] = $customer_id;
				$this->item_model->new_combined_item($item);
			}
			
			if(isset($item['children'])){
				$item['child_items'] = json_encode($item['children']);
			}
			
			if(isset($item['length_width_height'])){
				$item['length_width_height'] = str_replace(' ', '', $item['length_width_height']);
				$item['length_width_height'] = str_replace('X', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('XX', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('Xx', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('xX', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('xx', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('.', ',', $item['length_width_height']);
				$size = explode('x', $item['length_width_height']);
				
				$item['length'] = $size[0];
				$item['width'] = $size[1];
				$item['height'] = $size[2];
			}
			
			$item['order_id'] = $order_id;
			
			if(isset($item['children'])){
				unset($item['children']);
			}
			if(isset($item['length_width_height'])){
				unset($item['length_width_height']);
			}
			if(isset($item['level'])){
				unset($item['level']);
			}
			if(isset($item['item_name'])){
				unset($item['item_name']);
			}
			if(isset($item['item_unit'])){
				unset($item['item_unit']);
			}
			if(isset($item['customer_id'])){
				unset($item['customer_id']);
			}
			if(isset($item['name'])){
				unset($item['name']);
			}
			
			$this->insert_order_items($item);
		}
	}*/
	
	public function insert_order_item_list($order_id, $customer_id, $item_list)
	{
		foreach ($item_list as $item) {
			/*			
			if(isset($item['length_width_height'])){
				$item['length_width_height'] = str_replace(' ', '', $item['length_width_height']);
				$item['length_width_height'] = str_replace('X', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('XX', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('Xx', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('xX', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('xx', 'x', $item['length_width_height']);
				$item['length_width_height'] = str_replace('.', ',', $item['length_width_height']);
				$size = explode('x', $item['length_width_height']);
				
				if($size[0] !== null && $size[1] !== null && $size[2] !== null){
					$item['length'] = $size[0];
					$item['width'] = $size[1];
					$item['height'] = $size[2];
				}else{
					$item['length'] = 0;
					$item['width'] = 0;
					$item['height'] = 0;
				}
			}
			*/
			$item['order_id'] = $order_id;
			
			if(isset($item['children'])){
				unset($item['children']);
			}
			if(isset($item['length_width_height'])){
				unset($item['length_width_height']);
			}
			if(isset($item['level'])){
				unset($item['level']);
			}
			if(isset($item['item_name'])){
				unset($item['item_name']);
			}
			if(isset($item['item_unit'])){
				unset($item['item_unit']);
			}
			if(isset($item['customer_id'])){
				unset($item['customer_id']);
			}
			if(isset($item['name'])){
				unset($item['name']);
			}
			
			$item_code = $item['item_code'];
			//$length = $item['length'];
			//$width = $item['width'];
			//$height = $item['height'];
			$quantity = $item['quantity'];
			//$material_type = $item['material_type'];
			$remark = $item['remark'];
			//$child_items = $item['child_items'];
			$attributes = $this->purchase_bl->array_to_cb($item['attributes']);
			$cost = $item['cost'];
			$disc_percent = $item['disc_percent'];
			$disc_value = $item['disc_value'];
			
			//$this->order_db->insert_order_items($item);
			$this->db->query("
				INSERT INTO order_items (order_id, item_code, quantity, remark, attributes, cost, disc_percent, disc_value)
				VALUES ($order_id, '$item_code', $quantity, '$remark', COLUMN_CREATE($attributes), $cost, $disc_percent, $disc_value)
			");
		}
	}
	
	public function insert_draft_order($data)
	{
		$array = json_decode($data, true);
		
		$insert = array(
			'draft_creator' => $this->session->userdata('user_id'),
			'draft_data' => $data,
			'order_type' => $array['order_type'],
			'status' => 'A'
		);
		
		if ( $this->db->insert('draft_orders', $insert) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
}