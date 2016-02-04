<?php

class Migration_Table_structure_for_movement_code extends CI_Migration {

  public function up()
  {
    $this->dbforge->add_field(
      array(
        'movement_code_id' => array(
                                        'type' => 'BIGINT',
                                        'unsigned' => TRUE,
                                        'auto_increment' => TRUE,
                                        ),
        'code_reference' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 10
                                        ),
        'description' => array(
                                        'type' => 'VARCHAR',
                                        'constraint' => 200
                                        ),
      )                          
    );
    $this->dbforge->add_key('movement_code_id', TRUE);
    $this->dbforge->create_table('movements_code', TRUE);
	
	 
  }

  public function down()
  {
    $this->dbforge->drop_table('movements_code');
  }

}

?>