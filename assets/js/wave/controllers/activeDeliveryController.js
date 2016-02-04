app.controller('ActiveDeliveryController', function($scope, $filter, ApiCallService, ngTableParams) {
	$scope.table_loading = false;
	
	$scope.deliveries = [];
	$scope.notCompletedDeliveries = [];
	$scope.completedDeliveries = [];
	
	$scope.tableFilter = {};
	$scope.tableFilter.$ = '';
	
	$scope.completedDeliveriesFilter = {};
	$scope.completedDeliveriesFilter.$ = '';
	
	$scope.notCompletedDeliveriesFilter = {};
	$scope.notCompletedDeliveriesFilter.$ = '';
	
	$scope.search = {
		'start_date': '',
		'end_date': ''
	};
	
	$scope.notCompletedDeliveriesSearch = {
		'start_date': '',
		'end_date': ''
	};
	
	$scope.completedDeliveriesSearch = {
		'start_date': '',
		'end_date': ''
	};
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				'order_loading_date': 'asc'
			}
		}, 
		{
			total: $scope.deliveries.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.deliveries, $scope.tableFilter);
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
	
	$scope.notCompletedDeliveriesTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				'order_loading_date': 'asc'
			}
		}, 
		{
			total: $scope.notCompletedDeliveries.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.notCompletedDeliveries, $scope.notCompletedDeliveriesFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentNotCompletedPage = null;
	$scope.$watch("notCompletedDeliveriesFilter.$", function () {
		$scope.notCompletedDeliveriesTableParams.reload();
		
		if ($scope.notCompletedDeliveriesFilter.$.length > 0) {
			if (currentNotCompletedPage === null) {
				currentNotCompletedPage = $scope.notCompletedDeliveriesTableParams.$params.page;
			}
			$scope.notCompletedDeliveriesTableParams.page(1);
		} else {
			if (currentNotCompletedPage === null) {
				$scope.notCompletedDeliveriesTableParams.page(1);
			}
			else {
				$scope.notCompletedDeliveriesTableParams.page(currentNotCompletedPage);
			}
			currentNotCompletedPage = null;
		}
	});
	
	$scope.completedDeliveriesTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				'order_loading_date': 'asc'
			}
		}, 
		{
			total: $scope.completedDeliveries.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.completedDeliveries, $scope.completedDeliveriesFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentCompletedPage = null;
	$scope.$watch("completedDeliveriesFilter.$", function () {
		$scope.completedDeliveriesTableParams.reload();
		
		if ($scope.completedDeliveriesFilter.$.length > 0) {
			if (currentCompletedPage === null) {
				currentCompletedPage = $scope.completedDeliveriesTableParams.$params.page;
			}
			$scope.completedDeliveriesTableParams.page(1);
		} else {
			if (currentCompletedPage === null) {
				$scope.completedDeliveriesTableParams.page(1);
			}
			else {
				$scope.completedDeliveriesTableParams.page(currentCompletedPage);
			}
			currentCompletedPage = null;
		}
	});
	
	$scope.notCompletedDeliveriesList = function(){
		$scope.table_loading = true;
		
		$scope.searchNotCompletedDeliveries = {
			'start_date': '',
			'end_date': ''
		};
		ApiCallService.getNotCompletedDeliveries($scope.searchNotCompletedDeliveries).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.notCompletedDeliveries = data.delivery_list;
					
					for (var i=0; i< $scope.notCompletedDeliveries.length; i++) {
						$scope.notCompletedDeliveries[i].filter_status = $scope.UTILgetStatusLabel($scope.notCompletedDeliveries[i].status, "DELIVERY");
						$scope.notCompletedDeliveries[i].filter_date_loading_date = "muat tanggal " + moment($scope.notCompletedDeliveries[i].loading_date).format('D');
						$scope.notCompletedDeliveries[i].filter_month_loading_date = "muat bulan " + moment($scope.notCompletedDeliveries[i].loading_date).format('M');
						$scope.notCompletedDeliveries[i].filter_year_loading_date = "muat tahun " + moment($scope.notCompletedDeliveries[i].loading_date).format('YYYY');
						$scope.notCompletedDeliveries[i].order_loading_date = moment($scope.notCompletedDeliveries[i].loading_date).format('YYYYMMDD');
						$scope.notCompletedDeliveries[i].loading_date = moment($scope.notCompletedDeliveries[i].loading_date).format('DD-MM-YYYY');
						
						$scope.notCompletedDeliveries[i].filter_date_order_date_created = "order tanggal " + moment($scope.notCompletedDeliveries[i].order_date_created).format('D');
						$scope.notCompletedDeliveries[i].filter_month_order_date_created = "order bulan " + moment($scope.notCompletedDeliveries[i].order_date_created).format('M');
						$scope.notCompletedDeliveries[i].filter_year_order_date_created = "order tahun " + moment($scope.notCompletedDeliveries[i].order_date_created).format('YYYY');
					}
					
					$scope.notCompletedDeliveriesTableParams.reload();
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
	
	$scope.applyNotCompletedDeliveriesSearch = function(){
		$scope.table_loading = true;
		
		$scope.notCompletedDeliveriesSearch.start_date = new Date(moment($scope.notCompletedDeliveriesSearch.start_date).format('YYYY-MM-DD'));
		$scope.notCompletedDeliveriesSearch.end_date = new Date(moment($scope.notCompletedDeliveriesSearch.end_date).format('YYYY-MM-DD'));
		
		ApiCallService.getNotCompletedDeliveries($scope.search).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.notCompletedDeliveries = data.delivery_list;
					
					for (var i=0; i< $scope.deliveries.length; i++) {
						$scope.deliveries[i].filter_status = $scope.UTILgetStatusLabel($scope.deliveries[i].status, "DELIVERY");
						$scope.deliveries[i].filter_date_loading_date = "muat tanggal " + moment($scope.deliveries[i].loading_date).format('D');
						$scope.deliveries[i].filter_month_loading_date = "muat bulan " + moment($scope.deliveries[i].loading_date).format('M');
						$scope.deliveries[i].filter_year_loading_date = "muat tahun " + moment($scope.deliveries[i].loading_date).format('YYYY');
						$scope.deliveries[i].order_loading_date = moment($scope.deliveries[i].loading_date).format('YYYYMMDD');
						$scope.deliveries[i].loading_date = moment($scope.deliveries[i].loading_date).format('DD-MM-YYYY');
						
						$scope.deliveries[i].filter_date_order_date_created = "order tanggal " + moment($scope.deliveries[i].order_date_created).format('D');
						$scope.deliveries[i].filter_month_order_date_created = "order bulan " + moment($scope.deliveries[i].order_date_created).format('M');
						$scope.deliveries[i].filter_year_order_date_created = "order tahun " + moment($scope.deliveries[i].order_date_created).format('YYYY');
					}
					
					$scope.tableParams.reload();
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
	
	$scope.applyCompletedDeliveriesSearch = function(){
		$scope.table_loading = true;
		
		$scope.completedDeliveriesSearch.start_date = new Date(moment($scope.completedDeliveriesSearch.start_date).format('YYYY-MM-DD'));
		$scope.completedDeliveriesSearch.end_date = new Date(moment($scope.completedDeliveriesSearch.end_date).format('YYYY-MM-DD'));
		
		ApiCallService.getCompletedDeliveries($scope.completedDeliveriesSearch).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.completedDeliveries = data.delivery_list;
					
					for (var i=0; i< $scope.completedDeliveries.length; i++) {
						$scope.completedDeliveries[i].filter_status = $scope.UTILgetStatusLabel($scope.completedDeliveries[i].status, "DELIVERY");
						$scope.completedDeliveries[i].filter_date_loading_date = "muat tanggal " + moment($scope.completedDeliveries[i].loading_date).format('D');
						$scope.completedDeliveries[i].filter_month_loading_date = "muat bulan " + moment($scope.completedDeliveries[i].loading_date).format('M');
						$scope.completedDeliveries[i].filter_year_loading_date = "muat tahun " + moment($scope.completedDeliveries[i].loading_date).format('YYYY');
						$scope.completedDeliveries[i].order_loading_date = moment($scope.completedDeliveries[i].loading_date).format('YYYYMMDD');
						$scope.completedDeliveries[i].loading_date = moment($scope.completedDeliveries[i].loading_date).format('DD-MM-YYYY');
						
						$scope.completedDeliveries[i].filter_date_order_date_created = "order tanggal " + moment($scope.completedDeliveries[i].order_date_created).format('D');
						$scope.completedDeliveries[i].filter_month_order_date_created = "order bulan " + moment($scope.completedDeliveries[i].order_date_created).format('M');
						$scope.completedDeliveries[i].filter_year_order_date_created = "order tahun " + moment($scope.completedDeliveries[i].order_date_created).format('YYYY');
					}
					
					$scope.completedDeliveriesTableParams.reload();
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
	
	$scope.applySearch = function(){
		$scope.table_loading = true;
		
		$scope.search.start_date = new Date(moment($scope.search.start_date).format('YYYY-MM-DD'));
		$scope.search.end_date = new Date(moment($scope.search.end_date).format('YYYY-MM-DD'));
		
		ApiCallService.getActiveDeliveries($scope.search).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.deliveries = data.delivery_list;
					
					for (var i=0; i< $scope.deliveries.length; i++) {
						$scope.deliveries[i].filter_status = $scope.UTILgetStatusLabel($scope.deliveries[i].status, "DELIVERY");
						$scope.deliveries[i].filter_date_loading_date = "muat tanggal " + moment($scope.deliveries[i].loading_date).format('D');
						$scope.deliveries[i].filter_month_loading_date = "muat bulan " + moment($scope.deliveries[i].loading_date).format('M');
						$scope.deliveries[i].filter_year_loading_date = "muat tahun " + moment($scope.deliveries[i].loading_date).format('YYYY');
						$scope.deliveries[i].order_loading_date = moment($scope.deliveries[i].loading_date).format('YYYYMMDD');
						$scope.deliveries[i].loading_date = moment($scope.deliveries[i].loading_date).format('DD-MM-YYYY');
						
						$scope.deliveries[i].filter_date_order_date_created = "order tanggal " + moment($scope.deliveries[i].order_date_created).format('D');
						$scope.deliveries[i].filter_month_order_date_created = "order bulan " + moment($scope.deliveries[i].order_date_created).format('M');
						$scope.deliveries[i].filter_year_order_date_created = "order tahun " + moment($scope.deliveries[i].order_date_created).format('YYYY');
					}
					
					$scope.tableParams.reload();
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
	
	$scope.init = function() {
		$scope.notCompletedDeliveriesList();
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
