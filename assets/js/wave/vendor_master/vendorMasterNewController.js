app.controller('VendorMasterNewController', function($scope, $modal, $state, VendorService, SweetAlert, VendorFactory) {
	$scope.vendor = VendorFactory.newVendor;
	
	$scope.insertVendor = function () {
		VendorFactory.insertVendor().then(function(data){
			if(data.data.call_status == 'success'){
				$state.go('app.master.vendor');
			}
		})
	};
});