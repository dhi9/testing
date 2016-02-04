app.controller('OwnDraftOrderDetailController', function($scope, $modal, ItemLookupService, CustomerService, CustomerFactory, ApiCallService, SweetAlert, $state, AuthService, $stateParams) {

	$scope.draft_id = $stateParams.draft_id;

	$scope.itemLookupList = [];

	$scope.open = true;
	
	$scope.customerCombinedItemList = CustomerFactory.customerCombinedItemList;
	CustomerFactory.getCustomerCombinedItemList().then(function () {
		$scope.customerCombinedItemList = CustomerFactory.customerCombinedItemList;
		console.log($scope.customerCombinedItemList);
	});

	$scope.customerLookupList = [];
	
	/*$scope.order = {
		"customer_input_type": "E",
		"customer_id": null,
		"customer_details": {
			"customer_id": null,
			"customer_name": "",
			"pic_name": "",
			"address": "",
			"city": "",
			"postcode": "",
			"phone_number": "",
			"fax_number": "",
			"customer_email": ""
		},
		"order_details": {
			order_items: [{
				"item_code": "",
				"quantity": "",
				"remark": ""
			}],
			"HLPFIELD_items_is_edit_mode": true
		},
		"delivery_request_details": []
	};*/
	
	$scope.customerIdToSearch = "";
	
	$scope.HLPFIELD_items_is_edit_mode = true;
	
	$scope.is_order_saved = false;
	$scope.submitted_order_reference = "";
	
	$scope.OPTIONS_department_types = [
		{value: '', label:'--- Pilih Divisi ---'},
		{value: 'B', label:'Busa'},
		{value: 'S', label:'Superland'},
		{value: 'C', label:'Charis'},
		{value: 'T', label:'Theraspine'},
		{value: 'U', label:'Cushion'}
	];
	
	$scope.lookupItemUnit = function(itemCode) {
		return ItemLookupService.getItemUnit(itemCode);
	}
	
	$scope.lookupItemName = function(itemCode) {
		return ItemLookupService.getItemName(itemCode);
	}
	
	$scope.createNewCustomer = function() {
		$scope.order.customer_details = {
			"customer_name": "",
			"pic_name": "",
			"address": "",
			"city": "",
			"postcode": "",
			"phone_number": "",
			"fax_number": "",
			"customer_email": ""
		};
		
		$scope.order.customer_id = "";
		$scope.order.customer_input_type = "N";
	}
	
	$scope.updateCustomer = function() {
		$scope.order.customer_input_type = "U";
	}
	
	$scope.addItem = function() {
		var newItem = {
		"item_code": "",
		"quantity": null,
		"material_type": "",
		"remark": ""
		};
		
		$scope.order.order_details.order_items.push(newItem);
	}

	$scope.addItemChild = function(index){
		var childItem =
		{
			"item_code": "",
			"length_width_height": "",
			"material_type": "",
			"remark": "",
			"level": "C"
		};
		$scope.order.order_details.order_items[index].children.push(childItem);
	}

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
			var deliveryRequestsItems = [];
			var orderItems = $scope.order.order_details.order_items;
			
			for (var i = 0 ; i < orderItems.length ; i++) {
				var totalInDelivery = $scope.getTotalInDeliveryRequests(orderItems[i].item_code, orderItems[i].material_type, orderItems[i].remark);
				
				var newItem = {
					"item_code": orderItems[i].item_code,
					"item_name": orderItems[i].item_name || '',
					"length_width_height": orderItems[i].length_width_height || '',
					"main_quantity": orderItems[i].quantity,
					"quantity": null,
					"remains": orderItems[i].quantity - totalInDelivery,
					"material_type": orderItems[i].material_type,
					"remark": orderItems[i].remark,
					"level": orderItems[i].level,
				};
				
				deliveryRequestsItems.push(newItem);
			}
			
			var newDeliveryRequest = {
				"requested_delivery_date": "",
				"requested_delivery_address": "",
				"is_new_address": 1,
				"requested_delivery_items": deliveryRequestsItems,
				"HLPFIELD_is_edit_mode": true
			}
			
			$scope.order.delivery_request_details.push(newDeliveryRequest);
		}
	};
	
	$scope.confirmDeliveryRequest = function(deliveryRequest) {
		if ($scope.isDeliveryRequestValid(deliveryRequest)) {
			deliveryRequest.HLPFIELD_is_edit_mode = false;
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
		}
	}
	
	$scope.isDeliveryRequestValid = function(deliveryRequest) {
		var validity = true;
		
		if (deliveryRequest.requested_delivery_date == "" || deliveryRequest.requested_delivery_date == null || deliveryRequest.requested_delivery_address == "") {
			validity = false;
		}
		else {
			var quantityNotEmpty = 0;
			
			angular.forEach(deliveryRequest.requested_delivery_items, function(deliveryRequestItem) {
				if (deliveryRequestItem.quantity != null && deliveryRequestItem.quantity != "" && deliveryRequestItem.quantity != 0){
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
	
	$scope.removeDeliveryRequest = function(deliveryRequest) {
		$scope.order.delivery_request_details.splice($scope.order.delivery_request_details.indexOf(deliveryRequest), 1);
	};
	
	$scope.filterNullAndZero = function() {
		return function(item) {
			if (item.quantity === null) return false;
			if (item.quantity == 0) return false;
			return true;
		}
	}
	
	$scope.removeItem = function(item) {
		$scope.order.order_details.order_items.splice($scope.order.order_details.order_items.indexOf(item), 1);
	};

	$scope.removeChild = function(item, itemChild) {
		var indexParent = $scope.order.order_details.order_items.indexOf(item);
		$scope.order.order_details.order_items[indexParent].children.splice( $scope.order.order_details.order_items[indexParent].children.indexOf(item), 1);
	};

	$scope.activateItemsEditMode = function() {
		SweetAlert.swal({
			title: "Perhatian!",
			text: "Semua rencana pengiriman dalam order ini akan terhapus!", 
			type: "warning", 
			showCancelButton: true, 
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Ya, Teruskan!",
			closeOnConfirm: true,
			animation: "slide-from-top"
		}, 
		function(isConfirm) {
			if (isConfirm) {
				console.log("teruskan");
				$scope.HLPFIELD_items_is_edit_mode = true;
				//if edit mode activated then clear delivery request
				$scope.order.delivery_request_details = [];
			}
			else {
				console.log("batal");   
			}
		});
	}
	
	$scope.isAnyInEditMode = function() {
		
		if ($scope.HLPFIELD_items_is_edit_mode) {
			return true;
		}
		
		for ( var i = 0 ; i < $scope.order.delivery_request_details.length ; i++ ) {  
			if ($scope.order.delivery_request_details[i].HLPFIELD_is_edit_mode) {
				return true;
			}
		}
		
		return false;
	}
	
	$scope.isDuplicateItems = function() {
		for (var i = 0 ; i < $scope.order.order_details.order_items.length - 1 ; i++) {
			for (var j = i+1 ; j < $scope.order.order_details.order_items.length ; j++) {
				if ($scope.order.order_details.order_items[i].item_code == $scope.order.order_details.order_items[j].item_code
					&& $scope.order.order_details.order_items[i].material_type == $scope.order.order_details.order_items[j].material_type
					&& $scope.order.order_details.order_items[i].remark == $scope.order.order_details.order_items[j].remark
				) {
					return true;
				}
			}
		}
		
		return false;
	}

	$scope.confirmItemsEdit = function() {
		
		if ($scope.isDuplicateItems()) {
			SweetAlert.swal({
				title: "Perhatian!",
				text: "Ada barang duplikat.", 
				type: "warning", 
				//confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
		}
		else {
			if ($scope.isOrderItemsValid()) {
				$scope.HLPFIELD_items_is_edit_mode = false;
			}
			else {
				SweetAlert.swal({
					title: "Perhatian!",
					text: "Kode Barang tidak boleh kosong dan Jumlah Order tidak boleh kosong atau bernilai 0.", 
					type: "warning", 
					//confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ok",
					closeOnConfirm: true,
					animation: "slide-from-top"
				});
			}
		}
	}
	
	$scope.isCustomerValid = function() {
		var customer = $scope.order.customer_details;
		
		if(customer.customer_name != null && customer.customer_name != ""){
			validity = true;
		}
		else {
			validity = false;
		}
		
		return validity;
	}
	
	$scope.isOrderItemsValid = function() {
		var orderItems = $scope.order.order_details.order_items;
		
		angular.forEach(orderItems, function(orderItem) {
			if(orderItem.item_code != "" && orderItem.quantity != "" && orderItem.quantity != 0){
				validity = true;
			}
			else {
				validity = false;
			}
		});
		
		return validity;
	}
	
	$scope.updateDraftOrder = function() {
		$scope.draft.draft_data = JSON.stringify($scope.order);
		ApiCallService.updateDraftOrder($scope.draft).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal("Perubahan Draft Order Berhasil", "Draft order berhasil diubah.", "success");
					//$scope.submitted_order_reference = data.order_reference;
					//$scope.is_order_saved = true;
				}
				else {
					SweetAlert.swal({
						title: "Submit Order Gagal",
						text: data.error_message, 
						type: "error", 
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
		});
	};
	
	$scope.deleteDraftOrder = function() {
		$scope.draft.draft_data = JSON.stringify($scope.order);
		ApiCallService.deleteDraftOrder($scope.draft).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal("Penghapusan Draft Order Berhasil", "Draft order berhasil dihapus.", "success");
					$state.go('app.order.draft_order_list');
					//$scope.submitted_order_reference = data.order_reference;
					//$scope.is_order_saved = true;
				}
				else {
					SweetAlert.swal({
						title: "Submit Order Gagal",
						text: data.error_message, 
						type: "error", 
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
		});
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
					
					$scope.order.customer_details.customer_id = $scope.customerIdToSearch;
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
	
	$scope.getTotalInDeliveryRequests = function(itemCode, materialType, remark) {
	
		var deliveryRequests = $scope.order.delivery_request_details;
		var total = 0;
		
		angular.forEach(deliveryRequests, function(deliveryRequest) {
			var deliveryRequestItems = deliveryRequest.requested_delivery_items;
			
			angular.forEach(deliveryRequestItems, function(deliveryRequestItem) {
				if (deliveryRequestItem.item_code == itemCode
					&& deliveryRequestItem.material_type == materialType
					&& deliveryRequestItem.remark == remark
				) {
					quantity = parseInt(deliveryRequestItem.quantity) || 0;
					total = total + quantity;							
				}
			});
		});
		
		return total;
	}
	
	$scope.isNoDeliveryRequestItemRemaining = function() {
		orderItems = $scope.order.order_details.order_items;
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
	
	$scope.displayItemDetailModal = function(index) {
		var pass_data = {
			index: index
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_item_detail',
			controller: 'ItemDetailModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	}

	$scope.displayChildItemDetailModal = function(index, item) {

		var indexParent = $scope.order.order_details.order_items.indexOf(item);
		var pass_data = {
			index: index,
			parent_index:indexParent
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_child_item_detail',
			controller: 'ItemDetailModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	}

	$scope.displayCustomerListModal = function() {
		/*var pass_data = {
			index: index
		};*/
		
		console.log("open");
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_customer_list',
			controller: 'CustomerListModalCtrl',
			size: 'lg',
			/*resolve: {
				passed_data: function () {
					return pass_data;
				}
			},*/
			scope: $scope
		});
	}
	
	$scope.init = function() {
		
		AuthService.isLoggedOn();
		
		//clear all fields
		$scope.itemLookupList = [];
	
		$scope.customerLookupList = [];

		/*$scope.order = {
			"customer_input_type": "E",
			"customer_id": null,
			"customer_details": {
				"customer_id": null,
				"customer_name": "",
				"pic_name": "",
				"address": "",
				"city": "",
				"postcode": "",
				"phone_number": "",
				"fax_number": "",
				"customer_email": ""
			},
			"order_details": {
				order_items: [{
					"item_code": "",
					"quantity": "",
					"remark": ""
				}],
				"HLPFIELD_items_is_edit_mode": true
			},
			"delivery_request_details": []
		};*/

		$scope.customerIdToSearch = "";
		$scope.hasSpecialRequestAccess = false;

		$scope.HLPFIELD_items_is_edit_mode = true;

		$scope.is_order_saved = false;
		$scope.submitted_order_reference = "";
		
		//ItemLookupService.retrieveItemLookup();
		$scope.itemLookupList = ItemLookupService.getAllItems();
		
		/*ApiCallService.getCustomerLookup().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.customerLookupList = data.customer_indexes_list;
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
		*/
		
		ApiCallService.getDraftOrderByDraftId($scope.draft_id).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.draft = data.draft_order;
					
					var draftData = angular.toJson(data.draft_order.draft_data);
					for(var i = 0 ; i < draftData.delivery_request_details.length; i++){
						draftData.delivery_request_details[i].requested_delivery_date = new Date(moment(draftData.delivery_request_details[i].requested_delivery_date));
					}

					$scope.order = draftData;
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
		
		ApiCallService.checkUserHasAccessForSpecialRequest().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					if (data.has_access == 1) {
						$scope.hasSpecialRequestAccess = true;
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
			});
	};
	
	$scope.clearPage = function() {
		$scope.init();
	};
	
	$scope.init();
	console.log($scope);
});

app.controller('ItemDetailModalCtrl', function ($scope, $modalInstance, passed_data, ngTableParams, $filter) {

	$scope.filter = {};
	$scope.filter.$ = '';

	var index = passed_data.index;
	var parentIndex = passed_data.parent_index;

	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		},
		{
			total: $scope.itemLookupList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.itemLookupList, $scope.filter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);

	var currentPage = null;
	$scope.$watch("filter.$", function () {
		$scope.tableParams.reload();

		if ($scope.filter.$.length > 0) {
			if (currentPage === null) {
				currentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (currentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(currentPage);
			}
			currentPage = null;
		}
	});

	$scope.setItemCode = function(itemCode, itemName) {
		$scope.order.order_details.order_items[index].item_code = itemCode;
		$scope.order.order_details.order_items[index].item_name = itemName;
		$scope.order.order_details.order_items[index].level = 'S';
		$modalInstance.dismiss('close');
	}

	$scope.setItemCustom = function(custom) {
		$scope.order.order_details.order_items[index].item_code = custom.item_code;
		$scope.order.order_details.order_items[index].item_name = custom.item_name;
		$scope.order.order_details.order_items[index].level = 'E';
		$scope.order.order_details.order_items[index].children = custom.children;
		$modalInstance.dismiss('close');
	}

	$scope.setChildItemCode = function(itemCode, itemName) {
		$scope.order.order_details.order_items[parentIndex].children[index].item_code = itemCode;
		$scope.order.order_details.order_items[parentIndex].children[index].item_name = itemName;
		$scope.order.order_details.order_items[parentIndex].children[index].level = 'C';
		$modalInstance.dismiss('close');
	}

	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};

	/*
	 var data = [
	 {
	 "item_code": "NEW",
	 "length_width_height": "200x120x25",
	 "quantity": "1",
	 "material_type": "",
	 "remark": "",
	 "level": "E",
	 "item_name": "Spiderman",
	 "children": [
	 {
	 "item_code": "A120",
	 "length_width_height": "200x160x25",
	 "material_type": "",
	 "remark": "",
	 "level": "C"
	 },
	 {
	 "item_code": "A160",
	 "length_width_height": "200x160x25",
	 "material_type": "",
	 "remark": "",
	 "level": "C"
	 }
	 ]
	 },
	 {
	 "item_code": "VN001",
	 "length_width_height": "200x120x25",
	 "quantity": "1",
	 "material_type": "",
	 "remark": "",
	 "level": "E",
	 "item_name": "Venom",
	 "children": [
	 {
	 "item_code": "A120",
	 "length_width_height": "200x160x25",
	 "material_type": "",
	 "remark": "",
	 "level": "C"
	 },
	 {
	 "item_code": "A160",
	 "length_width_height": "200x160x25",
	 "material_type": "",
	 "remark": "",
	 "level": "C"
	 }
	 ]
	 },
	 {
	 "item_code": "V002",
	 "length_width_height": "200x120x25",
	 "quantity": "1",
	 "material_type": "",
	 "remark": "",
	 "level": "E",
	 "item_name": "Batman",
	 "children": [
	 {
	 "item_code": "A120",
	 "length_width_height": "200x160x25",
	 "material_type": "",
	 "remark": "",
	 "level": "C"
	 },
	 {
	 "item_code": "A160",
	 "length_width_height": "200x160x25",
	 "material_type": "",
	 "remark": "",
	 "level": "C"
	 }
	 ]
	 },
	 ];
	 */
	$scope.tableParamsCustom = new ngTableParams({
		page: 1,
		count: 10
	}, {
		total: $scope.customerCombinedItemList.length,
		getData: function ($defer, params) {
			var orderedData = params.sorting() ? $filter('orderBy')($scope.customerCombinedItemList, params.orderBy()) : data;
			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		}
	});

	$scope.editId = -1;

	$scope.setEditId = function (pid) {
		$scope.editId = pid;
	};

	$scope.newCustomItem = function (){

		$scope.order.order_details.order_items[index].item_code = '';
		$scope.order.order_details.order_items[index].level = 'N';
		$scope.order.order_details.order_items[index].children = [
			{
				"item_code": "",
				"length_width_height": "",
				"material_type": "",
				"remark": "",
				"level": "C"
			}
		];
		$modalInstance.dismiss('close');
		/*
		 var customItem =
		 {
		 "item_code": "",
		 "length_width_height": "",
		 "quantity": "",
		 "material_type": "",
		 "remark": "",
		 "level": "N",
		 "item_name": "",
		 "children": [
		 {
		 "item_code": "a",
		 "length_width_height": "",
		 "material_type": "",
		 "remark": "",
		 "level": "C"
		 }
		 ]
		 };

		 $scope.order.order_details.order_items.push(customItem);
		 $modalInstance.dismiss('close');
		 */
	};


});

app.controller('CustomerListModalCtrl', function ($scope, $modalInstance, ngTableParams, $filter, ApiCallService) {
	
	//var index = passed_data.index;
	$scope.customerList = [];
	
	ApiCallService.getAllCustomers().
		success(function(data, status, headers, config) {
		
			if (data.call_status === "success") {
				$scope.customerList = data.customer_details_list;
				
				$scope.customerListTableParams = new ngTableParams(
					{
						page: 1, // show first page
						count: 10 // count per page
					}, 
					{
						total: $scope.customerList.length, // length of data
						getData: function ($defer, params) {
							var orderedData = params.sorting() ? $filter('orderBy')($scope.customerList, params.orderBy()) : $scope.customerList;
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					}
				);
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
	
	$scope.setCustomerIdToSearch = function(customerId) {
		$scope.customerIdToSearch = customerId;
		console.log(customerId);
		console.log($scope.customerIdToSearch);
		$modalInstance.dismiss('close');
	}
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};

});