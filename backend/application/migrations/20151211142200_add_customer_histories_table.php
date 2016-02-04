<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_customer_histories_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'history_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'customer_id' => array(
				'type' => 'BIGINT',
				'constraint' => '20',
			),
			'user_id' => array(
				'type' => 'BIGINT',
				'constraint' => '20',
			),
			'section' => array(
				'type' => 'VARCHAR',
				'constraint' => '50',
				'NULL' => TRUE,
			),
			'field' => array(
				'type' => 'VARCHAR',
				'constraint' => '50',
				'NULL' => TRUE,
			),
			'old_data' => array(
				'type' => 'VARCHAR',
				'constraint' => '1000',
				'NULL' => TRUE,
			),
			'new_data' => array(
				'type' => 'VARCHAR',
				'constraint' => '1000',
				'NULL' => TRUE,
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('history_id', TRUE);
		$this->dbforge->create_table('customer_histories', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('customer_histories', TRUE);
	}
}