<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Order_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('item_model');
	}
	
	public function change_order_status($order_id, $status)
	{
		return $this->db->update(
			'orders',
			array(
					'status' => $status
			),
			array('order_id' => $order_id)
		);
	}
	
	public function get_order_list()
	{
		return $this->db
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_active_orders()
	{
		return $this->db
			->where_not_in('status', array('Z', 'X', 'C'))
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_completed_orders($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('date_created <', $end_date);
		}
		
		return $this->db
			->where('status', 'C')
			->where('status !=', 'Z')
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_rejected_orders($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('date_created <', $end_date);
		}
		
		return $this->db
			->where('status', 'Z')
			->where('status !=', 'C')
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_all_orders($start_date = NULL, $end_date = NULL)
	{
		if($start_date != NULL) $this->db->where('date_created >=', $start_date);
		if($end_date != NULL)
		{
			$end_date = date('Y-m-d',strtotime($end_date . " +1 days"));
			
			$this->db->where('date_created <', $end_date);
		}
		
		return $this->db
			->where_not_in('status', array('Z', 'X'))
			->order_by('date_created desc')
		->get('orders');
	}
	
	public function get_order($order_id)
	{
		return $this->db->where('order_id', $order_id)->get('orders');
	}
	
	public function get_order_items($order_id)
	{
		return $this->db
			->where('order_id', $order_id)
		->get('order_items');
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
			//->where('IFNULL(special_request, 0) = ', 0)
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
	
	public function generate_order_reference_with_order_type($order_id, $order_type)
	{
		// ambil date created dari tabel order berdasarkan order id
		$date_created = $this->db->where('order_id', $order_id)->get('orders')->row()->date_created;
		
		// bikin initial date
		$date = date('Y-m-01', strtotime($date_created));
		$year = date('Y', strtotime($date_created));
		$month = date('m', strtotime($date_created));
		
		switch ($year) {
			case "2015":
				$y = "A";
				break;
			case "2016":
				$y = "B";
				break;
			case "2017":
				$y = "C";
				break;
		}
		switch ($month) {
			case "10":
				$m = "A";
				break;
			case "11":
				$m = "B";
				break;
			case "12":
				$m = "C";
				break;
			default:
				$m = $month;
				break;
		}
		$initial_date = $date.' 00:00:00';
		
		// hitung jumlah date created yang sama
		$query = $this->db
			->where('date_created <=', $date_created)
			->where('date_created >', $initial_date)
			//->where('IFNULL(special_request, 0) = ', 0)
		->get('orders');
		$count = $query->num_rows();
		
		// buat urutannya
		$sequence = str_pad($count, 4, "0", STR_PAD_LEFT);
		
		$order_reference = "O".$order_type.$y.$m.$sequence;
		
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
	
	public function get_blocked_orders()
	{
		return $this->db
			->select('o.order_reference, c.customer_name, c.pic_name, min(dr.requested_delivery_date) as requested_delivery_date, c.customer_id')
			->from('orders o')
			->join('customers c', 'c.customer_id = o.customer_id')
			->join('delivery_requests dr', 'dr.order_id = o.order_id')
			->where('c.is_credit_blocked', 1)
			->group_by('o.order_reference, c.customer_name, c.pic_name')
		->get();
	}
	
	public function get_orders_to_deliver()
	{
		return $this->db
			->select('
				o.order_id, MIN(dr.requested_delivery_date) as requested_date,
				c.customer_name, o.status,
				o.order_reference, o.production_completed_date
			')
			->from('orders o')
			->where_in('o.status', array('R','B','D'))
			->join('delivery_requests dr', 'dr.order_id = o.order_id')
			->join('customers c', 'c.customer_id = o.customer_id')
			->group_by('o.order_id')
			->order_by('requested_date')
		->get();
	}
	
	public function get_good_issue_items($order_id)
	{
		return $this->db
			->where('order_id', $order_id)
		->get('order_item_delivery');
	}
	
	public function get_order_by_order_reference($order_reference)
	{
		return $this->db
			->where('order_reference', $order_reference)
		->get('orders');
	}
	
	public function get_draft_order_list()
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_orders do')
			->join('users user_creator','user_creator.user_id = do.draft_creator', 'left')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			//->where_in('do.product_type', $department)
			->where_in('do.status', array('A'))
		->get();
	}
	
	public function get_user_draft_order_list($user_id)
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_orders do')
			->join('users user_creator','user_creator.user_id = do.draft_creator')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			->where('do.draft_creator', $user_id)
			->where_not_in('do.status', array('C', 'X'))
		->get();
	}
	
	
	public function get_draft_order_cart_list($user_id)
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_carts do')
			->join('users user_creator','user_creator.user_id = do.draft_creator')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			->where('do.draft_creator', $user_id)
			->where_not_in('do.status', array('C', 'X'))
		->get();
	}
	
	public function get_user_active_draft_order_list($user_id)
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_orders do')
			->join('users user_creator','user_creator.user_id = do.draft_creator')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			->where('do.draft_creator', $user_id)
			->where_in('do.status', array('A'))
			->where_not_in('do.status', array('C', 'X'))
		->get();
	}
	
	public function get_user_changed_draft_order_list($user_id)
	{
		return $this->db
			->select('do.*, user_creator.username as user_creator, user_approver.username as user_approver')
			->from('draft_orders do')
			->join('users user_creator','user_creator.user_id = do.draft_creator')
			->join('users user_approver','user_approver.user_id = do.draft_approver', 'left')
			->where('do.draft_creator', $user_id)
			->where_in('do.status', array('U'))
			->where_not_in('do.status', array('C', 'X'))
		->get();
	}
	
	public function get_draft_order_by_draft_id($draft_id)
	{
		return $this->db
			->where('draft_id', $draft_id)
		->get('draft_orders');
	}
	public function get_draft_order_cart_by_draft_id($draft_id)
	{
		return $this->db
			->where('draft_id', $draft_id)
		->get('draft_carts');
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
	
	public function generate_draft_reference_cart($draft_id, $order_type)
	{
		switch ($order_type) {
			case "biasa":
			case "B":
				$type = "B";
				break;
			case "konsinyasi":
			case "K":
				$type = "K";
				break;
			case "sample":
				$type = "S";
				break;
			case "urgent":
				$type = "U";
				break;
			default:
				$type = "B";
		}
		// ambil date created dari tabel draft berdasarkan draft id
		$query = $this->db->where('draft_id', $draft_id)->get('draft_carts');
		if($query->num_rows() > 0)
		{
			$date_created = $query->row()->date_created;
			$date = date('Y-m', strtotime($date_created));
			$year = date('Y', strtotime($date_created));
			$month = date('m', strtotime($date_created));
		}
		else
		{
			$date = date('Y-m');
			$year = date('Y');
			$month = date('m');
		}
		
		$initial_date = $date.' 00:00:00';
		
		// hitung jumlah date created yang sama
		$query = $this->db
		->where('date_created <=', $date_created)
		->where('date_created >', $initial_date)
		->get('draft_carts');
		$count = $query->num_rows();
		
		// buat urutannya
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		$draft_reference = 'T'.$type.$year.$month.$sequence;
		
		$data = array(
			'draft_reference' => $draft_reference
		);
		
		$this->db->where('draft_id', $draft_id);
		$this->db->update('draft_carts', $data);
		
		return $draft_reference;
	}
	
	public function insert_order($array)
	{
		if ( $this->db->insert('orders', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_good_issue($array)
	{
		/*
		if ( $this->db->insert('order_item_delivery', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
		*/
		
		if($array['attributes'] == ''){
			$array['attributes'] = NULL;
		}else{
			$attributes = array ();
			foreach($array['attributes'] as $key=>$value){
				array_push($attributes, $key);
				array_push($attributes, $value);
			}
			$array['attributes'] = $attributes;
		}
		
		//if ( $this->db->insert('inventory_stocks', $array) )
		if(
		   $this->db->query(
			"INSERT INTO `order_item_delivery`(
				`order_id`,
				`item_code`,
				`quantity`,
				`site_id`,
				`storage_id` ,
				`bin_id`,
				`status`,
				`attributes`
			 )
			VALUES (
				'".$array['order_id']."',
				'".$array['item_code']."',
				".$array['quantity'].",
				'".$array['site_id']."',
				'".$array['storage_id']."',
				'".$array['bin_id']."',
				'".$array['status']."',
				COLUMN_CREATE('".implode("','", $array['attributes'])."')
				)"
			)
		   )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_order_items($array)
	{
		$column_list = ["order_id", "item_code", "length", "width", "height", "quantity", "material_type", "remark", "child_items", "attributes", "cost", "disc_percent", "disc_value"];
		
		$data = array();
		foreach($column_list as $column){
			if(isset($array[$column])){
				$data[$column] = $array[$column];
			}
		}
		
		if ( $this->db->insert('order_items', $data) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
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
	
	public function insert_draft_order_cart($data)
	{
		$array = json_decode($data, true);
		
		$insert = array(
			'draft_creator' => $this->session->userdata('user_id'),
			'draft_data' => $data,
			'type' => $array['order_type'],
			'status' => 'A'
		);
		
		if ( $this->db->insert('draft_carts', $insert) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	public function is_order_forced_close($order_id)
	{
		$order = $this->get_order($order_id)->row_array();
		
		if($order['status'] == 'Z') return TRUE;
		else return FALSE;
	}
	
	public function update_order($data)
	{
		$this->db->update(
			'orders',
			$data,
			array('order_id' => $data['order_id'])
		);
	}
	
	public function update_draft_order($data)
	{
		unset($data['approver']);
		
		$this->db->update(
			'draft_orders',
			$data,
			array('draft_id' => $data['draft_id'])
		);
	}
	
	public function update_good_issue($data)
	{		
		$this->db->update(
			'order_item_delivery',
			$data,
			array('order_item_delivery_id' => $data['order_item_delivery_id'])
		);
	}
	
	public function update_draft_order_cart($data)
	{
		unset($data->approver);
		
		$this->db->update(
			'draft_carts',
			$data,
			array('draft_id' => $data['draft_id'])
		);
	}
	
	public function bl_get_order_item_list_by_order_id($order_id)
	{
		$array_item_list = array();
		
		$item_list = $this->get_order_items($order_id)->result_array();
		
		foreach ($item_list as $item) {
			if($item['child_items'] == NULL){
				$item['item_name'] = $this->item_model->get_item_by_item_code($item['item_code'])->row()->item_name;
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
	
	public function bl_insert_order_item_list($order_id, $customer_id, $item_list)
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
			
			$this->insert_order_items($item);
		}
	}
	
	public function get_draft_approver_by_draft_id($draft_id)
	{
		return $this->db
			->from('draft_orders do')
			->join('users u', 'u.user_id = do.draft_approver')
			->where('do.draft_id', $draft_id)
		->get();
	}
}
