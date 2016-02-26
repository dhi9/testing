<html>
     <head lang="en">
          <meta charset="UTF-8">
          <title></title>
          <style>
              html{font-size: 8pt} table{width: 100%;font-size: 10pt;border: 0px;border-spacing: 0;border-collapse: collapse;margin-bottom: 10px}table tr td {padding: 5px} table .w25{width: 20%} table .w50{width: 50%} table .w70{width: 70%}
              table thead tr {background: #eee}
          </style>
     </head>
     <body>
        <table>
            <tr>
                <th align="center">
                    <h3>Laporan Stock Untuk : <?php echo $report['site']['site_reference'] ?></h3>
                </th>
            </tr>
            <tr>
                <th align="center">
                    Tanggal : <?php echo $report['date_from'] ?>  Ke : <?php echo $report['date_to'] ?>
                </th>
            </tr>
        </table>
         <br>
        <?php
            foreach($stock_report as $s){
        ?>
        <table border="1">
            <thead>
                <tr>
                    <th colspan="4" align="left">
                        <?php echo $s['item_code'] ?> -  <?php echo $s['attributes'] ?>
                    </th>
                </tr>
            </thead>
            <tbody>
            <tr>
                <th colspan="3" align="left">Stock Awal</th>
                <th align="left"><?php echo number_format($s['quantity_start']) ?> - <?php echo $s['uom'] ?></th>
            </tr>
            </tbody>
            <tbody>
                <tr>
                    <th colspan="4" align="left">Transaksi Stock</th>
                </tr>
            </tbody>
            <?php
                foreach($s['items'] as $i){
            ?>
                <tbody>
                    <tr>
                        <td><?php echo $i['document_reference'] ?></td>
                        <td><?php echo $i['type'] ?></td>
                        <td><?php echo $i['type_name'] ?></td>
                        <td align="left"><?php echo number_format($i['base_uom_quantity']) ?> - <?php echo $i['uom'] ?></td>
                    </tr>
                </tbody>
            <?php
                }
            ?>
            <tbody>
                <tr>
                    <th colspan="3" align="left">Stock Akhir</th>
                    <th align="left"><?php echo number_format($s['quantity_end']) ?> - <?php echo $s['uom'] ?></th>
                </tr>
            </tbody>
            <br>
        </table>
        <?php
          }
        ?>
    </body>
</html>