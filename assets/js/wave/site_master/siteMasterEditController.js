app.controller('SiteMasterEditController', function($scope, $modal, $state, $stateParams, SiteService, SweetAlert, CustomerFactory) {
	var reference = $stateParams.reference;
	
	$scope.site = {};
	$scope.customerList = [];
	SiteService.getSiteByReference(reference).success(function(data){
		if (data.call_status == 'success') {
			$scope.site = data.site;
			$scope.site.old_customer_id = data.site.customer_id;
			if($scope.site.consignment == 1){
				$scope.site.consignment = true;
			}else{
				$scope.site.consignment = false;
			}
			CustomerFactory.getCustomerConsignmentList().then(function(){
				for (var i = 0; i<CustomerFactory.customerConsignmentList.length;i+=1) {
					$scope.customerList.push(CustomerFactory.customerConsignmentList[i]);
				}
			});
			CustomerFactory.getCustomerById($scope.site.customer_id).then(function(){
					for (var i = 0; i<CustomerFactory.customerConsignment.length;i+=1) {
					$scope.customerList.push(CustomerFactory.customerConsignment[i]);
				}
				
			});
		}
	});
	
	$scope.updateSite = function () {
		SiteService.updateSite($scope.site).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Site berhasil diubah.",
					type: "success",
					animation: "slide-from-top"
				});
				
				$state.go('app.master.site');
			}
			else {
				SweetAlert.swal({
					title: "Site Gagal Diubah",
					text: data.error_message,
					type: "error",
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
	SiteService.getSiteHistoryListBySiteId($scope.site.site_id).success(function(data){
		if (data.call_status == 'success') {
			$scope.historyList = data.history_list;
			
			for(var i = 0; i < $scope.historyList.length; i++)
			{
				$scope.historyList[i].datetime = new Date($scope.historyList[i].datetime);
			}
		}
	});
	
	$scope.closeModal = function () {
		$modalInstance.close();
	};
});