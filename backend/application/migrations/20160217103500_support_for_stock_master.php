<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Support_for_stock_master extends CI_Migration {

	public function up()
	{
		$items = array(
			'status' => array(
				'type' => 'VARCHAR',
                'constraint' => 1,
                'DEFAULT' => 'A'
			)
		);
		$this->dbforge->add_column('items', $items);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('items', 'status');
	}
}