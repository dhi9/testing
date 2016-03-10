<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Purchase_model extends CI_Model {

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
	
	public function get_draft_purchase_by_draft_reference($draft_reference)
	{
		return $this->db
			->select('dp.*, u.username as approver')
			->from('draft_requests dp')
			->join('users u', 'u.user_id = dp.draft_approver')
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
		return $this->db
			->select('r.*, i.item_name, COLUMN_JSON(r.attributes) as attributes')
			->from('request_items r')
			->join('items i', 'r.item_code = i.item_code')
			->where('r.requests_id', $requests_id)
		->get();
	}
	
	public function get_active_delivery_requests_by_requests_id($requests_id)
	{
		return $this->db
			->select('*')
			->from('request_delivery_requests')
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
			->select('r.*, i.item_name, COLUMN_JSON(r.attributes) as attributes')
			->from('request_delivery_request_items r')
			->join('items i', 'r.item_code = i.item_code')
			->where('r.requests_delivery_request_id', $requests_delivery_request_id)
		->get();
	}
	
	public function get_delivered_items_list_by_requests_delivery_request_id($requests_delivery_request_id)
	{
		return $this->db
			->select('*')
			->from('request_delivery_items')
			->where('requests_delivery_request_id', $requests_delivery_request_id)
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
			->select('user_id, username, max_limit, email')
			->from('users')
			->where('max_limit IS NOT NULL', null, false)
			->order_by('max_limit', 'asc')
		->get();
	}
	
	public function get_site_list()
	{
		return $this->db->from('sites')->get();
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
	
	public function get_users_by_user_id($user_id, $by)
	{
		return $this->db
			->select('u.username, ua.*')
			->from('users u')
			->join('user_approvals ua', 'u.user_id = ua.user_id')
			->where('u.user_id', $user_id)
			//->where('max_limit IS NOT NULL', null, false)
			->order_by('ua.'.$by, 'asc')
		->get();
	}
	
	public function generate_draft_reference($draft_id, $type)
	{
		$query = $this->db->where('draft_id', $draft_id)->get('draft_requests');
		
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
		
		$query = $this->db
			->where('date_created <=', $date_created)
			->where('date_created >', $initial_date)
			->where('type', $type)
		->get('draft_requests');
		$count = $query->num_rows();
		
		$sequence = str_pad($count, 3, "0", STR_PAD_LEFT);
		
		$draft_reference = $type.'R_'.$date.'-'.$sequence;
		
		$data = array(
			'draft_reference' => $draft_reference
		);
		
		$this->db->where('draft_id', $draft_id);
		$this->db->update('draft_requests', $data);
		
		return $draft_reference;
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
	
	public function insert_request_delivery_request_items($array)
	{
		if(! empty($array['attributes'])){
			$attributes = $array['attributes'];
			$this->db->set('attributes', "COLUMN_CREATE($attributes)", FALSE);
			unset($array['attributes']) ;
		}
		
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
	
	public function insert_delivered_items($array)
	{
		if (
			$this->db->query("
					INSERT INTO request_delivery_items (
						requests_delivery_request_id,
						item_code,
						item_unit,
						quantity,
						date_recieved,
						site_id,
						storage_id,
						bin_id,
						batch_id,
						attributes,
						remark
					)VALUES (
						".$array['requests_delivery_request_id'].",
						'".$array['item_code']."',
						'".$array['item_unit']."',
						".$array['quantity'].",
						'".$array['date_recieved']."',
						".$array['site_id'].",
						".$array['storage_id'].",
						".$array['bin_id'].",
						".$array['batch_id'].",
						COLUMN_CREATE(".$array['attributes']."),
						'".$array['remark']."'
					)
				")
			)
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
		$this->db->insert('request_delivery_services', $array);
	}
	
	public function insert_inventory_stock($array)
	{
		$this->db->insert('inventory_stocks', $array);
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
	
	public function send_email($to, $pdf)
	{
		$companyDetail = $this->company_db->get_company()->row()->company_name;
		$type = $this->purchase_model->get_active_requests_by_requests_reference($pdf)->row()->type;
		$subject = "";
		if($type == "PR"){
			$subject = "Purchase Order";
		}elseif($type == "SR"){
			$subject = "Service Order";
		}else{
			
		}
		$data['client_name'] = $companyDetail;
		$this->load->library('email');
		$this->email->from('test@waveconsulting.co.id', 'VONTIS RT');
		//$this->email->to($to);
		$this->email->to($to);
		$this->email->cc('test@waveconsulting.co.id'); 
		$this->email->subject("$companyDetail - $subject $pdf");
		$this->email->message($this->load->view('email-format-po', $data, TRUE));
		$this->email->attach('docs/'.$pdf.'.pdf');	
		$this->email->send();
	}
}
