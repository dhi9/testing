<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Site_master_support extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_column('sites', array(
			'consignment' => array(
				'type' => 'INT',
				'constraint' => '1'
			),
			'customer_id' => array(
				'type' => 'BIGINT',
				'NULL' => TRUE,
				'after' => 'consignment',
			),
		));
	}
	
	public function down()
	{
		$this->dbforge->drop_column('sites', 'consignment');
		$this->dbforge->drop_column('sites', 'customer_id');
	}
}