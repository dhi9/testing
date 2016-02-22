<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_table_sales_invoices extends CI_Migration {
	
	public function up()
	{
		$this->dbforge->add_field(array(
			'invoice_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'invoice_reference' => array(
				'type' => 'VARCHAR',
				'constraint' => 30,
			),
			'order_id' => array(
				'type' => 'BIGINT',
			),
			'customer_id' => array(
				'type' => 'BIGINT',
			),
			'payment_type' => array(
				'type' => 'VARCHAR',
				'constraint' => 30,
			),
			'payment_bank_name' => array(
				'type' => 'VARCHAR',
				'constraint' => 30,
				'NULL' => TRUE,
			),
			'payment_date'  => array(
				'type' => 'DATETIME',
				'NULL' => TRUE,
			),
			'payment_remark'  => array(
				'type' => 'VARCHAR',
				'constraint' => 200,
				'NULL' => TRUE,
			)
		));
		$this->dbforge->add_key('invoice_id', TRUE);
		$this->dbforge->add_field("date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->create_table('sales_invoices');
	}
	
	public function down()
	{
		$this->dbforge->drop_table('sales_invoices');
	}
}