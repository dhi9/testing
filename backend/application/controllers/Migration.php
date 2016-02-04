<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration extends CI_Controller {

	public function __construct()
	{
		// Call the CI_Model constructor
		parent::__construct();
		
		$this->load->library('migration');
	}
	
	public function latest() {
		if ($this->migration->latest() === FALSE)
		{
			show_error($this->migration->error_string());
		}
		else {
			echo 'Migration to latest success';
		}
	}
	
	public function reset() {
		if ($this->migration->version(0) === FALSE)
		{
			show_error($this->migration->error_string());
		}
		else {
			echo 'Reset migration success';
		}
	}
	
	public function version($version = 0) {
		if ($this->migration->version($version) === FALSE)
		{
			show_error($this->migration->error_string());
		}
		else {
			echo 'Migration to version '.$version.' success';
		}
	}
}
