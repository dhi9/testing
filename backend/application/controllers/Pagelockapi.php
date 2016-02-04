<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pagelockapi extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		
		$this->load->model('page_lock_model');
	}
        
  public function delete_page_lock()
	{
		$this->page_lock_model->delete_page_lock();
		
		$feedback = array(
			"call_status" => "success"
		);
		echo json_encode($feedback);
	}
	
	public function check_page_lock()
	{
		$data = json_decode(file_get_contents('php://input'));	
		$pagelockdata = json_decode($data->pagelockdata, true);
		
		if ($pagelockdata['level'] == 'O')
		{
			$query = $this->page_lock_model->get_page_lock_by_order_id($pagelockdata['order_id']);
		}
		else if ($pagelockdata['level'] == 'D')
		{
			$query = $this->page_lock_model->get_page_lock_by_delivery_id($pagelockdata['delivery_id']);
		}
		
		if ($query->num_rows() > 0)
		{
			$feedback['page_lock_status'] = 'denied';
		}
		else
		{
			$this->page_lock_model->insert_page_lock($pagelockdata);
			
			$feedback['page_lock_status'] = 'insert';
		}
		
		$feedback['call_status'] = 'success';
		echo json_encode($feedback);
	}
}
