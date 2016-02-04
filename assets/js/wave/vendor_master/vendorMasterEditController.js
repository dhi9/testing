app.controller('VendorMasterEditController', function($scope, $modal, $state, $stateParams, VendorService, SweetAlert, VendorFactory) {
	var reference = $stateParams.reference;
	
	$scope.vendor = VendorFactory.vendor;
	
	VendorFactory.getVendorByReference(reference).then(function(){
		$scope.vendor = VendorFactory.vendor;
	});
	
	$scope.updateVendor = function () {
		VendorFactory.updateVendor().then(function(data){
			if (data.data.call_status == 'success') {
				$state.go('app.master.vendor');
			}
		});
	};
	
	$scope.historyModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'history_modal',
			controller: 'HistoryModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};
});

app.controller('HistoryModalCtrl', function ($scope, $modalInstance, VendorService) {
	VendorService.getVendorHistoryListByVendorId($scope.vendor.vendor_id).success(function(data){
		if (data.call_status == 'success') {
			$scope.historyList = data.history_list;
			
			for(var i = 0; i < $scope.historyList.length; i++)
			{
				$scope.historyList[i].datetime = new Date($scope.historyList[i].datetime);
			}
		}
	});
	
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});