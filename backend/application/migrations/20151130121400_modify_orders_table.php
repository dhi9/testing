<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Modify_orders_table extends CI_Migration {

	public function up()
	{
		$fields = array(
	        'product_type' => array(
	                'name' => 'order_type',
					'type' => 'VARCHAR',
					'constraint' => '1',
	        ),
		);
		$this->dbforge->modify_column('orders', $fields);


		$orders = array(
			'delivery_type' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
			)
		);
		$this->dbforge->add_column('orders', $orders);
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
		$this->dbforge->modify_column('orders', $fields);
		$this->dbforge->drop_column('orders', 'delivery_type');
	}
}