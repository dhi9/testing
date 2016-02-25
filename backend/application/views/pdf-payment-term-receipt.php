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
                <td rowspan="2" class="w25" align="left" style="border-right:none;">
                    <center>
                        <img src="<?php $imgae = json_decode($PaymentTermCompanyDetail->ir_image);echo $imgae[0]; ?>" width="140" height="40">
                    </center>    
                </td>
                
                <td class="w25" style="border:none;" >
				<h3><?php echo $PaymentTermCompanyDetail->ir_receipt_name ?></h3>
                </td>
				
                <td class="w25" style="border-right:1px solid #000;border-bottom:none;">Tanggal: <?php echo date("d-m-Y"); ?> </td>
            </tr>
             <tr>
            
				<td style="border:none;" valign="top">
					<?php echo $PaymentTermCompanyDetail->ir_header ?>
                </td>
				<td>
					No: 
				</td>
             </tr>
         </table>
         
         <table border="1" style="border-collapse:collapse;">
            <thead>
                <tr>
                    <th width="5">No</th>
                    <th>Sales Invoice#</th>
                    <th>Tanggal</th>
                    <th>Referensi Pembayaran/Bank/Giro/Cek</th>
                    <th>Jumlah</th>
                </tr>
             </thead>
             <tbody>  

				
                
                <?php
                    $itemlength = sizeof($DataPaymentTermReceipt);
                    $i = 1;

                    foreach ($DataPaymentTermReceipt as $payterm) {
                        
                   
                ?>


                <tr>
                    <td align="center" style="height:20px"><?php echo $i ?></td>
                    <td>
					<?php echo $payterm['invoice_reference']; $i+=1 ?>
					</td>
                    <td><?php echo $payterm['payment_date']; ?></td>
                    <td><?php echo $payterm['payment_type'] ?></td>                
                   
                    <td align="right"></td>
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
					
					<td align="right"></td>
					
				 </tr>
				 <?php 
				 } 
				 ?>
                

             </tbody>
         </table>
         
         <table id="collapse" style="border-collapse:collapse;border:1px solid #000;">
            
             <tr>
                <td colspan="3" valign="top" align="left" style="border-right:none solid #000; border-bottom:none">   
                </td>
                
                <td align="right" colspan="1" height="100" style="border-right:none solid #000;     ">
                    Total Received: <?php  ?>
                </td>
             </tr>
             
         </table>

         <table style="border-collapse:collapse;border:1px solid #000;border-top:none">
            <tr>
                <td height="20">
                    Tanggal Print: <?php echo date("d-m-Y"); ?><?php  ?>
                </td> 
                <td align="right">
                    Page: 
                    <?php 
                        if (sizeof($DataPaymentTermReceipt) > 15){
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