<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Item_tags_table extends CI_Migration {

	public function up()
	{
		$this->dbforge->add_field(array(
			'item_tag_id' => array(
				'type' => 'BIGINT',
				'auto_increment' => TRUE
			),
			'tag_id' => array(
				'type' => 'BIGINT',
			),
			'item_code' => array(
				'type' => 'VARCHAR',
				'constraint' => '30',
			),
			'status' => array(
				'type' => 'VARCHAR',
				'constraint' => '1',
				'DEFAULT' => 'A'
			),
		));
		$this->dbforge->add_field("date_created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP");
		$this->dbforge->add_key('item_tag_id', TRUE);
		$this->dbforge->create_table('item_tags', TRUE);
	}
	
	public function down()
	{
		$this->dbforge->drop_table('item_tags', TRUE);
	}
}