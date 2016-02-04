<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_draft_id_to_orders_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_column('orders', array(
			'draft_id' => array(
				'type' => 'BIGINT',
				'after' => 'order_id',
			),
		));
	}
	
	public function down()
	{
		$this->dbforge->drop_column('orders', 'draft_id');
	}
}