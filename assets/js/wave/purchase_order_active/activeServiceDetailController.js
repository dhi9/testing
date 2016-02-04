app.controller('ActiveServiceDetailController', function($filter, $scope, PurchaseService, VendorService, WarehouseService,  $stateParams, ItemLookupService, SiteService) {
	var requestsReference = $stateParams.requests_reference;
	
	$scope.userList = [];
	$scope.ActiveRequestDetail = [];
	$scope.ActiveRequestVendorDetail = [];
	$scope.ActiveItemRequestList = [];
	$scope.ActiveDeliveryRequestList = [];
	$scope.ActiveDeliveryRequestItemList = [];
	$scope.approve = [];
	$scope.warehouse = [];
	$scope.supplier = {
		vendor_name: 'PT Trilestari',
		address: 'Cikarang',
		city: 'Cikarang',
		sales_email: 'trilestari@email.com',
		sales_pic: 'Harti'
	};
	$scope.warehouse = {};
	$scope.warehouse.addresses = [];

    $scope.siteList = [];
    SiteService.getSiteList().success(function(data){
        if (data.call_status == "success") {
            $scope.siteList = data.site_list;
        }
    });

    WarehouseService.getAddressList().success(function(data){
		if (data.call_status === "success") {
			$scope.warehouse.addresses = data.address_list;
		}
	});
	$scope.searchWarehouseById = function(id) {
		if (id != null) {
			var found = $filter('filter')($scope.warehouse.addresses, {warehouse_id: id}, true);
			if (found.length) {
				//$scope.deliveryRequestList[0].warehouse_address = found[0]['address'];
				return found[0]
			}
		}
	}
	
	PurchaseService.getActiveRequestsByDraftReference(requestsReference).success(function(data){
			$scope.ActiveRequestDetail = data.requests;
			$scope.ActiveRequestDetail.date_created = moment($scope.ActiveRequestDetail.date_created).format('DD-MM-YYYY HH:mm');
			
			VendorService.getVendorById($scope.ActiveRequestDetail.vendor_id).success(function(data){
				$scope.ActiveRequestVendorDetail = data.vendor;
			})
			
			PurchaseService.getActiveItemServiceRequestsByRequestsId($scope.ActiveRequestDetail.requests_id).success(function(data){
				$scope.ActiveItemRequestList = data.item_requests;
			})
			
			PurchaseService.getActiveDeliveryRequestsByRequestsId($scope.ActiveRequestDetail.requests_id).success(function(data){
				$scope.ActiveDeliveryRequestList = data.delivery_requests;
				for(var i = 0; i < $scope.ActiveDeliveryRequestList.length; i++){
					$scope.ActiveDeliveryRequestList[i].requested_date = new Date(moment($scope.ActiveDeliveryRequestList[i].requested_date));
				}
			})
			
			
		})
	$scope.requestItemList = function(data){
		PurchaseService.getActiveDeliveryRequestsItemsByRequestsId(data).success(function(data){
			return data.delivery_requests_items;
		
		})
	}
	$scope.sumTotal = function(){
		var sum = 0;
		for(var i = 0; i < $scope.ActiveItemRequestList.length; i++){
			var total = $scope.ActiveItemRequestList[i].quantity * $scope.ActiveItemRequestList[i].cost;
			sum += total;
		};
		
		return sum;
	};
	
	PurchaseService.getUsersList().success(function(data){
		if (data.call_status === "success") {
			$scope.userList = data.users_list;
		}
	});
	
	$scope.Approver = function (data){
		for(var i = 0; i < $scope.userList.length; i +=1){
			if( +data <= +$scope.userList[i].max_limit) {
				$scope.approve.name = $scope.userList[i].username;
				$scope.approve.email = $scope.userList[i].email;
				$scope.approve.user_id = $scope.userList[i].user_id;
				return;
			}
		}
	}
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
	$scope.lookupItemUnit = function(itemCode) {
		return ItemLookupService.getItemUnit(itemCode);
	}
	
	$scope.lookupItemName = function(itemCode) {
		return ItemLookupService.getItemName(itemCode);
	}
	$scope.createPDF = function (){
		PurchaseService.createServicePDF(requestsReference);
	}
});