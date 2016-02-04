<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_attributes_to_manual_stock_settings_table extends CI_Migration {

	public function up()
	{
		$batchs = array(
			'attributes' => array(
				'type' => 'TEXT',
				'after' => 'batch_id'
			)
		);
		$this->dbforge->add_column('manual_stock_setting_items', $batchs);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('manual_stock_setting_items', 'attributes');
	}
}