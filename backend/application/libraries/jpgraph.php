<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class jpgraph 
{
    public function piechart()
    {
        include_once APPPATH.'/third_party/jpgraph/src/jpgraph.php';
        include_once APPPATH.'/third_party/jpgraph/src/jpgraph_pie.php';
        //include ("jpgraph/src/jpgraph_pie3d.php");

  }
}
?>