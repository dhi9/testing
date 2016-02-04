app.controller('ActivePurchaseDetailController', function($filter, $scope, PurchaseService, VendorService, WarehouseService,  $stateParams, ItemLookupService, AttributeFactory, SiteService) {
	var requestsReference = $stateParams.requests_reference;
	
	$scope.userList = [];
	$scope.ActiveRequestDetail = [];
	$scope.ActiveRequestVendorDetail = [];
	$scope.ActiveItemRequestList = [];
	$scope.ActiveDeliveryRequestList = [];
    $scope.ActiveDeliveryRequestItemList = [];
	$scope.approve = [];
	$scope.warehouse = {};
	$scope.warehouse.addresses = [];

    $scope.siteList = [];
    SiteService.getSiteList().success(function(data){
        if (data.call_status == "success") {
            $scope.siteList = data.site_list;
        }
    });

    $scope.attributeList = AttributeFactory.attributeList;
    AttributeFactory.getAttributeList().then(function(){
        $scope.attributeList = AttributeFactory.attributeList;
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
	};

	PurchaseService.getActiveRequestsByDraftReference(requestsReference).success(function(data){
		$scope.ActiveRequestDetail = data.requests;
		$scope.ActiveRequestDetail.date_created = moment($scope.ActiveRequestDetail.date_created).format('DD-MM-YYYY HH:mm');

		VendorService.getVendorById($scope.ActiveRequestDetail.vendor_id).success(function(data){
			$scope.ActiveRequestVendorDetail = data.vendor;
		});

		PurchaseService.getActiveItemRequestsByRequestsId($scope.ActiveRequestDetail.requests_id).success(function(data){
			$scope.ActiveItemRequestList = data.item_requests;
		});

		PurchaseService.getActiveDeliveryRequestsByRequestsId($scope.ActiveRequestDetail.requests_id).success(function(data){
			$scope.ActiveDeliveryRequestList = data.delivery_requests;
			for(var i = 0; i < $scope.ActiveDeliveryRequestList.length; i += 1){
				$scope.ActiveDeliveryRequestList[i].requested_date = new Date(moment($scope.ActiveDeliveryRequestList[i].requested_date));
				$scope.getItemDeliveryRequestsList(i, $scope.ActiveDeliveryRequestList[i].requests_delivery_request_id);
			}
		});
	});

	$scope.getItemDeliveryRequestsList = function(j, delivery_request_id) {
		PurchaseService.getActiveDeliveryRequestsItemsByRequestsId(delivery_request_id).success(function (data) {
			$scope.ActiveDeliveryRequestList[j].item_delivery_request_list = data.delivery_requests_items;
      $scope.ActiveDeliveryRequestItemList.splice(j, 0, data.delivery_requests_items[0]);
			for(var k = 0; k < $scope.ActiveItemRequestList.length; k += 1){
				var ActiveDeliveryRequestList = $scope.ActiveDeliveryRequestList[j].item_delivery_request_list;
				for(var l = 0; l < ActiveDeliveryRequestList.length; l += 1){
					if($scope.ActiveItemRequestList[k].item_code == ActiveDeliveryRequestList[l].item_code){
						$scope.ActiveDeliveryRequestList[j].item_delivery_request_list[l].total_order = parseInt($scope.ActiveItemRequestList[k].quantity);
                        $scope.ActiveDeliveryRequestList[j].item_delivery_request_list[l].attributes = JSON.parse($scope.ActiveDeliveryRequestList[j].item_delivery_request_list[l].attributes);
                    }
				}
                $scope.ActiveItemRequestList[k].attributes = JSON.parse($scope.ActiveItemRequestList[k].attributes);
                //console.log(JSON.parse($scope.ActiveItemRequestList[k].attributes));
			}
			for(var i = 0; i < $scope.ActiveDeliveryRequestList[j].item_delivery_request_list.length; i += 1){
				$scope.ActiveDeliveryRequestList[j].item_delivery_request_list[i].quantity = parseInt($scope.ActiveDeliveryRequestList[j].item_delivery_request_list[i].quantity);
			}
		})
	};

    $scope.getRemainItem = function(itemDeliveryRequest, $index){
        var total = 0;
        var total_order = itemDeliveryRequest.total_order;
        var index = $scope.ActiveDeliveryRequestItemList.indexOf(itemDeliveryRequest);
        for(var i = 0; i < index; i += 1){
            if($scope.ActiveDeliveryRequestItemList[i].item_code || '' == itemDeliveryRequest.item_code){
                var quantity = $scope.ActiveDeliveryRequestItemList[i].quantity;
                total += quantity;
            }
        }
        var result = total_order - total;
        return parseInt(result);
    }

	$scope.requestItemList = function(data){
		PurchaseService.getActiveDeliveryRequestsItemsByRequestsId(data).success(function(data){
			return data.delivery_requests_items;
		
		})
	};
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
	};
	
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
	};
	$scope.lookupItemUnit = function(itemCode) {
		return ItemLookupService.getItemUnit(itemCode);
	};
	
	$scope.lookupItemName = function(itemCode) {
		return ItemLookupService.getItemName(itemCode);
	};

	$scope.createPDF = function (){
		PurchaseService.createPDF(requestsReference);
	}
});