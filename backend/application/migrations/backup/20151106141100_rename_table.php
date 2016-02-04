<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Rename_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->rename_table('requests_item_requests', 'request_items');
		$this->dbforge->rename_table('service_item_requests', 'request_services');
		$this->dbforge->rename_table('requests_delivery_requests', 'request_delivery_requests');
		$this->dbforge->rename_table('purchase_delivery_request_items', 'request_delivery_request_items');
		$this->dbforge->rename_table('service_completed_requests', 'request_delivery_services');
		$this->dbforge->rename_table('purchase_delivered_items', 'request_delivery_items');
	}
	
	public function down()
	{
		$this->dbforge->rename_table('request_items', 'requests_item_requests');
		$this->dbforge->rename_table('request_services', 'service_item_requests');
		$this->dbforge->rename_table('request_delivery_requests', 'requests_delivery_requests');
		$this->dbforge->rename_table('request_delivery_request_items', 'purchase_delivery_request_items');
		$this->dbforge->rename_table('request_delivery_services', 'service_completed_requests');
		$this->dbforge->rename_table('request_delivery_items', 'purchase_delivered_items');
	}
}