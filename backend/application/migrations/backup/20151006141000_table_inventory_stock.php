<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Table_inventory_stock extends CI_Migration {

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
		
		$modify = array(
				'site_reference' => array(
					'name' => 'site_id',
					'type' => 'BIGINT',
					'constraint' => '20',
			),
				'storage_name' => array(
					'name' => 'storage_id',
					'type' => 'BIGINT',
					'constraint' => '20',
			),
				'bin_name' => array(
					'name' => 'bin_id',
					'type' => 'BIGINT',
					'constraint' => '20',
			),
		);
		$this->dbforge->modify_column('inventory_stocks', $modify);
		
		$inventory = array(
				'purchase_delivered_item_id' => array(
						'type' => 'BIGINT',
						'constraint' => '20',
						'after' => 'inventory_stock_id'
				),
				'batch_id' => array(
						'type' => 'BIGINT',
						'constraint' => '20',
						'after' => 'bin_id'
				)
		);
		$this->dbforge->add_column('inventory_stocks', $inventory);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('purchase_delivered_items', 'batch_id');
		$this->dbforge->drop_column('inventory_stocks', 'purchase_delivered_item_id');
		$this->dbforge->drop_column('inventory_stocks', 'batch_id');
		$modify = array(
				'site_id' => array(
					'name' => 'site_reference',
					'type' => 'VARCHAR',
					'constraint' => '10',
			),
				'storage_id' => array(
					'name' => 'storage_name',
					'type' => 'VARCHAR',
					'constraint' => '100',
			),
				'bin_id' => array(
					'name' => 'bin_name',
					'type' => 'VARCHAR',
					'constraint' => '100',
			),
		);
		$this->dbforge->modify_column('inventory_stocks', $modify);
	}
}