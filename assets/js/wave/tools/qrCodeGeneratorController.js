app.controller('qrCodeGeneratorController', function($filter, $scope, $timeout, $http, $stateParams, ngTableParams, ItemLookupService, ApiCallService, SweetAlert) {
	$scope.qrCode = {
		'qrvalue':'http://www.wvi.co.id',
		'size':300,
		'version':10,
		'level':'H',
	}

});