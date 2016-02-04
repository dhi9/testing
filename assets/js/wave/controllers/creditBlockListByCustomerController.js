app.controller('CreditBlockListByCustomerController', function($scope, $filter, ApiCallService, ngTableParams) {
	$scope.table_loading = false;

	$scope.customerList = [];
	
	$scope.tableFilter = {};
	$scope.tableFilter.$ = '';
	
	$scope.init = function() {
		$scope.table_loading = true;
		
		ApiCallService.getBlockedCustomers().
			success(function(data, status, headers, config) {
				
				if (data.call_status === "success") {
					$scope.customerList = data.customer_details_list;
					
					$scope.tableParams = new ngTableParams(
						{
							page: 1, // show first page
							count: 10 // count per page
						}, 
						{
							total: $scope.customerList.length, // length of data
							getData: function ($defer, params) {
								var filteredData = $filter('filter') ($scope.customerList, $scope.tableFilter);
								var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
								params.total(orderedData.length);
								$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
							}
						}
					);
					
					var currentPage = null;
					$scope.$watch("tableFilter.$", function () {
						$scope.tableParams.reload();
						
						if ($scope.tableFilter.$.length > 0) {
							if (currentPage === null) {
								currentPage = $scope.tableParams.$params.page;
							}
							$scope.tableParams.page(1);
						} else {
							if (currentPage === null) {
								$scope.tableParams.page(1);
							}
							else {
								$scope.tableParams.page(currentPage);
							}
							currentPage = null;
						}
					});
				}
				else {
					console.log(data);
				}
			
				$scope.table_loading = false;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
				
				$scope.table_loading = false;
			});
	
	};
	
	$scope.init();

});