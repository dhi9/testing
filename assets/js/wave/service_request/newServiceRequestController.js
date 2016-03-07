app.controller('NewServiceRequestController', function($filter, $scope, $http, $modal, WarehouseService, SupplierService, PurchaseService, VendorService, ItemService, SweetAlert, SiteService) {
  $scope.edit = {};
	$scope.edit.itemList = true;
	$scope.edit.sendEmail = false;
	
	$scope.warehouse = {};
	$scope.warehouse.addresses = [];
	
	$scope.deliveryRequest = [];
	$scope.deliveryRequestList = [];
	$scope.itemRequestList = [];
	
	$scope.data = [];
	$scope.data.supplier_email = "";
	
	$scope.userList = [];
	$scope.approve = {};
	
	$scope.deliveryRequest = {
		date: '',
		warehouse_id: '',
		remark: ''
	};
    $scope.currency = 'idr';

    $scope.siteList = [];
    SiteService.getSiteList().success(function(data){
        if (data.call_status == "success") {
            $scope.siteList = data.site_list;
        }
    });

	$scope.siteNonConsignmentList = [];
	SiteService.getSiteNonConsignmentList().success(function(data) {
		if (data.call_status == "success"){
			$scope.siteNonConsignmentList = data.site_list;
		}
	});

    PurchaseService.getUsersList().success(function(data){
		if (data.call_status === "success") {
			$scope.userList = data.users_list;
		}
	});

    $scope.getApprover = function(){
        var amount = $scope.sumTotal();
        var currency = $scope.currency;
        var type = "so";
        PurchaseService.getApprover(amount, currency, type).success(function(data){
            if (data.call_status == "success") {
                $scope.approve.name = data.user.username;
                $scope.approve.email = data.user.email;
                $scope.approve.user_id = data.user.user_id;
            }
        });
    }

	$scope.approver = function (data){
		for(var i = 0; i < $scope.userList.length; i +=1){
            if($scope.userList[i].so_approval == "1"){
                var orderBy = $filter('orderBy');
                if($scope.currency == "idr"){
                    $scope.userList = orderBy($scope.userList, 'so_max_idr', false);
                    if( +data <= +$scope.userList[i].so_max_idr) {
                        $scope.approve.name = $scope.userList[i].username;
                        $scope.approve.email = $scope.userList[i].email;
                        $scope.approve.user_id = $scope.userList[i].user_id;
                        return;
                    }
                }else if($scope.currency == "usd"){
                    $scope.userList = orderBy($scope.userList, 'so_max_usd', false);
                    if( +data <= +$scope.userList[i].so_max_usd) {
                        $scope.approve.name = $scope.userList[i].username;
                        $scope.approve.email = $scope.userList[i].email;
                        $scope.approve.user_id = $scope.userList[i].user_id;
                        return;
                    }
                }else {
                    $scope.userList = orderBy($scope.userList, 'so_max_eur', false)
                    if( +data <= +$scope.userList[i].so_max_eur) {
                        $scope.approve.name = $scope.userList[i].username;
                        $scope.approve.email = $scope.userList[i].email;
                        $scope.approve.user_id = $scope.userList[i].user_id;
                        return;
                    }
                }
            }
		}
	}
	
	ItemService.getRawItemList().success(function(data){
		if (data.call_status === "success") {
			$scope.itemList = data.item_list;
		}
	});
	
	VendorService.getActiveVendorList().success(function(data){
		if (data.call_status === "success") {
			$scope.supplierList = data.vendor_list;
		}
	});
	
	WarehouseService.getAddressList().success(function(data){
		if (data.call_status === "success") {
			$scope.warehouse.addresses = data.address_list;
		}
	});
	
	$scope.addItemRequest = function(){
		var newItemRequest = {
			item_code: '',
			quantity: ''
		};
		
		$scope.itemRequestList.push(newItemRequest);
	};
	$scope.addItemRequest();
	
	$scope.checkDeliveryRequest = function(deliveryRequest){
		for (var i = 0; i < $scope.deliveryRequest.length; i += 1) {
			if ($scope.isDeliveryRequestValid(deliveryRequest[i])) {
				return true;
			}else{
				return false;
			}
		}
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
	
	$scope.isItemDeliveryRequestValid = function(deliveryRequest){
		var itemDeliveryRequest = deliveryRequest.item_delivery_request_list;
		
		for(var i = 0; i < itemDeliveryRequest.length; i++){
			if(itemDeliveryRequest[i].quantity == null || itemDeliveryRequest[i].quantity == ''){
				return false;
			}
		}
		return true;
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
		if (itemRequest.item_name == "" || itemRequest.quantity == "" || itemRequest.quantity == null  || itemRequest.quantity == undefined) {
			return false;
		}
		else {
			return true;
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
	$scope.checkItemRequests = function (){
		var valid = $scope.isItemRequestListValid();
		if (valid) {
			$scope.edit.itemList = false
		}else{
			SweetAlert.swal({
                title: "Perhatian!",
                text: "Nama Jasa tidak boleh boleh kosong. Jumlah minimal diisi 1.",
                type: "warning",
                //confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                closeOnConfirm: true,
                animation: "slide-from-top"
            });
		}
	}
	$scope.lookupItemName = function(itemCode) {
		return ItemService.getItemName(itemCode);
	}
	
	$scope.setItemCodeRequest = function(index, itemCode) {
		ItemService.getItemByItemCode(itemCode).success(function(data){
			if (data.call_status === "success") {
				$scope.itemRequestList[index] = data.item_details;
				$scope.itemRequestList[index].quantity = '';
				$scope.itemRequestList[index].item_unit = '';
				$scope.itemRequestList[index].remark = '';
				
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
		$scope.itemRequestList[index].remark = '';
		
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
			$scope.data.supplier_email = $scope.supplier.sales_email;
		}
	}
	
	$scope.searchWarehouseById = function(id) {
		if (id != null) {
			var found = $filter('filter')($scope.warehouse.addresses, {warehouse_id: id}, true);
			
			if (found.length) {
				//$scope.deliveryRequestList[0].warehouse_address = found[0]['address'];
				return found[0];
			}
		}
	}
	
	$scope.removeDeliveryRequest = function() {
		$scope.deliveryRequest.editMode = false;
	}
	
	$scope.removeItemRequest = function(itemRequest) {
		$scope.itemRequestList.splice($scope.itemRequestList.indexOf(itemRequest), 1);
	};
	
	$scope.isSupplierValid =  function (){
		if ( $scope.supplier.vendor_id == undefined || $scope.supplier.vendor_id == "") {
			return false;
		}else{
			return true;
		}
	}
	
	$scope.submitServiceRequest = function(){
		if ($scope.isItemRequestListValid() && $scope.isDeliveryRequestValid($scope.deliveryRequest) && $scope.isSupplierValid() && $scope.edit.itemList == false && $scope.approve.user_id !== undefined && $scope.approve.user_id !== ""  ) {
			for (var i = 0; i < $scope.itemRequestList.length; i++) {
				delete $scope.itemRequestList[i].uom_list;
			}
			
			$scope.deliveryRequestList.push($scope.deliveryRequest);
			
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
			};
			
			PurchaseService.insertDraftService(data).success(function(data){
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Service Request Berhasil Disimpan",
						text: "Draft disimpan dengan reference " + data.draft_reference,
						type: "success",
						animation: "slide-from-top",
					});
				}
			})
			.error(function(data){
				console.log(data);
			});
		}
		else{
			SweetAlert.swal({
				title: "Perhatian",
				text: "Supplier atau Detail Service tidak boleh kosong",
				type: "warning",
				animation: "slide-from-top"
			});
		}
	}
	
	$scope.submitDraft = function(){
		if ($scope.isItemRequestListValid() && $scope.isDeliveryRequestValid($scope.deliveryRequest) && $scope.isSupplierValid() && $scope.edit.itemList == false && $scope.approve.user_id !== undefined && $scope.approve.user_id !== ""  ) {
			for (var i = 0; i < $scope.itemRequestList.length; i++) {
				delete $scope.itemRequestList[i].uom_list;
			}
			
			$scope.deliveryRequestList.push($scope.deliveryRequest);
			
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
			};
			
			PurchaseService.insertDraftService(data).success(function(data){
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Service Request Berhasil Disimpan ke Purchase Discussion",
						//text: "Draft disimpan dengan reference " + data.draft_reference,
						type: "success",
						animation: "slide-from-top",
					});
				}
			})
			.error(function(data){
				console.log(data);
			});
		}
		else{
			SweetAlert.swal({
				title: "Perhatian",
				text: "Supplier atau Detail Service tidak boleh kosong",
				type: "warning",
				animation: "slide-from-top"
			});
		}
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
	
	$scope.setNotes = function(notes){
		$scope.notes = notes;
	}
	
	$scope.displayOrderNotes = function() {
		var pass_data = {
			note: $scope.notes,
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_order_notes',
			controller: 'OrderNotesModalCtrl',
			size: 'lg',
			scope: $scope,
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			}
		});
	}
});

app.controller('OrderNotesModalCtrl', function ($scope, $modalInstance, $state) {
	$scope.saveOrderNotes = function () {
		$scope.setNotes($scope.notes);
		$modalInstance.dismiss('close');
	};
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
});