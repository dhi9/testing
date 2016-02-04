<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Modify_request_delivery_requests_table extends CI_Migration {

	public function up()
	{
		$fields = array(
	        'warehouse_id' => array(
	                'name' => 'site_id',
					'type' => 'BIGINT',
	        ),
		);
		$this->dbforge->modify_column('request_delivery_requests', $fields);
	}
	
	public function down()
	{
		$fields = array(
	        'site_id' => array(
	                'name' => 'warehouse_id',
					'type' => 'BIGINT',
	        ),
		);
		$this->dbforge->modify_column('request_delivery_requests', $fields);
	}
}