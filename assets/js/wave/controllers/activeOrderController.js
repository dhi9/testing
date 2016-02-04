app.controller('ActiveOrderController', function($scope, $filter, ApiCallService, ngTableParams) {

	$scope.table_loading = false;

	$scope.orders = [];
	$scope.completedOrders = [];
	$scope.rejectedOrders = [];
	$scope.allOrders = [];
	
	$scope.activeOrdersFilter = {};
	$scope.activeOrdersFilter.$ = '';
	
	$scope.completedOrdersFilter = {};
	$scope.completedOrdersFilter.$ = '';

	$scope.rejectedOrdersFilter = {};
	$scope.rejectedOrdersFilter.$ = '';
	
	$scope.allOrdersFilter = {};
	$scope.allOrdersFilter.$ = '';
	
	$scope.searchCompletedOrders = {
		'start_date': '',
		'end_date': ''
	};
	
	$scope.searchRejectedOrders = {
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
	
	$scope.completedOrdersList = function(){
		$scope.table_loading = true;
		
		$scope.searchCompletedOrders = {
			'start_date': '',
			'end_date': ''
		};
		
		ApiCallService.getCompletedOrders($scope.searchCompletedOrders).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.completedOrders = data.orders;
					
					for (var i=0; i< $scope.completedOrders.length; i++) {
						$scope.completedOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.completedOrders[i].status, "ORDER");
						
						if ($scope.completedOrders[i].next_requested_delivery_date) {
							$scope.completedOrders[i].next_requested_delivery_date_ORDERBY = moment($scope.completedOrders[i].next_requested_delivery_date).format('YYYYMMDD');
							$scope.completedOrders[i].next_requested_delivery_date = moment($scope.completedOrders[i].next_requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.completedOrders[i].next_requested_delivery_date_ORDERBY = '99991231';
						}
						
						if ($scope.completedOrders[i].date_created) {
							$scope.completedOrders[i].date_created_ORDERBY = moment($scope.completedOrders[i].date_created).format('YYYYMMDD');
							$scope.completedOrders[i].date_created = moment($scope.completedOrders[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.completedOrders[i].date_created_ORDERBY = '99991231';
						}
						
						$scope.completedOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.completedOrders[i].status, "ORDER");
					}
					
					$scope.completedOrdersTableParams.total($scope.completedOrders.length);
					$scope.completedOrdersTableParams.reload();
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
	}
	
	$scope.applyCompletedOrdersFilter = function(){
		$scope.table_loading = true;
		
		$scope.searchCompletedOrders.start_date = new Date(moment($scope.searchCompletedOrders.start_date).format('YYYY-MM-DD'));
		$scope.searchCompletedOrders.end_date = new Date(moment($scope.searchCompletedOrders.end_date).format('YYYY-MM-DD'));
		
		ApiCallService.getCompletedOrders($scope.searchCompletedOrders).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.completedOrders = data.orders;
					
					for (var i=0; i< $scope.completedOrders.length; i++) {
						$scope.completedOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.completedOrders[i].status, "ORDER");
						
						if ($scope.completedOrders[i].next_requested_delivery_date) {
							$scope.completedOrders[i].next_requested_delivery_date_ORDERBY = moment($scope.completedOrders[i].next_requested_delivery_date).format('YYYYMMDD');
							$scope.completedOrders[i].next_requested_delivery_date = moment($scope.completedOrders[i].next_requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.completedOrders[i].next_requested_delivery_date_ORDERBY = '99991231';
						}
						
						if ($scope.completedOrders[i].date_created) {
							$scope.completedOrders[i].date_created_ORDERBY = moment($scope.completedOrders[i].date_created).format('YYYYMMDD');
							$scope.completedOrders[i].date_created = moment($scope.completedOrders[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.completedOrders[i].date_created_ORDERBY = '99991231';
						}
						
						$scope.completedOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.completedOrders[i].status, "ORDER");
					}
					
					$scope.completedOrdersTableParams.total($scope.completedOrders.length);
					$scope.completedOrdersTableParams.reload();
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
	}
	
	$scope.completedOrdersTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				date_created_ORDERBY: 'desc' // initial sorting
			}
		}, 
		{
			total: $scope.completedOrders.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.completedOrders, $scope.completedOrdersFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentCompletedPage = null;
	$scope.$watch("completedOrdersFilter.$", function () {
		$scope.completedOrdersTableParams.reload();
		
		if ($scope.completedOrdersFilter.$.length > 0) {
			if (currentCompletedPage === null) {
				currentCompletedPage = $scope.completedOrdersTableParams.$params.page;
			}
			$scope.completedOrdersTableParams.page(1);
		} else {
			if (currentCompletedPage === null) {
				$scope.completedOrdersTableParams.page(1);
			}
			else {
				$scope.completedOrdersTableParams.page(currentCompletedPage);
			}
			currentCompletedPage = null;
		}
	});
	
	$scope.rejectedOrdersList = function(){
		$scope.table_loading = true;
		
		$scope.searchRejectedOrders = {
			'start_date': '',
			'end_date': ''
		};
		
		ApiCallService.getRejectedOrders($scope.searchRejectedOrders).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.rejectedOrders = data.orders;
					
					for (var i=0; i< $scope.rejectedOrders.length; i++) {
						$scope.rejectedOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.rejectedOrders[i].status, "ORDER");
						
						if ($scope.rejectedOrders[i].next_requested_delivery_date) {
							$scope.rejectedOrders[i].next_requested_delivery_date_ORDERBY = moment($scope.rejectedOrders[i].next_requested_delivery_date).format('YYYYMMDD');
							$scope.rejectedOrders[i].next_requested_delivery_date = moment($scope.rejectedOrders[i].next_requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.rejectedOrders[i].next_requested_delivery_date_ORDERBY = '99991231';
						}
						
						if ($scope.rejectedOrders[i].date_created) {
							$scope.rejectedOrders[i].date_created_ORDERBY = moment($scope.rejectedOrders[i].date_created).format('YYYYMMDD');
							$scope.rejectedOrders[i].date_created = moment($scope.rejectedOrders[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.rejectedOrders[i].date_created_ORDERBY = '99991231';
						}
						
						$scope.rejectedOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.rejectedOrders[i].status, "ORDER");
					}
					
					$scope.rejectedOrdersTableParams.total($scope.rejectedOrders.length);
					$scope.rejectedOrdersTableParams.reload();
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
	}
	
	$scope.applyRejectedOrdersFilter = function(){
		$scope.table_loading = true;
		
		$scope.searchRejectedOrders.start_date = new Date(moment($scope.searchRejectedOrders.start_date).format('YYYY-MM-DD'));
		$scope.searchRejectedOrders.end_date = new Date(moment($scope.searchRejectedOrders.end_date).format('YYYY-MM-DD'));
		
		ApiCallService.getRejectedOrders($scope.searchRejectedOrders).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.rejectedOrders = data.orders;
					
					for (var i=0; i< $scope.rejectedOrders.length; i++) {
						$scope.rejectedOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.rejectedOrders[i].status, "ORDER");
						
						if ($scope.rejectedOrders[i].next_requested_delivery_date) {
							$scope.rejectedOrders[i].next_requested_delivery_date_ORDERBY = moment($scope.rejectedOrders[i].next_requested_delivery_date).format('YYYYMMDD');
							$scope.rejectedOrders[i].next_requested_delivery_date = moment($scope.rejectedOrders[i].next_requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.rejectedOrders[i].next_requested_delivery_date_ORDERBY = '99991231';
						}
						
						if ($scope.rejectedOrders[i].date_created) {
							$scope.rejectedOrders[i].date_created_ORDERBY = moment($scope.rejectedOrders[i].date_created).format('YYYYMMDD');
							$scope.rejectedOrders[i].date_created = moment($scope.rejectedOrders[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.rejectedOrders[i].date_created_ORDERBY = '99991231';
						}
						
						$scope.rejectedOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.rejectedOrders[i].status, "ORDER");
					}
					
					$scope.rejectedOrdersTableParams.total($scope.rejectedOrders.length);
					$scope.rejectedOrdersTableParams.reload();
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
	}
	
	$scope.rejectedOrdersTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				date_created_ORDERBY: 'desc' // initial sorting
			}
		}, 
		{
			total: $scope.rejectedOrders.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.rejectedOrders, $scope.rejectedOrdersFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentRejectedPage = null;
	$scope.$watch("rejectedOrdersFilter.$", function () {
		$scope.rejectedOrdersTableParams.reload();
		
		if ($scope.rejectedOrdersFilter.$.length > 0) {
			if (currentRejectedPage === null) {
				currentRejectedPage = $scope.rejectedOrdersTableParams.$params.page;
			}
			$scope.rejectedOrdersTableParams.page(1);
		} else {
			if (currentRejectedPage === null) {
				$scope.rejectedOrdersTableParams.page(1);
			}
			else {
				$scope.rejectedOrdersTableParams.page(currentRejectedPage);
			}
			currentRejectedPage = null;
		}
	});
	
	$scope.allOrdersList = function(){
		$scope.table_loading = true;
		
		$scope.searchAllOrders = {
			'start_date': '',
			'end_date': ''
		};
		
		ApiCallService.getAllOrders($scope.searchAllOrders).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.allOrders = data.orders;
					
					for (var i=0; i< $scope.allOrders.length; i++) {
						$scope.allOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.allOrders[i].status, "ORDER");
						
						if ($scope.allOrders[i].next_requested_delivery_date) {
							$scope.allOrders[i].next_requested_delivery_date_ORDERBY = moment($scope.allOrders[i].next_requested_delivery_date).format('YYYYMMDD');
							$scope.allOrders[i].next_requested_delivery_date = moment($scope.allOrders[i].next_requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.allOrders[i].next_requested_delivery_date_ORDERBY = '99991231';
						}
						
						if ($scope.allOrders[i].date_created) {
							$scope.allOrders[i].date_created_ORDERBY = moment($scope.allOrders[i].date_created).format('YYYYMMDD');
							$scope.allOrders[i].date_created = moment($scope.allOrders[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.allOrders[i].date_created_ORDERBY = '99991231';
						}
						
						$scope.allOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.allOrders[i].status, "ORDER");
					}
					
					$scope.allOrdersTableParams.total($scope.allOrders.length);
					$scope.allOrdersTableParams.reload();
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
	}
	
	$scope.applyAllOrdersFilter = function(){
		$scope.table_loading = true;
		
		$scope.searchAllOrders.start_date = new Date(moment($scope.searchAllOrders.start_date).format('YYYY-MM-DD'));
		$scope.searchAllOrders.end_date = new Date(moment($scope.searchAllOrders.end_date).format('YYYY-MM-DD'));
		
		ApiCallService.getAllOrders($scope.searchAllOrders).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.allOrders = data.orders;
					
					for (var i=0; i< $scope.allOrders.length; i++) {
						$scope.allOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.allOrders[i].status, "ORDER");
						
						if ($scope.allOrders[i].next_requested_delivery_date) {
							$scope.allOrders[i].next_requested_delivery_date_ORDERBY = moment($scope.allOrders[i].next_requested_delivery_date).format('YYYYMMDD');
							$scope.allOrders[i].next_requested_delivery_date = moment($scope.allOrders[i].next_requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.allOrders[i].next_requested_delivery_date_ORDERBY = '99991231';
						}
						
						if ($scope.allOrders[i].date_created) {
							$scope.allOrders[i].date_created_ORDERBY = moment($scope.allOrders[i].date_created).format('YYYYMMDD');
							$scope.allOrders[i].date_created = moment($scope.allOrders[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.allOrders[i].date_created_ORDERBY = '99991231';
						}
						
						$scope.allOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.allOrders[i].status, "ORDER");
					}
					
					$scope.allOrdersTableParams.total($scope.allOrders.length);
					$scope.allOrdersTableParams.reload();
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
	}
	
	$scope.allOrdersTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				date_created_ORDERBY: 'desc' // initial sorting
			}
		}, 
		{
			total: $scope.allOrders.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.allOrders, $scope.allOrdersFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentAllPage = null;
	$scope.$watch("allOrdersFilter.$", function () {
		$scope.allOrdersTableParams.reload();
		
		if ($scope.allOrdersFilter.$.length > 0) {
			if (currentAllPage === null) {
				currentAllPage = $scope.allOrdersTableParams.$params.page;
			}
			$scope.allOrdersTableParams.page(1);
		} else {
			if (currentAllPage === null) {
				$scope.allOrdersTableParams.page(1);
			}
			else {
				$scope.allOrdersTableParams.page(currentAllPage);
			}
			currentAllPage = null;
		}
	});
	
	$scope.init = function() {
		$scope.table_loading = true;
		
		ApiCallService.getActiveOrders().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.activeOrders = data.orders;
					
					for (var i=0; i< $scope.activeOrders.length; i++) {
						$scope.activeOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.activeOrders[i].status, "ORDER");
						
						//@@ REF_A
						if ($scope.activeOrders[i].next_requested_delivery_date) {
							$scope.activeOrders[i].next_requested_delivery_date_ORDERBY = moment($scope.activeOrders[i].next_requested_delivery_date).format('YYYYMMDD');
							$scope.activeOrders[i].next_requested_delivery_date = moment($scope.activeOrders[i].next_requested_delivery_date).format('DD-MM-YYYY');
						}
						else {
							$scope.activeOrders[i].next_requested_delivery_date_ORDERBY = '99991231';
						}
						
						//@@ REF_B
						$scope.activeOrders[i].date_created_ORDERBY = moment($scope.activeOrders[i].date_created).format('YYYYMMDD');
						$scope.activeOrders[i].date_created = moment($scope.activeOrders[i].date_created).format('DD-MM-YYYY');
					}
					
					$scope.activeOrdersTableParams = new ngTableParams(
						{
							page: 1, // show first page
							count: 10, // count per page
							sorting: {
				       date_created_ORDERBY: 'desc' // initial sorting
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
				case 'Z':
					statusLabel= "Void";
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
				case 'Z':
					statusLabel= "Void";
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
				case 'Z':
					statusLabel= "Void";
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
				case 'Z':
					statusLabel= "label-inverse";
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
				case 'Z':
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
				case 'Z':
					statusLabel= "label-inverse";
					break;
			}
		}
		
		return statusLabel;
	}

});



