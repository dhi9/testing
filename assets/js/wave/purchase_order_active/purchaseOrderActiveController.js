app.controller('PurchaseOrderActiveController', function($scope, $filter, ngTableParams, PurchaseService) {
	$scope.getUsersList = [];
	$scope.activePurchaseList = [];
	$scope.completedPurchaseList = [];
	
	$scope.searchActive = {};
	$scope.searchActive.$ = '';
	$scope.searchCompleted = {};
	$scope.searchCompleted.$ = '';
	
	$scope.statusLabel = function(status){
		switch(status) {
			case 'C':
				return 'Selesai';
				break;
			default:
				return 'Aktif';
		}
	}
	
	PurchaseService.getUsersList().success(function(data){
		$scope.getUsersList = data.users_list;
	});
	
	PurchaseService.getActiveRequestsList().success(function(data){
		$scope.activePurchaseList = data.request_list;
		
		for(var i = 0; i < $scope.activePurchaseList.length; i++){
			$scope.activePurchaseList[i].date_created = new Date($scope.activePurchaseList[i].date_created);
			$scope.activePurchaseList[i].statusLabel = $scope.statusLabel($scope.activePurchaseList[i].status);
			
			for(var j = 0; j < $scope.getUsersList.length; j++){
				if ($scope.getUsersList[j].user_id == $scope.activePurchaseList[i].requests_creator) {
					$scope.activePurchaseList[i].creator_name = $scope.getUsersList[j].username;
				}
			}
		}
		
		$scope.activePurchaseTableParams.total($scope.activePurchaseList.length);
		$scope.activePurchaseTableParams.reload();
	});
	
	PurchaseService.getCompletedPurchaseList().success(function(data){
		$scope.completedPurchaseList = data.request_list;
		
		for(var i = 0; i < $scope.completedPurchaseList.length; i++){
			$scope.completedPurchaseList[i].statusLabel = $scope.statusLabel($scope.completedPurchaseList[i].status);
			$scope.completedPurchaseList[i].date_created = new Date($scope.completedPurchaseList[i].date_created);
			$scope.completedPurchaseList[i].date_modified = new Date($scope.completedPurchaseList[i].date_modified);
			$scope.completedPurchaseList[i].date = moment($scope.completedPurchaseList[i].date_created).format('YYYYMMDD');
			
			for(var j = 0; j < $scope.getUsersList.length; j++){
				if ($scope.getUsersList[j].user_id == $scope.completedPurchaseList[i].requests_creator) {
					$scope.completedPurchaseList[i].creator_name = $scope.getUsersList[j].username;
				}
			}
		}
		
		$scope.completedPurchaseTableParams.total($scope.completedPurchaseList.length);
		$scope.completedPurchaseTableParams.reload();
	});
	
	$scope.activePurchaseTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'date_created': 'desc'
			}
		}, 
		{
			total: $scope.activePurchaseList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.activePurchaseList, $scope.searchActive);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var siteCurrentPage = null;
	$scope.$watch("searchActive.$", function () {
		$scope.activePurchaseTableParams.reload();
		
		if ($scope.searchActive.$.length > 0) {
			if (siteCurrentPage === null) {
				siteCurrentPage = $scope.activePurchaseTableParams.$params.page;
			}
			$scope.activePurchaseTableParams.page(1);
		} else {
			if (siteCurrentPage === null) {
				$scope.activePurchaseTableParams.page(1);
			}
			else {
				$scope.activePurchaseTableParams.page(siteCurrentPage);
			}
			siteCurrentPage = null;
		}
	});
	
	$scope.completedPurchaseTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'date': 'desc'
			}
		}, 
		{
			total: $scope.completedPurchaseList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.completedPurchaseList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var siteCompleteCurrentPage = null;
	$scope.$watch("searchCompleted.$", function () {
		$scope.completedPurchaseTableParams.reload();
		
		if ($scope.searchCompleted.$.length > 0) {
			if (siteCompleteCurrentPage === null) {
				siteCompleteCurrentPage = $scope.completedPurchaseTableParams.$params.page;
			}
			$scope.completedPurchaseTableParams.page(1);
		} else {
			if (siteCompleteCurrentPage === null) {
				$scope.completedPurchaseTableParams.page(1);
			}
			else {
				$scope.completedPurchaseTableParams.page(siteCompleteCurrentPage);
			}
			siteCompleteCurrentPage = null;
		}
	});
	
});