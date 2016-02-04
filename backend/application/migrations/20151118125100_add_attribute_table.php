<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_attribute_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(
			array(
				'attribute_id' => array(
					'type' => 'BIGINT',
					'auto_increment' => TRUE,
				),
				'attribute_name' => array(
					'type' => 'VARCHAR',
					'constraint' => 20,
				),
				'default_value' => array(
					'type' => 'VARCHAR',
					'constraint' => 50,
					'null' => TRUE,
				),
				'status' => array(
					'type' => 'VARCHAR',
					'constraint' => 1,
					'default' => 'X',
				),
			)
		);
		$this->dbforge->add_field("date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('attribute_id', TRUE);
		$this->dbforge->create_table('attributes', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('attributes');
	}
}