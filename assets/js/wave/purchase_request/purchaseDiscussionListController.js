app.controller('PurchaseDiscussionListController', function($filter, $scope, ngTableParams, PurchaseService) {
	$scope.purchaseRequestList = [];
	
	$scope.search = {};
	$scope.search.$ = '';
	
	PurchaseService.getPurchaseDiscussionList().success(function(data){
		$scope.purchaseRequestList = data.purchase_list;
		
		for(var i = 0; i < $scope.purchaseRequestList.length; i++){
			$scope.purchaseRequestList[i].date_created = new Date($scope.purchaseRequestList[i].date_created);
			$scope.purchaseRequestList[i].statusLabel = $scope.statusLabel($scope.purchaseRequestList[i].status);
			
			if ($scope.purchaseRequestList[i].type == 'P') {
				$scope.purchaseRequestList[i].typeLabel = 'Purchase Request';
			}
			else{
				$scope.purchaseRequestList[i].typeLabel = 'Service Request';
			}
			
			//draft detail dari sini
			$scope.purchaseRequestList[i].data = JSON.parse($scope.purchaseRequestList[i].draft_data);
		}
		
		$scope.purchaseTableParams.total($scope.purchaseRequestList.length);
		$scope.purchaseTableParams.reload();
	});
	
	$scope.statusLabel = function(status){
		switch(status) {
			case 'P':
				return 'Approved';
				break;
			case 'C':
				return 'Perlu Diganti';
				break;
			default:
				return 'Aktif';
		}
	}
	
	$scope.purchaseTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'date_created': 'desc'
			}
		}, 
		{
			total: $scope.purchaseRequestList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.purchaseRequestList, $scope.purchaseDraftFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var purchaseRequestCurrentPage = null;
	$scope.$watch("purchaseDraftFilter.$", function () {
		$scope.purchaseTableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (purchaseRequestCurrentPage === null) {
				purchaseRequestCurrentPage = $scope.purchaseTableParams.$params.page;
			}
			$scope.purchaseTableParams.page(1);
		} else {
			if (purchaseRequestCurrentPage === null) {
				$scope.purchaseTableParams.page(1);
			}
			else {
				$scope.purchaseTableParams.page(purchaseRequestCurrentPage);
			}
			purchaseRequestCurrentPage = null;
		}
	});
});