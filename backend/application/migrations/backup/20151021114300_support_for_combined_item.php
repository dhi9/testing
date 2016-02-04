<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Support_for_combined_item extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'combined_item_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'customer_id' => array(
				'type' => 'BIGINT',
				'null' => TRUE,
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => '30',
			),
			'item_name' => array(
				'type' => 'VARCHAR',
				'constraint' => '50',
			),
			'item_unit' => array(
				'type' => 'VARCHAR',
				'constraint' => '10',
				'null' => TRUE,
			),
			'value_currency' => array(
				'type' => 'VARCHAR',
				'constraint' => '3',
				'null' => TRUE,
			),
			'value_amount' => array(
				'type' => 'DECIMAL',
				'constraint' => '17,2',
				'null' => TRUE,
			),
			'child_items' => array(
				'type' => 'VARCHAR',
				'constraint' => '4000',
			),
		));
		$this->dbforge->add_key('combined_item_id', TRUE);
		$this->dbforge->create_table('customer_combined_items', TRUE);
		
		$this->dbforge->add_column('order_items', array(
			'child_items' => array(
				'type' => 'VARCHAR',
				'constraint' => '4000',
			),
			'length' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'item_code',
			),
			'width' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'length',
			),
			'height' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'width',
			),
		));
		
		$this->dbforge->add_column('delivery_request_items', array(
			'length' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'item_code',
			),
			'width' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'length',
			),
			'height' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'width',
			),
		));
		
		$this->dbforge->add_column('delivery_items', array(
			'length' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'item_code',
			),
			'width' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'length',
			),
			'height' => array(
				'type' => 'DECIMAL',
				'constraint' => '10,0',
				'null' => TRUE,
				'after' => 'width',
			),
		));
	}
	
	public function down()
	{
		$this->dbforge->drop_table('customer_combined_items', TRUE);
		
		$this->dbforge->drop_column('order_items', 'child_items');
		$this->dbforge->drop_column('order_items', 'length');
		$this->dbforge->drop_column('order_items', 'width');
		$this->dbforge->drop_column('order_items', 'height');
		
		$this->dbforge->drop_column('delivery_request_items', 'length');
		$this->dbforge->drop_column('delivery_request_items', 'width');
		$this->dbforge->drop_column('delivery_request_items', 'height');
		
		$this->dbforge->drop_column('delivery_items', 'length');
		$this->dbforge->drop_column('delivery_items', 'width');
		$this->dbforge->drop_column('delivery_items', 'height');
	}
}