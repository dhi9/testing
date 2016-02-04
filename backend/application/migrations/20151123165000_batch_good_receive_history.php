<?php

class Migration_Batch_good_receive_history extends CI_Migration {

  public function up()
  {
    $this->dbforge->add_field(
      array(
        'batch_good_receive_history_id' => array(
                                        'type' => 'BIGINT',
                                        'unsigned' => TRUE,
                                        'auto_increment' => TRUE,
                                        ),
        'batch_id' => array(
                                        'type' => 'BIGINT',
                                        'constraint' => 20,
                                        ),
        'batch_reference' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 10
                                        ),
        'date_good_receive' => array(
                                        'type' => 'DATETIME'
                                        ),
        'quantity' => array(
                                        'type' => 'DECIMAL',
                                        'constraint' => '12,3',
                                        ),
        'item_unit' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 10
                                        ),
        'notes' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 600,
                                        'NULL' => TRUE
                                        ),
      )                          
    );
    $this->dbforge->add_key('batch_good_receive_history_id', TRUE);
    $this->dbforge->create_table('batch_good_receive_history', TRUE);
	
  }

  public function down()
  {
    $this->dbforge->drop_table('batch_good_receive_history');
  }

}

?>