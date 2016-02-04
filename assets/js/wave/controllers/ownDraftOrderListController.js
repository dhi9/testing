app.controller('OwnDraftOrderListController', function($scope, $filter, ApiCallService, ngTableParams) {

	$scope.table_loading = false;

	$scope.ownActiveDraftList = [];
	$scope.ownChangedDraftList = [];
	
	$scope.ownActiveDraftFilter = {};
	$scope.ownActiveDraftFilter.$ = '';
	
	$scope.ownChangedDraftFilter = {};
	$scope.ownChangedDraftFilter.$ = '';
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	$scope.ownActiveDraftTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				date_created_ORDERBY: 'desc' // initial sorting
			}
		}, 
		{
			total: $scope.ownActiveDraftList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.ownActiveDraftList, $scope.ownActiveDraftFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentPage = null;
	$scope.$watch("ownActiveDraftFilter.$", function () {
		$scope.ownActiveDraftTableParams.reload();
		
		if ($scope.ownActiveDraftFilter.$.length > 0) {
			if (currentPage === null) {
				currentPage = $scope.ownActiveDraftTableParams.$params.page;
			}
			$scope.ownActiveDraftTableParams.page(1);
		} else {
			if (currentPage === null) {
				$scope.ownActiveDraftTableParams.page(1);
			}
			else {
				$scope.ownActiveDraftTableParams.page(currentPage);
			}
			currentPage = null;
		}
	});
	
	$scope.ownChangedDraftTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				date_created_ORDERBY: 'desc' // initial sorting
			}
		}, 
		{
			total: $scope.ownChangedDraftList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.ownChangedDraftList, $scope.ownChangedDraftFilter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentChangedPage = null;
	$scope.$watch("ownChangedDraftFilter.$", function () {
		$scope.ownChangedDraftTableParams.reload();
		
		if ($scope.ownChangedDraftFilter.$.length > 0) {
			if (currentChangedPage === null) {
				currentChangedPage = $scope.ownChangedDraftTableParams.$params.page;
			}
			$scope.ownChangedDraftTableParams.page(1);
		} else {
			if (currentChangedPage === null) {
				$scope.ownChangedDraftTableParams.page(1);
			}
			else {
				$scope.ownChangedDraftTableParams.page(currentChangedPage);
			}
			currentChangedPage = null;
		}
	});
	
	$scope.init = function() {
		$scope.table_loading = true;
		
		ApiCallService.getOwnActiveDraftOrderList().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.ownActiveDraftList = data.draft_list;
					
					for (var i=0; i< $scope.ownActiveDraftList.length; i++) {
						//$scope.activeOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.activeOrders[i].status, "ORDER");
						
						if ($scope.ownActiveDraftList[i].date_created) {
							$scope.ownActiveDraftList[i].date_created_ORDERBY = moment($scope.ownActiveDraftList[i].date_created).format('YYYYMMDD');
							$scope.ownActiveDraftList[i].date_created = moment($scope.ownActiveDraftList[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.ownActiveDraftList[i].date_created_ORDERBY = '99991231';
						}
						
						$scope.ownActiveDraftList[i].division_label = $scope.UTILgetDepartmentDraftLabel($scope.ownActiveDraftList[i].product_type);
					}
					
					$scope.ownActiveDraftTableParams.total($scope.ownActiveDraftList.length);
					$scope.ownActiveDraftTableParams.reload();
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
			
		ApiCallService.getOwnChangedDraftOrderList().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.ownChangedDraftList = data.draft_list;
					
					for (var i=0; i< $scope.ownChangedDraftList.length; i++) {
						//$scope.activeOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.activeOrders[i].status, "ORDER");
						
						if ($scope.ownChangedDraftList[i].date_created) {
							$scope.ownChangedDraftList[i].date_created_ORDERBY = moment($scope.ownChangedDraftList[i].date_created).format('YYYYMMDD');
							$scope.ownChangedDraftList[i].date_created = moment($scope.ownChangedDraftList[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.ownChangedDraftList[i].date_created_ORDERBY = '99991231';
						}
						
						$scope.ownChangedDraftList[i].division_label = $scope.UTILgetDepartmentDraftLabel($scope.ownChangedDraftList[i].product_type);
					}
					
					$scope.ownChangedDraftTableParams.total($scope.ownChangedDraftList.length);
					$scope.ownChangedDraftTableParams.reload();
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
	
	$scope.UTILgetStatusDraftLabel = function(status) {
		
		var statusLabel;
		
		switch(status) {
			case 'A':
				statusLabel= "Aktif";
				break;
			case 'U':
				statusLabel= "Ganti";
				break;
			case 'C':
				statusLabel= "Disetujui";
				break;
			case 'X':
				statusLabel= "Batal";
				break;
		}
		
		return statusLabel;
	}
	
	$scope.UTILgetDepartmentDraftLabel = function(status) {
		
		var statusLabel;
		
		switch(status) {
			case 'B':
				statusLabel= "Busa";
				break;
			case 'S':
				statusLabel= "Superland";
				break;
			case 'C':
				statusLabel= "Charis";
				break;
			case 'T':
				statusLabel= "Theraspine";
				break;
			case 'U':
				statusLabel= "Cushion";
				break;
		}
		
		return statusLabel;
	}
	
	/*$scope.UTILgetStatusClass = function(status, level) {
		
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
	}*/

});



