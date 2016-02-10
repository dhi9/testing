app.controller('VendorMasterNewController', function($scope, $modal, $state, VendorService, SweetAlert, VendorFactory) {
	$scope.vendor = VendorFactory.newVendor;

	$scope.insertVendor = function () {
		VendorFactory.insertVendor();
	};
});