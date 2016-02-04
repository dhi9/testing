<?php

class Migration_Table_structure_for_order_active extends CI_Migration {

  public function up()
  {
    $this->dbforge->add_field(
      array(
        'purchase_delivered_item_id' => array(
                                        'type' => 'BIGINT',
                                        'unsigned' => TRUE,
                                        'auto_increment' => TRUE,
                                        ),
        'requests_delivery_request_id' => array(
                                        'type' => 'BIGINT',
                                        ),
        'item_code' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 20
                                        ),
        'item_unit' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 10
                                        ),
        'quantity' => array(
                                        'type' => 'INT',
                                        'constraint' => 11
                                        ),
        'date_recieved' => array(
                                        'type' => 'DATETIME'
                                        ),
        'site_id' => array(
                                        'type' => 'BIGINT',
                                        'constraint' => 20
                                        ),
        'storage_id' => array(
                                        'type' => 'BIGINT',
                                        'constraint' => 20
                                        ),
        'bin_id' => array(
                                        'type' => 'BIGINT',
                                        'constraint' => 20
                                        ),
        'remark' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 200,
        								'NULL' => TRUE
                                        ),
      )                          
    );
    $this->dbforge->add_key('purchase_delivered_item_id', TRUE);
    $this->dbforge->create_table('purchase_delivered_items');
	
	 $this->dbforge->add_field(
      array(
        'service_completed_request_id' => array(
                                        'type' => 'BIGINT',
                                        'auto_increment' => TRUE,
                                        ),
        'requests_delivery_request_id' => array(
                                        'type' => 'BIGINT',
                                        ),
        'confirmed_by' => array(
                                        'type' => 'BIGINT',
                                        ),
        'date_completed' => array(
                                        'type' => 'DATETIME',
                                        ),
        'remark' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 200,
        								'NULL' => TRUE
                                        ),
      )                          
    );

    $this->dbforge->add_field("date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
    
    $this->dbforge->add_key('service_completed_request_id', TRUE);
    $this->dbforge->create_table('service_completed_requests');
  }

  public function down()
  {
    $this->dbforge->drop_table('purchase_delivered_items');
    $this->dbforge->drop_table('service_completed_requests');
  }

}

?>