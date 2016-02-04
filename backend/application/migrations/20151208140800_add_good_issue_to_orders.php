<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_good_issue_to_orders extends CI_Migration {

	public function up()
	{
		$emailcc = array(
			'good_issue_date' => array(
				'type' => 'DATETIME',
				'NULL' => TRUE,
			),
			'good_issue_remark' => array(
				'type' => 'VARCHAR',
				'constraint' => '200',
				'NULL' => TRUE,
			),
		);
		$this->dbforge->add_column('orders', $emailcc);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('orders', 'good_issue_date');
		$this->dbforge->drop_column('orders', 'good_issue_remark');
	}
}