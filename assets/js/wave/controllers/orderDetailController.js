app.controller('OrderDetailController', function($rootScope, $scope, $state, $stateParams, $modal, $filter, ItemLookupService, PurchaseService, CustomerService, ApiCallService, SweetAlert, AttributeFactory, ItemService, OrderService) {

	$scope.state = $state.current;

	$scope.retrievedOrderId = $stateParams.order_id;

	$scope.itemLookupList = [];
	$scope.customerLookupList = [];

	$scope.siteList = [];
	$scope.storageList = [];
	$scope.binList = [];
	$scope.batchList = [];

	PurchaseService.getSiteList().success(function(data){
		if(data.call_status == "success"){
			$scope.siteList = data.site_list;
		}
	});

	PurchaseService.getStorageList().success(function(data){
		if(data.call_status == "success"){
			$scope.storageList = data.storage_list;
		}
	});

	PurchaseService.getBinList().success(function(data){
		if(data.call_status == "success"){
			$scope.binList = data.bin_list;
		}
	});

	PurchaseService.getBatchList().success(function(data){
		if(data.call_status == "success"){
			$scope.batchList = data.batch_list;
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

	$scope.customerIdToSearch = "";

	$scope.goodIssue = {};
	$scope.goodIssue.confirmGoodsIssue = false;
	$scope.goodIssue.good_issue = false;
	$scope.goodIssue.items = [];

	$scope.addGoodIssueItem = function() {
		var newItem = {
			"order_id": $scope.retrievedOrderId,
			"item_code": "",
			"attributes": {},
			"quantity": 0,
			"is": "N",
			"status": "A",
		};
		$scope.goodIssue.items.push(newItem);
	};

	$scope.setAttributesGoodIssue = function (index, item){
		$scope.goodIssue.items[index].item_code = item.item_code;
		$scope.goodIssue.items[index].attributes = item.attributes;
		$scope.goodIssue.items[index].requested_quantity = item.quantity;
		$scope.goodIssue.items[index].requested_unit = item.item_unit;
		$scope.goodIssue.items[index].item_unit = item.item_unit;
		ItemService.getItemUomConversionListByItemCode(item.item_code).success(function(data) {
			if (data.call_status === "success") {
				$scope.goodIssue.items[index].uom_list = data.conversion_list;
			}
		});
	}

	$scope.checkGoodIssue = function(){
		var item = $scope.checkGIBeforeSave();
		var num = false;
		if(item.length > 0){
			$scope.displayBeforeGIModal(item);
			num = false;
		}else{
			num = true;
		}
		return num;
	}
	$scope.checkGI = function(){
		for(var i = 0; i < $scope.order.order_detail.order_items.length; i += 1){

		}
	}
	$scope.getUomList = function (item_code){
		var uom_list = [];
		ItemService.getItemUomConversionListByItemCode(item_code).success(function(data) {
			if (data.call_status === "success") {
				uom_list = data.conversion_list;
			}
		});
		return uom_list;
	}
	$scope.checkGIBeforeSave = function(){
		var reviewedItem = [];
		var delivered_quantity = {};
		for (var i = 0; i < $scope.order.order_detail.order_items.length; i += 1){
			$scope.order.order_detail.order_items[i].received_quantity = 0;
			delivered_quantity[$scope.order.order_detail.order_items[i].item_code] = 0;
			for (var j = 0; j < $scope.goodIssue.items.length; j += 1){
				if($scope.order.order_detail.order_items[i].item_code == $scope.goodIssue.items[j].item_code){
					for(var l = 0; l < $scope.goodIssue.items[j].uom_list.length; l += 1){
						if($scope.goodIssue.items[j].uom_list[l].alternative_uom == $scope.goodIssue.items[j].item_unit ){
							$scope.order.order_detail.order_items[i].received_quantity += $scope.goodIssue.items[j].uom_list[l].base_amount *  parseInt($scope.goodIssue.items[j].quantity);
						}
					}
				}
			}
			/*
			for(var k = 0;k < $scope.deliveredItemList.length; k += 1){
				if($scope.deliveryItemList[i].item_code == $scope.deliveredItemList[k].item_code ){
					//$scope.deliveryItemList[i].received_quantity += parseInt($scope.deliveredItemList[k].quantity);
					delivered_quantity[$scope.deliveryItemList[i].item_code] += parseInt($scope.deliveredItemList[k].quantity);
				}
			}
			*/
		}

		for (var m = 0; m < $scope.order.order_detail.order_items.length; m += 1){
			$scope.order.order_detail.order_items[m].aktual_quantity = parseInt($scope.order.order_detail.order_items[m].quantity);
			var quantity = parseInt($scope.order.order_detail.order_items[m].aktual_quantity);
			var received_quantity = parseInt($scope.order.order_detail.order_items[m].received_quantity);
			var delivered = parseInt(delivered_quantity[$scope.order.order_detail.order_items[m].item_code]);
			received_quantity = received_quantity + delivered;
			delivered_quantity[$scope.order.order_detail.order_items[m].item_code] = 0;
			if(received_quantity < quantity){
				$scope.order.order_detail.order_items[m].remain_quantity = quantity - received_quantity;
				reviewedItem.push($scope.order.order_detail.order_items[m]);
			}else if(quantity == received_quantity){
				//reviewedItem.push($scope.deliveryItemList[m]);
			}
		}
		return reviewedItem;
	}

	$scope.updateGoodIssue = function (){
		//$scope.checkGoodIssue();
		for (var j = 0; j < $scope.goodIssue.items.length; j += 1){
			for(var l = 0; l < $scope.goodIssue.items[j].uom_list.length; l += 1){
				if($scope.goodIssue.items[j].uom_list[l].alternative_uom == $scope.goodIssue.items[j].item_unit ){
					$scope.goodIssue.items[j].aktual_quantity = $scope.goodIssue.items[j].uom_list[l].base_amount *  parseInt($scope.goodIssue.items[j].quantity);
				}
			}
		}

		if($scope.goodIssue.confirmGoodsIssue == null || $scope.goodIssue.confirmGoodsIssue == undefined || $scope.goodIssue.confirmGoodsIssue == false){
			//$scope.checkGoodIssue();
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
			$scope.displayBeforeGIModal($scope.goodIssue.items);
			/*
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
					if(data.good_issue_status){
						$scope.order.order_detail.good_issue_status = "A";
					}
				}
			});
			*/
		}
	};

	$scope.lookupAttibute = function (itemCode, attributeName, index){
		var attribute = "";
		for(var i = 0; i < $scope.order.order_detail.order_items.length; i += 1){
			if(itemCode == $scope.order.order_detail.order_items[i].item_code){
				attribute = $scope.order.order_detail.order_items[i].attributes[attributeName];
				//console.log(itemCode, attributeName, index);
				$scope.goodIssue.items[index].attributes[attributeName] = $scope.order.order_detail.order_items[i].attributes[attributeName];
			}
		}
		return attribute;
	};

	$scope.lookupQuantity = function (itemCode){
		var quantity = 0;
		for(var i = 0; i < $scope.order.order_detail.order_items.length; i += 1){
			if(itemCode == $scope.order.order_detail.order_items[i].item_code){
				quantity = $scope.order.order_detail.order_items[i].quantity;
			}
		}
		return quantity;
	};

	$scope.getSiteName = function(site_id){
		for(var j = 0; j<$scope.siteList.length; j += 1){
			if($scope.siteList[j].site_id == site_id){
				return $scope.siteList[j].site_reference;
			}
		}
	}
	$scope.getStorageName = function(storage_id){
		for(var j = 0; j<$scope.storageList.length; j += 1){
			if($scope.storageList[j].storage_id == storage_id){
				return $scope.storageList[j].storage_name;
			}
		}
	}
	$scope.getBinName = function(bin_id){
		for(var j = 0; j<$scope.binList.length; j += 1){
			if($scope.binList[j].bin_id == bin_id){
				return $scope.binList[j].bin_name;
			}
		}
	}
	$scope.getBatchName = function(batch_id){
		for(var j = 0; j<$scope.batchList.length; j += 1){
			if($scope.batchList[j].batch_id == batch_id){
				return $scope.batchList[j].batch_reference;
			}
		}
	}

	$scope.tabs = [
		{
			title: 'cash',
			content: '/cash.html',
			active: false
		}, {
			title: 'transfer',
			content: '/transfer.html',
			active: false
		}, {
			title: 'debit',
			content: '/debit.html',
			active: false
		}, {
			title: 'credit',
			content: '/credit.html',
			active: false
		}, {
			title: 'term',
			content: '/term.html',
			active: false
		}, {
			title: 'konsinyasi',
			content: '/konsinyasi.html',
			active: false
		}
	];

	$scope.total = function(){
		if($scope.order){
			var total = 0;
			for (var i = 0; i < $scope.order.order_detail.order_items.length; i += 1) {
				total += ($scope.order.order_detail.order_items[i].quantity*$scope.order.order_detail.order_items[i].cost)-($scope.order.order_detail.order_items[i].quantity*$scope.order.order_detail.order_items[i].cost*$scope.order.order_detail.order_items[i].disc_percent/100);
			}
			return total;
		}
	}

	$scope.totalWithoutDisc = function(){
		if($scope.order) {
			 var total = 0;
		for(var i = 0; i < $scope.order.order_detail.order_items.length; i += 1) {
			total += ($scope.order.order_detail.order_items[i].quantity*$scope.order.order_detail.order_items[i].cost);
		}
		return total;
		};
	}

	$scope.totalDiscPercent = function(){
		if ($scope.order) {
			var total = 0;
			for (var i = 0; i < $scope.order.order_detail.order_items.length; i += 1) {
				if($scope.order.order_detail.order_items[i].disc_percent !== null){
					total += ($scope.order.order_detail.order_items[i].quantity*$scope.order.order_detail.order_items[i].cost*$scope.order.order_detail.order_items[i].disc_percent/100)
				}
			}
			return total;
		};
	}

	$scope.totalDiscValue = function(){
		if ($scope.order) {
			var total = 0;
			for (var i = 0; i < $scope.order.order_detail.order_items.length; i += 1) {
				if($scope.order.order_detail.order_items[i].disc_value !== null){
					total += $scope.order.order_detail.order_items[i].disc_value;
				}
			}
			return total;
		};
	}

	$scope.totalDisc = function(){
		if ($scope.order) {
			var total = 0;
			total += $scope.totalDiscPercent() + $scope.totalDiscValue();
			return total;
		};
	}

	$scope.totalGrand = function(){
		if ($scope.order) {
			var total = 0;
			total += $scope.totalWithoutDisc() - $scope.totalDiscPercent() - $scope.totalDiscValue();
			return total;
		};
	}

	$scope.lookupItemUnit = function(itemCode) {
		return ItemLookupService.getItemUnit(itemCode);
	}

	$scope.lookupItemName = function(itemCode) {
		return ItemLookupService.getItemName(itemCode);
	}

	$scope.addItem = function() {
		var newItem = {
			"item_code": "",
			"quantity": null,
			"material_type": "",
			"remark": ""
		};

		$scope.order.order_detail.order_items.push(newItem);
	}

	//@@ FOCUS
	$scope.addDeliveryRequest = function() {
		if ($scope.isNoDeliveryRequestItemRemaining()) {
			SweetAlert.swal({
				title: "Tidak Dapat Menambah Rencana Pengiriman",
				text: "Semua item telah masuk rencana pengiriman.",
				type: "warning",
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
		}
		else {
			var deliveryRequestItems = [];
			var orderItems = $scope.order.order_detail.order_items;

			for (var i = 0 ; i < orderItems.length ; i++) {
				var totalInDelivery = $scope.getTotalInDeliveryRequests(orderItems[i].item_code, orderItems[i].material_type, orderItems[i].remark);

				var newItem = {
					"item_code": orderItems[i].item_code,
					"main_quantity": orderItems[i].quantity,
					"quantity": null,
					"remains": orderItems[i].quantity - totalInDelivery,
					"material_type": orderItems[i].material_type,
					"remark": orderItems[i].remark
				};

				deliveryRequestItems.push(newItem);
			}

			var newDeliveryRequest = {
				"order_id": $scope.retrievedOrderId,
				"delivery_request_id": null,
				"requested_delivery_date": "",
				"requested_delivery_address": "",
				"is_new_address": 1,
				"delivery_request_items": deliveryRequestItems,
				"HLPFIELD_is_edit_mode": true,
				"status": "A"
			}

			$scope.order.delivery_request_details.push(newDeliveryRequest);
		}

	};

	$scope.getDeliveryRequestCancelledString = function(deliveryRequest) {
		if (deliveryRequest.status == "X") {
			return " - BATAL";
		}
		return "";
	}

	$scope.getDeliveryRequestIsNewString = function(deliveryRequest) {
		if (deliveryRequest.HLPFIELD_is_edit_mode == true) {
			return " - BARU";
		}
		return "";
	}

	//untuk existing
	$scope.cancelDeliveryRequest = function(deliveryRequest) {
		ApiCallService.cancelDeliveryRequest(deliveryRequest).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					deliveryRequest.status = 'X';

					SweetAlert.swal({
						title: "Success",
						text: "Rencana pengiriman telah dibatalkan",
						type: "success",
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
				else if (data.call_status === "error") {
					if(data.error_code == "821") {
						SweetAlert.swal({
							title: "Terjadi Kesalahan",
							text: data.error_message,
							type: "error",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
					else if(data.error_code == "501") {
						$scope.showForceCloseOrderErrorPopUp();
					}
					else if(data.error_code == "702") {
						SweetAlert.swal({
							title: "Batalkan Rencana Pengiriman Gagal",
							text: data.error_message,
							type: "error",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			})
		;
	};

	//untuk yang baru
	$scope.removeDeliveryRequest = function(deliveryRequest) {
		$scope.order.delivery_request_details.splice($scope.order.delivery_request_details.indexOf(deliveryRequest), 1);
	}

	$scope.removeGoodIssueItem = function(item) {
		$scope.goodIssue.items[$scope.goodIssue.items.indexOf(item)].status = 'X';
	}

	$scope.isAllowedToAddNewDeliveryRequest = function() {
		if ($scope.order != null) {
			for (var i = 0 ; i < $scope.order.delivery_request_details.length ; i++) {
				if ($scope.order.delivery_request_details[i].HLPFIELD_is_edit_mode == true) {
					return false;
				}
			}
		}
		return true;
	}

	$scope.createNewDeliveryRequest = function(deliveryRequest) {
		$scope.createDeliveryRequestButtonLoading = true;

		if($scope.isDeliveryRequestValid(deliveryRequest)) {
			deliveryRequest.requested_delivery_date = new Date(moment(deliveryRequest.requested_delivery_date).format('YYYY-MM-DD'));

			deliveryRequest.delivery_request_items.forEach(function(item) {
				if(item.quantity === null || item.quantity == 0) {
					deliveryRequest.delivery_request_items.splice(deliveryRequest.delivery_request_items.indexOf(item), 1);
				}
			});

			//deliveryRequest.delivery_request_id = id dari delivery request yang baru dibuat
			ApiCallService.createNewDeliveryRequest(deliveryRequest).
				success(function(data, status, headers, config) {
					if (data.call_status === "success") {
						deliveryRequest.delivery_request_id = data.delivery_request_id;
						deliveryRequest.HLPFIELD_is_edit_mode = false;

						SweetAlert.swal({
							title: "Success",
							text: "Rencana pengiriman telah ditambah",
							type: "success",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
					else if (data.call_status === "error") {
						if(data.error_code == "701") {
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
								title: "Simpan Rencana Pengiriman Gagal",
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

					$scope.createDeliveryRequestButtonLoading = false;
				}).
				error(function(data, status, headers, config) {
					console.log(data);
					console.log(status);
					console.log(header);
					console.log(config);

					$scope.createDeliveryRequestButtonLoading = false;
				});
		}
		else {
			SweetAlert.swal({
				title: "Perhatian!",
				text: "Tanggal dan Alamat rencana pengiriman tidak boleh kosong. Jumlah Permohonan Pengiriman minimal diisi 1. Jumlah Permohonan tidak boleh lebih dari Jumlah Sisa",
				type: "warning",
				//confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});

			$scope.createDeliveryRequestButtonLoading = false;
		}
	}

	$scope.filterNullAndZero = function() {
		return function(item) {
			if (item.quantity === null) return false;
			if (item.quantity == 0) return false;
			return true;
		}
	}

	$scope.getTotalInDeliveryRequests = function(itemCode, materialType, remark) {
		var deliveryRequests = $scope.order.delivery_request_details;
		var total = 0;

		angular.forEach(deliveryRequests, function(deliveryRequest) {
			if (deliveryRequest.status == 'A') {
				var deliveryRequestItems = deliveryRequest.delivery_request_items;

				angular.forEach(deliveryRequestItems, function(deliveryRequestItem) {
					if (deliveryRequestItem.item_code == itemCode
					&& deliveryRequestItem.material_type == materialType
					&& deliveryRequestItem.remark == remark
				) {
						quantity = parseInt(deliveryRequestItem.quantity) || 0;
						total = total + quantity;
					}
				});
			}
		});

		return total;
	}

	$scope.getTotalInDeliveries = function(itemCode, materialType, remark) {
		var deliveryRequests = $scope.order.delivery_request_details;
		var total = 0;

		angular.forEach(deliveryRequests, function(deliveryRequest) {
			if (deliveryRequest.status == 'A') {
				var deliveries = deliveryRequest.deliveries;

				angular.forEach(deliveries, function(delivery) {
					var deliveryItems = delivery.delivery_items;

					angular.forEach(deliveryItems, function(deliveryItem) {
						if (deliveryItem.item_code == itemCode
							&& deliveryItem.material_type == materialType
							&& deliveryItem.remark == remark
						) {
							quantity = parseInt(deliveryItem.quantity_sent) || 0;
							total = total + quantity;
						}
					});
				});
			}
		});

		return total;
	}

	$scope.getTotalItemsReceived = function(itemCode, materialType, remark) {
		var deliveryRequests = $scope.order.delivery_request_details;
		var total = 0;

		angular.forEach(deliveryRequests, function(deliveryRequest) {
			if (deliveryRequest.status == 'A') {
				var deliveries = deliveryRequest.deliveries;

				angular.forEach(deliveries, function(delivery) {
					if (delivery.status == 'C') {
						var deliveryItems = delivery.delivery_items;

						angular.forEach(deliveryItems, function(deliveryItem) {
							if (deliveryItem.item_code == itemCode
								&& deliveryItem.material_type == materialType
								&& deliveryItem.remark == remark
							) {
								quantity = parseInt(deliveryItem.quantity_received) || 0;
								total = total + quantity;
							}
						});
					}
				});
			}
		});

		return total;
	}

	$scope.itemsRemaining = function(itemQuantity, itemCode, materialType, remark) {

		return itemQuantity;
	}

	$scope.printOrder = function() {
		SweetAlert.swal({
			title: "Success",
			text: "Order telah diprint.",
			type: "success",
			//confirmButtonColor: "#DD6B55",
			confirmButtonText: "Ok",
			closeOnConfirm: true,
			animation: "slide-from-top"
		});
	}

	$scope.submitNewOrder = function() {
		var inputOrder = {};
		angular.copy($scope.order, inputOrder);

		inputOrder.delivery_request_details.forEach(function(deliveryRequestDetail) {
			deliveryRequestDetail.requested_delivery_items.forEach(function(item) {
				if(item.quantity === null || item.quantity == 0) {
					deliveryRequestDetail.requested_delivery_items.splice(deliveryRequestDetail.requested_delivery_items.indexOf(item), 1);
				}
			});
		});

		ApiCallService.submitNewOrder(inputOrder).
			success(function(data, status, headers, config) {
				console.log(data);
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	};

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

	$scope.updateOrder = function() {
		var inputOrder = {};

		var original_start_date = $scope.original_value.production_start_date;

		var input_start_date = null;
		if ($scope.order.order_detail.production_start_date != null) {
			input_start_date = new Date(moment($scope.order.order_detail.production_start_date).format('YYYY-MM-DD'));
		}

		var original_completed_date = $scope.original_value.production_completed_date;

		var input_completed_date = null;
		if ($scope.order.order_detail.production_completed_date != null) {
			input_completed_date = new Date(moment($scope.order.order_detail.production_completed_date).format('YYYY-MM-DD'));
		}

		// kasih nilai default
		inputOrder.is_production_start_date_changed = 0;

		// kalau start date-nya berubah
		if (input_start_date != null && ( original_start_date === null || (original_start_date.toISOString() != input_start_date.toISOString()))) {
			var changed = true;

			inputOrder.is_production_start_date_changed = 1;
			inputOrder.production_start_date = input_start_date.toISOString().slice(0, 19).replace('T', ' ');
		}

		// kasih nilai default
		inputOrder.is_production_completed_date_changed = 0;

		// kalau completed date-nya berubah
		if (input_completed_date != null && ( original_completed_date === null || (original_completed_date.toISOString() != input_completed_date.toISOString()))){
			var changed = true;

			inputOrder.is_production_completed_date_changed = 1;
			inputOrder.production_completed_date = input_completed_date.toISOString().slice(0, 19).replace('T', ' ');
		}

		// kalau data inputnya beda dengan data awal
		if (changed) {
			$scope.updateButtonLoading = true;

			$scope.original_value.production_start_date = input_start_date;
			$scope.original_value.production_completed_date = input_completed_date;

			inputOrder.order_id = $scope.order.order_detail.order_id;

			ApiCallService.updateOrder(inputOrder).
				success(function(data, status, headers, config) {
					if (data.call_status === "success") {
						SweetAlert.swal({
							title: "Success",
							text: "Order berhasil di update",
							type: "success",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
						if(data.is_order_complete){
							$scope.order.order_detail.status = "R";
						}
					}
					else if (data.call_status === "error") {
						if(data.error_code == "701") {
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
								title: "Update Order Gagal",
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
		}
	};

	$scope.formatSearchCustomerText = function(model) {
		for (var i=0; i< $scope.customerLookupList.length; i++) {
			if (model === $scope.customerLookupList[i].customer_id) {
				return $scope.customerLookupList[i].customer_name + ' - ' + $scope.customerLookupList[i].pic_name;
			}
		}
	}

	$scope.getCustomerById = function() {
		CustomerService.getCustomerById($scope.customerIdToSearch).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.order.customer_input_type = "E";
					$scope.order.customer_id = $scope.customerIdToSearch;

					$scope.order.customer_details.customer_name = data.customer_details.customer_name;
					$scope.order.customer_details.pic_name = data.customer_details.pic_name;
					$scope.order.customer_details.address = data.customer_details.address;
					$scope.order.customer_details.city = data.customer_details.city;
					$scope.order.customer_details.postcode = data.customer_details.postcode;
					$scope.order.customer_details.phone_number = data.customer_details.phone_number;
					$scope.order.customer_details.fax_number = data.customer_details.fax_number;
					$scope.order.customer_details.customer_email = data.customer_details.customer_email;
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}

	$scope.displayBeforeGIModal = function(item) {
		var pass_data = {
			item: item,
			goodIssue: $scope.goodIssue
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_before_gi',
			controller: 'BeforeGIModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};


	$scope.displayPaymentReceiptModal = function(item) {
		var pass_data = {
			item: item
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_payment_receipt',
			controller: 'PaymentReceiptModalCtrl',
			size: 'md',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
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

	$scope.displayOrderHistory = function() {
		var pass_data = {
			order_id: $scope.retrievedOrderId,
			order_reference: $scope.order.order_detail.order_reference
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

	$scope.displayForceCloseOrder = function() {
		var pass_data = {
			order_id: $scope.retrievedOrderId,
			order_reference: $scope.order.order_detail.order_reference,
			force_close_reason: $scope.order.force_close_reason
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_content_force_close_order.html',
			controller: 'ForceCloseOrderModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			}
		});
	}

	$scope.displayOrderNotes = function() {
		var pass_data = {
			order_id: $scope.retrievedOrderId,
			order_reference: $scope.order.order_detail.order_reference,
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_order_notes',
			controller: 'OrderNotesModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			}
		});
	}

	$scope.setToCurrentDate = function() {
		var todayDate = new Date(moment(Date.now()).format('YYYY-MM-DD'));
		return todayDate;
	}

	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}

	$scope.isDeliveryRequestValid = function(deliveryRequest) {
		var validity = true;

		if (deliveryRequest.requested_delivery_date == "" || deliveryRequest.requested_delivery_date == null || deliveryRequest.requested_delivery_address == "") {
			validity = false;
		}
		else {
			var quantityNotEmpty = 0;

			angular.forEach(deliveryRequest.delivery_request_items, function(deliveryRequestItem) {
				if (deliveryRequestItem.quantity != null && deliveryRequestItem.quantity != "" && deliveryRequestItem.quantity != 0) {
					if (deliveryRequestItem.quantity > deliveryRequestItem.remains) {
						validity = false;
					}
					quantityNotEmpty = quantityNotEmpty + 1;
				}
			});

			if (quantityNotEmpty == 0) {
				validity = false;
			}
		}

		return validity;
	}

	$scope.isNoDeliveryRequestItemRemaining = function() {
		orderItems = $scope.order.order_detail.order_items;
		noItemRemaining = true;

		orderItems.forEach(function(orderItem) {
			total = $scope.getTotalInDeliveryRequests(orderItem.item_code, orderItem.material_type, orderItem.remark);
			itemRemaining = orderItem.quantity - total;

			if (itemRemaining > 0) {
				noItemRemaining = false;
			}
		});

		return noItemRemaining;
	}

	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}

	$scope.printOrderNotes = function(order) {
		var dateCreated = moment(order.order_detail.date_created).format('DD-MM-YYYY');
		var dayCreated= $filter('date')(order.order_detail.date_created, "EEEE");
		var division = order.order_detail.product_type;
		var orderReference = order.order_detail.order_reference;

		var today = new Date();
		var dateToday = $filter('date')(today, 'd MMMM yyyy');
		var dayToday= $filter('date')(today, "EEEE");

		checkBusa = '';
		checkSuperland = '';
		checkCharis = '';
		checkTheraspine = '';
		checkCushion = '';

		if (division == 'B') {
			checkBusa = 'checked';
		} else if (division == 'S') {
			checkSuperland = 'checked';
		} else if (division == 'C') {
			checkCharis = 'checked';
		} else if (division == 'T') {
			checkTheraspine = 'checked';
		} else if (division == 'U') {
			checkCushion = 'checked';
		}

		//var printContents = document.getElementById(divName).innerHTML;
		var popupWin = window.open('', '_blank', 'width=960,height=960');
		popupWin.document.open();
		//popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + '<p>asdfasdfasdfasdfasdf</p>' + '</body></html>');

		var tableData = '';
		var custDataRow = '';
		var i;
		var m = 0;
		for (i = 0 ; i < order.order_detail.order_items.length ; i++ ) {
			var item = order.order_detail.order_items[i];
			custDataRow = order.customer_detail.customer_name;

			var width = item.width || 0;
			var length = item.length || 0;
			var height = item.height || 0;
			var quantity = item.quantity;
			var volume = length * width * height * quantity;

			volume = (volume / 1000000).toFixed(2);

			tableData = tableData + '<tr><td>'
				+ (i + 1) + '</td><td>'
				+ custDataRow
				+ '</td><td>'
				+ item.item_code + ' - ' + item.item_name
				+ '</td><td>'
				+ item.quantity + '</td><td>'
				+ (item.material_type === null ? '' : item.material_type) + '</td><td>'
				+ volume + '</td><td>'
				+ '' +'</td><td>'
				+ '' +'</td><td>'
				+ (item.remark === null || item.remark === '' ? '' : item.remark)
				+'</td></tr>';

			if (item.children != null) {
				for(var j = 0; j < item.children.length; j++){
					var itemChild = item.children[j];

					var width = itemChild.width || 0;
					var length = itemChild.length || 0;
					var height = itemChild.height || 0;
					var quantity = itemChild.quantity || 1;
					var volume = length * width * height * quantity;

					volume = (volume / 1000000).toFixed(2);

					tableData = tableData + '<tr><td>'
					+ '</td><td>'
					+ '</td><td>'
					+ '&nbsp;&nbsp;&nbsp;' + itemChild.item_code + ' - ' + itemChild.item_name
					+ '</td><td>'
					+ '</td><td>'
					+ (itemChild.material_type || '') + '</td><td>'
					+ volume + '</td><td>'
					+ '</td><td>'
					+ '</td><td>'
					+ (itemChild.remark || '')
					+'</td></tr>';
				}
			}

			m++;
		};

		while (m < 20) {
			tableData = tableData + '<tr><td style="height:20px">'
				+ '</td><td>'
				+ '</td><td>'
				+ '</td><td>'
				+ '</td><td>'
				+ '</td><td>'
				+ '</td><td>'
				+ '</td><td>'
				+ '</td><td>'
				+ '</td></tr>';
			m++;
		};

		var docWrite = '<html> <head lang="en"> <meta charset="UTF-8"> <title>PB</title> <style> html{text-align:center}body{min-width:960px;max-width:960px;display:inline-block;margin:0 auto 0 20px}#fixhh tr{height:40px;} #fixh tr{height:40px;} .table-mid { border-collapse: collapse; border-bottom: 1px solid #999; } .table-mid th , td{ border: 1px  solid #999; padding: 0.5rem; text-align: left; } .centered { text-align: center; } .table-bottom { border-collapse: collapse; } .table-bottom th{ font-weight: normal; padding: 0.5rem; text-align: left; }</style> </head> <body onload="window.print()"> <table class="table-mid" width="100%"> <tr> <td>No &nbsp; : '+ orderReference +'</td> <td colspan="2" class="centered">PESANAN BARANG SPL</td> <td colspan="2">Tgl Pesan :' + dateCreated + '</td> </tr> <tr><td rowspan="3">Dari : '+ $rootScope.username +'</td><td><input type="checkbox"' + checkBusa + '>Busa</td><td><input type="checkbox"' + checkSuperland + '>Superland</td><td colspan="2">Hari &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ' + dayCreated + '</td></tr><tr><td><input type="checkbox"' + checkCharis + '>Charis</td><td><input type="checkbox"' + checkTheraspine + '>Theraspine</td><td rowspan="2"></td></tr><tr><td><input type="checkbox"' + checkCushion + '>Cushion</td><td></td></tr> </table> <br> <table class="table-mid" width="100%"> <thead id="fixhh"> <tr> <td>No.</td> <td>Nama Pemesan</td> <td>Type/Ukuran/Warna</td> <td>Jumlah</td> <td>Kain</td> <td>m<sup>3</sup></td> <td>Tgl Kirim</td> <td>Selesai</td> <td>Keterangan</td> </tr> </thead> <tbody id="fixh">' + tableData + '</tbody> </table> <br> <br> <br> <table class="table-bottom" width="100%"> <tr> <th colspan="4">'+ dayToday +', '+ dateToday +'</th> </tr> <tr> <th>DIPERIKSA : </th> <th>PENANGGUNG JAWAB :</th> <th>PELAKSANA :</th> <th>DISETUJUI :</th> </tr> <tr> <th rowspan="2"></th> <th rowspan="2"></th> <th rowspan="2"></th> <th rowspan="2"></th> </tr> <tr></tr> <tr> <th>( '+ draftApprover +' )</th> <th>( ............................... )</th> <th>( ............................... )</th> <th>( ............................... )</th> </tr> <tr> <th>Ka. Marketing</th> <th>Ka. Divisi</th> <th>Ka. Logistik</th> <th>Dir. Produksi</th> </tr> <tr> <th colspan="4"></th> </tr> </table> </body> </html>';

		popupWin.document.write(docWrite);
		popupWin.document.close();
	}

	$scope.parseFloat = function (parse) {
		return parseFloat(parse);
	}

	$scope.init = function() {
		$scope.itemLookupList = ItemLookupService.getAllItems();

		ApiCallService.getOrderDetail($scope.retrievedOrderId).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.order = data.order;
					$scope.order.order_type = $scope.order.order_detail.order_type;

					$scope.goodIssue.order_id = $scope.order.order_detail.order_id;
					$scope.goodIssue.customer_id = $scope.order.customer_detail.customer_id;
					$scope.goodIssue.delivery_type = $scope.order.order_detail.delivery_type;
					$scope.goodIssue.delivery_address_id = 0;
					$scope.goodIssue.good_issue_remark = $scope.order.order_detail.good_issue_remark;

					//simpan value awal untuk perbandingan sebelum di save
					$scope.original_value = {};
					$scope.original_value.production_start_date = null;
					$scope.original_value.production_completed_date = null;
					$scope.original_value.good_issue_date = null;

					$scope.goodIssue.type = $scope.order.order_type;

					ApiCallService.getGoodIssueItems($scope.retrievedOrderId).success(function(data){
						if(data.call_status == "success"){
							$scope.goodIssue.items = data.good_issue_items;

							for(var i = 0; i < $scope.goodIssue.items.length; i += 1){
								$scope.goodIssue.items[i].quantity = parseInt($scope.goodIssue.items[i].quantity);
								$scope.goodIssue.items[i].location = $scope.getBatchName($scope.goodIssue.items[i].batch_id)+", "+$scope.getSiteName($scope.goodIssue.items[i].site_id)+"/"+$scope.getStorageName($scope.goodIssue.items[i].storage_id)+"/"+$scope.getBinName($scope.goodIssue.items[i].bin_id);
								$scope.goodIssue.items[i].attributes = JSON.parse($scope.goodIssue.items[i].attributes);
								$scope.goodIssue.items[i].aktual_quantity = 0;
								for(var j = 0; j < $scope.order.order_detail.order_items.length; j += 1 ){
									var itemGI = JSON.stringify($scope.goodIssue.items[i].attributes);
									var itemOrder = JSON.stringify($scope.order.order_detail.order_items[j].attributes);
									if($scope.goodIssue.items[i].item_code == $scope.order.order_detail.order_items[j].item_code
									&& itemGI == itemOrder){
										$scope.goodIssue.items[i].requested_quantity = $scope.order.order_detail.order_items[j].quantity;
										$scope.goodIssue.items[i].requested_unit = $scope.order.order_detail.order_items[j].item_unit;
									}
								}
								for(var k = 0; k < $scope.goodIssue.items[i].uom_list.length; k += 1){
									if($scope.goodIssue.items[i].uom_list[k].alternative_uom == $scope.goodIssue.items[i].item_unit ){
										//$scope.goodIssue.items[i].aktual_quantity += $scope.goodIssue.items[i].uom_list[k].base_amount *  parseInt($scope.goodIssue.items[i].quantity);
										console.log($scope.goodIssue.items[i]);
									}
								}
							}
						}
					});

					if ($scope.order.order_detail.date_created !== null) {
						$scope.order.order_detail.date_created = new Date(moment($scope.order.order_detail.date_created).format('YYYY-MM-DD'));
					}

					if ($scope.order.order_detail.production_start_date !== null) {
						$scope.order.order_detail.production_start_date = new Date(moment($scope.order.order_detail.production_start_date).format('YYYY-MM-DD'));
						//simpan value awal untuk perbandingan sebelum di save
						$scope.original_value.production_start_date = new Date(moment($scope.order.order_detail.production_start_date));
					}

					if ($scope.order.order_detail.production_completed_date !== null) {
							$scope.order.order_detail.production_completed_date = new Date(moment($scope.order.order_detail.production_completed_date).format('YYYY-MM-DD'));
							//simpan value awal untuk perbandingan sebelum di save
							$scope.original_value.production_completed_date = new Date(moment($scope.order.order_detail.production_completed_date).format('YYYY-MM-DD'));
					}

					if ($scope.order.order_detail.good_issue_date !== null) {
						$scope.order.order_detail.good_issue_date = new Date(moment($scope.order.order_detail.good_issue_date).format('YYYY-MM-DD'));
						$scope.goodIssue.good_issue_date = $scope.order.order_detail.good_issue_date;
						//simpan value awal untuk perbandingan sebelum di save
						$scope.original_value.good_issue_date = new Date(moment($scope.order.order_detail.good_issue_date).format('YYYY-MM-DD'));
					}

					//clear date values

					for (var i = 0; i < $scope.order.order_detail.order_items.length ; i += 1) {
						$scope.order.order_detail.order_items[i].attributes = JSON.parse($scope.order.order_detail.order_items[i].attributes);
					}
					for ( var i = 0 ; i < $scope.order.delivery_request_details.length ; i++ ) {
						$scope.order.delivery_request_details[i].requested_delivery_date = new Date(moment($scope.order.delivery_request_details[i].requested_delivery_date));
					}

					ApiCallService.getDraftApproverByDraftId($scope.order.order_detail.draft_id).
						success(function(data, status, headers, config) {
							if (data.call_status === "success") {
								draftApprover = data.draft_approver;
							}
						}).
						error(function(data, status, headers, config) {
							console.log(data);
							console.log(status);
							console.log(header);
							console.log(config);
						});
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
			})
		;

		pageLock = {
			'level': 'O',
			'order_id': $scope.retrievedOrderId
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
			})
		;

	};

	$scope.saveDelivery = function() {
		$scope.createDeliveryButtonLoading = true;
		$state.go('app.delivery.new_delivery', {order_id:$scope.retrievedOrderId});
		/*
		var delivery = {
				'order_id': $scope.retrievedOrderId,
				'deliveries': $scope.order.delivery_request_details
		}

		var validasi = true;
		//if ($scope.isDeliveryValid(delivery)) {
		if (validasi) {
			ApiCallService.submitOrderDelivery(delivery).success(function(data){
				if(data.call_status == "success"){
					$state.go('app.delivery.active_delivery');
				}else{
					if(data.error_code == "405"){
						$state.go('app.delivery.active_delivery');
					}else{
						SweetAlert.swal({
							title: "Perhatian!",
							text: data.error_message,
							type: "warning",
							//confirmButtonColor: "#DD6B55",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
				}
				$scope.createDeliveryButtonLoading = false;
			});
		}
		else {
			$scope.createDeliveryButtonLoading = false;

			SweetAlert.swal({
					title: "Perhatian!",
					text: "Tanggal dan Alamat pengiriman tidak boleh kosong, Jumlah Pengiriman Pengiriman minimal diisi 1, Transportasi tidak boleh kosong. Jumlah Permohonan tidak boleh lebih besar dari Jumlah Belum Dikirim.",
					type: "warning",
					//confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ok",
					closeOnConfirm: true,
					animation: "slide-from-top"
			});

			$scope.createDeliveryButtonLoading = false;

		}
			 */
	}

	$scope.payOrder = function (){
		var order = {
			order_id : $scope.order.order_detail.order_id,
			customer_id : $scope.order.customer_detail.customer_id,
			payment_type : $scope.order.payment_type,
			order_items : $scope.order.order_detail.order_items,
		};
		ApiCallService.payOrder(order).success(function(data){
			if(data.call_status == "success"){
				SweetAlert.swal({
					title: "Berhasil",
					text: "Pembayaran berhasil.",
					type: "success",
					closeOnConfirm: true,
					animation: "slide-from-top"
				});
				$scope.order.order_detail.payment_status = "P";
			}else{
				SweetAlert.swal({
					title: data.error_code,
					text: data.error_messages,
					type: data.call_status,
					//confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ok",
					closeOnConfirm: true,
					animation: "slide-from-top"
				});
			}
		});
	}

	$scope.init();
	console.log($scope);
});

app.controller('OrderUpdateHistoryModalCtrl', function ($scope, $modalInstance, passed_data, ApiCallService) {

	$scope.passed_data = passed_data;

	$scope.order_id = $scope.passed_data.order_id;
	$scope.order_reference = $scope.passed_data.order_reference;

	$scope.order_update_history = [];

	$scope.init = function() {
		ApiCallService.getOrderUpdateHistory($scope.order_id).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.order_update_history = data.order_update_history_list;
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

app.controller('ForceCloseOrderModalCtrl', function ($scope, $modalInstance, $state, passed_data, ApiCallService, SweetAlert) {
	$scope.order = {};

	$scope.order.order_id = passed_data.order_id;
	$scope.order.order_reference = passed_data.order_reference;

	$scope.doForceCloseOrder = function () {
		ApiCallService.forceCloseOrder($scope.order).
			success(function(data, status, headers, config) {
				SweetAlert.swal({
					title: "Tutup Paksa Order Berhasil",
					text: "Order telah ditutup paksa.",
					type: "success",
					closeOnConfirm: true,
					animation: "slide-from-top"
				});

				$state.go('app.order.active_order');
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});

		$modalInstance.dismiss('close');
	};

	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};


});


app.controller('OrderNotesModalCtrl', function ($scope, $modalInstance, $state, passed_data, ApiCallService, SweetAlert) {
	$scope.order = {};

	$scope.order.order_id = passed_data.order_id;
	$scope.order.order_reference = passed_data.order_reference;
	$scope.order.order_notes = passed_data.order_reference;

	var orderNotes = {
		'order_id':passed_data.order_id,
		'order_notes':$scope.order.order_notes,
	};
	$scope.saveOrderNotes = function () {
		ApiCallService.saveOrderNotes(orderNotes).
			success(function(data, status, headers, config) {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Order notes telah disimpan.",
					type: "success",
					closeOnConfirm: true,
					animation: "slide-from-top"
				});
				console.log(data);
				console.log(orderNotes);
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});

		$modalInstance.dismiss('close');
	};

	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};


});


app.controller('LocationModalCtrl', function ($scope, $modalInstance, ItemService, PurchaseService, passed_data, SweetAlert) {
	$scope.locations = passed_data.item;
	$scope.inventory = [];

	ItemService.getLocationListByItemCode($scope.locations.item_code).success(function(data){
		$scope.inventory = data.inventory;
	});

	$scope.getSiteName = function(site_id){
		for(var j = 0; j<$scope.siteList.length; j += 1){
			if($scope.siteList[j].site_id == site_id){
				return $scope.siteList[j].site_reference;
			}
		}
	}
	$scope.getStorageName = function(storage_id){
		for(var j = 0; j<$scope.storageList.length; j += 1){
			if($scope.storageList[j].storage_id == storage_id){
				return $scope.storageList[j].storage_name;
			}
		}
	}
	$scope.getBinName = function(bin_id){
		for(var j = 0; j<$scope.binList.length; j += 1){
			if($scope.binList[j].bin_id == bin_id){
				return $scope.binList[j].bin_name;
			}
		}
	}
	$scope.getBatchName = function(batch_id){
		for(var j = 0; j<$scope.batchList.length; j += 1){
			if($scope.batchList[j].batch_id == batch_id){
				return $scope.batchList[j].batch_reference;
			}
		}
	}

	$scope.saveLocation = function(data){

		var i = $scope.goodIssue.items.indexOf(passed_data.item);
		var sitename = $scope.getSiteName($scope.locations.site_id);
		var storagename = $scope.getStorageName($scope.locations.storage_id);
		var binname = $scope.getBinName($scope.locations.bin_id);
		var batchname = $scope.getBatchName($scope.locations.piece_id);
		$scope.goodIssue.items[i].location = batchname+","+sitename+"/"+storagename+"/"+binname;
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


app.controller('BeforeGIModalCtrl', function ($scope, $modalInstance, ItemService, PurchaseService, passed_data, SweetAlert, ApiCallService) {
	$scope.items = passed_data.item;
	$scope.goodIssue = passed_data.goodIssue;
	console.log($scope.items);
	$scope.confirmGoodsIssue = function (){
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
				$scope.order.order_detail.good_issue_status = data.good_issue_status;
				$modalInstance.dismiss();
			}
		});
	}

	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});

app.controller('PaymentReceiptModalCtrl', function ($scope, $modalInstance, passed_data, ItemService, PurchaseService, SweetAlert, OrderService) {
	$scope.order_id = passed_data.item;

	$scope.downloadSalesInvoice = function (){
		OrderService.getSalesInvoice($scope.order_id).success(function(){

		});
	}

	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});

