app.controller('SiteLocationsNewController', function($scope, $modal, $state, $stateParams, SiteService, SweetAlert) {
	var siteId = $stateParams.site_id;
	console.log(siteId);
	$scope.storage = {};
	SiteService.getSiteById(siteId).success(function(data){
		if (data.call_status == 'success') {
			$scope.site = data.site;
		}
	});
	$scope.insertStorage = function () {
		$scope.storage.site_id = siteId;
		
		SiteService.insertStorage($scope.storage).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Lokasi berhasil ditambah.",
					type: "success",
					animation: "slide-from-top"
				});
				
				$state.go('app.master.site_locations',{reference:$scope.site.site_reference});
			}
			else{
				SweetAlert.swal({
					title: "Tambah Lokasi Gagal",
					text: data.error_message,
					type: "error",
					animation: "slide-from-top"
				});
			}
		});
	};
});