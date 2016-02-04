app.controller('PurchaseDeliveryRequestListController', function($filter, $scope, PurchaseService, WarehouseService, $stateParams) {
	var request_reference = $stateParams.requests_reference;
	PurchaseService.getActiveRequestsByDraftReference(request_reference).success(function(data){
		$scope.ActiveRequestDetail = data.requests;

		PurchaseService.getActiveDeliveryRequestsByRequestsId($scope.ActiveRequestDetail.requests_id).success(function(data){
			$scope.ActiveDeliveryRequestList = data.delivery_requests;
			
			for (var i = 0; i < $scope.ActiveDeliveryRequestList.length; i++) {
				$scope.ActiveDeliveryRequestList[i].requested_date = new Date($scope.ActiveDeliveryRequestList[i].requested_date);
			}
		})
	})
	
	$scope.warehouse = {};
	$scope.warehouse.addresses = [];
	
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

	$scope.statusLabel = function(status){
		switch(status) {
			case "C":
				return "Selesai";
				break;
			default:
				return "";
		}
	}
});