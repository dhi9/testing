<html>
     <head lang="en">
          <meta charset="UTF-8">
          <title></title>
          <style>
              html{font-size: 8pt} table{width: 100%;font-size: 10pt;border: 0px;border-spacing: 0;border-collapse: collapse;}table tr td {padding: 5px} table .w25{width: 20%} table .w50{width: 50%} table .w70{width: 70%}
          </style>
     </head>
     <body>
        <table border="1">
            <tr>
                <td>
                    <table>
                        <tr>
                            <td style="width:150px;height:150px;"><barcode code="<?php echo $stock_status_url;?>" size="1.3" type="QR" error="M" class="barcode" /><td>
                            <td>
                                <h2>Stock Card</h2><br>
                                <barcode code="<?php echo $item['item_code'];?>" type="C128A" height="1.66" text="2" /><br/>
                                <p><?php echo $item['item_code'];?></p>
                            <td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table>
                        <tr>
                            <td>
                                <h2 align="left" valign="top">
                                    Nama Barang : <?php echo $item['item_name'];?>
                                </h2>
                            <td>
                            <td align="right" valign="top">
                                <h2>
                                    Batch/PieceID : <?php echo $item['batch_reference'];?>
                                </h2>
                            <td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <h2>
                                    Lokasi : <?php echo $item['site_reference'].'/'.$item['storage_name'].'/'.$item['bin_name'];?>
                                </h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>No. Dokumen</th>
                                <th>Tanggal Posting</th>
                                <th>Jumlah</th>
                                <th>UOM</th>
                                <th>UOM Dasar</th>
                                <th>PO/SO</th>
                                <th>User</th>
                                <th>Tipe</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                //for ($i=0 ; $i <= 20 ; $i++ ) { 
                                foreach($stock_list as $stock){
                            ?>
                            <tr>
                                <td></td>
                                <td><?php echo $stock['posting_date']?></td>
                                <td><?php echo $stock['quantity']?></td>
                                <td><?php echo $stock['uom']?></td>
                                <td><?php echo $stock['item_unit']?></td>
                                <td><?php echo $stock['document_reference']?></td>
                                <td></td>
                                <td><?php echo $stock['type']?></td>
                            </tr>
                            <?php
                                }
                            ?>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <h2>Tanggal Print : <?php echo date('d-m-Y');?></h2>
                </td>
            </tr>
        </table>
        
        
    </body>
</html>