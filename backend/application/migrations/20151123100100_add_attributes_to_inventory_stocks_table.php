<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_attributes_to_inventory_stocks_table extends CI_Migration {

	public function up()
	{
		$batchs = array(
			'attributes' => array(
				'type' => 'TEXT',
				'after' => 'quality'
			)
		);
		$this->dbforge->add_column('inventory_stocks', $batchs);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('inventory_stocks', 'attributes');
	}
}