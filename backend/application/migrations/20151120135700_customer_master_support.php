<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Customer_master_support extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_column('customers', array(
			'payment_term_type' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'DEFAULT' => 'C',
				'after' => 'credit_blocked_reason',
			),
			'payment_term_value' => array(
				'type' => 'INT',
				'constraint' => '11',
				'NULL' => TRUE,
				'after' => 'payment_term_type',
			),
			'payment_term_credit_limit' => array(
				'type' => 'INT',
				'constraint' => '20',
				'NULL' => TRUE,
				'after' => 'payment_term_value',
			),
			'consignment' => array(
				'type' => 'INT',
				'constraint' => '1',
				'NULL' => TRUE,
				'after' => 'payment_term_value',
			),
			'site_id' => array(
				'type' => 'BIGINT',
				'NULL' => TRUE,
				'after' => 'consignment',
			),
			'commission' => array(
				'type' => 'INT',
				'constraint' => '1',
				'NULL' => TRUE,
				'after' => 'site_id',
			),
			'commission_type' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'NULL' => TRUE,
				'after' => 'commission',
			),
			'commission_persent' => array(
				'type' => 'DECIMAL',
				'constraint' => '5,2',
				'NULL' => TRUE,
				'after' => 'commission_type',
			),
			'commission_value' => array(
				'type' => 'INT',
				'constraint' => '11',
				'NULL' => TRUE,
				'after' => 'commission_persent',
			)
		));
	}
	
	public function down()
	{
		$this->dbforge->drop_column('customers', 'payment_term_type');
		$this->dbforge->drop_column('customers', 'payment_term_value');
		$this->dbforge->drop_column('customers', 'payment_term_credit_limit');
		$this->dbforge->drop_column('customers', 'consignment');
		$this->dbforge->drop_column('customers', 'site_id');
		$this->dbforge->drop_column('customers', 'commission');
		$this->dbforge->drop_column('customers', 'commission_type');
		$this->dbforge->drop_column('customers', 'commission_persent');
		$this->dbforge->drop_column('customers', 'commission_value');
	}
}