<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Table_pengiriman extends CI_Migration {

	public function up()
	{
		$deliveries = array(
			'vendor_id' => array(
				'type' => 'BIGINT',
				'constraint' => '20',
				'after' => 'notes'
			),
			'reciever' => array(
				'type' => 'VARCHAR',
				'constraint' => '100',
				'after' => 'confirmation_date'
			)
		);
		$this->dbforge->add_column('deliveries', $deliveries);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('deliveries', 'vendor_id');
		$this->dbforge->drop_column('deliveries', 'reciever');
	}
}