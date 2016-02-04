<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Modify_draft_orders_table extends CI_Migration {

	public function up()
	{
		$fields = array(
	        'product_type' => array(
	                'name' => 'order_type',
					'type' => 'VARCHAR',
					'constraint' => '1',
	        ),
		);
		$this->dbforge->modify_column('draft_orders', $fields);
	}
	
	public function down()
	{
		$fields = array(
	        'order_type' => array(
	                'name' => 'product_type',
					'type' => 'VARCHAR',
					'constraint' => '1',
	        ),
		);
		$this->dbforge->modify_column('draft_orders', $fields);
	}
}