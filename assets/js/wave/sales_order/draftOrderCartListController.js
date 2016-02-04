app.controller('DraftOrderCartDetailController', function($scope, $filter, $modal, ItemLookupService, ApiCallService, CustomerService, CustomerFactory, ngTableParams, SweetAlert, $state, $stateParams, AuthService, AttributeFactory) {
	var draft_id = $stateParams.draft_id;
	
	$scope.table_loading = false;

	$scope.orders = [];
	$scope.completedOrders = [];
	$scope.allOrders = [];
	
	$scope.activeOrdersFilter = {};
	$scope.activeOrdersFilter.$ = '';
	
	$scope.completedOrdersFilter = {};
	$scope.completedOrdersFilter.$ = '';
	
	$scope.allOrdersFilter = {};
	$scope.allOrdersFilter.$ = '';
	
	$scope.searchCompletedOrders = {
		'start_date': '',
		'end_date': ''
	};
	
	$scope.searchAllOrders = {
		'start_date': '',
		'end_date': ''
	};
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	
	$scope.init = function() {
		$scope.table_loading = true;
		
		ApiCallService.getDraftOrderCartList().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.activeOrders = data.draft_list;
					for (var i = 0; i < $scope.activeOrders.length; i += 1) {
						$scope.activeOrders[i].order = angular.fromJson($scope.activeOrders[i].draft_data);
					};
					console.log($scope.activeOrders);
					$scope.activeOrdersTableParams = new ngTableParams(
						{
							page: 1, // show first page
							count: 10, // count per page
							sorting: {
				       date_created: 'desc' // initial sorting
					    }
						}, 
						{
							total: $scope.activeOrders.length, // length of data
							getData: function ($defer, params) {
								var filteredData = $filter('filter') ($scope.activeOrders, $scope.activeOrdersFilter);
								var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
								params.total(orderedData.length);
								$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
							}
						}
					);
					
					var currentActivePage = null;
					$scope.$watch("activeOrdersFilter.$", function () {
						$scope.activeOrdersTableParams.reload();
						
						if ($scope.activeOrdersFilter.$.length > 0) {
							if (currentActivePage === null) {
								currentActivePage = $scope.activeOrdersTableParams.$params.page;
							}
							$scope.activeOrdersTableParams.page(1);
						} else {
							if (currentActivePage === null) {
								$scope.activeOrdersTableParams.page(1);
							}
							else {
								$scope.activeOrdersTableParams.page(currentActivePage);
							}
							currentActivePage = null;
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
	
	$scope.isNullThen = function(inputNumber, replacementNumber) {    
		if (inputNumber === null || inputNumber === undefined) {
			return replacementNumber;
		}
		return inputNumber;
	}
	
	$scope.UTILgetStatusLabel = function(status, level) {
		
		var statusLabel;
		
		if (level == "ORDER") {
			switch(status) {
				case 'A':
					statusLabel= "Draft";
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
				case 'A':
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
