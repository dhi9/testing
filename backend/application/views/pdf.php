<html>
     <head lang="en">
          <meta charset="UTF-8">
          <title></title>
          <style>
              html{font-size: 8pt} table{width: 100%;font-size: 7pt;border: 0px} table .w25{width: 20%} table .w50{width: 50%} table .w70{width: 70%} table#collapse td {padding: 8px}
         </style>
     </head>
     <body>
         <table id="collapse" style="border:1px solid #000;border-collapse:collapse;">
            <tr>
                <td rowspan="4" class="w25" align="left" style="border-right:1px solid #000;">
                    <center>
                        <img src="/../barrackobama.com/wp-content/themes/gnrm_main/images/birokrasi.jpg" width="100" height="40">
                    </center>
                    <br>
                    Company Name
                    <br>
                    Company Address
                </td>
                <td rowspan="2" class="w50" style="border-right:1px solid #000;border-bottom:1px solid #000;">
                    Purchase Order  : PR_2015-11-09-023
                    <barcode code="PR_2015-11-09-023" type="C128A" height="0.66" text="2" />
                </td>
                <td class="w25" style="border-right:1px solid #000;border-bottom:1px solid #000;">PO Date:</td>
            </tr>
             <tr>
                <td style="border-right:1px solid #000;border-bottom:1px solid #000;">Page: 1 of 2 </td>
             </tr>
             <tr>
                <td rowspan="2" style="border-right:1px solid #000;border-bottom:1px solid #000;">header text per company</td>
                 <td>Requested Date/ Tanggal Pengerjaan</td>
             </tr>
             <tr>
                <td align="center">5 january 2016</td>
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
                        Nama Supplier
                        <br>
                        Alamat
                        <br>
                        Kota 
                        &#44;&nbsp;
                        Kode Pos
                        <br>Tel: &nbsp;
                        No telp
                        &nbsp; Fax: &nbsp;
                        No Fax
                        <br>
                        Email
                        <br>
                        Attn: &nbsp;
                        Nama Pic
                    </td>
                    <td valign="top">
                        Nama Perusahaan
                        <br>
                        Alamat
                        <br>
                        Kota 
                        &#44;&nbsp;
                        Kode Pos
                        <br>Tel: &nbsp;
                        No telp
                        &nbsp; Fax: &nbsp;
                        No Fax
                        <br>
                        Nama Pic
                    </td>
                    <td valign="top">
                        Nama
                        <br>
                        Alamat
                        <br>
                        Kota 
                        &#44;&nbsp;
                        Kode Pos
                        <br>Tel: &nbsp;
                        No telp
                        &nbsp; Fax: &nbsp;
                        No Fax
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
                 <?php for($i=1;$i<=15;$i+=1){ ?>
                <tr>
                    <td align="center" style="height:20px"><?php echo $i ?></td>
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
                <td class="w70" align="right" style="border-right:1px solid #000;">Termin/ Term:                   hari/days</td>
                <td rowspan="2" valign="top" >Total</td>
                <td rowspan="2" valign="top" align="right">$ X.XXX.XXX,00</td>
            </tr>
             <tr>
                <td align="right" style="border-right:1px solid #000;">Setelah Barang/ Jasa Diterima - After Goods/Service Received</td>
             </tr>
             <tr>
                <td rowspan="2" valign="top" align="left" style="border-right:1px solid #000;border-top:1px solid #000">
                    Catatan Pengiriman:
                </td>
                <td colspan="2" height="100" style="border-top:1px solid #000">tanda tangan</td>
             </tr>
             <tr>
                <td align="center" colspan="2" height="10" style="border-top:1px solid #000;">PIC</td>
             </tr>
         </table>
         <table style="border-collapse:collapse;border:1px solid #000;">
            <tr>
                <td height="100">FOOTER</td> 
            </tr>
         </table>
         <pagebreak />
         <table id="collapse" style="border:1px solid #000;border-collapse:collapse;">
            <tr>
                <td rowspan="3" class="w25" align="left" style="border-right:1px solid #000;border-bottom:1px solid #000;">
                    <center>
                        <img src="/../barrackobama.com/wp-content/themes/gnrm_main/images/birokrasi.jpg" width="100" height="40">
                    </center>
                    <br>
                    Company Name
                    <br>
                    Company Address
                </td>
                <td rowspan="2" class="w50" style="border-right:1px solid #000;border-bottom:1px solid #000;" >
                    Purchase Order  : PR_2015-11-09-023
                    <barcode code="PR_2015-11-09-023" type="C128A" height="0.66" text="2" />
                </td>
                <td class="w25" style="border-right:1px solid #000;border-bottom:1px solid #000;">PO Date: </td>
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
                 <?php for($i=1;$i<=20;$i+=1){ ?>
                <tr>
                    <td align="center" style="height:30px"><?php echo $i ?></td>
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
    </body>
</html>