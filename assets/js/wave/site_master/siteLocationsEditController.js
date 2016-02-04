app.controller('SiteLocationsEditController', function($scope, $modal, $state, $stateParams, SiteService, SweetAlert) {
	var storageId = $stateParams.storage_id;
	
	$scope.storage = {};
	
	SiteService.getStorageById(storageId).success(function(data){
		if (data.call_status == 'success') {
			$scope.storage = data.storage;
			
			SiteService.getSiteById($scope.storage.site_id).success(function(data){
				if (data.call_status == 'success') {
					$scope.site = data.site;
				}
			});
		}
	});
	
	$scope.updateStorage = function () {
		SiteService.updateStorage($scope.storage).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Site berhasil diubah.",
					type: "success",
					animation: "slide-from-top"
				});
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
	SiteService.getStorageHistoryListByStorageId($scope.storage.storage_id).success(function(data){
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