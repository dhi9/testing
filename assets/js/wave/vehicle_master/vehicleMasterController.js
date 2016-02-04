app.controller('VehicleMasterController', function($filter, $scope, $http, VehicleService, ngTableParams) {
	$scope.vehicleList = [];
	$scope.vehicleType = [];
	
	$scope.search = {};
	$scope.search.$ = '';
	/*VehicleService.getVehicleTypeList().
		success(function(data) {
			if (data.call_status === "success") {
				$scope.vehicleType = data.vehicle_type_list;
			}
		});*/
			
	$scope.vehicleList.vehicle_type={};
	VehicleService.getVehicleList().success(function(data){
		$scope.vehicleList = data.vehicle_list;
			for(var i = 0; i < $scope.vehicleList.length; i++){
				$scope.vehicleList[i].statusLabel = $scope.statusLabel($scope.vehicleList[i].status);
			}
		$scope.tableParams.total($scope.vehicleList.length);
		$scope.tableParams.reload();
	});
	
	$scope.statusLabel = function(status){
		if (status == 'A') {
			return 'Active';
		}
		else if (status == 'S') {
			return 'Suspended';
		}
		else {
			return 'Non Active';
		}
	}
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'vendor_code': 'asc'
			}
		}, 
		{
			total: $scope.vehicleList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.vehicleList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var vehicleCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (vehicleCurrentPage === null) {
				vehicleCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (vehicleCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(vehicleCurrentPage);
			}
			vehicleCurrentPage = null;
		}
	});
});