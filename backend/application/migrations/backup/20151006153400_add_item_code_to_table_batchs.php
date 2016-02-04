<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_item_code_to_table_batchs extends CI_Migration {

	public function up()
	{
		$batchs = array(
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => '30',
				'after' => 'batch_reference'
			)
		);
		$this->dbforge->add_column('batchs', $batchs);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('batchs', 'item_code');
	}
}