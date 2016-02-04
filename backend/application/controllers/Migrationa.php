<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		//if ($this->input->is_cli_request() == FALSE){
		//	show_404();
		//}
		$this->load->library('migration');
		$this->load->dbforge();

	}
	
	public function latest() {
		echo "Migrated to dbVersion : ".$this->migration->latest();
		
	}
	
	public function reset() {
		$this->migration->version(0);
		echo "Reset to dbVersion : 0";
	}
	
	public function version($version = 0) {
		if($version == 0){
			die();
		}
		$this->migration->version($version);
	}
}
