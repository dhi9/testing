<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Support_for_user_master extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_column('users', array(
			'full_name' => array(
				'type' => 'VARCHAR',
				'constraint' => '200',
				'NULL' => TRUE,
				'after' => 'username',
			),
			'approval' => array(
				'type' => 'VARCHAR',
				'constraint' => '200',
				'default' => '[]',
				'after' => 'access',
			),
		));
		
		$this->dbforge->add_field(
			array(
				'user_permission_id' => array(
					'type' => 'BIGINT',
					'auto_increment' => TRUE,
				),
				'user_id' => array(
					'type' => 'BIGINT',
				),
				'permission_code' => array(
					'type' => 'VARCHAR',
					'constraint' => 100,
					'null' => TRUE,
				),
				'status' => array(
					'type' => 'VARCHAR',
					'constraint' => 1,
					'default' => 'X',
				),
			)
		);
		$this->dbforge->add_key('user_permission_id', TRUE);
		$this->dbforge->create_table('user_permissions', TRUE);
		
		$this->dbforge->add_field(
			array(
				'user_approval_id' => array(
					'type' => 'BIGINT',
					'auto_increment' => TRUE,
				),
				'user_id' => array(
					'type' => 'BIGINT',
				),
				'po_approval' => array(
					'type' => 'TINYINT',
					'constraint' => 1,
					'default' => 0,
				),
				'po_max_usd' => array(
					'type' => 'DECIMAL',
					'constraint' => 17.2,
					'null' => TRUE,
				),
				'po_max_idr' => array(
					'type' => 'DECIMAL',
					'constraint' => 17.2,
					'null' => TRUE,
				),
				'po_max_eur' => array(
					'type' => 'DECIMAL',
					'constraint' => 17.2,
					'null' => TRUE,
				),
				'so_approval' => array(
					'type' => 'TINYINT',
					'constraint' => 1,
					'default' => 0,
				),
				'so_max_usd' => array(
					'type' => 'DECIMAL',
					'constraint' => 17.2,
					'null' => TRUE,
				),
				'so_max_idr' => array(
					'type' => 'DECIMAL',
					'constraint' => 17.2,
					'null' => TRUE,
				),
				'so_max_eur' => array(
					'type' => 'DECIMAL',
					'constraint' => 17.2,
					'null' => TRUE,
				),
				'inventory_adjustment' => array(
					'type' => 'TINYINT',
					'constraint' => 1,
					'default' => 0,
				),
				'so_max_discount_approval' => array(
					'type' => 'TINYINT',
					'constraint' => 1,
					'default' => 0,
				),
				'so_max_discount' => array(
					'type' => 'DECIMAL',
					'constraint' => 17.2,
					'null' => TRUE,
				),
				'payment' => array(
					'type' => 'TINYINT',
					'constraint' => 1,
					'default' => 0,
				),
				'consignment' => array(
					'type' => 'TINYINT',
					'constraint' => 1,
					'default' => 0,
				),
			)
		);
		$this->dbforge->add_key('user_approval_id', TRUE);
		$this->dbforge->create_table('user_approvals', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('users', 'full_name');
		$this->dbforge->drop_column('users', 'approval');
		
		$this->dbforge->drop_table('user_permissions', TRUE);
		
		$this->dbforge->drop_table('user_approvals', TRUE);
	}
}