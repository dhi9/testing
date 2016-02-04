<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Stock_opname_items_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'stock_opname_item_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'stock_opname_id' => array(
				'type' => 'BIGINT',
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => '30',
			),
			'site_id' => array(
				'type' => 'BIGINT',
				'NULL' => true,
			),
			'batch_id' => array(
				'type' => 'BIGINT',
				'NULL' => true,
			),
			'aktual_quantity' => array(
				'type' => 'INT',
				'constraint' => '11',
				'NULL' => true,
			),
			'system_quantity' => array(
				'type' => 'INT',
				'constraint' => '11',
				'NULL' => true,
			),
			'adjustment_quantity' => array(
				'type' => 'INT',
				'constraint' => '11',
				'NULL' => true,
			),
			'base_uom' => array(
				'type' => 'VARCHAR',
				'constraint' => '10',
				'NULL' => true,
			),
			'remark' => array(
				'type' => 'VARCHAR',
				'constraint' => '200',
				'NULL' => true,
			),
			'approver_id' => array(
				'type' => 'BIGINT',
				'NULL' => true,
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'DEFAULT' => 'X'
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('stock_opname_item_id', TRUE);
		$this->dbforge->create_table('stock_opname_items', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('stock_opname_items', TRUE);
	}
}