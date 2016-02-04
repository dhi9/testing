<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Stats_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model('delivery_model');
	}
	
	public function count_monthly_order()
	{
		return $this->db
			->select('YEAR(date_created) as year, MONTH(date_created) as month, COUNT(order_id) as total')
			->group_by('YEAR(date_created), MONTH(date_created)')
			->order_by('year DESC, month DESC')
			->limit(12)
		->get('orders');
	}
	
	public function count_monthly_delivery()
	{
		return $this->db
			->select('YEAR(date_created) as year, MONTH(date_created) as month, COUNT(delivery_id) as total')
			->group_by('YEAR(date_created), MONTH(date_created)')
			->order_by('year DESC, month DESC')
			->limit(12)
		->get('deliveries');
	}
	
	public function count_delivery_by_status()
	{
		return $this->db
			->select('status, COUNT(delivery_id) as total')
			->like('date_created', date('Y-m-d'), 'after')
			->where_not_in('status', array('X', 'Z'))
			->group_by('status')
		->get('deliveries');
	}
	
	public function get_last_12_months_dates()
	{
		for ($i = 0; $i <= 11; $i++) {
			$dates[] = date("Y-m", strtotime( date( 'Y-m-01' )." -$i months"));
		}
		
		return $dates;
	}
}
