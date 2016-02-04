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
                    Nama PO : XXXXXXXX
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
                                for ($i=1 ; $i <= 20 ; $i++ ) { 
                                    
                            ?>
                            <tr>
                                <td>1022102</td>
                                <td>Item X</td>
                                <td>2500</td>
                                <td>KG</td>
                                <td>1/9/2015</td>
                                <td>AAAA123</td>
                                <td>Jakarta/Toko/X</td>
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
                                for ($i=1 ; $i <= 5 ; $i++ ) { 
                                    
                            ?>
                            <tr>
                                <td>1022102</td>
                                <td>Item X</td>
                                <td>2500</td>
                                <td>KG</td>
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

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>