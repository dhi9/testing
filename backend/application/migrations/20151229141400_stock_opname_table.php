<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Stock_opname_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'stock_opname_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'opname_date' => array(
				'type' => 'VARCHAR',
				'constraint' => '20',
			),
			'opname_start_date' => array(
				'type' => 'DATETIME',
				'NULL' => true,
			),
			'opname_finish_date' => array(
				'type' => 'DATETIME',
				'NULL' => true,
			),
			'opname_valid_date' => array(
				'type' => 'DATETIME',
				'NULL' => true,
			),
			'site_id' => array(
				'type' => 'BIGINT',
				'NULL' => true,
			),
			'opname_creator_id' => array(
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
		$this->dbforge->add_key('stock_opname_id', TRUE);
		$this->dbforge->create_table('stock_opname', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('stock_opname', TRUE);
	}
}