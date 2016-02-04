<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Table_structure_for_this_commit extends CI_Migration {

	public function up() {
		$fields = array(
			'remark' => array(
				'type' => 'VARCHAR',
				'constraint' => 200,
				'null' => TRUE,
			),
		);
		$this->dbforge->modify_column('requests_delivery_requests', $fields);
	}
	
	public function down() {
		$fields = array(
			'remark' => array(
				'type' => 'VARCHAR',
				'constraint' => 200,
				'null' => FALSE,
			),
		);
		$this->dbforge->modify_column('requests_delivery_requests', $fields);
	}
}