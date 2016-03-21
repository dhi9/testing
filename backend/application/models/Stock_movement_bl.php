<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Stock_movement_bl extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('stock_movement_db', 'delivery_db', 'sales_db'));
	}
	
	public function insert_stock_movement_by_delivery_id($delivery_id)
	{
		$delivery = $this->delivery_db->get_delivery_by_id($delivery_id)->row_array();
		$delivery_item_list = $this->delivery_db->get_delivery_item_list_by_delivery_id($delivery_id)->result_array();
		$sales = $this->sales_db->get_sales_by_delivery_id($delivery_id)->row_array();
		
		foreach($delivery_item_list as $item){
			$insert_stock_movement = array(
				'item_code' => $item['item_code'],
				//'document_number' => 'D',
				'document_reference' => $sales['order_reference'],
				//'posting_date' => $actual_loading_date_old_value,
				'quantity' => $item['quantity_sent_actual'],
				//'uom' => ,
				//'uom_quantity' => ,
				//'email' => ,
				'type' => 'VGI1',
				//'price' => ,
			);
			$this->stock_movement_db->insert_stock_movement($insert_stock_movement);
		}
	}
	
	public function get_stock_report($data){
		if(!empty($data['searchItem'])){
			$data['searchItem'] = explode("-", $data['searchItem']);
		}
		return $this->stock_movement_db->get_stock_movement_list_by_search($data)->result_array();
	}

	public function get_stock_movement_list_by_item_code($item_code)
	{
		$stock_movement_list = $this->stock_movement_db->get_stock_movement_list_by_item_code($item_code)->result_array();
		
		$subtract = array("VGR2", "VGR4", "VGR6", "VGI1", "VGI3", "VGI5", "VGI7", "VPS2");
		
		$balance = 0;
		foreach($stock_movement_list as &$row){
			if( in_array($row['type'], $subtract) ){
				$balance -= $row['base_uom_quantity'];
			}
			else{
				$balance += $row['base_uom_quantity'];
			}
			
			$row['balance'] = $balance;
		}
		
		return array_reverse($stock_movement_list);
	}
}
