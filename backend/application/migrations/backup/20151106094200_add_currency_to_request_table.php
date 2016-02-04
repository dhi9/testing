<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_currency_to_request_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_column('requests', array(
			'currency' => array(
				'type' => 'VARCHAR',
				'constraint' => '3',
				'after' => 'date_modified',
			),
		));
	}
	
	public function down()
	{
		$this->dbforge->drop_column('requests', 'currency');
	}
}