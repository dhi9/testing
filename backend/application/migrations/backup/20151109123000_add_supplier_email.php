<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_supplier_email extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_column('requests', array(
			'supplier_email' => array(
				'type' => 'VARCHAR',
				'constraint' => '100',
				'NULL' => TRUE,
				'after' => 'approver_id',
			),
		));
	}
	
	public function down()
	{
		$this->dbforge->drop_column('requests', 'supplier_email');
	}
}