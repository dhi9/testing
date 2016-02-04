app.controller('BankMasterListController', function($filter, $scope, $http, ngTableParams, BankFactory) {
	$scope.bankList = BankFactory.bankList;
	
	$scope.search = {};
	$scope.search.$ = '';
	
	BankFactory.getBankList().then(function(){
		$scope.bankList = BankFactory.bankList;
		$scope.tableParams.total($scope.bankList.length);
		$scope.tableParams.reload();
	});
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'bank_code': 'asc'
			}
		}, 
		{
			total: $scope.bankList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.bankList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var bankCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (bankCurrentPage === null) {
				bankCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (bankCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(bankCurrentPage);
			}
			bankCurrentPage = null;
		}
	});
});