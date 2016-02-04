<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Order_item_delivery_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'order_item_delivery_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'order_id' => array(
				'type' => 'BIGINT',
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => '30',
			),
			'attributes' => array(
				'type' => 'TINYTEXT',
				'NULL' => true,
			),
			'quantity' => array(
				'type' => 'INT',
				'constraint' => '11',
			),
			'site_id' => array(
				'type' => 'BIGINT',
				'NULL' => true,
			),
			'storage_id' => array(
				'type' => 'BIGINT',
				'NULL' => true,
			),
			'bin_id' => array(
				'type' => 'BIGINT',
				'NULL' => true,
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'DEFAULT' => 'A'
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('order_item_delivery_id', TRUE);
		$this->dbforge->create_table('order_item_delivery', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('order_item_delivery', TRUE);
	}
}