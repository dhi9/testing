<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_category_to_items_support extends CI_Migration {

	public function up()
	{
		$orders = array(
			'category_id' => array(
				'type' => 'BIGINT',
				'after' => 'item_name'
			),
		);
		$this->dbforge->add_column('items', $orders);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('items', 'category_id');
	}
}