app.controller('SiteBinController', function($filter, $scope, $http, $stateParams, SiteService, ngTableParams) {
	var storageId = $stateParams.storage_id;
	
	$scope.binList = [];
	
	$scope.search = {};
	$scope.search.$ = '';
	
	$scope.statusLabel = function(status){
		switch(status) {
			case 'N':
				return 'Non Aktif';
				break;
			case 'A':
				return 'Aktif';
				break;
			default:
				return '';
		}
	}
	SiteService.getSiteBinListByStorageId(storageId).success(function(data){
		if (data.call_status == 'success') {
			$scope.binList = data.bin_list;
			
			$scope.tableParams.total($scope.binList.length);
			$scope.tableParams.reload();
		}
	});
	
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
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'site_code': 'asc'
			}
		}, 
		{
			total: $scope.binList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.binList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var siteCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (siteCurrentPage === null) {
				siteCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (siteCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(siteCurrentPage);
			}
			siteCurrentPage = null;
		}
	});

});