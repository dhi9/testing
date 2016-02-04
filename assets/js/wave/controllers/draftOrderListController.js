app.controller('DraftOrderListController', function($scope, $filter, ApiCallService, ngTableParams) {

	$scope.ownDraftList = [];
	$scope.departmentDraftList = [];
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	$scope.ownDraftTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				date_created_ORDERBY: 'desc' // initial sorting
			}
		}, 
		{
			total: $scope.ownDraftList.length, // length of data
			getData: function ($defer, params) {
				var orderedData = params.sorting() ? $filter('orderBy')($scope.ownDraftList, params.orderBy()) : $scope.ownDraftList;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	$scope.departmentDraftTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				date_created_ORDERBY: 'desc' // initial sorting
			}
		}, 
		{
			total: $scope.departmentDraftList.length, // length of data
			getData: function ($defer, params) {
				var orderedData = params.sorting() ? $filter('orderBy')($scope.departmentDraftList, params.orderBy()) : $scope.departmentDraftList;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	$scope.init = function() {
		
		ApiCallService.getOwnDraftOrderList().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.ownDraftList = data.draft_list;
					
					for (var i=0; i< $scope.ownDraftList.length; i++) {
						//$scope.activeOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.activeOrders[i].status, "ORDER");
						
						if ($scope.ownDraftList[i].date_created) {
							$scope.ownDraftList[i].date_created_ORDERBY = moment($scope.ownDraftList[i].date_created).format('YYYYMMDD');
							$scope.ownDraftList[i].date_created = moment($scope.ownDraftList[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.ownDraftList[i].date_created_ORDERBY = '99991231';
						}
					}
					
					$scope.ownDraftTableParams.total($scope.ownDraftList.length);
					$scope.ownDraftTableParams.reload();
				}
				else {
					console.log(data);
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
			
		ApiCallService.getDepartmentDraftOrderList().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.departmentDraftList = data.draft_list;
					
					for (var i=0; i< $scope.departmentDraftList.length; i++) {
						//$scope.activeOrders[i].filter_status = $scope.UTILgetStatusLabel($scope.activeOrders[i].status, "ORDER");
						
						if ($scope.departmentDraftList[i].date_created) {
							$scope.departmentDraftList[i].date_created_ORDERBY = moment($scope.departmentDraftList[i].date_created).format('YYYYMMDD');
							$scope.departmentDraftList[i].date_created = moment($scope.departmentDraftList[i].date_created).format('DD-MM-YYYY');
						}
						else {
							$scope.departmentDraftList[i].date_created_ORDERBY = '99991231';
						}
					}
					
					$scope.departmentDraftTableParams.total($scope.departmentDraftList.length);
					$scope.departmentDraftTableParams.reload();
				}
				else {
					console.log(data);
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
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



