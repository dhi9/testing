app.controller('NewDeliveryListController', function($scope, $filter, ApiCallService, ngTableParams, DeliveryService) {
	$scope.table_loading = false;
	
	$scope.orders = [];
	
	$scope.tableFilter = {};
	$scope.tableFilter.$ = '';
	
	$scope.init = function() {
		$scope.table_loading = true;
		
		DeliveryService.getDeliveryRequestList().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.deliveryRequestList = data.delivery_request_list;
					
					for (var i=0; i< $scope.deliveryRequestList.length; i++) {
						if ($scope.deliveryRequestList[i].date_created_order) {
							$scope.deliveryRequestList[i].date_created_order_ORDERBY = moment($scope.deliveryRequestList[i].date_created_order).format('YYYYMMDD');
							$scope.deliveryRequestList[i].date_created_order = moment($scope.deliveryRequestList[i].date_created_order).format('DD-MM-YYYY');
						}
						else {
							$scope.deliveryRequestList[i].date_created_order_ORDERBY = '99991231';
						}
						
						if ($scope.deliveryRequestList[i].requested_delivery_date) {
							$scope.deliveryRequestList[i].requested_delivery_date_ORDERBY = moment($scope.deliveryRequestList[i].requested_delivery_date).format('YYYYMMDD');
							$scope.deliveryRequestList[i].requested_delivery_date = moment($scope.deliveryRequestList[i].requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.deliveryRequestList[i].requested_delivery_date_ORDERBY = '99991231';
						}
					}
					
					$scope.tableParams = new ngTableParams(
						{
							page: 1, // show first page
							count: 10, // count per page
							sorting: {
								'requested_date_ORDERBY': 'asc'
							}
						}, 
						{
							total: $scope.deliveryRequestList.length, // length of data
							getData: function ($defer, params) {
								var filteredData = $filter('filter') ($scope.deliveryRequestList, $scope.tableFilter);
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
	
	//Additional
	$scope.UTILgetStatusLabel = function(status, level) {
		
		var statusLabel;
		
		if (level == "ORDER") {
			switch(status) {
				case 'N':
					statusLabel= "Penyerahan";
					break;
				case 'P':
					statusLabel= "Produksi";
					break;
				case 'R':
					statusLabel= "Tersedia";
					break;
				case 'B':
					statusLabel= "Credit Block";
					break;
				case 'D':
					statusLabel= "Pengiriman";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
			}
		}
		else if (level == "DELIVERYREQUEST") {
			switch(status) {
				case 'A':
					statusLabel= "Aktif";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
				case 'X':
					statusLabel= "Batal";
					break;
			}
		}
		else if(level == "DELIVERY"){
			switch(status) {
				case 'A':
					statusLabel= "Dibuat";
					break;
				case 'L':
					statusLabel= "Pemuatan";
					break;
				case 'S':
					statusLabel= "Tiba";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
				case 'X':
					statusLabel= "Batal";
					break;
			}
		}
		
		return statusLabel;
	}
	
	$scope.UTILgetStatusClass = function(status, level) {
		
		var statusLabel;
		
		if (level == "ORDER") {
			switch(status) {
				case 'N':
					statusLabel= "label-default";
					break;
				case 'P':
					statusLabel= "label-warning";
					break;
				case 'R':
					statusLabel= "label-info";
					break;
				case 'B':
					statusLabel= "label-danger";
					break;
				case 'D':
					statusLabel= "label-inverse";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
			}
		}
		else if (level == "DELIVERYREQUEST") {
			switch(status) {
				case 'A':
					statusLabel= "label-default";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
				case 'X':
					statusLabel= "label-inverse";
					break;
			}
		}
		else if(level == "DELIVERY"){
			switch(status) {
				case 'A':
					statusLabel= "label-default";
					break;
				case 'L':
					statusLabel= "label-warning";
					break;
				case 'S':
					statusLabel= "label-info";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
				case 'X':
					statusLabel= "label-inverse";
					break;
			}
		}
		
		return statusLabel;
	}
});
