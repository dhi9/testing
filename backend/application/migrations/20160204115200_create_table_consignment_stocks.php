<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_table_consignment_stocks extends CI_Migration {
	
	public function up()
	{
		$this->dbforge->add_field(array(
			'consignment_stock_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'customer_id' => array(
				'type' => 'BIGINT',
			),
			'delivery_address_id' => array(
				'type' => 'BIGINT',
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => 30,
			),
			'attibutes'  => array(
				'type' => 'BLOB',
				'NULL' => TRUE,
			),
			'quantity'  => array(
				'type' => 'BIGINT',
				'NULL' => TRUE,
			)
		));
		$this->dbforge->add_key('consignment_stock_id', TRUE);
		$this->dbforge->create_table('consignment_stocks');
	}
	
	public function down()
	{
		$this->dbforge->drop_table('consignment_stocks');
	}
}