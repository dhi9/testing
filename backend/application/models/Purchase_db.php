<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Purchase_db extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
	}
	
	public function get_draft_by_id($id)
	{
		return $this->db
			->select('dp.*, u.username as approver')
			->from('draft_requests dp')
			->join('users u', 'u.user_id = dp.draft_approver')
			->where('draft_id', $id)
		->get();
	}
	
	public function get_draft_purchase_by_id($id)
	{
		return $this->db
			->select('dp.*, u.username as approver')
			->from('draft_requests dp')
			->join('users u', 'u.user_id = dp.draft_approver')
			->where('draft_id', $id)
		->get();
	}
	
	public function get_draft_by_reference($draft_reference)
	{
		return $this->db
			->select('dp.*, u.username as approver')
			->from('draft_requests dp')
			->join('users u', 'u.user_id = dp.draft_approver')
			->where('draft_reference', $draft_reference)
		->get();
	}
	
	public function get_draft_purchase_by_draft_reference($draft_reference)
	{
		return $this->db
			//->select('dp.*, u.username as approver')
			->select('dp.*')
			->from('draft_requests dp')
			//->join('users u', 'u.user_id = dp.draft_approver')
			->where('draft_reference', $draft_reference)
		->get();
	}
	
	public function get_purchase_by_draft_reference($draft_reference)
	{
		return $this->db
			->select('dp.*, u.username as approver')
			->from('requests dp')
			->join('users u', 'u.user_id = dp.approver_id')
			->where('requests_reference', $draft_reference)
		->get();
	}
	
	public function get_draft_purchase_by_date_created_range($start_date, $end_date, $type)
	{
		if(!empty($end_date)){
			$this->db
			->where('date_created <=', $end_date);
		}
		return $this->db
			->where('date_created >', $start_date)
			->where('type', $type)
		->get('draft_requests');
	}
	
	public function get_draft_by_id_and_approver_id($id, $approver_id)
	{
		return $this->db
			->where('draft_id', $id)
			->where('draft_approver', $approver_id)
		->get('draft_requests');
	}
	
	public function get_purchase_by_approver_id($approver_id)
	{
		return $this->db
			->select('p.*, c.username as creator, a.username as approver')
			->from('purchases as p')
			->join('users c', 'c.user_id = p.creator_id')
			->join('users a', 'a.user_id = p.approver_id')
			->where('p.approver_id', $approver_id)
		->get();
	}
	
	public function get_purchase_by_purchase_delivery_request_id($requests_delivery_request_id)
	{
		return $this->db
			->select('p.*')
			->from('requests p')
			->join('request_delivery_requests pdr', 'pdr.requests_id = p.requests_id')
			->where('requests_delivery_request_id', $requests_delivery_request_id)
		->get();
	}
	
	public function get_purchase_request_by_id($id)
	{
		return $this->db
			->where('purchase_id', $id)
		->get('purchases');
	}
	
	public function get_request()
	{
		return $this->db
			->select('dp.*, u.username as draft_creator_name')
			->from('draft_requests dp')
			->join('users u', 'u.user_id = dp.draft_creator')
			->where_in('dp.status', array('A'))
		->get();
	}
	
	public function get_request_by_approver_id($id)
	{
		return $this->db
			->select('dp.*, u.username as draft_creator_name')
			->from('draft_requests dp')
			->join('users u', 'u.user_id = dp.draft_creator')
			->where('dp.draft_approver', $id)
			->where_in('dp.status', array('A','C'))
		->get();
	}
	
	public function get_approved_request_by_approver_id()
	{
		return $this->db
			->select('dp.*, u.username as draft_creator_name, s.username as approver_name')
			->from('requests dp')
			->join('users u', 'u.user_id = dp.requests_creator')
			->join('users s', 's.user_id = dp.approver_id')
			->where_in('dp.status', array('P'))
		->get();
	}
	
	public function get_requests_item_request_list_by_purchase_id($purchase_id)
	{
		return $this->db
			->where('purchase_id', $id)
		->get('request_items');
	}
	
	public function get_active_requests_list()
	{
		return $this->db
			->select('dp.*, u.username as approver, c.username as creator')
			->from('requests dp')
			->where_in('dp.status', array('P'))
			->join('users u', 'u.user_id = dp.approver_id')
			->join('users c', 'c.user_id = dp.requests_creator')
		->get();
	}
	
	public function get_completed_requests_list()
	{
		return $this->db
		->select('dp.*, u.username as approver')
		->from('requests dp')
		->where_in('dp.status', array('C'))
		->join('users u', 'u.user_id = dp.approver_id')
		->get();
	}
	
	public function get_active_requests_creator_name($requests_creator)
	{
		return $this->db
			->select('username')
			->from('users')
			->where('user_id', $requests_creator)
		->get();
	}
	
	public function get_active_requests_by_requests_reference($draft_reference)
	{
		return $this->db
			->select('dp.*, u.username as approver')
			->from('requests dp')
			->join('users u', 'u.user_id = dp.approver_id')
			->where('requests_reference', $draft_reference)
		->get();
	}
	
	public function get_active_item_requests_by_requests_id($requests_id)
	{
		/*return $this->db
			->select('*')
			->from('request_items')
			->where('requests_id', $requests_id)
		->get();*/
		
		return $this->db->query("
			SELECT *, COLUMN_JSON(attributes) as attributes
			FROM `request_items`
			WHERE `requests_id` = $requests_id
		");
	}
	
	public function get_active_delivery_requests_by_requests_id($requests_id)
	{
		return $this->db
			->select('*')
			->from('request_delivery_requests rd')
			->join('sites s', 's.site_id = rd.site_id', 'left')
			->where('requests_id', $requests_id)
		->get();
	}
	
	public function get_active_delivery_requests_by_delivery_requests_id($delivery_requests_id)
	{
		return $this->db
			->select('*')
			->from('request_delivery_requests')
			->where('requests_delivery_request_id', $delivery_requests_id)
		->get();
	}
	
	public function get_active_delivery_requests_items_by_requests_delivery_request_id($requests_delivery_request_id)
	{
		return $this->db
			->select('*')
			->from('request_delivery_request_items')
			->where('requests_delivery_request_id', $requests_delivery_request_id)
		->get();
	}
	
	public function get_approver($amount, $currency, $type)
	{
		return $this->db
			->select('*')
			->from('user_approvals')
			->where($type.'_max_'.$currency.">=".$amount)
			->order_by($type.'_max_'.$currency, "asc")
		->get();
	}
	
	public function get_delivered_items_list_by_requests_delivery_request_id($requests_delivery_request_id)
	{
		return $this->db->query("
			SELECT *, COLUMN_JSON(attributes) as attributes
			FROM `request_delivery_items`
			WHERE `requests_delivery_request_id` = $requests_delivery_request_id
		");
	}
	
	public function get_delivered_item_by_id($purchase_delivered_item_id)
	{
		return $this->db
			->select('
				rdi.*, i.item_code, i.item_name, s.site_reference, sl.storage_name,
				bl.bin_name, b.batch_reference, COLUMN_JSON(attributes) as attributes
			')
			->from('request_delivery_items rdi')
			->join('items i', 'i.item_code = rdi.item_code', 'left')
			->join('sites s', 's.site_id = rdi.site_id', 'left')
			->join('storage_locations sl', 'sl.storage_id = rdi.storage_id', 'left')
			->join('bin_locations bl', 'bl.bin_id = rdi.bin_id', 'left')
			->join('batchs b', 'b.batch_id = rdi.batch_id', 'left')
			->where('purchase_delivered_item_id', $purchase_delivered_item_id)
		->get();
	}
	
	public function get_active_item_service_requests_by_requests_id($requests_id)
	{
		return $this->db
			->from('request_services')
			->where('requests_id', $requests_id)
		->get();
	}
	
	public function get_completed_service_by_requests_delivery_request_id($requests_delivery_request_id)
	{
		return $this->db
			->from('request_delivery_services')
			->where('requests_delivery_request_id', $requests_delivery_request_id)
		->get();
	}
	
	public function get_purchase_delivery_requests_by_requests_id($requests_id)
	{
		return $this->db
			->where('requests_id', $requests_id)
		->get('request_delivery_requests');
	}
	
	public function get_completed_purchase_delivery_requests_by_requests_id($requests_id)
	{
		return $this->db
			->where('requests_id', $requests_id)
			->where('status', 'C')
		->get('request_delivery_requests');
	}
	
	public function get_users_list()
	{
		return $this->db
			->select('u.user_id, u.username, u.max_limit, u.email, ua.*')
			->from('users u')
			->join('user_approvals ua', 'u.user_id = ua.user_id')
			//->where('max_limit IS NOT NULL', null, false)
			//->order_by('max_limit', 'asc')
		->get();
	}
	
	public function get_storage_list()
	{
		return $this->db->from('storage_locations')->get();
	}
	
	public function get_bin_list()
	{
		return $this->db->from('bin_locations')->get();
	}
	
	public function get_batch_list()
	{
		return $this->db->from('batchs')->get();
	}
	
	public function get_users_by_user_id($user_id)
	{
		return $this->db
			->select('max_limit')
			->where('user_id', $user_id)
			->where('max_limit IS NOT NULL', null, false)
			->order_by('max_limit', 'asc')
		->get('users');
	}
	
	public function update_draft_order($data)
	{
		$this->db->update(
			'draft_requests',
			$data,
			array('draft_id' => $data['draft_id'])
		);
	}
	
	public function update_draft_purchase($data)
	{
		$this->db->update(
			'draft_requests',
			$data,
			array('draft_reference' => $data['draft_reference'])
		);
	}
	
	public function update_draft_purchase_by_id($id, $data)
	{
		$this->db->update(
			'draft_requests',
			$data,
			array('draft_id' => $id)
		);
	}
	
	public function update_draft_purchase_by_reference($reference, $data)
	{
		$this->db->update(
			'draft_requests',
			$data,
			array('draft_reference' => $reference)
		);
	}
	
	public function update_completed_delivery_request($data)
	{
		$this->db->update(
			'request_delivery_requests',
			$data,
			array('requests_delivery_request_id' => $data['requests_delivery_request_id'])
		);
	}
	
	public function update_locations_delivered_request_item($data)
	{
		$this->db->update(
			'request_delivery_items',
			$data,
			array('purchase_delivered_item_id' => $data['purchase_delivered_item_id'])
		);
	}
	
	public function update_locations_inventory_stock($data)
	{
		$this->db->update(
			'inventory_stocks',
			$data,
			array('purchase_delivered_item_id' => $data['purchase_delivered_item_id'])
		);
	}
	
	public function update_batch_delivered_request_item($data)
	{
		$this->db->update(
			'batchs',
			$data,
			array('batch_id' => $data['batch_id'])
		);
	}
	
	public function update_remark_delivered_request_item($data)
	{
		$this->db->update(
			'request_delivery_items',
			$data,
			array('purchase_delivered_item_id' => $data['purchase_delivered_item_id'])
		);
	}
	
	public function update_service_request_to_complete_service_request($data)
	{
		$this->db->update(
			'requests',
			$data,
			array('requests_reference' => $data['requests_reference'])
		);
	}
	
	public function update_purchase_request_to_complete_purchase_request($data)
	{
		$this->db->update(
			'requests',
			$data,
			array('requests_id' => $data['requests_id'])
		);
	}
	
	public function insert_requests($array)
	{
		if ( $this->db->insert('requests', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_purchase($array)
	{
		if ( $this->db->insert('requests', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_requests_item_request($array)
	{
		if ( $this->db->insert('request_items', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_purchase_item($array)
	{
		if ( $this->db->insert('request_items', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_service_item_request($array)
	{
		if ( $this->db->insert('request_services', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_purchase_service($array)
	{
		if ( $this->db->insert('request_services', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_requests_delivery_request($array)
	{
		if ( $this->db->insert('request_delivery_requests', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_purchase_delivery_request($array)
	{
		if ( $this->db->insert('request_delivery_requests', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_request_delivery_request_items($array)
	{
		if ( $this->db->insert('request_delivery_request_items', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_purchase_delivery_request_item($array)
	{
		if ( $this->db->insert('request_delivery_request_items', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_batchs($array)
	{
		if ( $this->db->insert('batchs', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_batch($array)
	{
		if ( $this->db->insert('batchs', $array) )
		{
			return $this->db->insert_id();
		} 
		else
		{
			return 0;
		}
	}
	
	public function insert_delivered_items($array)
	{
		if(! empty($array['attributes'])){
			$attributes = $array['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($array['attributes']) ;
		}
		
		if ( $this->db->insert('request_delivery_items', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_completed_service($array)
	{
		if ( $this->db->insert('request_delivery_services', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_inventory_stock($array)
	{
		if ( $this->db->insert('inventory_stocks', $array) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function insert_draft_requests($data)
	{
		if ( $this->db->insert('draft_requests', $data) )
		{
			return $this->db->insert_id();
		}
		else
		{
			return 0;
		}
	}
	
	public function get_inventory_stock_by_data($data)
	{
		if(! empty($data['storage_id'])){
			$this->db->where('storage_id', $data['storage_id']);
		}
		if(! empty($data['bin_id'])){
			$this->db->where('bin_id', $data['bin_id']);
		}
		if(! empty($data['batch_id'])){
			$this->db->where('batch_id', $data['batch_id']);
		}
		if(! empty($data['attributes'])){
			$this->db->where('attributes', $data['attributes']);
		}
		
		return $this->db
			->where('item_code', $data['item_code'])
			->where('site_id', $data['site_id'])
		->get('inventory_stocks');
	}
	
	public function update_inventory_stock_by_data($data)
	{
		$this->db->set('quantity', $data['quantity']);
		
		if(! empty($data['storage_id'])){
			$this->db->where('storage_id', $data['storage_id']);
		}
		if(! empty($data['bin_id'])){
			$this->db->where('bin_id', $data['bin_id']);
		}
		if(! empty($data['batch_id'])){
			$this->db->where('batch_id', $data['batch_id']);
		}
		if(! empty($data['attributes'])){
			$this->db->where('attributes', $data['attributes']);
		}
		
		$this->db->where('item_code', $data['item_code']);
		$this->db->where('site_id', $data['site_id']);
		$this->db->update('inventory_stocks');
	}
	
	public function is_batch_exist($batch_reference)
	{
		return $this->db
			->where('batch_reference', $batch_reference)
		->get('batchs');
	}
	
	public function get_batch_by_reference($batch_reference)
	{
		return $this->db
			->where('batch_reference', $batch_reference)
		->get('batchs');
	}
	
	public function get_purchase_discussion_list()
	{
		return $this->db
			->where('status', 'D')
		->get('draft_requests');
	}
	
	public function get_this_year_purchase_list()
	{
		return $this->db
			->where("YEAR(date_created) = YEAR(CURDATE())")
			->where('status', 'C')
		->get('requests');
	}
	
	public function count_not_approved_purchase_item()
	{
		return $this->db->where('type', 'P')->where('status', 'A')->count_all_results('draft_requests');
	}
	
	public function count_not_approved_purchase_service()
	{
		return $this->db->where('type', 'S')->where('status', 'A')->count_all_results('draft_requests');
	}
	
	public function count_not_completed_purchase()
	{
		return $this->db->where('status !=', 'C')->count_all_results('requests');
	}
	
	public function get_not_received_purchase_list_by_item_code($item_code)
	{
		return $this->db
			->from('request_items ri')
			->join('requests r', 'r.requests_id = ri.requests_id')
			->where('r.status !=', 'C')
			->where('ri.item_code', $item_code)
		->get();
	}
}