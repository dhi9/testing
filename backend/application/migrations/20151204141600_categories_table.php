<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Categories_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'category_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'category_name' => array(
				'type' => 'VARCHAR',
				'constraint' => '100',
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'DEFAULT' => 'A'
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('category_id', TRUE);
		$this->dbforge->create_table('categories', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('categories', TRUE);
	}
}