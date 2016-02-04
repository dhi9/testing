<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_customer extends CI_Migration {

	public function up()
	{
		$customers = array(
			'customer_reference' => array(
				'type' => 'VARCHAR',
				'constraint' => '15',
				'after' => 'customer_id',
				'NULL' => TRUE
			)
		);
		$this->dbforge->add_column('customers', $customers);
		
		$customer_delivery_addresses = array(
				'description' => array(
						'type' => 'VARCHAR',
						'constraint' => '50',
						'after' => 'customer_id',
						'NULL' => TRUE
				),
				'area' => array(
						'type' => 'VARCHAR',
						'constraint' => '50',
						'after' => 'delivery_address',
						'NULL' => TRUE
				),
				'city' => array(
						'type' => 'VARCHAR',
						'constraint' => '50',
						'after' => 'area',
						'NULL' => TRUE
				),
				'pic_name' => array(
						'type' => 'VARCHAR',
						'constraint' => '100',
						'after' => 'city',
						'NULL' => TRUE
				),
				'post_code' => array(
						'type' => 'VARCHAR',
						'constraint' => '10',
						'after' => 'pic_name',
						'NULL' => TRUE
				),
				'phone_number' => array(
						'type' => 'VARCHAR',
						'constraint' => '20',
						'after' => 'post_code',
						'NULL' => TRUE
				)
		);
		$this->dbforge->add_column('customer_delivery_addresses', $customer_delivery_addresses);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('customers', 'customer_reference');
		$this->dbforge->drop_column('customer_delivery_addresses','description');
		$this->dbforge->drop_column('customer_delivery_addresses','area');
		$this->dbforge->drop_column('customer_delivery_addresses','city');
		$this->dbforge->drop_column('customer_delivery_addresses','pic_name');
		$this->dbforge->drop_column('customer_delivery_addresses','post_code');
		$this->dbforge->drop_column('customer_delivery_addresses','phone_number');
	}
}