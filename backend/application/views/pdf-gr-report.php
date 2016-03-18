<html>
    <head>

          <style>
              html{font-size: 8pt} table{width: 100%;font-size: 10pt;border: 0px;border-spacing: 0;border-collapse: collapse;}table tr td {padding: 5px} table .w50{width: 50%} table .w70{width: 70%} 
          </style>
    </head>

    <body>
        <table border="1">
            <tr>
                <td colspan="2" align="center">
                    Good Receive (GR) Document
                </td>
            </tr>
            <tr>
                <td>
                    Nama PO : <?php echo $request['requests_reference'] ?>
                </td>
                <td align="right">
                    Page 1 of 1
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <br>
                    Daftar barang sudah GR<br>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Kode Barang</th>
                                <th>Nama Barang</th>
                                <th>Diterima</th>
                                <th>Unit</th>
                                <th>Tanggal</th>
                                <th>Batch</th>
                                <th>Lokasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                $countDelivered = count($delivered_items);
                                foreach($delivered_items as $di){
                            ?>
                            <tr>
                                <td><?php echo $di['item_code'] ?></td>
                                <td><?php echo @$di['item_name'] ?></td>
                                <td><?php echo $di['quantity'] ?></td>
                                <td><?php echo $di['item_unit'] ?></td>
                                <td><?php echo date("d/m/Y",strtotime($di['date_recieved'])) ?></td>
                                <td><?php echo $di['batch_reference'] ?></td>
                                <td><?php echo $di['site_reference']."/".$di['storage_name']."/".$di['bin_name'] ?></td>
                            </tr>
                            <?php
                                }
                            ?>
                            <?php
                                for ($i=$countDelivered ; $i < 20 ; $i++ ) { 
                                    
                            ?>
                            <tr>
                                <td>&nbsp;</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>

                            <?php
                                }
                            ?>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <br>
                    Daftar barang belum GR<br>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Kode Barang</th>
                                <th>Nama Barang</th>
                                <th>QTY</th>
                                <th>Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                $ny = 0;
                                    $countNotDelivered = count($not_delivered_items);
                                    foreach($not_delivered_items as $not_yet){
                                        if($ny<5){
                            ?>
                            <tr>
                                <td><?php echo $not_yet['item_code'] ?></td>
                                <td><?php echo $not_yet['item_name'] ?></td>
                                <td><?php echo $not_yet['remain_quantity'] ?></td>
                                <td><?php echo $not_yet['item_unit'] ?></td>
                            </tr>

                            <?php
                                        }
                                        $ny += 1;
                                }
                            ?>
                            <?php
                                for ($i=$countNotDelivered ; $i < 5 ; $i++ ) { 
                                    
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
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <br>
                    Keterangan<br>
                    <table border="1">
                        <tr>
                            <td style="height:100px">
                                <?php $request_delivery['remark'] ?>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <?php
    /*
        echo var_dump($delivered_items)."<br>delivered items<br><br>";
        echo var_dump($not_delivered_items)."<br>not delivered items<br><br>";
        echo var_dump($delivered_quantity)."<br>delivered quantity<br><br>";
        echo var_dump($request_items)."<br>request items<br><br>";
        echo var_dump($re_request_items)."<br>re request items<br><br>";
    */
        ?>
    </body>
</html>