<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_bank_master_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'bank_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'bank_name' => array(
				'type' => 'VARCHAR',
				'constraint' => '50',
				'NULL' => TRUE,
			),
			'account_name' => array(
				'type' => 'VARCHAR',
				'constraint' => '50',
				'NULL' => TRUE,
			),
			'account_number' => array(
				'type' => 'VARCHAR',
				'constraint' => '50',
				'NULL' => TRUE,
			),
			'telex_transfer' => array(
				'type' => 'TINYINT',
				'constraint' => '1',
				'default' => 0,
			),
			'credit_card' => array(
				'type' => 'TINYINT',
				'constraint' => '1',
				'default' => 0,
			),
			'debit_card' => array(
				'type' => 'TINYINT',
				'constraint' => '1',
				'default' => 0,
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'default' => 'A',
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('bank_id', TRUE);
		$this->dbforge->create_table('banks', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('banks', TRUE);
	}
}