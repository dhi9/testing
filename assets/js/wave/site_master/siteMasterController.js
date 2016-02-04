app.controller('SiteMasterController', function($filter, $scope, $http, SiteService, ngTableParams) {
	$scope.siteList = [];
	
	$scope.search = {};
	$scope.search.$ = '';
	
	$scope.statusLabel = function(status){
		switch(status) {
			case 'X':
				return 'Non Aktif';
				break;
			default:
				return 'Aktif';
		}
	}
	
	SiteService.getSiteList().success(function(data){
		$scope.siteList = data.site_list;
		
		for(var i = 0; i < $scope.siteList.length; i++){
			$scope.siteList[i].statusLabel = $scope.statusLabel($scope.siteList[i].status);
		}
		
		$scope.tableParams.total($scope.siteList.length);
		$scope.tableParams.reload();
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
			total: $scope.siteList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.siteList, $scope.search);
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