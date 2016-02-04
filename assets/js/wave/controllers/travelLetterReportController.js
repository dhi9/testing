app.controller('TravelLetterReportController', function($scope, $filter, ApiCallService, ngTableParams) {
	$scope.table_loading = false;
	
	$scope.report = [];
	
	$scope.tableFilter = {};
	$scope.tableFilter.$ = '';
	
	$scope.search = {
		'start_date': '',
		'end_date': ''
	};
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		}, 
		{
			total: $scope.report.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.report, $scope.tableFilter);
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
	
	$scope.applySearch = function(){
		$scope.table_loading = true;
		
		$scope.search.start_date = new Date(moment($scope.search.start_date).format('YYYY-MM-DD'));
		$scope.search.end_date = new Date(moment($scope.search.end_date).format('YYYY-MM-DD'));
		
		ApiCallService.getTravelLetterReport($scope.search).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.report = data.report;
					
					for (var i=0; i< $scope.report.length; i++) {
						var d2 = moment($scope.report[i].confirmation_date);
						var d1 = moment($scope.report[i].arrival_date);
						$scope.report[i].travel_letter_duration = moment.duration(d2.diff(d1)).asDays();
						
						if ($scope.report[i].loading_date) {
							$scope.report[i].loading_date_ORDERBY = moment($scope.report[i].loading_date).format('YYYYMMDD');
							$scope.report[i].loading_date = moment($scope.report[i].loading_date).format('DD-MM-YYYY');
						}
						else {
							$scope.report[i].loading_date_ORDERBY = '99991231';
						}
						
						if ($scope.report[i].actual_loading_date) {
							$scope.report[i].actual_loading_date_ORDERBY = moment($scope.report[i].actual_loading_date).format('YYYYMMDD');
							$scope.report[i].actual_loading_date = moment($scope.report[i].actual_loading_date).format('DD-MM-YYYY');
						}
						else {
							$scope.report[i].actual_loading_date_ORDERBY = '99991231';
						}
						
						if ($scope.report[i].arrival_date) {
							$scope.report[i].arrival_date_ORDERBY = moment($scope.report[i].arrival_date).format('YYYYMMDD');
							$scope.report[i].arrival_date = moment($scope.report[i].arrival_date).format('DD-MM-YYYY');
						}
						else {
							$scope.report[i].arrival_date_ORDERBY = '99991231';
						}
						
						if ($scope.report[i].confirmation_date) {
							$scope.report[i].confirmation_date_ORDERBY = moment($scope.report[i].confirmation_date).format('YYYYMMDD');
							$scope.report[i].confirmation_date = moment($scope.report[i].confirmation_date).format('DD-MM-YYYY');
						}
						else {
							$scope.report[i].confirmation_date_ORDERBY = '99991231';
						}
					}
					
					$scope.tableParams.total($scope.report.length);
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
	
	$scope.exportToCSV = function() {
		var now = new Date();
		var filename = "reportsuratjalan" + moment(now).format('YYYYMMDDhhmmss');
		$scope.csv.generate($scope, filename + ".csv");
	}
	
	$scope.init = function() {
		
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

});
