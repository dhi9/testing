app.controller('NewDeliveryController', function($scope, $state, $stateParams, $modal, ItemLookupService, VendorService, VehicleService,  ApiCallService, SweetAlert, CustomerFactory, DeliveryService) {
	$scope.state = $state.current;

	$scope.deliveryRequestId = $stateParams.delivery_request_id;

	$scope.itemLookupList = [];
	$scope.vehicleList = [];
	$scope.vendorList =[];
	$scope.vehicleType = [];
	$scope.order = {};
	$scope.deliveryAddressList = CustomerFactory.deliveryAddressList;
	$scope.customerIdToSearch = "";
	$scope.deliveryRequest = {};

	$scope.vehicleList.vehicle_type={};
	VehicleService.getVehicleList().success(function(data){
		$scope.vehicleList = data.vehicle_list;
	});
	VendorService.getVendorList().success(function(data) {
		if (data.call_status === "success") {
			$scope.vendorList = data.vendor_list;
		}
	});

	VehicleService.getVehicleTypeList().
		success(function(data) {
			if (data.call_status === "success") {
				$scope.vehicleType = data.vehicle_type_list;
			}
		});

	$scope.lookupItemUnit = function(itemCode) {
		return ItemLookupService.getItemUnit(itemCode);
	}

	$scope.lookupItemName = function(itemCode) {
		return ItemLookupService.getItemName(itemCode);
	}

	//@@ FOCUS
	$scope.addDelivery = function(deliveryRequest) {
		if ($scope.isNoDeliveryItemRemaining(deliveryRequest)) {
			SweetAlert.swal({
				title: "Tidak Dapat Menambah Pengiriman",
				text: "Semua item dalam rencana pengiriman ini telah masuk pengiriman.",
				type: "warning",
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
		}
		else {
			var deliveryItems = [];
			var deliveryRequestItems = deliveryRequest.delivery_request_items;

			for (var i = 0 ; i < deliveryRequestItems.length ; i++) {
				var total_in_deliveries = $scope.totalInDeliveries(deliveryRequest, deliveryRequestItems[i].item_code, deliveryRequestItems[i].material_type, deliveryRequestItems[i].remark);

				var newItem = {
					"item_code": deliveryRequestItems[i].item_code,
					"requested_quantity": deliveryRequestItems[i].quantity,
					"quantity_sent": null,
					"total_in_deliveries": total_in_deliveries,
					"remaining": deliveryRequestItems[i].quantity - total_in_deliveries,
					"material_type": deliveryRequestItems[i].material_type,
					"remark": deliveryRequestItems[i].remark
				};

				deliveryItems.push(newItem);
			}

			var newDelivery = {
				"order_id": $scope.order.order_detail.order_id,
				"delivery_request_id": deliveryRequest.delivery_request_id,
				"delivery_id": "",
				"delivery_reference": "",
				"loading_date": "",
				"delivery_address": deliveryRequest.requested_delivery_address,
				"is_new_address": 0,
				"delivery_items": deliveryItems,
				"HLPFIELD_is_edit_mode": true,
				"delivery_source": "",
				"delivery_provider": "",
				"driver_name": "",
				"truck_code": "",
				"status": "A",
				"notes": ""
			}

			$scope.order.delivery_request_details[$scope.order.delivery_request_details.indexOf(deliveryRequest)].deliveries.push(newDelivery);
		}
	};

	$scope.removeDelivery = function(delivery_request, delivery) {
		var index = $scope.order.delivery_request_details.indexOf(delivery_request);
		$scope.order.delivery_request_details[index].deliveries.splice($scope.order.delivery_request_details[index].deliveries.indexOf(delivery), 1);
	}

	$scope.isAllowedToAddNewDelivery = function(delivery_request) {
		var index = $scope.order.delivery_request_details.indexOf(delivery_request);
		if ($scope.order != null) {
			for (var i = 0 ; i < $scope.order.delivery_request_details[index].deliveries.length ; i++) {
				if ($scope.order.delivery_request_details[index].deliveries[i].HLPFIELD_is_edit_mode == true) {
					return false;
				}
			}
		}
		return true;
	}

	$scope.filterNullAndZero = function() {
		return function(item) {
			if (item.quantity_sent === null) return false;
			if (item.quantity_sent == 0) return false;
			return true;
		}
	}

	//REF newOrderController.js $scope.submitNewOrder = function()
	//REF newOrderController.js $scope.removeDeliveryRequest = function(deliveryRequest)
	$scope.updateSelectedAddress = function(delivery_address_id){
		if(delivery_address_id != 0){
			for(var i = 0; i < $scope.deliveryAddressList.length; i+=1){
				if($scope.deliveryAddressList[i].delivery_address_id == delivery_address_id){
					$scope.deliveryRequest.delivery_address = $scope.deliveryAddressList[i].delivery_address;
				}
			}
		}else{
			$scope.deliveryRequest.delivery_address = "";
		}
	}

	$scope.saveDelivery = function(delivery){

		var validasi = true;
		console.log('1', delivery);
		//if ($scope.isDeliveryValid(delivery)) {
		if (validasi) {
			ApiCallService.submitNewDelivery(delivery).success(function (data) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Success",
						text: "Pengiriman telah ditambah",
						type: "success",
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
			});
		}
	}

	$scope.saveDelivery2 = function(delivery) {
		$scope.createDeliveryButtonLoading = true;

		if ($scope.isDeliveryValid(delivery)) {

			delivery.loading_date = new Date(moment(delivery.loading_date).format('YYYY-MM-DD'));

			delivery.delivery_items.forEach(function(item) {
				if(item.quantity_sent === null || item.quantity_sent == 0) {
					delivery.delivery_items.splice(delivery.delivery_items.indexOf(item), 1);
				}
			});

			ApiCallService.submitNewDelivery(delivery).
				success(function(data, status, headers, config) {
					if (data.call_status === "success") {
						delivery.delivery_id = data.delivery_id;
						delivery.delivery_reference = data.delivery_reference;
						delivery.HLPFIELD_is_edit_mode = false;

						SweetAlert.swal({
							title: "Success",
							text: "Pengiriman telah ditambah",
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
								title: "Simpan Pengiriman Gagal",
								text: data.error_message,
								type: "error",
								confirmButtonText: "Ok",
								closeOnConfirm: true,
								animation: "slide-from-top"
							});
						}
						else {
							SweetAlert.swal({
								title: "Terjadi Kesalahan",
								text: data.error_message,
								type: "Error",
								confirmButtonText: "Ok",
								closeOnConfirm: true,
								animation: "slide-from-top"
							});
						}
					}

					$scope.createDeliveryButtonLoading = false;
				}).
				error(function(data, status, headers, config) {
					console.log(data);
					console.log(status);
					console.log(header);
					console.log(config);

					$scope.createDeliveryButtonLoading = false;
				});
		}
		else {
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
	}

	$scope.cancelDelivery = function(delivery) {
		var data = { delivery_id: delivery.delivery_id };
		ApiCallService.cancelDelivery(data).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Success",
						text: "Pengiriman telah dibatalkan.",
						type: "success",
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});

					delivery.status = 'X';
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
					else if(data.error_code == "831") {
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
							title: "Batalkan Pengiriman Gagal",
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
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}

	$scope.getDeliveryCancelledString = function(delivery) {
		if (delivery.status == "X") {
			return " - BATAL";
		}
		return "";
	}

	$scope.getDeliveryRequestCancelledString = function(delivery_request) {
		if (delivery_request.status == "X") {
			return " - BATAL";
		}
		return "";
	}

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

	$scope.displayPrintModal = function(delivery) {
		var pass_data = {
			deliveryId: delivery.delivery_id,
			deliveryReference: delivery.delivery_reference
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_print_delivery_reference',
			controller: 'PrintDeliveryReferenceModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			}
		});
	}

	$scope.isDeliveryValid = function(delivery) {
		var validity = true;

		if (delivery.loading_date == null || delivery.loading_date == "" || delivery.delivery_address == "" || delivery.source == "" || delivery.delivery_provider == "" || delivery.driver_name == "" || delivery.truck_code == "") {
			validity = false;
		}
		else {
			var quantityNotEmpty = 0;

			angular.forEach(delivery.delivery_items, function(deliveryItem) {
				if(deliveryItem.quantity_sent != null && deliveryItem.quantity_sent != "" && deliveryItem.quantity_sent != 0){
					if (deliveryItem.quantity_sent > deliveryItem.remaining) {
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

	$scope.totalInDeliveries = function(deliveryRequest, itemCode, materialType, remark) {
		var deliveries = deliveryRequest.deliveries;
		var total = 0;

		angular.forEach(deliveries, function(delivery) {
			if (delivery.status != 'X') {
				var deliveryItems = delivery.delivery_items;

				angular.forEach(deliveryItems, function(deliveryItem) {
					if (deliveryItem.item_code == itemCode
						&& deliveryItem.material_type == materialType
						&& deliveryItem.remark == remark
					) {
						if (deliveryItem.quantity_received != null) {
							quantity = parseInt(deliveryItem.quantity_received) || 0;
						}
						else {
							quantity = parseInt(deliveryItem.quantity_sent) || 0;
						}
						total = total + quantity;
					}
				});
			}
		});

		return total;
	}

	$scope.isNoDeliveryItemRemaining = function(deliveryRequest) {
		deliveryRequestItems = deliveryRequest.delivery_request_items;
		noItemRemaining = true;

		deliveryRequestItems.forEach(function(deliveryRequestItem) {
			total = $scope.totalInDeliveries(deliveryRequest, deliveryRequestItem.item_code, deliveryRequestItem.material_type, deliveryRequestItem.remark);
			itemRemaining = deliveryRequestItem.quantity - total;

			if (itemRemaining > 0) {
				noItemRemaining = false;
			}
		});

		return noItemRemaining;
	}

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

	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}

	$scope.init = function() {
		$scope.itemLookupList = ItemLookupService.getAllItems();

		/*ApiCallService.getOrderDetail($scope.retrievedOrderId).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {

					$scope.order = data.order;
					CustomerFactory.getCustomerById($scope.order.customer_detail.customer_id).then(function(){
					   $scope.deliveryAddressList = CustomerFactory.deliveryAddressList;
					});
					//simpan value awal untuk perbandingan sebelum di save
					$scope.original_value = {};
					$scope.original_value.production_start_date = null;
					$scope.original_value.production_completed_date = null;

					if ($scope.order.order_detail.date_created !== null) {
						$scope.order.order_detail.date_created = new Date(moment($scope.order.order_detail.date_created).format('YYYY-MM-DD'));
					}

					if ($scope.order.order_detail.production_start_date !== null) {
						$scope.order.order_detail.production_start_date = new Date(moment($scope.order.order_detail.production_start_date).format('YYYY-MM-DD'));
						//simpan value awal untuk perbandingan sebelum di save
						$scope.original_value.production_start_date = new Date(moment($scope.order.order_detail.production_start_date).format('YYYY-MM-DD'));
					}

					if ($scope.order.order_detail.production_completed_date !== null) {
						$scope.order.order_detail.production_completed_date = new Date(moment($scope.order.order_detail.production_completed_date).format('YYYY-MM-DD'));
						//simpan value awal untuk perbandingan sebelum di save
						$scope.original_value.production_completed_date = new Date(moment($scope.order.order_detail.production_start_date).format('YYYY-MM-DD'));
					}

					for ( var i = 0 ; i < $scope.order.delivery_request_details.length ; i++ ) {
						$scope.order.delivery_request_details[i].is_new_address = 0;
						$scope.order.delivery_request_details[i].requested_delivery_date = new Date(moment($scope.order.delivery_request_details[i].requested_delivery_date).format('YYYY-MM-DD'));

						if ($scope.order.delivery_request_details[i].deliveries == null) {
							$scope.order.delivery_request_details[i].deliveries = [];
						}

						for (var j = 0 ; j < $scope.order.delivery_request_details[i].deliveries.length ; j++ ) {
							if ($scope.order.delivery_request_details[i].deliveries[j].loading_date !== null) {
								$scope.order.delivery_request_details[i].deliveries[j].loading_date = new Date(moment($scope.order.delivery_request_details[i].deliveries[j].loading_date).format('YYYY-MM-DD'));
							}
						}
					}
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
			});*/

		DeliveryService.getDeliveryRequestById($scope.deliveryRequestId).success(function(data){
			if (data.call_status == 'success') {
				$scope.deliveryRequest = data.delivery_request;
				$scope.deliveryRequest.next_delivery_date = moment($scope.deliveryRequest.requested_delivery_date).format('DD-MM-YYYY');
				$scope.deliveryRequest.requested_delivery_date =  new Date(moment($scope.deliveryRequest.requested_delivery_date).format('DD-MM-YYYY'));
				$scope.deliveryRequest.order_date_modified = new Date($scope.deliveryRequest.order_date_modified);

				CustomerFactory.getCustomerById($scope.deliveryRequest.customer_id).then(function(){
					$scope.deliveryAddressList = CustomerFactory.deliveryAddressList;
				});
			}
		});
	};

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

app.controller('PrintDeliveryReferenceModalCtrl', function ($scope, $modalInstance, passed_data, ApiCallService) {

	deliveryId = passed_data.deliveryId;

	$scope.init = function() {
		ApiCallService.getDeliveryItemsByDeliveryId(deliveryId).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.deliveryItems = data.delivery_item_list;
					$scope.deliveryReference = passed_data.deliveryReference;
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