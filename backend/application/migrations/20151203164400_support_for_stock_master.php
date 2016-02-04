<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Support_for_stock_master extends CI_Migration {

	public function up()
	{
		/*$this->dbforge->add_column('items', array(
			'date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP',
			'date_updated' => array(
				'type' => 'DATETIME',
				'NULL' => TRUE,
			),
		));*/
		
		$this->dbforge->add_field(array(
			'item_location_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE,
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => 30,
			),
			'site_id' => array(
				'type' => 'BIGINT',
				'NULL' => TRUE,
			),
			'storage_id' => array(
				'type' => 'BIGINT',
				'NULL' => TRUE,
			),
			'bin_id' => array(
				'type' => 'BIGINT',
				'NULL' => TRUE,
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => 1,
				'default' => 'A',
			),
		));
		$this->dbforge->add_key('item_location_id', TRUE);
		$this->dbforge->create_table('item_locations', TRUE);
		
		$this->dbforge->add_field(array(
			'item_alternate_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE,
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => 30,
			),
			'alternate_code' => array(
				'type' => 'VARCHAR',
				'constraint' => 30,
				'NULL' => TRUE,
			),
			'alternate_name' => array(
				'type' => 'VARCHAR',
				'constraint' => 50,
				'NULL' => TRUE,
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => 1,
				'default' => 'A'
			),
		));
		$this->dbforge->add_key('item_alternate_id', TRUE);
		$this->dbforge->create_table('item_alternates', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('items', 'date_created');
		$this->dbforge->drop_column('items', 'date_updated');
		
		$this->dbforge->drop_table('item_locations', TRUE);
		$this->dbforge->drop_table('item_alternates', TRUE);
	}
}