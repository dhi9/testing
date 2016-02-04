app.controller('StockSettingController', function($filter, $scope, $http, ngTableParams, ItemService) {
	$scope.settingList = [];
	
	$scope.search = {};
	$scope.search.$ = '';
	
	ItemService.getManualStockSettingList().success(function(data){
		$scope.settingList = data.setting_list;
		$scope.tableParams.total($scope.settingList.length);
		$scope.tableParams.reload();
	});
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'item_code': 'asc'
			}
		}, 
		{
			total: $scope.settingList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.settingList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var itemCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (itemCurrentPage === null) {
				itemCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (itemCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(itemCurrentPage);
			}
			itemCurrentPage = null;
		}
	});

});