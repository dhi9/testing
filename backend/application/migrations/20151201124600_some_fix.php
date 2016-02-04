<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Some_fix extends CI_Migration {

	public function up()
	{
		$this->dbforge->modify_column('storage_locations', array(
			'status' => array(
				'name' => 'status',
				'type' => 'VARCHAR',
				'constraint' => 1,
				'default' => 'A',
			),
		));
	}
	
	public function down()
	{
		$this->dbforge->modify_column('storage_locations', array(
			'status' => array(
				'name' => 'status',
				'type' => 'VARCHAR',
				'constraint' => 1,
				'NULL' => TRUE,
			),
		));
	}
}