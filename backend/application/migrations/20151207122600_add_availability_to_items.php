<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_availability_to_items extends CI_Migration {

	public function up()
	{
		$emailcc = array(
			'availability' => array(
				'type' => 'TINYINT',
				'constraint' => 1,
				'NULL' => TRUE,
				'after' => 'item_type'
			),
		);
		$this->dbforge->add_column('items', $emailcc);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('items', 'availability');
	}
}