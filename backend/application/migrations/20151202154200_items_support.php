<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Items_support extends CI_Migration {

	public function up()
	{
		$orders = array(
			'item_image' => array(
				'type' => 'LONGBLOB',
				'NULL' => TRUE
			),
		);
		$this->dbforge->add_column('items', $orders);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('items', 'item_image');
	}
}