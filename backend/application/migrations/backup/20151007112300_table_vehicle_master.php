<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Table_vehicle_master extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(
				array(
						'vehicle_id' => array(
								'type' => 'BIGINT',
								'auto_increment' => TRUE,
						),
						'vendor_id' => array(
								'type' => 'BIGINT',
						),
						'vehicle_plate' => array(
								'type' => 'VARCHAR',
								'constraint' => 20
						),
						'kir_number' => array(
								'type' => 'VARCHAR',
								'constraint' => 50
						),
						'vehicle_type_id' => array(
								'type' => 'VARCHAR',
								'constraint' => 2
						),
						'max_weight' => array(
								'type' => 'BIGINT',
						),
						'max_volume' => array(
								'type' => 'BIGINT',
						),
						'capabilities' => array(
								'type' => 'VARCHAR',
								'constraint' => 100,
								'NULL' => TRUE
						),
						'date_modified' => array(
								'type' => 'DATETIME',
						),
						'status' => array(
								'type' => 'VARCHAR',
								'constraint' => 1
						)
				)
				);
		$this->dbforge->add_field("date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('vehicle_id', TRUE);
		$this->dbforge->create_table('vehicles', TRUE);
		
		$this->dbforge->add_field(
				array(
						'vehicle_service_id' => array(
								'type' => 'BIGINT',
								'auto_increment' => TRUE,
						),
						'vehicle_id' => array(
								'type' => 'BIGINT',
						),
						'service_name' => array(
								'type' => 'VARCHAR',
								'constraint' => 200,
						),
						'service_date' => array(
								'type' => 'DATETIME',
								'NULL' => TRUE
						),
						'vendor_id' => array(
								'type' => 'BIGINT',
						),
						'date_modified' => array(
								'type' => 'DATETIME',
								'NULL' => TRUE
						),
						'cost' => array(
								'type' => 'DECIMAL',
								'constraint' => '17,2',
						),
				)
				);
		
		
		
		$this->dbforge->add_field("date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('vehicle_service_id', TRUE);
		$this->dbforge->create_table('vehicle_services', TRUE);
	
		$this->dbforge->add_field(
				array(
						'vehicle_type_id' => array(
								'type' => 'BIGINT',
								'auto_increment' => TRUE,
						),
						'vehicle_type' => array(
								'type' => 'VARCHAR',
								'constraint' => 20
						),
					)
				);
		
		
		
		$this->dbforge->add_key('vehicle_type_id', TRUE);
		$this->dbforge->create_table('vehicle_types', TRUE);
	
	}
	
	public function down()
	{

		$this->dbforge->drop_table('vehicles');
		$this->dbforge->drop_table('vehicle_services');
		$this->dbforge->drop_table('vehicle_types');
	}
}