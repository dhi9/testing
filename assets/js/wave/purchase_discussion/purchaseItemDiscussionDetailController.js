app.controller('PurchaseItemDiscussionDetailController', function($filter, $scope, $http, $modal, $stateParams, WarehouseService, SupplierService, PurchaseService, VendorService, ItemService, SweetAlert, PurchaseFactory, ItemFactory, VendorFactory, AttributeFactory, SiteService) {
	var draftReference = $stateParams.reference;
	
	PurchaseService.getDraftByDraftReference(draftReference).success(function(data){
		if (data.call_status == "success") {
			var draft = JSON.parse(data.draft_purchase.draft_data);
			
			VendorFactory.getVendorById(draft.supplier_id).then(function(){
				$scope.supplier = VendorFactory.vendor;
			});
			
			$scope.itemRequestList = draft.item_request_list;
			
			for (var i = 0; i < draft.delivery_request_list.length; i++) {
				draft.delivery_request_list[i].date = new Date(draft.delivery_request_list[i].date);
			}
			$scope.deliveryRequestList = draft.delivery_request_list;
			
			$scope.supplier.vendor_id = draft.supplier_id;
			$scope.currency = draft.currency;
			$scope.hack.tax = draft.tax;
			$scope.edit.sendEmail = draft.send_email;
			$scope.data.supplier_email = draft.supplier_email;
			$scope.approve.name = draft.approver_name;
			$scope.approve.email = draft.approver_email;
			$scope.approve.user_id = draft.approver_id;
			$scope.notes = draft.notes;
			
			PurchaseFactory.itemRequestList = draft.item_request_list;
			PurchaseFactory.deliveryRequestList = draft.delivery_request_list;
		}
	});
	
	$scope.edit = {};
	$scope.edit.itemList = true;
	$scope.edit.sendEmail = false;
	$scope.notes = "";
	$scope.supplier = [];
	$scope.data = [];
	$scope.data.supplier_email = "";
	$scope.currency = 'idr';
	$scope.warehouse = {};
	$scope.warehouse.addresses = [];
	
	$scope.deliveryRequestList = PurchaseFactory.deliveryRequestList;
	$scope.itemRequestList = PurchaseFactory.itemRequestList;
	ItemFactory.itemRequestList = $scope.itemRequestList;
	
	$scope.supplierList = VendorFactory.activeVendorList;
	
	$scope.userList = PurchaseFactory.userList;
	$scope.approve = PurchaseFactory.approve;
	
	$scope.hack = {};
	$scope.hack.tax = 0;
	
	$scope.predicatBy = function (prop){
		return function(a,b){
			if( a[prop] > b[prop]){
				return 1;
			}else if( a[prop] < b[prop] ){
				return -1;
			}
			return 0;
		}
	}
	
	PurchaseFactory.getUsersList().then(function(){
		$scope.userList = PurchaseFactory.userList;
		$scope.userList.sort( $scope.predicatBy("po_max_eur") );
		$scope.approverIDR =  $scope.userList.sort($scope.predicatBy("po_max_idr"));//$filter('orderBy')($scope.userList, 'po_max_idr', false);
		$scope.approverUSD =  $scope.userList.sort($scope.predicatBy("po_max_usd"));//$filter('orderBy')($scope.userList, 'po_max_usd', false);
		$scope.approverEUR =  $scope.userList.sort($scope.predicatBy("po_max_eur"));//$filter('orderBy')($scope.userList, 'po_max_eur', false);
	});
	
	$scope.siteList = [];
	SiteService.getSiteList().success(function(data){
		if (data.call_status == "success") {
			$scope.siteList = data.site_list;
		}
	});
	
	$scope.attributeList = AttributeFactory.attributeActiveList;
	AttributeFactory.getAttributeActiveList().then(function(){
		$scope.attributeList = AttributeFactory.attributeActiveList;
	});
	
	$scope.getApprover = function(){
		var amount = $scope.sumTotal();
		var currency = $scope.currency;
		var type = "po";
		PurchaseService.getApprover(amount, currency, type).success(function(data){
			if (data.call_status == "success") {
				$scope.approve.name = data.user.username;
				$scope.approve.email = data.user.email;
				$scope.approve.user_id = data.user.user_id;
			}
		});
	}
	
	ItemFactory.getRawItemList().then(function(){
		$scope.itemList = ItemFactory.itemList;
	});
	
	VendorFactory.getActiveVendorList().then(function(){
		$scope.supplierList = VendorFactory.activeVendorList;
	});
	
	WarehouseService.getAddressList().success(function(data){
		if (data.call_status === "success") {
			$scope.warehouse.addresses = data.address_list;
		}
	});
	
	$scope.addDeliveryRequest = function(){
		PurchaseFactory.addDeliveryRequest();
	};
	
	$scope.addItemRequest = function(){
		PurchaseFactory.addItemRequest();
	};
	
	$scope.addItemRequest();
	
	$scope.checkDeliveryRequest = function(deliveryRequest){
		//PurchaseFactory.checkDeliveryRequest(deliveryRequest);
		
		var itemDeliveryRequest = deliveryRequest.item_delivery_request_list;
		var valid = true;
		
		for(var i = 0; i < itemDeliveryRequest.length; i++){
			if( itemDeliveryRequest[i].quantity > itemDeliveryRequest[i].remaining) {
				valid = false;
			}
		}
		
		if (valid) {
			deliveryRequest.editMode = false;
		}
		else {
			SweetAlert.swal({
				title: "Jumlah Permohonan Pengiriman Tidak Boleh Lebih Besar Dari Jumlah Belum Direncanakan",
				type: "error",
				animation: "slide-from-top"
			});
		}
	};
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	};
	
	$scope.getItemUom = function(index, itemCode){
		ItemFactory.getItemUomConversionListByItemCode(index, itemCode);
	};
	
	$scope.isAllowedToAddNewDeliveryRequest = function() {
		if( $scope.edit.itemList ){
			return false;
		}
		else {
			for (var i = 0 ; i < $scope.deliveryRequestList.length ; i++) {
				if ($scope.deliveryRequestList[i].editMode == true) {
					return false;
				}
			}
		}
		return true;
	};
	
	$scope.isDeliveryRequestValid = function(deliveryRequest){
		if (deliveryRequest.date == "" || deliveryRequest.site_id == "" || (!$scope.isItemDeliveryRequestValid(deliveryRequest) )) {
			return false;
		}
		else {
			return true;
		}
	};
	
	$scope.isItemDeliveryRequestValid = function(deliveryRequest){
		var itemDeliveryRequest = deliveryRequest.item_delivery_request_list;
		
		for(var i = 0; i < itemDeliveryRequest.length; i++){
			if(itemDeliveryRequest[i].quantity == null){
				return false;
			}else if(itemDeliveryRequest[i].quantity == 0){
				return true;
			}
		}
		return true;
	};
	
	$scope.checkItemRequests = function(){
		var valid = $scope.isItemRequestListValid();
		var isDuplicate = $scope.isDuplicateItems ();
		if(valid){
			if(!isDuplicate){
				$scope.edit.itemList = false;
			}else{
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
		}else{
			SweetAlert.swal({
				title: "Perhatian!",
				text: "Kode Barang, Jumlah, dan Unit tidak boleh kosong. Jumlah Pengiriman minimal diisi 1.",
				type: "warning",
				//confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
		}
	}
	
	$scope.isDuplicateItems = function() {
		for (var i = 0 ; i < $scope.itemRequestList.length - 1; i++) {
			for (var j = i+1 ; j < $scope.itemRequestList.length ; j++) {
				if ($scope.itemRequestList[i].item_unit == $scope.itemRequestList[j].item_unit &&
					$scope.itemRequestList[i].item_code == $scope.itemRequestList[j].item_code
				) {
					return true;
				}
			}
		}
		return false;
	}
	
	$scope.isItemRequestListValid = function(){
		for(var i = 0; i < $scope.itemRequestList.length; i++){
			if(! $scope.isItemRequestValid($scope.itemRequestList[i]) ){
				return false;
			}
		}
		return true;
	};
	
	$scope.isItemRequestValid = function(itemRequest){
		if (itemRequest.item_code == "" || itemRequest.quantity == "" || itemRequest.item_unit == '') {
			return false;
		}
		else {
			return true;
		}
	};
	
	$scope.lookupItemName = function(itemCode) {
		return ItemService.getItemName(itemCode);
	};
	
	$scope.setItemCodeRequest = function(index, itemCode) {
		ItemService.getItemWithUomByItemCode(itemCode).success(function(data){
			if (data.call_status === "success") {
				$scope.itemRequestList[index] = data.item_details;
				$scope.itemRequestList[index].quantity = '';
				$scope.itemRequestList[index].item_unit = data.item_details.item_unit;
			}
		});
	};
	
	$scope.setItemRequest = function(index, item) {
		ItemService.getItemWithUomByItemCode(item.item_code).success(function(data){
			if (data.call_status === "success") {
				$scope.itemRequestList[index] = data.item_details;
				$scope.itemRequestList[index].quantity = '';
				$scope.itemRequestList[index].item_unit = data.item_details.item_unit;
			}
		});
	};
	
	$scope.searchItem = function(index, supplierName) {
		var found = $filter('filter')($scope.supplierList, {vendor_name: supplierName}, true);
		
		if (found.length) {
			$scope.supplier = found[0];
		}
	};
	
	$scope.searchSupplier = function(supplierName) {
		var found = $filter('filter')($scope.supplierList, {vendor_name: supplierName}, true);
		
		if (found.length) {
			$scope.supplier = found[0];
			$scope.data.supplier_email = $scope.supplier.sales_email;
		}
	};
	
	$scope.searchWarehouseById = function(id) {
		if (id != null) {
			var found = $filter('filter')($scope.warehouse.addresses, {warehouse_id: id}, true);
			
			if (found.length) {
				$scope.deliveryRequestList[0].warehouse_address = found[0].address;
				return found[0];
			}
		}
	};
	
	$scope.removeDeliveryRequest = function(index) {
		$scope.deliveryRequestList.splice(index, 1);
	};
	
	$scope.removeItemRequest = function(itemRequest) {
		$scope.itemRequestList.splice($scope.itemRequestList.indexOf(itemRequest), 1);
	};
	
	$scope.submitPurchaseRequest = function(supplier){
		var valid = PurchaseFactory.isPurchaseValid(supplier);
		if(valid){
			for (var i = 0; i < $scope.itemRequestList.length; i++) {
				delete $scope.itemRequestList[i].uom_list;
				$scope.itemRequestList[i].attributes = JSON.stringify($scope.itemRequestList[i].attributes);
			}
			for (var j = 0; j < $scope.deliveryRequestList.length; j++) {
				for (var k = 0; k < $scope.deliveryRequestList[j].item_delivery_request_list.length; k++) {
					$scope.deliveryRequestList[j].item_delivery_request_list[k].attributes = JSON.stringify($scope.deliveryRequestList[j].item_delivery_request_list[k].attributes);
				}
			}
			var data = {
				supplier_id: $scope.supplier.vendor_id,
				currency: $scope.currency,
				send_email: $scope.edit.sendEmail,
				supplier_email: $scope.data.supplier_email,
				delivery_request_list: $scope.deliveryRequestList,
				item_request_list: $scope.itemRequestList,
				approver_name: $scope.approve.name,
				approver_email: $scope.approve.email,
				approver_id: $scope.approve.user_id,
				notes: $scope.notes,
				status: 'A',
				draft_reference: draftReference,
			};
			
			PurchaseService.updateDraftPurchase(data).success(function(data){
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Draft Purchase Request Berhasil Disimpan",
						//text: "Draft disimpan dengan reference " + data.draft_reference,
						type: "success",
						animation: "slide-from-top"
					});
				}
			});
		}else{
			SweetAlert.swal({
				title: "Perhatian",
				text: "Supplier atau Detail Sales tidak boleh kosong",
				type: "warning",
				animation: "slide-from-top"
			});
		}
	};
	
	$scope.submitDraftPurchase = function(supplier){
		var valid = PurchaseFactory.isPurchaseValid(supplier);
		if(valid){
			var data = {
				supplier_id: $scope.supplier.vendor_id,
				currency: $scope.currency,
				send_email: $scope.edit.sendEmail,
				supplier_email: $scope.data.supplier_email,
				delivery_request_list: $scope.deliveryRequestList,
				item_request_list: $scope.itemRequestList,
				approver_name: $scope.approve.name,
				approver_email: $scope.approve.email,
				approver_id: $scope.approve.user_id,
				notes: $scope.notes,
				status: 'D',
				draft_reference: draftReference,
			};
			
			PurchaseService.updateDraftPurchase(data).success(function(data){
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Purchase Request Berhasil Diupdate",
						//text: "Draft disimpan dengan reference " + data.draft_reference,
						type: "success",
						animation: "slide-from-top"
					});
				}
			});
		}else{
			SweetAlert.swal({
				title: "Perhatian",
				text: "Supplier atau Detail Sales tidak boleh kosong",
				type: "warning",
				animation: "slide-from-top"
			});
		}
	};
	
	$scope.sumTotal = function(){
		var sum = 0;
		for(var i = 0; i < $scope.itemRequestList.length; i++){
			var total = $scope.itemRequestList[i].quantity * $scope.itemRequestList[i].cost;
			sum += total;
		}
		return sum;
	};
	
	$scope.setNotes = function(notes){
		$scope.notes = notes;
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
	};
	
	$scope.displayOrderNotes = function() {
		var modalInstance = $modal.open({
			templateUrl: 'modal_order_notes',
			controller: 'OrderNotesModalCtrl',
			size: 'lg',
			scope: $scope,
		});
	}
});

app.controller('ItemDetailModalCtrl', function ($scope, $modalInstance, passed_data, ngTableParams, $filter) {
	$scope.filter = {};
	$scope.filter.$ = '';
	
	var index = passed_data.index;
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		},
		{
			total: $scope.itemList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.itemList, $scope.filter);
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
	
	$scope.setItemCode = function(item) {
		$scope.setItemRequest(index, item);
		$modalInstance.dismiss('close');
	};
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
});

app.controller('OrderNotesModalCtrl', function ($scope, $modalInstance, $state, SweetAlert) {
	$scope.saveOrderNotes = function () {
		$scope.setNotes($scope.notes);
		$modalInstance.dismiss('close');
	};
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
});