<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_stock_movements_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'stock_movement_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => '30',
			),
			'document_number' => array(
				'type' => 'VARCHAR',
				'constraint' => '15',
				'null' => TRUE,
			),
			'document_reference' => array(
				'type' => 'VARCHAR',
				'constraint' => '20',
				'null' => TRUE,
			),
			'posting_date' => array(
				'type' => 'DATETIME',
				'null' => TRUE,
			),
			'quantity' => array(
				'type' => 'INT',
				'null' => TRUE,
			),
			'uom' => array(
				'type' => 'VARCHAR',
				'constraint' => '10',
				'null' => TRUE,
			),
			'uom_quantity' => array(
				'type' => 'INT',
				'null' => TRUE,
			),
			'email' => array(
				'type' => 'VARCHAR',
				'constraint' => '20',
				'null' => TRUE,
			),
			'type' => array(
				'type' => 'VARCHAR',
				'constraint' => '10',
				'null' => TRUE,
			),
			'price' => array(
				'type' => 'INT',
				'null' => TRUE,
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('stock_movement_id', TRUE);
		$this->dbforge->create_table('stock_movements', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('stock_movements', TRUE);
	}
}