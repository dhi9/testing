app.controller('DeliveryConfirmationDetailController', function($scope, $state, $stateParams, VendorService, VehicleService, $modal, ItemLookupService, ApiCallService, SweetAlert, AttributeFactory) {

	$scope.state = $state.current;
	
	$scope.retrieveDeliveryId = $stateParams.delivery_id;
    $scope.retrievedOrderId = "";
	$scope.itemLookupList = [];
    $scope.vehicleList = [];
    $scope.vendorList =[];
    $scope.vehicleType = [];

    $scope.vehicleList.vehicle_type={};
    VehicleService.getVehicleList().success(function(data){
        $scope.vehicleList = data.vehicle_list;
    });
    VendorService.getVendorList().success(function(data) {
        if (data.call_status === "success") {
            $scope.vendorList = data.vendor_list;
        }
    });

    $scope.attributeList = AttributeFactory.attributeList;
    AttributeFactory.getAttributeList().then(function(){
        $scope.attributeList = AttributeFactory.attributeList;
    });
    $scope.attributeActiveList = AttributeFactory.attributeActiveList;
    AttributeFactory.getAttributeActiveList().then(function(){
        $scope.attributeActiveList = AttributeFactory.attributeActiveList;
    });

    VehicleService.getVehicleTypeList().
        success(function(data) {
            if (data.call_status === "success") {
                $scope.vehicleType = data.vehicle_type_list;
            }
        });

    $scope.goodIssue = {};
    $scope.goodIssue.good_issue = false;
    $scope.goodIssue.items = [];

    $scope.addGoodIssueItem = function() {
        var newItem = {
            "order_id": $scope.retrievedOrderId,
            "item_code": "",
            "quantity": 0,
            "is": "N",
            "status": "A",
        };
        $scope.goodIssue.items.push(newItem);
    };
    $scope.updateGoodIssue = function (){
        if($scope.goodIssue.confirmGoodsIssue == null || $scope.goodIssue.confirmGoodsIssue == undefined || $scope.goodIssue.confirmGoodsIssue == false){
            console.log('false', $scope.goodIssue);
            ApiCallService.updateGoodIssue($scope.goodIssue).success(function(data){
                if(data.call_status == "success" ){
                    SweetAlert.swal({
                        title: "Berhasil",
                        text: "Semua item telah masuk good issue.",
                        type: "success",
                        confirmButtonText: "Ok",
                        closeOnConfirm: true,
                        animation: "slide-from-top"
                    });
                }
            });
        }else{
            console.log('true', $scope.goodIssue);
            ApiCallService.updateGoodIssue($scope.goodIssue).success(function(data){
                if(data.call_status == "success" ){
                    SweetAlert.swal({
                        title: "Berhasil",
                        text: "Semua item telah masuk good issue.",
                        type: "success",
                        confirmButtonText: "Ok",
                        closeOnConfirm: true,
                        animation: "slide-from-top"
                    });
                }
            });
        }
    };

    $scope.lookupAttibute = function (itemCode, attributeName){
        var attribute = "";
        for(var i = 0; i < $scope.delivery.order_detail.order_items.length; i += 1){
            if(itemCode == $scope.delivery.order_detail.order_items[i].item_code){
                attribute = $scope.delivery.order_detail.order_items[i].attributes[attributeName];
            }
        }
        return attribute;
    };

    $scope.lookupQuantity = function (itemCode){
        var quantity = 0;
        for(var i = 0; i < $scope.delivery.order_detail.order_items.length; i += 1){
            if(itemCode == $scope.delivery.order_detail.order_items[i].item_code){
                quantity = $scope.delivery.order_detail.order_items[i].quantity;
            }
        }
        return quantity;
    };


    $scope.lookupItemUnit = function(itemCode) {
		return ItemLookupService.getItemUnit(itemCode);
	}
	
	$scope.lookupItemName = function(itemCode) {
		return ItemLookupService.getItemName(itemCode);
	}
	
	$scope.OPTIONS_explaination_types = [
		{value: '', label:''},
		{value: 'K', label:'Kualitas'},
		{value: 'R', label:'Kuantitas kurang/lebih'},
		{value: 'S', label:'Salah kirim'},
		{value: 'T', label:'Terlambat'},
		{value: 'L', label:'Lain-lain'}
	];
	
	$scope.showForceCloseOrderErrorPopUp = function() {
		SweetAlert.swal({
			title: "Order Telah Ditutup",
			text: "Tidak dapat melakukan perubahan pada Order.", 
			type: "error", 
			confirmButtonText: "Ok",
			closeOnConfirm: true,
			animation: "slide-from-top"
		});
	};
	
	$scope.updateDelivery = function() {
		$scope.updateButtonLoading = true;
		
		var inputOrder = {};
		
		var original_actual_loading_date = $scope.original_value.actual_loading_date;
		
		var input_actual_loading_date = null;
		if ($scope.delivery.delivery_detail.actual_loading_date != null) {
			input_actual_loading_date = new Date(moment($scope.delivery.delivery_detail.actual_loading_date).format('YYYY-MM-DD'));
		} 
		
		var original_arrival_date = $scope.original_value.arrival_date;
		
		var input_arrival_date = null;
		if ($scope.delivery.delivery_detail.arrival_date != null) {
			input_arrival_date = new Date(moment($scope.delivery.delivery_detail.arrival_date).format('YYYY-MM-DD'));
		}
		
		var original_confirmation_date = $scope.original_value.confirmation_date;
		
		var input_confirmation_date = null;
		
		if ($scope.delivery.delivery_detail.confirmation_date != null) {
			input_confirmation_date = new Date(moment($scope.delivery.delivery_detail.confirmation_date).format('YYYY-MM-DD'));
		}
		
		// kasih nilai default
		inputOrder.is_actual_loading_date_changed = 0;
		
		if (input_actual_loading_date != null && ( original_actual_loading_date === null || (original_actual_loading_date.toISOString() != input_actual_loading_date.toISOString()))) {
			inputOrder.is_actual_loading_date_changed = 1;
			inputOrder.actual_loading_date = input_actual_loading_date.toISOString().slice(0, 19).replace('T', ' ');
		}
		
		// kasih nilai default
		inputOrder.is_arrival_date_changed = 0;
		
		if (input_arrival_date != null && ( original_arrival_date === null || (original_arrival_date.toISOString() != input_arrival_date.toISOString()))) {
			inputOrder.is_arrival_date_changed = 1;
			inputOrder.arrival_date = input_arrival_date.toISOString().slice(0, 19).replace('T', ' ');
		}
		
		// kasih nilai default
		inputOrder.is_confirmation_date_changed = 0;
		
		if (input_confirmation_date != null && ( original_confirmation_date === null || (original_confirmation_date.toISOString() != input_confirmation_date.toISOString()))) {
			inputOrder.is_confirmation_date_changed = 1;
			inputOrder.confirmation_date = input_confirmation_date.toISOString().slice(0, 19).replace('T', ' ');
		}
		
		inputOrder.delivery_id = $scope.delivery.delivery_detail.delivery_id;
		inputOrder.delivery_items = $scope.delivery.delivery_detail.delivery_items;
		
		ApiCallService.updateDelivery(inputOrder).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Success",
						text: "Konfirmasi Pengiriman telah diupdate", 
						type: "success", 
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
				else if (data.call_status === "error") {
					if (data.error_code == "701") {
						SweetAlert.swal({
							title: "Perhatian!",
							text: "Harap login kembali", 
							type: "error", 
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						}, 
						function() {
							$state.go('app.login');
						});
					}
					else if(data.error_code == "501") {
						$scope.showForceCloseOrderErrorPopUp();
					}
					else if(data.error_code == "702") {
						SweetAlert.swal({
							title: "Update Pengiriman Gagal",
							text: data.error_message, 
							type: "error", 
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
					else {
						SweetAlert.swal({
							title: "Success",
							text: data.error_message, 
							type: "success", 
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
				}
				
				$scope.updateButtonLoading = false;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
				
				$scope.updateButtonLoading = false;
			});
	};
	
	$scope.displayOrderHistory = function() {
		var pass_data = {
			delivery_id: $scope.retrieveDeliveryId
		};
	
		var modalInstance = $modal.open({
			templateUrl: 'modal_content_order_history.html',
			controller: 'OrderUpdateHistoryModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			}
		});
	}
	
	$scope.displayPrintSpecialDelivery = function() {
		/*var pass_data = {
			delivery_id: $scope.retrieveDeliveryId
		};*/
	
		var modalInstance = $modal.open({
			templateUrl: 'modal_content_print_special_delivery',
			controller: 'PrintSpecialDeliveryModalCtrl',
			scope: $scope
			//size: 'lg',
			/*resolve: {
				passed_data: function () {
					return pass_data;
				}
			}*/
		});
	}
	
	$scope.setToCurrentDate = function() {
		var todayDate = new Date(moment(Date.now()).format('YYYY-MM-DD'));
		return todayDate;
		console.log(dateField);
	}
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	$scope.printSpecialOrdeeliveryNotes = function(delivery) {
		//var printContents = document.getElementById(divName).innerHTML;
		var popupWin = window.open('', '_blank', 'width=960,height=960');
		popupWin.document.open();
		//popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + '<p>asdfasdfasdfasdfasdf</p>' + '</body></html>');
		
		var tableData = '';
		
		
		for (var i = 0 ; i < delivery.delivery_detail.delivery_items.length ; i++ ) {

		tableData = tableData + '<div class="row" style="height: auto"> <div class="float_left" style="width: 10%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ (i + 1) + 
		'</div> </div> <div class="float_left" style="width: 25.6%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].item_name +
		'</div> </div> <div class="float_left" style="width: 10%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].item_type + 
		'</div> </div> <div class="float_left" style="width: 10%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">' 
		+ delivery.delivery_detail.delivery_items[i].quantity_sent +
		'</div> </div> <div class="float_left" style="width: 10%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].item_unit +
		'</div> </div> <div class="float_left" style="width: 15%;height: 20px;border: 1px solid #000000;border-top: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].material_type +
		'</div> </div> <div class="float_left" style="width: 15%;height: 20px;border: 1px solid #000000;border-top: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].remark +
		' </div> </div> </div> ';
		};
		
		var docWrite = '<html><head lang="en"><meta charset="UTF-8"><title>Surat Jalan</title><style> html{text-align:center}body{min-width:960px;max-width:960px;display:inline-block;margin:0 auto 0 20px}.rowin{width:100%}.float_left{float:left}.float_right{float:right}.clear_both{clear:both}.pb_5{padding-bottom:5px}.pl_10{padding-left:10px}.pt_5{padding-top:5px}.text-left{text-align:left}.sales{float:left;width:49%;height:103px;border:1px solid #000;border-right:none}.doc-date{width:45%;height:45px;border:1px solid #000;border-right:0;border-bottom:0}.sj-no{width:44.9%;height:45px;border:1px solid #000;border-bottom:0}.so-no{width:45%;height:47px;border:1px solid #000;border-right:0}.po-no{width:44.9%;height:47px;border:1px solid #000}.tipe-check{width:96.1%;height:30px;border:1px solid #000;border-top:0}.pl_50{padding-left:50px}.sent{width:49%;height:100px;border:1px solid #000;border-top:0}.sales-to{width:47%;height:100px;border:1px solid #000;border-left:0;border-top:0}.delivery-date{width:49%;height:50px;border:1px solid #000;border-top:0}.pt_15{padding-top:15px}.trans{width:47%;height:50px;border:1px solid #000;border-left:0;border-top:0}.no{width:10%;height:20px;border:1px solid #000;border-top:0;border-right:0}.uraian{width:25.6%;height:20px;border:1px solid #000;border-top:0;border-right:0}.jml,.tipe,.uom{width:10%;height:20px;border:1px solid #000;border-top:0;border-right:0}.ket{width:30%;height:20px;border:1px solid #000;border-top:0}.pt_40{padding-top:40px}enter}body{min-width:960px;max-width:960px;display:inline-block;margin:0 auto 0 20px}.rowin{width:100%}.float_left{float:left}.float_right{float:right}.clear_both{clear:both}.pb_5{padding-bottom:5px}.pl_10{padding-left:10px}.pt_5{padding-top:5px}.text-left{text-align:left}.sales{float:left;width:49%;height:103px;border:1px solid #000;border-right:none}.doc-date{width:45%;height:45px;border:1px solid #000;border-right:0;border-bottom:0}.sj-no{width:44.9%;height:45px;border:1px solid #000;border-bottom:0}.so-no{width:45%;height:47px;border:1px solid #000;border-right:0}.po-no{width:44.9%;height:47px;border:1px solid #000}.tipe-check{width:96.1%;height:30px;border:1px solid #000;border-top:0}.pl_50{padding-left:50px}.sent{width:49%;height:100px;border:1px solid #000;border-top:0}.sales-to{width:47%;height:100px;border:1px solid #000;border-left:0;border-top:0}.delivery-date{width:49%;height:50px;border:1px solid #000;border-top:0}.pt_15{padding-top:15px}.trans{width:47%;height:50px;border:1px solid #000;border-left:0;border-top:0}.no{width:10%;height:20px;border:1px solid #000;border-top:0;border-right:0}.uraian{width:25.6%;height:20px;border:1px solid #000;border-top:0;border-right:0}.jml,.tipe,.uom{width:10%;height:20px;border:1px solid #000;border-top:0;border-right:0}.ket{width:30%;height:20px;border:1px solid #000;border-top:0}.pt_40{padding-top:40px}</style></head><body onload="window.print()"> <div class="container"> <div class="row"> <div class="float_left" style="width: 104.5%;height: 100px"> <div class="rowin"> <div class="doc-date float_left text-left pl_10 pt_5"> <div class="pb_5">Tanggal Dokumen</div> <div class="pb_5">'+ delivery.delivery_detail.date_created +'</div> </div> <div class="sj-no float_left text-left pl_10 pt_5"> <div class="pb_5">Nomor Surat Jalan</div> <div class="pb_5">'+ delivery.delivery_detail.delivery_reference +'</div> </div> <div class="clear_both"></div> </div> <div class="rowin"> <div class=" so-no float_left text-left pl_10 pt_5" style=""> <div class="pb_5">Nomer Sales Order</div> <div class="pb_5">'+ delivery.order_detail.order_reference +'</div> </div> <div class="po-no float_left text-left pl_10 pt_5"> <div class="pb_5">Nomer PO Customer</div> <div class="pb_5"></div> </div> <div class="clear_both"></div> </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="tipe-check float_left"> <div class="text-left pl_10 pt_5"> <span>Tipe </span> <span class="pl_50"><input type="checkbox"> Busa </span> <span class="pl_50"><input type="checkbox"> Superland </span> <span class="pl_50"><input type="checkbox"> Charis </span> <span class="pl_50"><input type="checkbox"> Theraspine </span> <span class="pl_50"><input type="checkbox"> Cushion </span> </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="sent float_left"> <div class="text-left pl_10 pt_5"> Tujuan Pengiriman </div> <div class="text-left pl_10 pt_5" style="font-size: 8pt">'+ delivery.customer_detail.address +' </div> </div> <div class="sales-to float_left"> <div class="text-left pl_10 pt_5"> Dijual Kepada<br/>'+ delivery.customer_detail.customer_name +' </div> <div class="text-left pl_10 pt_40"> No Tlpn<br/>'+ delivery.customer_detail.phone_number +' </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="delivery-date float_left"> <div class="text-left pt_15 pl_10"> <span>Tanggal Pengiriman</span> <span>'+ delivery.delivery_detail.print_loading_date +'</span> </div> </div> <div class="trans float_left"> <div class="text-left pt_15 pl_10" > <span>Kendaraan Pengangkut</span> <span>'+ delivery.delivery_detail.truck_code +'</span> </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="no float_left"> <div class="text-left" style="padding-left: 10px"> No. </div> </div> <div class="uraian float_left"> <div class="text-left pl_10" > Uraian Barang </div> </div> <div class=" tipe float_left"> <div class="text-left pl_10" > Tipe </div> </div> <div class="jml float_left"> <div class="text-left pl_10"> Jumlah </div> </div> <div class="uom float_left"> <div class="text-left pl_10"> UOM </div> </div> <div class="ket float_left"> <div class="text-left pl_10"> Keterangan </div> </div> </div> <div class="clear_both"></div> ' + tableData + ' <div class="clear_both"></div> <div class="row"> <div class="float_left" style="width: 96.1%;height: 200px;border: 1px solid #000000;border-top: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> Keterangan Tambahan </div> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> </div> <div class="text-left" style="padding-top: 100px; padding-left: 10px"> Mohon hubungi nomer berikut untuk keadaan darurat : XXXXX </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="float_left" style="width: 24%;height: 100px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> <div class="pb_5">Diperiksa</div> <div class="pt_40">Tgl/Nama Jelas</div> </div> </div> <div class="float_left" style="width: 24%;height: 100px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> <div class="pb_5">Mengetahui</div> <div class="pt_40">Tgl/Nama Jelas</div> </div> </div> <div class="float_left" style="width: 24%;height: 100px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> <div class="pb_5">Supir</div> <div class="pt_40">Tgl/Nama Jelas</div> </div> </div> <div class="float_left" style="width: 23.8%;height: 100px;border: 1px solid #000000;border-top: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> <div class="pb_5">Tanda Tangan Penerima</div> <div class="pt_40">Tgl/Nama Jelas</div> </div> </div> </div> <div class="clear_both"></div> </div></body></html>';
		
		
		popupWin.document.write(docWrite);
		popupWin.document.close();
		
		
		
		
	}
	
	$scope.printDeliveryNotes = function(delivery) {
		
		//var printContents = document.getElementById(divName).innerHTML;
		var popupWin = window.open('', '_blank', 'width=960,height=960');
		popupWin.document.open();
		//popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + '<p>asdfasdfasdfasdfasdf</p>' + '</body></html>');
		
		var tableData = '';
		
		
		for (var i = 0 ; i < delivery.delivery_detail.delivery_items.length ; i++ ) {

		tableData = tableData + '<div class="row" style="height: auto"> <div class="float_left" style="width: 10%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ (i + 1) + 
		'</div> </div> <div class="float_left" style="width: 25.6%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].item_name +
		'</div> </div> <div class="float_left" style="width: 10%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].item_type + 
		'</div> </div> <div class="float_left" style="width: 10%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">' 
		+ delivery.delivery_detail.delivery_items[i].quantity_sent +
		'</div> </div> <div class="float_left" style="width: 10%;height: 20px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].item_unit +
		'</div> </div> <div class="float_left" style="width: 30%;height: 20px;border: 1px solid #000000;border-top: 0px"> <div class="text-left" style="padding-left: 10px">'
		+ delivery.delivery_detail.delivery_items[i].item_remark +
		' </div> </div> </div> ';
		};
		
		var docWrite = '<html><head lang="en"><meta charset="UTF-8"><title>Surat Jalan</title><style> html{text-align:center}body{min-width:960px;max-width:960px;display:inline-block;margin:0 auto 0 20px}.rowin{width:100%}.float_left{float:left}.float_right{float:right}.clear_both{clear:both}.pb_5{padding-bottom:5px}.pl_10{padding-left:10px}.pt_5{padding-top:5px}.text-left{text-align:left}.sales{float:left;width:49%;height:103px;border:1px solid #000;border-right:none}.doc-date{width:45%;height:45px;border:1px solid #000;border-right:0;border-bottom:0}.sj-no{width:44.7%;height:45px;border:1px solid #000;border-bottom:0}.so-no{width:45%;height:47px;border:1px solid #000;border-right:0}.po-no{width:44.7%;height:47px;border:1px solid #000}.tipe-check{width:96.1%;height:30px;border:1px solid #000;border-top:0}.pl_50{padding-left:50px}.sent{width:49%;height:100px;border:1px solid #000;border-top:0}.sales-to{width:47%;height:100px;border:1px solid #000;border-left:0;border-top:0}.delivery-date{width:49%;height:50px;border:1px solid #000;border-top:0}.pt_15{padding-top:15px}.trans{width:47%;height:50px;border:1px solid #000;border-left:0;border-top:0}.no{width:10%;height:20px;border:1px solid #000;border-top:0;border-right:0}.uraian{width:25.6%;height:20px;border:1px solid #000;border-top:0;border-right:0}.jml,.tipe,.uom{width:10%;height:20px;border:1px solid #000;border-top:0;border-right:0}.ket{width:30%;height:20px;border:1px solid #000;border-top:0}.pt_40{padding-top:40px}</style></head><body onload="window.print()"> <div class="container"> <div class="row"> <div class="sales"> <div class="text-left pl_10 pt_5"> Penjual </div> <div class="text-left pl_10 pt_5" style="font-size: 8pt"> PT. Superpoly Industries <br> Komplek Perkantoran Kota Grogol Permai <br> Blok B-45, Jl. Prof DR. Latumeten, Jakarta Barat 11460 </div> </div> <div class="float_left" style="width: 50%;height: 100px"> <div class="rowin"> <div class="doc-date float_left text-left pl_10 pt_5"> <div class="pb_5">Tanggal Dokumen</div> <div class="pb_5">'+ delivery.delivery_detail.date_created +'</div> </div> <div class="sj-no float_left text-left pl_10 pt_5"> <div class="pb_5">Nomor Surat Jalan</div> <div class="pb_5">'+ delivery.delivery_detail.delivery_reference +'</div> </div> <div class="clear_both"></div> </div> <div class="rowin"> <div class=" so-no float_left text-left pl_10 pt_5" style=""> <div class="pb_5">Nomer Sales Order</div> <div class="pb_5">'+ delivery.order_detail.order_reference +'</div> </div> <div class="po-no float_left text-left pl_10 pt_5"> <div class="pb_5">Nomer PO Customer</div> <div class="pb_5"></div> </div> <div class="clear_both"></div> </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="tipe-check float_left"> <div class="text-left pl_10 pt_5"> <span>Tipe </span> <span class="pl_50"><input type="checkbox"> Busa </span> <span class="pl_50"><input type="checkbox"> Superland </span> <span class="pl_50"><input type="checkbox"> Charis </span> <span class="pl_50"><input type="checkbox"> Theraspine </span> <span class="pl_50"><input type="checkbox"> Cushion </span> </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="sent float_left"> <div class="text-left pl_10 pt_5"> Tujuan Pengiriman </div> <div class="text-left pl_10 pt_5" style="font-size: 8pt">'+ delivery.customer_detail.address +' </div> </div> <div class="sales-to float_left"> <div class="text-left pl_10 pt_5"> Dijual Kepada<br/>'+ delivery.customer_detail.customer_name +' </div> <div class="text-left pl_10 pt_5"> No Tlpn<br/>'+ delivery.customer_detail.phone_number +' </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="delivery-date float_left"> <div class="text-left pt_15 pl_10"> <span>Tanggal Pengiriman</span> <span>'+ delivery.delivery_detail.print_loading_date +'</span> </div> </div> <div class="trans float_left"> <div class="text-left pt_15 pl_10" > <span>Kendaraan Pengangkut</span> <span>'+ delivery.delivery_detail.truck_code +'</span> </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="no float_left"> <div class="text-left" style="padding-left: 10px"> No. </div> </div> <div class="uraian float_left"> <div class="text-left pl_10" > Uraian Barang </div> </div> <div class=" tipe float_left"> <div class="text-left pl_10" > Tipe </div> </div> <div class="jml float_left"> <div class="text-left pl_10"> Jumlah </div> </div> <div class="uom float_left"> <div class="text-left pl_10"> UOM </div> </div> <div class="ket float_left"> <div class="text-left pl_10"> Keterangan </div> </div> </div> <div class="clear_both"></div> ' + tableData + ' <div class="clear_both"></div> <div class="row"> <div class="float_left" style="width: 96.1%;height: 200px;border: 1px solid #000000;border-top: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> Keterangan Tambahan </div> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> </div> <div class="text-left" style="padding-top: 100px; padding-left: 10px"> Mohon hubungi nomer berikut untuk keadaan darurat : XXXXX </div> </div> </div> <div class="clear_both"></div> <div class="row"> <div class="float_left" style="width: 24%;height: 100px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> <div class="pb_5">Diperiksa</div> <div class="pt_40">Tgl/Nama Jelas</div> </div> </div> <div class="float_left" style="width: 24%;height: 100px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> <div class="pb_5">Mengetahui</div> <div class="pt_40">Tgl/Nama Jelas</div> </div> </div> <div class="float_left" style="width: 24%;height: 100px;border: 1px solid #000000;border-top: 0px;border-right: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> <div class="pb_5">Supir</div> <div class="pt_40">Tgl/Nama Jelas</div> </div> </div> <div class="float_left" style="width: 23.8%;height: 100px;border: 1px solid #000000;border-top: 0px"> <div class="text-left" style="padding-top: 15px; padding-left: 10px"> <div class="pb_5">Tanda Tangan Penerima</div> <div class="pt_40">Tgl/Nama Jelas</div> </div> </div> </div> <div class="clear_both"></div> </div></body></html>';
		
		
		popupWin.document.write(docWrite);
		popupWin.document.close();
		
		
		
		
	}
	
			
	$scope.printDiv = function(divName) {
		var printContents = document.getElementById(divName).innerHTML;
		var popupWin = window.open('', '_blank', 'width=300,height=300');
		popupWin.document.open()
		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
		popupWin.document.close();
	} 
	
	//@@ FOCUS
	
	$scope.init = function() {
		
		$scope.itemLookupList = ItemLookupService.getAllItems();
		
		ApiCallService.getDeliveryDetail($scope.retrieveDeliveryId).
			success(function(data, status, headers, config) {
				
				if (data.call_status === "success") {
					
					$scope.delivery = data.delivery;
                    $scope.retrievedOrderId = $scope.delivery.order_detail.order_id;
                    $scope.goodIssue.order_id = $scope.delivery.order_detail.order_id;
                    $scope.goodIssue.good_issue_remark = $scope.delivery.order_detail.good_issue_remark;

					//simpan value awal untuk perbandingan sebelum di save
					$scope.original_value = {};
					$scope.original_value.actual_loading_date = null;
					$scope.original_value.arrival_date = null;
					$scope.original_value.confirmation_date = null;
                    $scope.original_value.good_issue_date = null;

                    ApiCallService.getGoodIssueItems($scope.retrievedOrderId).success(function(data){
                        if(data.call_status == "success"){
                            $scope.goodIssue.items = data.good_issue_items;

                            for(var i = 0; $scope.goodIssue.items.length; i += 1){
                                $scope.goodIssue.items[i].quantity = parseInt($scope.goodIssue.items[i].quantity);
                                $scope.goodIssue.items[i].location = $scope.goodIssue.items[i].site_id+"/"+$scope.goodIssue.items[i].storage_id+"/"+$scope.goodIssue.items[i].bin_id
                            }

                        }
                    });

					$scope.delivery.delivery_detail.date_created = moment($scope.delivery.delivery_detail.date_created).format('YYYY-MM-DD');
					
					if ($scope.delivery.delivery_detail.loading_date !== null) {
						$scope.delivery.delivery_detail.loading_date = new Date(moment($scope.delivery.delivery_detail.loading_date).format('YYYY-MM-DD'));
						$scope.delivery.delivery_detail.print_loading_date = moment($scope.delivery.delivery_detail.loading_date).format('YYYY-MM-DD');
						$scope.original_value.loading_date = new Date(moment($scope.delivery.delivery_detail.loading_date).format('YYYY-MM-DD'));
					}
					
					if ($scope.delivery.delivery_detail.actual_loading_date !== null) {
						$scope.delivery.delivery_detail.actual_loading_date = new Date(moment($scope.delivery.delivery_detail.actual_loading_date));
						$scope.original_value.actual_loading_date = new Date(moment($scope.delivery.delivery_detail.actual_loading_date));
					}
					
					if ($scope.delivery.delivery_detail.arrival_date !== null) {
						$scope.delivery.delivery_detail.arrival_date = new Date(moment($scope.delivery.delivery_detail.arrival_date));
						$scope.original_value.arrival_date = new Date(moment($scope.delivery.delivery_detail.arrival_date));
					}

                    if ($scope.delivery.delivery_detail.confirmation_date !== null) {
                        $scope.delivery.delivery_detail.confirmation_date = new Date(moment($scope.delivery.delivery_detail.confirmation_date));
                        $scope.original_value.confirmation_date = new Date(moment($scope.delivery.delivery_detail.confirmation_date));
                    }

                    if ($scope.delivery.order_detail.production_completed_date !== null) {
                        $scope.delivery.order_detail.production_completed_date= new Date(moment($scope.delivery.order_detail.production_completed_date));
                    }

                    if ($scope.delivery.order_detail.good_issue_date !== null) {
                        $scope.delivery.order_detail.good_issue_date = new Date(moment($scope.delivery.order_detail.good_issue_date).format('YYYY-MM-DD'));
                        $scope.goodIssue.good_issue_date = $scope.delivery.order_detail.good_issue_date;
                        $scope.goodIssue.good_issue = true;
                        $scope.goodIssue.confirmGoodIssue = true;
                        //simpan value awal untuk perbandingan sebelum di save
                        $scope.original_value.good_issue_date = new Date(moment($scope.delivery.order_detail.good_issue_date).format('YYYY-MM-DD'));
                    }
                    console.log($scope);
				}
				else if (data.call_status === "error") {
					console.log(data);
				}
				
				pageLock = {
					'level': 'D',
					'delivery_id': $scope.delivery.delivery_id
				};
				ApiCallService.checkPageLock(pageLock).
					success(function(data, status, headers, config) {
						if (data.call_status === "success") {
							
						}
						else {
							console.log(data);
						}
					}).
					error(function(data, status, headers, config) {
						console.log(data);
						console.log(status);
						console.log(header);
						console.log(config);
					});
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
		
		//Hapus ini
		ApiCallService.getDeliveryItemsByDeliveryId($scope.retrieveDeliveryId).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					if(data.delivery_item_list.length == 0){
						$scope.disableTabBarang = true;
					}
					else {
						$scope.disableTabBarang = false;
					}
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	};
    $scope.displayLocationModal = function(item) {
        var pass_data = {
            item: item
        };

        var modalInstance = $modal.open({
            templateUrl: 'modal_location',
            controller: 'LocationModalCtrl',
            size: 'lg',
            resolve: {
                passed_data: function () {
                    return pass_data;
                }
            },
            scope: $scope
        });
    };
    $scope.displayCancelModal = function() {
        /*
        var pass_data = {
            item: item
        };
         */

        var modalInstance = $modal.open({
            templateUrl: 'modal_cancel',
            controller: 'CancelModalCtrl',
            size: 'lg',
            /*
            resolve: {
                passed_data: function () {
                    return pass_data;
                }
            },
            */
            scope: $scope
        });
    };

	$scope.init();
	
});
	
app.controller('OrderUpdateHistoryModalCtrl', function ($scope, $modalInstance, passed_data, ApiCallService) {
	
	$scope.passed_data = passed_data;
	
	$scope.delivery_id = $scope.passed_data.delivery_id;
	
	$scope.delivery_update_history = [];
	
	$scope.init = function() {
		ApiCallService.getDeliveryUpdateHistory($scope.delivery_id).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.delivery_update_history = data.delivery_update_history_list;
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
	
	$scope.init();

});

app.controller('PrintDeliveryModalCtrl', function ($scope, $modalInstance, ApiCallService) {
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
	
	$scope.init = function () {
		
	};
	
	$scope.init();

});

app.controller('PrintSpecialDeliveryModalCtrl', function ($scope, $modalInstance, ApiCallService) {
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
	
	$scope.init = function () {
		
	};
	
	$scope.init();

});

app.controller('CancelModalCtrl', function ($scope, $modalInstance, SweetAlert) {

    //var index = passed_data.index;
    $scope.saveModal = function(){
        SweetAlert.swal("Success!", "GR Telah Dibatalkan", "success");
        $modalInstance.dismiss('close');
    }
    $scope.closeModal = function () {
        $modalInstance.dismiss('close');
    };

});


app.controller('LocationModalCtrl', function ($scope, $modalInstance, ItemService, PurchaseService, passed_data, SweetAlert) {
    $scope.locations = passed_data.item;

    $scope.saveLocation = function(data){
        var i = $scope.goodIssue.items.indexOf(passed_data.item);
        $scope.goodIssue.items[i].location = $scope.locations.piece_id+","+$scope.locations.site_id+"/"+$scope.locations.storage_id+"/"+$scope.locations.bin_id;
        $scope.goodIssue.items[i].site_id = $scope.locations.site_id;
        $scope.goodIssue.items[i].storage_id = $scope.locations.storage_id;
        $scope.goodIssue.items[i].bin_id = $scope.locations.bin_id;
        $scope.goodIssue.items[i].piece_id = $scope.locations.piece_id;
        $modalInstance.dismiss();
    };

    $scope.closeModal = function () {
        $modalInstance.dismiss();
    };
});

