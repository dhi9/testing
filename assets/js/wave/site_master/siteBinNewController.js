app.controller('SiteBinNewController', function($scope, $modal, $state, $stateParams, SiteService, SweetAlert) {
	$scope.storageId = $stateParams.storage_id;
	
	$scope.bin = {};
	
	$scope.insertBin = function () {
		$scope.bin.storage_id = $scope.storageId;
		
		SiteService.insertBin($scope.bin).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Bin berhasil ditambah.",
					type: "success",
					animation: "slide-from-top"
				});
				
				$state.go('app.master.site_bin', {'storage_id':$scope.storageId});
			}
		});
	};
});