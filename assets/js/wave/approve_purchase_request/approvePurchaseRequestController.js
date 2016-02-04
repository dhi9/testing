app.controller('ApprovePurchaseRequestController', function($filter, $scope, $rootScope,$http, $modal, ngTableParams, PurchaseService) {
	
	$scope.purchaseRequestList = [];
	$scope.ownPurchaseRequestList = [];
	$scope.ownApprovedPurchaseRequestList = [];
	
	$scope.search = {};
	$scope.search.$ = '';
	
	$scope.purchaseDraftFilter = {};
	$scope.purchaseDraftFilter.$	= '';
	
	$scope.ownApprovedPurchaseDraftFilter = {};
	$scope.ownApprovedPurchaseDraftFilter.$	= '';
	
	PurchaseService.getRequestListByApproverId().success(function(data){
		$scope.ownPurchaseRequestList = data.request_list;
		
		for(var i = 0; i < $scope.ownPurchaseRequestList.length; i++){
			$scope.ownPurchaseRequestList[i].date_created = new Date($scope.ownPurchaseRequestList[i].date_created);
			$scope.ownPurchaseRequestList[i].statusLabel = $scope.statusLabel($scope.ownPurchaseRequestList[i].status);
			
			//draft detail dari sini
			$scope.ownPurchaseRequestList[i].data = JSON.parse($scope.ownPurchaseRequestList[i].draft_data);
		}
		
		$scope.ownPurchaseTableParams.total($scope.ownPurchaseRequestList.length);
		$scope.ownPurchaseTableParams.reload();
	});
	
	PurchaseService.getApprovedRequestListByApproverId().success(function(data){
		$scope.ownApprovedPurchaseRequestList = data.request_list;
		
		for(var i = 0; i < $scope.ownApprovedPurchaseRequestList.length; i++){
			$scope.ownApprovedPurchaseRequestList[i].date_created = new Date($scope.ownApprovedPurchaseRequestList[i].date_created);
			$scope.ownApprovedPurchaseRequestList[i].statusLabel = $scope.statusLabel($scope.ownApprovedPurchaseRequestList[i].status);
			
			//draft detail dari sini
			//$scope.ownApprovedPurchaseRequestList[i].data = JSON.parse($scope.ownApprovedPurchaseRequestList[i].draft_data);
		}
		
		$scope.ownApprovedPurchaseTableParams.total($scope.ownApprovedPurchaseRequestList.length);
		$scope.ownApprovedPurchaseTableParams.reload();
	});
	
	PurchaseService.getRequestList().success(function(data){
		$scope.purchaseRequestList = data.request_list;
		
		for(var i = 0; i < $scope.purchaseRequestList.length; i++){
			$scope.purchaseRequestList[i].date_created = new Date($scope.purchaseRequestList[i].date_created);
			$scope.purchaseRequestList[i].statusLabel = $scope.statusLabel($scope.purchaseRequestList[i].status);
			
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
	$scope.sortingRequest = function(draft_reference){
		var ref = draft_reference.charAt(0,1)
		return ref ;
	}
	
	$scope.ownPurchaseTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'statusLabel': 'desc'
			}
		}, 
		{
			total: $scope.ownPurchaseRequestList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.ownPurchaseRequestList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var ownPurchaseRequestCurrentPage = null;
	$scope.$watch("ownPurchaseDraftFilter.$", function () {
		$scope.ownPurchaseTableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (ownPurchaseRequestCurrentPage === null) {
				ownPurchaseRequestCurrentPage = $scope.ownPurchaseTableParams.$params.page;
			}
			$scope.ownPurchaseTableParams.page(1);
		} else {
			if (ownPurchaseRequestCurrentPage === null) {
				$scope.ownPurchaseTableParams.page(1);
			}
			else {
				$scope.ownPurchaseTableParams.page(purchaseRequestCurrentPage);
			}
			ownPurchaseRequestCurrentPage = null;
		}
	});
		
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
		$scope.ownPurchaseTableParams.reload();
		
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
	
	$scope.ownApprovedPurchaseTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			/*sorting:
			{
				'purchaseRequest_code': 'asc'
			}*/
		}, 
		{
			total: $scope.ownApprovedPurchaseRequestList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.ownApprovedPurchaseRequestList, $scope.ownApprovedPurchaseDraftFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var purchaseApprovedRequestCurrentPage = null;
	$scope.$watch("ownApprovedPurchaseDraftFilter.$", function () {
		$scope.ownApprovedPurchaseTableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (purchaseApprovedRequestCurrentPage === null) {
				purchaseApprovedRequestCurrentPage = $scope.ownApprovedPurchaseTableParams.$params.page;
			}
			$scope.ownApprovedPurchaseTableParams.page(1);
		} else {
			if (purchaseApprovedRequestCurrentPage === null) {
				$scope.ownApprovedPurchaseTableParams.page(1);
			}
			else {
				$scope.ownApprovedPurchaseTableParams.page(purchaseApprovedRequestCurrentPage);
			}
			purchaseApprovedRequestCurrentPage = null;
		}
	});

});