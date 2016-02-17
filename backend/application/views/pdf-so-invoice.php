<html>
     <head lang="en">
          <meta charset="UTF-8">
          <title></title>
          <style>
              html{font-size: 7pt} table{width: 100%;font-size: 7pt;border: 0px} table .w25{width: 20%} table .w50{width: 50%} table .w70{width: 70%} table#collapse td {padding: 4px}
         </style>
     </head>
     <body>
         <table id="collapse" style="border:1px solid #000;border-collapse:collapse;">
            <tr>
                <td rowspan="4" class="w25" align="left" style="border-right:none;">
                    <center>
                        <img src="<?php $imgae = json_decode($SalesInvoiceCompanyDetail->ir_image);echo $imgae[0]; ?>" width="140" height="40">
                    </center>
                    
                </td>
                <td rowspan="2" class="w50" style="border:none;">
                    <h2>Nama Invoice: <?php echo $SalesInvoiceCompanyDetail->ir_invoice_name ?></h2>
                    <barcode code="" type="C128A" height="0.66" text="2" />
                </td>
                <td class="w25" style="border-right:1px solid #000;border-bottom:none;">Tanggal: <?php echo $DataBank['date_created']; ?></td>
            </tr>
             <tr>
                
             </tr>
             <tr>
                <td rowspan="2" style="border:none;" valign="top">
                <?php echo $SalesInvoiceCompanyDetail->ir_header ?>   
                </td>
                 <td>No : </td>
             </tr>
             <tr>
                <td align="center">
                    
                </td>
             </tr>
         </table>
         
         <table border="1" style="border-collapse:collapse;">
            <thead>
                <tr>
                    <th width="5">No.</th>
                    <th>ArticleID/SKU</th>
                    <th>Color</th>
                    <th>QTY</th>
                    <th>Unit</th>
                    <th>Subtotal</th>
                    <th>Keterangan</th>
                </tr>
             </thead>
             <tbody>
                
                <?php 
                    $itemlength = sizeof($DataList);
                    $Total = 0;
                    $i = 1;
                    
                    $total = 0;
                    $sub = 0;
                    $disc = 0;
                    $totalHarga = 0;
                    $totalDisc = 0;
                    $totalDisc = 0;
                 

                    foreach ($DataList as $invo) {
                ?>       
                                     
                <tr>
                    <td align="center" style="height:20px"><?php echo $i ?></td>
                    <td><?php echo $invo['item_code']; $i+=1 ?></td>
                    <td><?php echo $invo['item_code'] ?></td>
                    <td><?php echo $invo['quantity'] ?></td>
                    <td><?php echo number_format($invo['cost']);

                            $total = ($invo['quantity']*$invo['cost']); 
                            $totalHarga+= ($invo['quantity']*$invo['cost']);

                            $disc = $invo['quantity'] * $invo['cost'] * $invo['disc_percent']/100 + $invo['disc_value'];
                            $totalDisc+= $invo['quantity'] * $invo['cost'] * $invo['disc_percent']/100 + $invo['disc_value'];


                            $sub = ($invo['quantity']*$invo['cost']) - $disc;
                    
                            if ($invo['disc_percent'] !== NULL) {
                               // echo "<tr><td><td><td><td><td>";
                                echo "<br> Discount ".$invo['disc_percent'].'% = '.number_format($disc);
                               // echo "</td></td></td></td></td></tr>";
                            } else {
                                echo "";

                            };

                            ?> 


                    <!--    <br> <?php echo "Discount ".$invo['disc_percent'].'% = '.number_format($disc); ?> </td>  -->

                    <td><?php echo number_format($total); 

                            if ($invo['disc_percent'] !== NULL){
                                echo "<br>".number_format($sub);
                            }else {
                            echo "";
                        };

                        ?> 
                    </td>
                    <td><?php echo $invo['remark'] ?></td>
                    

                 </tr>
                <?php
                    }
                ?>

                <?php  
                    for ($j=$itemlength+1; $j<=15; $j+=1) {
                ?>
                <tr>
                    <td align="center" style="height:20px"><?php echo $j?></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                   
                    <td align="right"></td>
                 </tr>
                 <?php
                    }
                 ?>

             </tbody>
         </table>
         
         <table id="collapse" style="border-collapse:collapse;border:1px solid #000;">
            
             <tr>
                <td rowspan="3" valign="top" align="left" style="border-right:1px solid #000;border:none" weight="40%">
                   <h3>Informasi Pembayaran</h3>
                    
                        Menggunakan:
                        <?php echo $DataBank['payment_type'] ?>
                    <br>
                        <?php if ($DataBank['payment_type'] !== "cash"){
                    echo "&nbsp;&nbsp;&nbsp;&nbsp; Bank: " .$DataBank['payment_bank_name']." - ".$DataBank['payment_date']." - ".$DataBank['payment_remark'];
                    echo "<br>";
                    echo "&nbsp;&nbsp;&nbsp;&nbsp; Bank: " .$DataBank['payment_bank_name']." - XXXX - ".$DataBank['payment_remark'];
                  } ;    
                     ?>
                </td>
                <?php
                    $ppn = 0;
                    $ppn = ($totalHarga-$totalDisc)*($SalesInvoiceCompanyDetail->ppn)/100;

                ?>

                <td align="left" colspan="1" height="100" style="border:1px solid #000" weight="60%">
                    <p>Total Harga :<?php echo "\t".number_format($totalHarga) ?></p>
                    <p>Discount :<?php echo "\t".number_format($totalDisc) ?></p>
                    <p>DPP(<?php echo $SalesInvoiceCompanyDetail->pkp ?>) :</p>
                    <p>PPN(<?php echo $SalesInvoiceCompanyDetail->ppn?>) : <?php echo "\t".number_format($ppn)?></p>
                    <p style="border-top: 1px #CCC solid">Grand Total : <?php echo number_format($totalHarga-$totalDisc+$ppn); ?></p>
                </td>

             </tr>
             
         </table>
         <table style="border-collapse:collapse;border:1px solid #000;border-top:none">
            <tr>
                <td height="20" valign="top">
                    Tanggal Print: <?php echo date("d-m-Y"); ?><?php  ?>
                </td> 
                <td align="right">
                    Page: 
                    <?php 
                        if (sizeof($DataList) > 15){
                            echo "1/2";
                        }
                        else {
                            echo "1/1";
                        }
                     ?>
                <td>
            </tr>
         </table>
    </body>
</html>