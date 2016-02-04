<html>
     <head lang="en">
          <meta charset="UTF-8">
          <title><?php echo $ActiveCompanyDetail->order_po_name ?></title>
          <style>
              html{font-size: 8pt} table{width: 100%;font-size: 7pt;border: 0px} table .w25{width: 20%} table .w50{width: 50%} table .w70{width: 70%} table#collapse td,th {padding: 8px}
         </style>
     </head>
     <body>
        <table id="collapse" style="border:1px solid #000;border-collapse:collapse;">
            <tr>
                <td rowspan="4" class="w25" align="left" style="border-right:1px solid #000;" valign="top">
                    <center>
                        <img src="<?php $imgae = json_decode($ActiveCompanyDetail->order_image);echo $imgae[0]; ?>" width="140" height="40">
                    </center>
                    <br>
                    <?php echo $ActiveCompanyDetail->company_name ?>
                    <br>
                    <?php echo $ActiveCompanyDetail->company_address ?>
                </td>
                <td rowspan="2" class="w50" style="border-right:1px solid #000;border-bottom:1px solid #000;">
                    Purchase Order  : <?php echo $ActiveRequestDetail['requests_reference'] ?>
                    <barcode code="<?php echo $draft_reference ?>" type="C128A" height="0.66" text="2" />
                </td>
                <td class="w25" style="border-right:1px solid #000;border-bottom:1px solid #000;">PO Date: <?php echo date("Y-m-d",strtotime($ActiveRequestDetail['date_created'])); ?></td>
            </tr>
             <tr>
                <td style="border-right:1px solid #000;border-bottom:1px solid #000;">Page: 
                    <?php
                        if(sizeof($ActiveDeliveryRequestList) > 1){
                            echo "1 of 2";
                        }else{
                             echo "1 of 1";
                        }
                    ?>
                </td>
             </tr>
             <tr>
                <td rowspan="2" style="border-right:1px solid #000;border-bottom:1px solid #000;" valign="top">
                    <?php echo $ActiveCompanyDetail->order_header ?>

                </td>
                 <td>Requested Date/ Tanggal Pengerjaan</td>
             </tr>
             <tr>
                <td align="center">
                    <?php 

                    if(sizeof($ActiveDeliveryRequestList) > 1){
                        echo "Attached/Terlampir";
                    }else{
                        foreach ($ActiveDeliveryRequestList as $key) {
                            $requested_date = $key['requested_date'];
                            break;
                        }
                        echo date("Y-m-d",strtotime($requested_date));
                    }

                    ?>
                </td>
             </tr>
         </table>
         <table style="border-left:1px solid #000;border-right:1px solid #000">
            <thead>
                <tr>
                    <th align="left">Vendor</th>
                    <th align="left">Bill to/ Tagih ke</th>
                    <th align="left">Ship to/ Kirim ke</th>
                </tr>
             </thead>
             <tbody>
                <tr>
                    <td valign="top">
                        <?php echo $ActiveRequestVendorDetail['vendor_name'] ?>
                        <br>
                        <?php echo $ActiveRequestVendorDetail['address'] ?>
                        <br>
                        <?php echo $ActiveRequestVendorDetail['city'] ?>
                        &#44;&nbsp;
                        <?php echo $ActiveRequestVendorDetail['postcode'] ?>
                        <br>Tel: &nbsp;
                        <?php echo $ActiveRequestVendorDetail['phone_number'] ?>
                        &nbsp; Fax: &nbsp;
                        <?php echo $ActiveRequestVendorDetail['fax_number'] ?>
                        <br>
                        <?php echo $ActiveRequestVendorDetail['sales_email'] ?>
                        <br>
                        Attn: &nbsp;
                        <?php echo $ActiveRequestVendorDetail['sales_pic'] ?>
                    </td>
                    <td valign="top">
                        <?php echo $ActiveCompanyDetail->company_name  ?>
                        <br>
                        <?php echo $ActiveCompanyDetail->company_address ?>
                        <br>
                        <?php echo $ActiveCompanyDetail->company_city ?>
                        &#44;&nbsp;
                        <?php echo $ActiveCompanyDetail->company_postcode ?>
                        <br>Tel: &nbsp;
                        <?php echo $ActiveCompanyDetail->company_phone_number ?>
                        &nbsp; Fax: &nbsp;
                        <?php echo $ActiveCompanyDetail->company_fax_number ?>
                        <br>
                    </td>
                    <td valign="top">
                        <?php 

                    if(sizeof($ActiveDeliveryRequestList) > 1){
                                    echo "<br>";
                        echo "Attached/Terlampir";
                    }else{
                        foreach ($ActiveDeliveryRequestList as $key) {
                            $shipto = $key;
                            break;
                        }
                    ?>
                        
                        <?php 
                            foreach ($ActiveDeliveryAddressList as $deliveryAddress) {
                                if ($key['site_id'] == $deliveryAddress['site_id']) {
                                    echo $deliveryAddress['site_name'];
                                    echo "<br>";
                                    echo $deliveryAddress['address'];
                                    echo "<br>";
                                    echo $deliveryAddress['city'];
                                    echo ", ";
                                    echo $deliveryAddress['postcode'];
                                    echo "<br>";
                                    echo "Tel:  ";
                                    echo $deliveryAddress['phone_number'];
                                    echo "  Fax: ";
                                    echo $deliveryAddress['fax_number'];
                                    break;
                                }
                            }
                        ?>
                        <br>
                        <?php
                            }
                        ?>
                    </td>
                 </tr>
             </tbody>
         </table>
         <table border="1" style="border-collapse:collapse;">
            <thead>
                <tr>
                    <th width="5">No.</th>
                    <th>ArticleID/SKU</th>
                    <th>Nama Barang/Name</th>
                    <th>Attribute</th>
                    <th>Jumlah/QTY</th>
                    <th>Unit</th>
                    <th>Remarks/Keterangan</th>
                    <th>Price/Harga</th>
                </tr>
             </thead>
             <tbody>
                <?php 
                 $itemList = $ActiveItemRequestList;
                 $itemlength = sizeof($itemList);
                 $total=0;
                 $i=1;
                 foreach ($itemList as $key) { ?>
                <tr>
                    <td align="center" style="height:20px"><?php echo $i ?></td>
                    <td><?php echo $key['item_code'];$i+=1 ?></td>
                    <td><?php echo $key['item_name'] ?></td>
                    <td><?php //echo $key['attributes'] ?></td>
                    <td><?php echo $key['quantity'] ?></td>
                    <td><?php echo $key['item_unit'] ?></td>
                    <td><?php echo @$key['remark'] ?></td>
                    <td align="right"><?php echo number_format($key['cost'],2);$total+= ($key['quantity']*$key['cost']);  ?></td>
                 </tr>
                 <?php } ?>
                 <?php 
                 for($j=$itemlength+1;$j<=20;$j+=1){ ?>
                <tr>
                    <td align="center" style="height:20px"><?php echo $j ?></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td align="right"></td>
                 </tr>
                 <?php } ?>
             </tbody>
         </table>
         <table id="collapse" style="border-collapse:collapse;border:1px solid #000;">
            <tr>
                <td class="w70" align="right" style="border-right:1px solid #000;">Termin/ Term: <span style="text-decoration: underline;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?php echo $ActiveRequestVendorDetail['payment_term_value']; ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>hari/days</td>
                <td rowspan="2" valign="top" >Total</td>
                <td valign="top" align="right"><?php echo strtoupper($ActiveRequestDetail['currency']) ." " ;echo number_format($total,2) ?></td>
            </tr>
             <tr>
                <td align="right" style="border-right:1px solid #000;">
                    <?php
                        switch ($ActiveCompanyDetail->order_term_payment) {                            
                            case 'I':
                                echo "Setelah Invoice Diterima - After Invoice Received";
                                break;
                            
                            default:
                                echo "Setelah Barang/ Jasa Diterima - After Goods/Service Received";
                                break;
                        }
                    ?>
                </td>
                <td align="right">* Harga belum termasuk PPN</td>
             </tr>
             <tr>
                <td rowspan="2" valign="top" align="left" style="border-right:1px solid #000;border-top:1px solid #000">
                    <i>Catatan Pengiriman:</i>
                    <p>
                    <br>
                    <?php 

                    if(sizeof($ActiveDeliveryRequestList) > 1){
                        echo "Attached/Terlampir";
                    }else{
                        foreach ($ActiveDeliveryRequestList as $key) {
                            echo $key['remark'];
                            break;
                        }
                        
                    }

                    ?>
                    </p>
                </td>
                <td colspan="2" height="100" style="border-top:1px solid #000"></td>
             </tr>
             <tr>
                <td align="center" colspan="2" height="10" style="border-top:1px solid #000;"><?php echo $ActiveCompanyDetail->order_pic ?></td>
             </tr>
         </table>
         <table style="border-collapse:collapse;border:1px solid #000;">
            <tr>
                <td height="100" valign="top">
                    <?php echo $ActiveCompanyDetail->order_footer ?>
                </td>
            </tr>
         </table>

         

         <?php
            if(sizeof($ActiveDeliveryRequestList) > 1){
                        
         ?>
         <pagebreak />
         <table id="collapse" style="border:1px solid #000;border-collapse:collapse;">
            <tr>
                <td rowspan="3" class="w25" align="left" style="border-right:1px solid #000;border-bottom:1px solid #000;">
                    <center>
                        <img src="<?php $imgae = json_decode($ActiveCompanyDetail->order_image);echo $imgae[0]; ?>" width="140" height="40">
                    </center>
                    <br>
                    <?php echo $ActiveCompanyDetail->company_name ?>
                    <br>
                    <?php echo $ActiveCompanyDetail->company_address ?>
                </td>
                <td rowspan="2" class="w50" style="border-right:1px solid #000;border-bottom:1px solid #000;" >
                    Purchase Order  : <?php echo $ActiveRequestDetail['requests_reference'] ?>
                    <barcode code="<?php echo $ActiveRequestDetail['requests_reference'] ?>" type="C128A" height="0.66" text="2" />
                </td>
                <td class="w25" style="border-right:1px solid #000;border-bottom:1px solid #000;">PO Date: <?php echo date("Y-m-d",strtotime($ActiveRequestDetail['date_created'])); ?></td>
            </tr>
             <tr>
                <td style="border-right:1px solid #000;border-bottom:1px solid #000;">Page: 2 of 2 </td>
             </tr>
             <tr>
                <td colspan="2" style="border-right:1px solid #000;border-bottom:1px solid #000;heigth:100px">
                    Attachment
                    <br>
                    Detail Pengiriman/ Pengaturan Pengiriman
                 </td>
             </tr>
         </table>
         <table id="collapse" border="1" style="border-collapse:collapse;">
            <thead>
                <tr>
                    <th width="50">Rencana Pengiriman</th>
                    <th>Tanggal Pengiriman</th>
                    <th>ArticleID/SKU</th>
                    <th>Nama Barang/Name</th>
                    <th>Attribute</th>
                    <th>Jumlah/QTY</th>
                    <th>Unit</th>
                    <th>Catatan Pengiriman</th>
                    <th>Alamat Pengiriman</th>
                </tr>
             </thead>
             <tbody>
                <?php
                 $itemList = $ActiveDeliveryRequestItemList;
                 $itemlength = sizeof($itemList);
                 $total=0;
                 $i=1;
                 foreach ($itemList as $key) { 
                 if($key['quantity'] > 0){ ?>
                <tr>
                    <td align="center" style="height:30px"><?php echo $key['plan'] ?></td>
                    <td><?php echo date("Y-m-d",strtotime($key['requested_date'])); ?></td>
                    <td><?php echo $key['item_code'];$i+=1 ?></td>
                    <td><?php echo $key['item_name'] ?></td>
                    <td><?php //echo $key['attributes'] ?></td>
                    <td><?php echo $key['quantity'] ?></td>
                    <td><?php echo $key['item_unit'] ?></td>
                    <td><?php echo @$key['remark'] ?></td>
                    <td>
                        <?php 
                            foreach ($ActiveDeliveryAddressList as $deliveryAddress) {
                                if ($key['site_id'] == $deliveryAddress['site_id']) {
                                    echo $deliveryAddress['site_name'];
                                    break;
                                }
                            }
                        ?>

                    </td>
                 </tr>
                 <?php }} ?>
                 <?php 
                 $k = sizeof($ActiveDeliveryRequestList);
                 for($j=$k+1;$j<=20;$j+=1){ ?>
                <tr>
                    <td align="center" style="height:30px"><?php echo $j ?></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td align="right"></td>
                 </tr>
                 <?php } ?>
             </tbody>
         </table>
         <?php
            }
         ?>
    </body>
</html>