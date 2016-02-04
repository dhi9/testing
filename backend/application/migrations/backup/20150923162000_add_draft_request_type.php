<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_draft_request_type extends CI_Migration {

	public function up()
	{
		$fields = array(
			'type' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'after' => 'date_created'
			)
		);
		$this->dbforge->add_column('draft_requests', $fields);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('draft_requests', 'type');
	}
}