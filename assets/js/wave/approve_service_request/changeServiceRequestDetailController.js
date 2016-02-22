app.controller('changeServiceRequestDetailController', function($filter, $scope, $http, $modal, $stateParams, $rootScope, PurchaseService, VendorService, ItemService, WarehouseService, SweetAlert, SiteService) {
	var draftReference = $stateParams.reference;
	//$scope.username = $rootScope.username;
    
    console.log($scope);
    
	$scope.edit = {};
	$scope.edit.itemList = true;
	$scope.edit.sendEmail = false;
		
	$scope.deliveryRequestList = [];
	$scope.itemRequestList = [];
	
	$scope.userList = [];
	$scope.approve = {};
	
	$scope.approver = false;
		
	$scope.supplierList = [];
	
	$scope.warehouse = {};
	$scope.warehouse.addresses = [];

    $scope.siteList = [];
    SiteService.getSiteList().success(function(data){
        if (data.call_status == "success") {
            $scope.siteList = data.site_list;
        }
    });

    VendorService.getVendorList().success(function(data){
		if (data.call_status === "success") {
			$scope.supplierList = data.vendor_list;
		}
	});
	WarehouseService.getAddressList().success(function(data){
		if (data.call_status === "success") {
			$scope.warehouse.addresses = data.address_list;
		}
	});
	$scope.searchSupplier = function(supplierName) {
		var found = $filter('filter')($scope.supplierList, {vendor_name: supplierName}, true);
		
		if (found.length) {
			$scope.supplier = found[0];
		}
	}
	
	PurchaseService.getDraftByDraftReference(draftReference).success(function(data){
		if (data.call_status === "success") {
			$scope.draft = data.draft_purchase;
			$scope.draft.draft_check_by = data.login_as;
			
			$scope.purchase = JSON.parse(data.draft_purchase.draft_data);
			$scope.currency = $scope.purchase.currency;
			$scope.itemRequestList = $scope.purchase.item_request_list;
			$scope.deliveryRequestList = $scope.purchase.delivery_request_list;
			
			for(var i = 0; i < $scope.deliveryRequestList.length; i++){
				$scope.deliveryRequestList[i].date = new Date(moment($scope.purchase.delivery_request_list[i].date));
			}
						
			VendorService.getVendorById($scope.purchase.supplier_id).success(function(data){
				if (data.call_status === "success") {
					$scope.supplier = data.vendor;
				}
			});
			
			PurchaseService.isUserApprover($scope.draft.draft_id).success(function(data){
				if (data.call_status === 'success') {
					$scope.approver = data.approver;
				}
			});
			PurchaseService.getRequestsByDraftReference(draftReference).success(function(data){
			if (data.call_status === "success") {
					$scope.draft.approved = data.purchase;
				}
			});
			
			$scope.isCreatorPurchaseRequestValid();
		}
	});
	
	$scope.sumTotal = function(){
		var sum = 0;
		for(var i = 0; i < $scope.itemRequestList.length; i++){
			var total = $scope.itemRequestList[i].quantity * $scope.itemRequestList[i].cost;
			sum += total;
		};
		
		return sum;
	};

	PurchaseService.getUsersList().success(function(data){
		if (data.call_status === "success") {
			$scope.userList = data.users_list;
		}
	});
	
	$scope.draftApprover = function (data){
		for(var i = 0; i < $scope.userList.length; i +=1){
			if( +data <= +$scope.userList[i].max_limit) {
				$scope.approve.name = $scope.userList[i].username;
				$scope.approve.email = $scope.userList[i].email;
				$scope.approve.user_id = $scope.userList[i].user_id;
				return;
			}
		}
	}	
	

	ItemService.getRawItemList().success(function(data){
		if (data.call_status === "success") {
			$scope.itemList = data.item_list;
		}
	});
	
	VendorService.getVendorList().success(function(data){
		if (data.call_status === "success") {
			$scope.supplierList = data.vendor_list;
		}
	});
	
	WarehouseService.getAddressList().success(function(data){
		if (data.call_status === "success") {
			$scope.warehouse.addresses = data.address_list;
		}
	});
	
	$scope.addDeliveryRequest = function(){
		var itemDeliveryRequestList = [];
		var itemRequestList = $scope.itemRequestList;
		
		for(i = 0; i < itemRequestList.length; i++){
			var itemDeliveryRequest = {
				item_code: itemRequestList[i].item_code,
				requested_quantity: itemRequestList[i].quantity,
				item_name: itemRequestList[i].item_name,
				remaining: itemRequestList[i].quantity - $scope.totalItemInItemDeliveryRequest(itemRequestList[i].item_code),
				item_unit: itemRequestList[i].item_unit
			};
			
			itemDeliveryRequestList.push(itemDeliveryRequest);
		}
		
		var newDeliveryRequest = {
			date: '',
			warehouse_id: '',
			remark: '',
			item_delivery_request_list: itemDeliveryRequestList,
			editMode: true
		};
		
		$scope.deliveryRequestList.push(newDeliveryRequest);
	}
	
	$scope.addItemRequest = function(){
		var newItemRequest = {
			item_code: '',
			quantity: ''
		};
		
		$scope.itemRequestList.push(newItemRequest);
	};
	$scope.addItemRequest();
	
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
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	$scope.getItemUom = function(index, itemCode){
		ItemService.getItemUomConversionListByItemCode(itemCode).success(function(data){
			if (data.call_status === "success") {
				$scope.itemRequestList[index].uom_list = data.conversion_list;
			}
		});
	};
	
	$scope.isAllowedToAddNewDeliveryRequest = function() {
		if( $scope.edit.itemList ){
			return false;
		}
		/*else if (test) {
			//code
		}*/
		else {
			for (var i = 0 ; i < $scope.deliveryRequestList.length ; i++) {
				if ($scope.deliveryRequestList[i].editMode == true) {
					return false;
				}
			}
		}
		return true;
	}
	
	$scope.isDeliveryRequestValid = function(deliveryRequest){
		if (deliveryRequest.date == "" || deliveryRequest.site_id == "" ) {
			return false;
		}
		else {
			return true;
		}
	}
	
	$scope.isItemRequestListValid = function(){
		for(var i = 0; i < $scope.itemRequestList.length; i++){
			if(! $scope.isItemRequestValid($scope.itemRequestList[i]) ){
				return false;
			}
		}
		return true;
	}
	
	$scope.isItemRequestValid = function(itemRequest){
		if (itemRequest.item_code == "" || itemRequest.quantity == "" || itemRequest.item_unit == '') {
			return false;
		}
		else {
			return true;
		}
	}
	$scope.isCreatorPurchaseRequestValid = function(){
		if ($scope.draft.draft_creator == $scope.draft.draft_check_by) {
			$scope.edit.toggleCost = false;
			$scope.edit.itemList = true;
			$scope.edit.itemListEdit = true;
			$scope.edit.deliveryRequest = true;
			$scope.edit.submitPurchase = true;
		}
		else {
			$scope.edit.toggleCost = false;
			$scope.edit.itemList = false;
			$scope.edit.itemListEdit = false;
			$scope.edit.deliveryRequest = false;
			$scope.edit.submitPurchase = false;
		}
	}
	
	/*$scope.isNoRemainingItemDeliveryRequest = function(){
		//var total = 0;
		//var deliveryRequestList = $scope.deliveryRequestList;

		for(var i = 0; i < deliveryRequestList.length; i++){
			var itemDeliveryRequestList = deliveryRequestList[i].item_delivery_request_list;

			for(var j = 0; j < itemDeliveryRequestList.length; j++){
				if(itemDeliveryRequestList[j].requested_quantity){
					quantity = itemDeliveryRequestList[j].quantity || 0;
					total += quantity;					
				}
			}
		}

		return true;
	}*/
	
	$scope.lookupItemName = function(itemCode) {
		return ItemService.getItemName(itemCode);
	}
	
	$scope.setItemCodeRequest = function(index, itemCode) {
		ItemService.getItemByItemCode(itemCode).success(function(data){
			if (data.call_status === "success") {
				$scope.itemRequestList[index] = data.item_details;
				$scope.itemRequestList[index].quantity = '';
				$scope.itemRequestList[index].item_unit = '';
				
				ItemService.getItemUomConversionListByItemCode(itemCode).success(function(data){
					if (data.call_status === "success") {
						$scope.itemRequestList[index].uom_list = data.conversion_list;
					}
				});
			}
		});
	}
	
	$scope.setItemRequest = function(index, item) {
		$scope.itemRequestList[index] = item;
		$scope.itemRequestList[index].quantity = '';
		$scope.itemRequestList[index].item_unit = '';
		
		ItemService.getItemUomConversionListByItemCode(item.item_code).success(function(data){
			if (data.call_status === "success") {
				$scope.itemRequestList[index].uom_list = data.conversion_list;
			}
		});
	}
	
	$scope.searchItem = function(index, supplierName) {
		var found = $filter('filter')($scope.supplierList, {vendor_name: supplierName}, true);
		
		if (found.length) {
			$scope.supplier = found[0];
		}
	}
	
	$scope.searchSupplier = function(supplierName) {
		var found = $filter('filter')($scope.supplierList, {vendor_name: supplierName}, true);
		
		if (found.length) {
			$scope.supplier = found[0];
		}
	}
	
	$scope.searchWarehouseById = function(id) {
		if (id != null) {
			var found = $filter('filter')($scope.warehouse.addresses, {warehouse_id: id}, true);
			
			if (found.length) {
				$scope.deliveryRequestList[0].warehouse_address = found[0]['address'];
				return found[0];
			}
		}
	}
	
	$scope.removeDeliveryRequest = function(index) {
		$scope.deliveryRequestList.splice(index, 1);
	}
	
	$scope.removeItemRequest = function(itemRequest) {
		$scope.itemRequestList.splice($scope.itemRequestList.indexOf(itemRequest), 1);
	};

	$scope.submitPurchaseRequest = function(){
		for (var i = 0; i < $scope.itemRequestList.length; i++) {
			delete $scope.itemRequestList[i].uom_list;
		}
		
		var data = {
			draft_reference: draftReference,
			supplier_id: $scope.supplier.vendor_id,
			currency: $scope.currency,
			send_email: $scope.edit.sendEmail,
			supplier_email: $scope.purchase.supplier_email,
			delivery_request_list: $scope.deliveryRequestList,
			item_request_list: $scope.itemRequestList,
			approver_name: $scope.approve.name,
			approver_email: $scope.approve.email,
			approver_id: $scope.approve.user_id,
		};
		
		PurchaseService.updateDraftPurchase(data).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Purchase Request Berhasil Disimpan",
					type: "success", 
					animation: "slide-from-top"
				});
			}
		});
	}
	
	$scope.sumTotal = function(){
		var sum = 0;
		for(var i = 0; i < $scope.itemRequestList.length; i++){
			var total = $scope.itemRequestList[i].quantity * $scope.itemRequestList[i].cost;
			sum += total;
		};
		
		return sum;
	};
	
	$scope.totalItemInItemDeliveryRequest = function(itemCode){
		var total = 0;
		var deliveryRequestList = $scope.deliveryRequestList;

		for(var i = 0; i < deliveryRequestList.length; i++){
			var itemDeliveryRequestList = deliveryRequestList[i].item_delivery_request_list;

			for(var j = 0; j < itemDeliveryRequestList.length; j++){
				if(itemDeliveryRequestList[j].item_code == itemCode){
					quantity = itemDeliveryRequestList[j].quantity || 0;
					total += quantity;					
				}
			}
		}

		return total;
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
	}
	
	/*$scope.setItemCode = function(itemCode, itemName) {
		$scope.itemRequestList[index].item_code = itemCode;
		$scope.itemRequestList[index].item_name = itemName;
		$modalInstance.dismiss('close');
	}*/
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
});