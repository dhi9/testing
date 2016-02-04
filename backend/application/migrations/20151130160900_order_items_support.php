<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Order_items_support extends CI_Migration {

	public function up()
	{
		$orders = array(
			'attributes' => array(
				'type' => 'TEXT',
				'constraint' => '1',
			),
			'cost' => array(
				'type' => 'INT',
				'constraint' => '20',
			),
			'disc_percent' => array(
				'type' => 'DECIMAL',
				'constraint' => '5.2',
			),
			'disc_value' => array(
				'type' => 'INT',
				'constraint' => '20',
			)
		);
		$this->dbforge->add_column('order_items', $orders);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('order_items', 'attributes');
		$this->dbforge->drop_column('order_items', 'cost');
		$this->dbforge->drop_column('order_items', 'disc_percent');
		$this->dbforge->drop_column('order_items', 'disc_value');
	}
}