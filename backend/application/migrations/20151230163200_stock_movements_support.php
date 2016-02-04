<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Stock_movements_support extends CI_Migration {

	public function up()
	{
		$stock_movements = array(
			'site_id' => array(
				'type' => 'BIGINT',
				'NULL' => TRUE,
				'after' => 'posting_date'
			),
			'batch_id' => array(
				'type' => 'BIGINT',
				'NULL' => TRUE,
				'after' => 'site_id'
			),
		);
		$this->dbforge->add_column('stock_movements', $stock_movements);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('stock_movements', 'site_id');
		$this->dbforge->drop_column('stock_movements', 'batch_id');
	}
}