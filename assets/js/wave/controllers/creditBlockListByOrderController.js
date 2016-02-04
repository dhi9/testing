app.controller('CreditBlockListByOrderController', function($scope, $filter, ApiCallService, ngTableParams) {
  $scope.table_loading = false;
	
	$scope.orderList = [];
	
	$scope.tableFilter = {};
	$scope.tableFilter.$ = '';
	
	$scope.init = function() {
		$scope.table_loading = true;
			
		ApiCallService.getBlockedOrders().
			success(function(data, status, headers, config) {
			
				if (data.call_status === "success") {
					$scope.orderList = data.order_list;
					
					for (var i=0; i< $scope.orderList.length; i++) {
						if ($scope.orderList[i].requested_delivery_date) {
							$scope.orderList[i].requested_delivery_date_ORDERBY = moment($scope.orderList[i].requested_delivery_date).format('YYYYMMDD');
							$scope.orderList[i].requested_delivery_date = moment($scope.orderList[i].requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.orderList[i].requested_delivery_date_ORDERBY = '99991231';
						}
					}
					
					$scope.tableParams = new ngTableParams(
						{
							page: 1, // show first page
							count: 10 // count per page
						}, 
						{
							total: $scope.orderList.length, // length of data
							getData: function ($defer, params) {
								var filteredData = $filter('filter') ($scope.orderList, $scope.tableFilter);
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