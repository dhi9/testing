<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_attributes_to_request_delivery_request_items_table extends CI_Migration {

	public function up()
	{
		$attributes = array(
			'attributes' => array(
				'type' => 'TINYTEXT',
				'null' => true,
				'after' => 'quantity'
			)
		);
		$this->dbforge->add_column('request_delivery_request_items', $attributes);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('request_delivery_request_items', 'attributes');
	}
}