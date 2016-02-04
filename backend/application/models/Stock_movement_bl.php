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
}
