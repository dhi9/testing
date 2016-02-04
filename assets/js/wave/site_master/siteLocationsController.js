app.controller('SiteLocationsController', function($filter, $scope, $http, $stateParams, SiteService, ngTableParams) {
	var reference = $stateParams.reference;
	
	$scope.siteList = [];
	$scope.locationList = [];
	
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
	
	SiteService.getSiteByReference(reference).success(function(data){
		if (data.call_status == 'success') {
			$scope.site = data.site;
			
			SiteService.getSiteLocationListBySiteId($scope.site.site_id).success(function(data){
				if (data.call_status == 'success') {
					$scope.locationList = data.location_list;
					
					for(var i = 0; i < $scope.locationList.length; i++){
						$scope.locationList[i].statusLabel = $scope.statusLabel($scope.locationList[i].status);
					}
					
					$scope.tableParams.total($scope.locationList.length);
					$scope.tableParams.reload();
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
			total: $scope.locationList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.locationList, $scope.search);
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