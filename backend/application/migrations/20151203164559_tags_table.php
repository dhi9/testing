<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Tags_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'tag_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'tag_name' => array(
				'type' => 'VARCHAR',
				'constraint' => '30',
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'DEFAULT' => 'A'
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('tag_id', TRUE);
		$this->dbforge->create_table('tags', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('tags', TRUE);
	}
}