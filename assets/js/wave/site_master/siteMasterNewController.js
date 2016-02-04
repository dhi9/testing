app.controller('SiteMasterNewController', function($scope, $modal, $state, SiteService, SweetAlert) {
	$scope.site = {};
	
	$scope.insertSite = function () {
		SiteService.insertSite($scope.site).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Site berhasil ditambah.",
					type: "success",
					animation: "slide-from-top"
				});
				
				$state.go('app.master.site');
			}
			else {
				SweetAlert.swal({
					title: "Tambah Site Gagal",
					text: data.error_message,
					type: "error",
					animation: "slide-from-top"
				});
			}
		});
	};
});