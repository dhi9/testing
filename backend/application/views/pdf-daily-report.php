<html>
  <head>
    <!--Load the AJAX API-->
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">

      // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart_div = document.getElementById('chart_div');
        //var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
          var chart = new google.visualization.PieChart(chart_div);
        google.visualization.events.addListener(chart, 'ready', function () {
            chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
            console.log(chart_div.innerHTML);
        });
          
        chart.draw(data, options);
      }
    </script>
      <style>
          table{border-collapse: collapse;} table tr td{padding: 5px;} #mg50{margin: 20px;} .noborder->tr->th{border: none}
      </style>
  </head>

  <body>
       <table border="1" width="100%">
          <tr>
              <td  width="140" height="40">
                  <img src="<?php $imgae = json_decode($CompanyDetail->order_image);echo $imgae[0]; ?>" width="140" height="40">
              </td>
              <td>
                  Rangkuman Aktifitas Harian, Hari <?php echo $day ?> -  <?php echo $date ?>
              </td>
          </tr>
          <tr>
              <td colspan="2" align="center" style="border-bottom:none">
                  <h3>Nilai Penjualan</h3>
                  <h3>IDR <?php echo number_format($cost_total, 2);?></h3>
              </td>
          </tr>
          <tr>
              <td colspan="2" align="center" style="border-bottom:none;border-top:none">
                  <table border="1" width="90%" id="mg50">
                    <thead>
                        <tr>
                            <th align="left" colspan="4"><h3>Penjualan</h3></th>
                        </tr>
                      </thead>
                      <tbody>
                          <tr>
                            <td align="left" style="border-right:none">Jumlah Penjualan</td><td style="border-right:none;border-left:none">:</td>
                              <td style="border-left:none">
                                  <?php echo $sales_total;?>
                                </td>
                            <td rowspan="4">
                              <!--<div id="chart_div"></div>-->
                                <?php $test = "asdasd"; //echo $this->view('pdf-daily-report-chart') ?>
                                <img src="<?php echo base_url();?>index.php/reportapi/piegraph/<?php echo $datay."/".$datax ?>" />
                            </td>
                          </tr>
                          <tr>
                            <td align="left" style="border-right:none">Nilai Penjualan</td><td style="border-right:none;border-left:none">:</td>
                              <td align="right" style="border-left:none">IDR <?php echo number_format($cost_total, 2);?></td>
                          </tr>
                          <tr>
                            <td align="left" style="border-right:none">Total Discount</td><td style="border-right:none;border-left:none">:</td>
                              <td align="right" style="border-left:none">IDR <?php echo number_format($discount_total, 2);?></td>
                          </tr>
                          <tr>
                            <td align="left" style="border-right:none">Total Tax</td><td style="border-right:none;border-left:none">:</td>
                              <td align="right" style="border-left:none">IDR  <?php echo number_format($tax_total, 2);?></td>
                          </tr>
                          
                      </tbody>
                  </table>
              </td>
          </tr>
          
           <tr>
              <td colspan="2" align="center" style="border-bottom:none;border-top:none">
                  <table border="1" width="90%" id="mg50">
                    <thead>
                        <tr>
                            <th align="left" colspan="4"><h3>Daftar barang terjual - Top 5</h3></th>
                        </tr>
                      </thead>
                      <tbody>
                          <table width="100%" border="1">
                            <thead>
                                <tr>
                                    <th>
                                        ArticleID/SKU
                                    </th>
                                    <th>
                                        Nama Barang
                                    </th>
                                    <th>
                                        Jumlah Terjual
                                    </th>
                                    <th>
                                        Nilai Penjualan
                                    </th>
                                </tr>  
                            </thead>
                            <tbody>
                                <?php
                                    $i = 1;
                                    function array_msort($array, $cols)
                                    {
                                        $colarr = array();
                                        foreach ($cols as $col => $order) {
                                            $colarr[$col] = array();
                                            foreach ($array as $k => $row) { $colarr[$col]['_'.$k] = strtolower($row[$col]); }
                                        }
                                        $eval = 'array_multisort(';
                                        foreach ($cols as $col => $order) {
                                            $eval .= '$colarr[\''.$col.'\'],'.$order.',';
                                        }
                                        $eval = substr($eval,0,-1).');';
                                        eval($eval);
                                        $ret = array();
                                        foreach ($colarr as $col => $arr) {
                                            foreach ($arr as $k => $v) {
                                                $k = substr($k,1);
                                                if (!isset($ret[$k])) $ret[$k] = $array[$k];
                                                $ret[$k][$col] = $array[$k][$col];
                                            }
                                        }
                                        return $ret;

                                    }
                                    $top5itembyquantity = array_msort($top5item, array('quantity'=>SORT_DESC));
                                    foreach($top5itembyquantity as $t5k => $t5v){
                                        if($i <= 5){
                                ?>
                                    <tr>
                                        <td><?php echo $t5k ?></td>
                                        <td><?php echo $t5v['item_name'] ?></td>
                                        <td><?php echo number_format($t5v['quantity']) ?></td>
                                        <td align="right"><?php echo number_format($t5v['cost']) ?></td>
                                    </tr>
                                <?php
                                        }
                                    $i += 1;
                                    }
                                    $counttop5 = count($top5item);
                                    for($j=0;$j<5-$counttop5;$j += 1){
                                ?>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                <?php
                                    }
                                ?>
                            </tbody>
                          </table>
                      </tbody>
                  </table>
              </td>
          </tr>
           
           <tr>
              <td colspan="2" align="center" style="border-top:none">
                  <table border="1" width="90%" id="mg50">
                    <thead>
                        <tr>
                            <th align="left" colspan="4"><h3>Daftar barang terjual - Top 5</h3></th>
                        </tr>
                      </thead>
                      <tbody>
                          <table width="100%" border="1">
                            <thead>
                                <tr>
                                    <th>
                                        ArticleID/SKU
                                    </th>
                                    <th>
                                        Nama Barang
                                    </th>
                                    <th>
                                        Jumlah Terjual
                                    </th>
                                    <th>
                                        Nilai Penjualan
                                    </th>
                                </tr>  
                            </thead>
                            <tbody>
                                <?php
                                    $i = 1;
                                    $top5itembycost = array_msort($top5item, array('cost'=>SORT_DESC));
                                    foreach($top5itembycost as $t5k => $t5v){
                                        if($i <= 5){
                                ?>
                                    <tr>
                                        <td><?php echo $t5k ?></td>
                                        <td><?php echo $t5v['item_name'] ?></td>
                                        <td><?php echo number_format($t5v['quantity']) ?></td>
                                        <td align="right"><?php echo number_format($t5v['cost']) ?></td>
                                    </tr>
                                <?php
                                        }
                                    $i += 1;
                                    }
                                    $counttop5 = count($top5item);
                                    for($j=0;$j<5-$counttop5;$j += 1){
                                ?>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                <?php
                                    }
                                ?>
                            </tbody>
                          </table>
                      </tbody>
                  </table>
                  <br>
              </td>
          </tr>
      </table>
  </body>
</html>