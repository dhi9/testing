<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Status_model extends CI_Model {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->model(array('delivery_model', 'order_model', 'customer_model'));
	}

	public function is_items_information_updated($items)
	{
		foreach($items as $item)
		{
			if($item['quantity_sent_actual'] != NULL && $item['quantity_received'] != NULL)
			{
				$feedback = true;
			}
			else
			{
				$feedback = false;
				break;
			}
		}
		
		return $feedback;
	}
	
        //TBO - Please optimise this function
	public function is_all_order_items_received($order_id)
	{
            $order_items = $this->order_model->get_order_items($order_id)->result_array();		
            $deliveries = $this->db->where('order_id', $order_id)->get('deliveries')->result_array();
            
            $received = false;
            //$total_order_items = 0;
            
            foreach($order_items as $order_item)
            {
                $total_delivery_items = 0;
                
                foreach($deliveries as $delivery)
                {
                    $delivery_items = $this->db
                        ->where('delivery_id', $delivery['delivery_id'])
                        ->where('item_code', $order_item['item_code'])
                        ->where('remark', $order_item['remark'])
                        ->get('delivery_items')->result_array();

                    foreach($delivery_items as $delivery_item)
                    {
                        $total_delivery_items = $total_delivery_items + $delivery_item['quantity_received'];
                    }
                }
                
                if($total_delivery_items == $order_item['quantity'])
                {
                    $received = true;
                }
                else
                {
                    return false;
                }
            }

            return $received;
	}
	
	public function is_all_delivery_request_items_received($delivery_request_id)
	{
            $delivery_request_items = $this->delivery_model->get_delivery_request_items($delivery_request_id)->result_array();
            $deliveries = $this->db->where('delivery_request_id', $delivery_request_id)->get('deliveries')->result_array();

            $received = false;

            foreach($delivery_request_items as $delivery_request_item)
            {
                $total_delivery_items = 0;
                
                foreach($deliveries as $delivery)
                {
                    $delivery_items = $this->db
                        ->where('delivery_id', $delivery['delivery_id'])
                        ->where('item_code', $delivery_request_item['item_code'])
                        ->where('remark', $delivery_request_item['remark'])
                        ->get('delivery_items')->result_array();

                    foreach($delivery_items as $delivery_item)
                    {
                        $total_delivery_items = $total_delivery_items + $delivery_item['quantity_received'];
                    }
                }

                if($total_delivery_items == $delivery_request_item['quantity'])
                {
                    $received = true;
                }
                else
                {
                    return false;
                }
            }

            return $received;
	}
	
	public function compute_new_status_DELIVERY($delivery_id, $delivery_items)
	{
            
		//tarik data dari database dan ditaro di $deliveryData
		$deliveryData = $this->delivery_model->get_delivery($delivery_id)->row_array();
		
		if ($deliveryData['confirmation_date'] != null && $this->is_items_information_updated($delivery_items))
		{
			$newStatus = 'C';
		}
		else if ($deliveryData['arrival_date'] != null)
		{
			$newStatus = 'S';
		}
		else if ($deliveryData['actual_loading_date'] != null)
		{
			$newStatus = 'L';
		}
		else
		{
			$newStatus = 'A';
		}
		
		//update database
		$this->delivery_model->change_delivery_status($delivery_id, $newStatus);
	}
	
	public function compute_new_status_DELIVERY_REQUEST($delivery_request_id)
	{
            
            $deliveryRequestData = $this->delivery_model->get_delivery_request($delivery_request_id)->row_array();
                    
            //tarik data dari database dan ditaro di $deliveryData
            //$deliveryData = $this->delivery_model->get_delivery($deliveryRequestData['delivery_id'])->row_array();

            if ($this->is_all_delivery_request_items_received($delivery_request_id) && $deliveryRequestData['status'] != 'X')
            {
                $newStatus = 'C';
            }
            else
            {
                $newStatus = 'A';
            }
            //update database
            $this->delivery_model->change_delivery_request_status($delivery_request_id, $newStatus);
            
	}
	
	public function compute_new_status_ORDER($order_id)
	{
		$orderData = $this->order_model->get_order($order_id)->row_array();
		$customerData = $this->customer_model->get_customer($orderData['customer_id'])->row_array();
		if ($this->is_all_order_items_received($order_id))
		{
			$newStatus = 'C';
		}
		//else if ($orderData['production_completed_date'] != NULL && $customerData['is_credit_blocked'] == 1)
		//{
		//	$newStatus = 'B';
		//}
		else if ($orderData['production_completed_date'] != NULL)
		{
			$newStatus = 'R';
		}
		else if ($orderData['production_start_date'] != NULL)
		{
			$newStatus = 'P';
		}
		else
		{
			$newStatus = 'N';
		}
		
		$this->order_model->change_order_status($order_id, $newStatus);
	}
	
}