<?php
    //$image = imagecreatefromstring(file_get_contents($ActiveCompanyDetail->order_image));
    //echo $image;

    //header("content-type: image/png");

    $imgae = json_decode($ActiveCompanyDetail->order_image);
    echo $imgae[0];
?>