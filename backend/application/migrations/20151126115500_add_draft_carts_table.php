<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_draft_carts_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'draft_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'draft_reference' => array(
				'type' => 'VARCHAR',
				'constraint' => '50',
			),
			'draft_creator' => array(
				'type' => 'BIGINT',
			),
			'draft_data' => array(
				'type' => 'VARCHAR',
				'constraint' => '6000',
				'null' => TRUE,
			),
			'draft_approver' => array(
				'type' => 'BIGINT',
			),
			'type' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
			),
			'order_notes' => array(
				'type' => 'TEXT',
				'null' => TRUE,
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('draft_id', TRUE);
		$this->dbforge->create_table('draft_carts', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('draft_carts', TRUE);
	}
}