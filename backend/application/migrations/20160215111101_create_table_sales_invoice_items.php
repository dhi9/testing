<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_table_sales_invoice_items extends CI_Migration {
	
	public function up()
	{
		$this->dbforge->add_field(array(
			'invoice_item_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'invoice_id' => array(
				'type' => 'BIGINT',
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => 20,
			),
			'attributes' => array(
				'type' => 'BLOB',
			),
			'quantity' => array(
				'type' => 'INT',
				'constraint' => 11,
			),
			'item_unit' => array(
				'type' => 'VARCHAR',
				'constraint' => 10,
				'NULL' => TRUE,
			),
			'cost'  => array(
				'type' => 'INT',
				'constraint' => 20,
			),
			'disc_percent'  => array(
				'type' => 'DECIMAL',
				'constraint' => 5.0,
				'NULL' => TRUE,
			),
			'disc_value'  => array(
				'type' => 'INT',
				'constraint' => 20,
				'NULL' => TRUE,
			),
			'remark'  => array(
				'type' => 'VARCHAR',
				'constraint' => 200,
				'NULL' => TRUE,
			)
		));
		$this->dbforge->add_key('invoice_item_id', TRUE);
		$this->dbforge->create_table('sales_invoice_items');
	}
	
	public function down()
	{
		$this->dbforge->drop_table('sales_invoice_items');
	}
}