<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_batch extends CI_Migration {

	public function up()
	{
		$batch = array(
			'batch_id' => array(
				'type' => 'BIGINT',
				'constraint' => '20',
				'after' => 'bin_id'
			)
		);
		$this->dbforge->add_column('purchase_delivered_items', $batch);
		
	}
	
	public function down()
	{
		$this->dbforge->drop_column('purchase_delivered_items', 'batch_id');
	}
}