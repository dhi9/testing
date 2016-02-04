<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_cc_email_setting_to_users extends CI_Migration {

	public function up()
	{
		$emailcc = array(
			'accept_po_cc' => array(
				'type' => 'TINYINT',
				'constraint' => 1,
				'NULL' => TRUE
			),
			'accept_so_cc' => array(
				'type' => 'TINYINT',
				'constraint' => 1,
				'NULL' => TRUE
			)
		);
		$this->dbforge->add_column('users', $emailcc);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('users', 'accept_po_cc');
		$this->dbforge->drop_column('users', 'accept_so_cc');
	}
}