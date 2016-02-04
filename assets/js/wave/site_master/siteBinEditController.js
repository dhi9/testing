app.controller('SiteBinEditController', function($scope, $modal, $state, $stateParams, SiteService, SweetAlert) {
	var binId = $stateParams.bin_id;
	
	$scope.bin = {};
	
	SiteService.getBinById(binId).success(function(data){
		if (data.call_status == 'success') {
			$scope.bin = data.bin;
		}
	});
	
	$scope.updateBin = function () {
		SiteService.updateBin($scope.bin).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Site berhasil diubah.",
					type: "success",
					animation: "slide-from-top"
				});
				$state.go('app.master.site_bin', {'storage_id':$scope.bin.storage_id});
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

app.controller('HistoryModalCtrl', function ($scope, $modalInstance, SiteService) {
	SiteService.getBinHistoryListByBinId($scope.bin.bin_id).success(function(data){
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