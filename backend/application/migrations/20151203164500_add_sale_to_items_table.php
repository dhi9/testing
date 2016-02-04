<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_sale_to_items_table extends CI_Migration {

	public function up()
	{
		$orders = array(
			'sell_price_type' => array(
				'type' => 'VARCHAR',
				'constraint' => 1,
				'NULL' => TRUE
			),
			'sell_price_perc_last_buy_price' => array(
				'type' => 'DECIMAL',
				'constraint' => '5,2',
				'NULL' => TRUE
			),
			'sell_price_markup_last_buy_price' => array(
				'type' => 'DECIMAL',
				'constraint' => '17,2',
				'NULL' => TRUE
			),
			'sell_price_fix' => array(
				'type' => 'DECIMAL',
				'constraint' => '17,2',
				'NULL' => TRUE
			),
			'discount_type' => array(
				'type' => 'VARCHAR',
				'constraint' => 1,
				'NULL' => TRUE
			),
			'discount_perc' => array(
				'type' => 'DECIMAL',
				'constraint' => '5,2',
				'NULL' => TRUE
			),
			'discount_perc_start_date' => array(
				'type' => 'DATE',
				'NULL' => TRUE
			),
			'discount_perc_end_date' => array(
				'type' => 'DATE',
				'NULL' => TRUE
			),
			'discount_special_price' => array(
				'type' => 'DECIMAL',
				'constraint' => '17,2',
				'NULL' => TRUE
			),
			'discount_special_price_start_date' => array(
				'type' => 'DATE',
				'NULL' => TRUE
			),
			'discount_special_price_end_date' => array(
				'type' => 'DATE',
				'NULL' => TRUE
			),
		);
		$this->dbforge->add_column('items', $orders);
	}
	
	public function down()
	{
		$this->dbforge->drop_column('items', 'sell_price_type');
		$this->dbforge->drop_column('items', 'sell_price_perc_last_buy_price');
		$this->dbforge->drop_column('items', 'sell_price_markup_last_buy_price');
		$this->dbforge->drop_column('items', 'sell_price_fix');
		$this->dbforge->drop_column('items', 'discount_type');
		$this->dbforge->drop_column('items', 'discount_perc');
		$this->dbforge->drop_column('items', 'discount_perc_start_date');
		$this->dbforge->drop_column('items', 'discount_perc_end_date');
		$this->dbforge->drop_column('items', 'discount_special_price');
		$this->dbforge->drop_column('items', 'discount_special_price_start_date');
		$this->dbforge->drop_column('items', 'discount_special_price_end_date');
	}
}