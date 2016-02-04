<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_manual_stock_setting_tables extends CI_Migration {

	public function up()
	{
		 $this->dbforge->add_field(array(
			'manual_stock_setting_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'manual_stock_setting_reference' => array(
				'type' => 'VARCHAR',
				'constraint' => '20',
				'null' => TRUE,
			),
			'type' => array(
				'type' => 'VARCHAR',
				'constraint' => '4',
				'null' => TRUE,
			),
			'material' => array(
				'type' => 'INT',
				'null' => TRUE,
			),
			'creator_id' => array(
				'type' => 'BIGINT',
				'null' => TRUE,
			),
			'approver_id' => array(
				'type' => 'BIGINT',
				'null' => TRUE,
			),
			'posting_date' => array(
				'type' => 'DATETIME',
				'null' => TRUE,
			),
			'posting_name' => array(
				'type' => 'VARCHAR',
				'constraint' => '50',
				'null' => TRUE,
			),
			'site_id' => array(
				'type' => 'BIGINT',
				'null' => TRUE,
			),
			'storage_id' => array(
				'type' => 'BIGINT',
				'null' => TRUE,
			),
			'approved_date' => array(
				'type' => 'DATETIME',
				'null' => TRUE,
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'default' => 'A',
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('manual_stock_setting_id', TRUE);
		$this->dbforge->create_table('manual_stock_settings', TRUE);
		
		$this->dbforge->add_field(array(
			'manual_stock_setting_item_id' => array(
				'type' => 'BIGINT',
				'unsigned' => TRUE,
				'auto_increment' => TRUE,
			),
			'manual_stock_setting_id' => array(
				'type' => 'BIGINT',
				'null' => TRUE,
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => 30,
				'null' => TRUE,
			),
			'item_name' => array(
				'type' => 'VARCHAR',
				'constraint' => 50,
				'null' => TRUE,
			),
			'item_uom' => array(
				'type' => 'VARCHAR',
				'constraint' => 10,
				'null' => TRUE,
			),
			'quantity' => array(
				'type' => 'INT',
				'null' => TRUE,
			),
			'bin_id' => array(
				'type' => 'BIGINT',
				'null' => TRUE,
			),
			'batch_id' => array(
				'type' => 'BIGINT',
				'null' => TRUE,
			),
			'remark' => array(
				'type' => 'VARCHAR',
				'constraint' => 200,
				'null' => TRUE,
			),
		));
		$this->dbforge->add_key('manual_stock_setting_item_id', TRUE);
		$this->dbforge->create_table('manual_stock_setting_items', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('manual_stock_settings');
		$this->dbforge->drop_table('manual_stock_setting_items', TRUE);
	}
}