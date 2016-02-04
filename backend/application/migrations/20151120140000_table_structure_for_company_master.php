<?php

class Migration_Table_structure_for_company_master extends CI_Migration {

  public function up()
  {
    $this->dbforge->add_field(
      array(
        'company_id' => array(
                                        'type' => 'BIGINT',
                                        'unsigned' => TRUE,
                                        'auto_increment' => TRUE,
                                        ),
        'company_name' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100,
                                        ),
        'company_address' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 500
                                        ),
        'company_city' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 50
                                        ),
        'company_postcode' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 10
                                        ),
        'company_phone_number' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 20
                                        ),
        'company_fax_number' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 20
                                        ),
        'company_pos_name' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'company_pos_address' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 500
                                        ),
        'company_pos_city' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 50
                                        ),
        'company_pos_postcode' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 10
                                        ),
        'company_pos_phone_number' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 20
                                        ),
        'company_pos_fax_number' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 20
                                        ),
        'company_number_npwp' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 20
                                        ),
        'delivery_name' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'delivery_prefix' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'delivery_image' => array(
                                        'type' => 'LONGBLOB',
                                        ),
        'delivery_header' => array(
                                        'type' => 'TEXT'
                                        ),
        'delivery_footer' => array(
                                        'type' => 'TEXT'
                                        ),
        'ir_receipt_name' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'ir_invoice_name' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'ir_prefix' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'ir_image' => array(
                                        'type' => 'LONGBLOB',
                                        ),
        'ir_header' => array(
                                        'type' => 'TEXT'
                                        ),
        'ir_footer' => array(
                                        'type' => 'TEXT'
                                        ),
        'order_po_name' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'order_po_prefix' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'order_so_name' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'order_so_prefix' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'order_image' => array(
                                        'type' => 'LONGBLOB',
                                        ),
        'order_pic' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'order_term_payment' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 1
                                        ),
        'order_header' => array(
                                        'type' => 'TEXT'
                                        ),
        'order_footer' => array(
                                        'type' => 'TEXT'
                                        ),
        'consignment_name' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'consignment_order_prefix' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'consignment_image' => array(
                                        'type' => 'LONGBLOB',
                                        ),
        'consignment_pic' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 100
                                        ),
        'consignment_header' => array(
                                        'type' => 'TEXT'
                                        ),
        'consignment_footer' => array(
                                        'type' => 'TEXT'
                                        ),
        'pkp' => array(
                                        'type' => 'INT',
                                        'constraint' => 1
                                        ),
        'ppn' => array(
                                        'type' => 'DECIMAL',
                                        'constraint' => '5,2',

                                        ),
      )                          
    );
    $this->dbforge->add_key('company_id', TRUE);
    $this->dbforge->create_table('company', TRUE);
	
  }

  public function down()
  {
    $this->dbforge->drop_table('company');
  }

}

?>