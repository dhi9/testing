app.controller('VendorMasterController', function($filter, $scope, $http, VendorService, ngTableParams, VendorFactory) {
    $scope.vendorList = VendorFactory.vendorList;
	
	$scope.search = {};
	$scope.search.$ = '';

    VendorFactory.getVendorList().then(function(){
        $scope.vendorList = VendorFactory.vendorList;

        for(var i = 0; i < $scope.vendorList.length; i += 1){
        	$scope.vendorList[i].restatus = $scope.statusLabel($scope.vendorList[i].status);
        }

        $scope.tableParams.total($scope.vendorList.length);
        $scope.tableParams.reload();
    })
	
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
			total: $scope.vendorList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.vendorList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var vendorCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (vendorCurrentPage === null) {
				vendorCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (vendorCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(vendorCurrentPage);
			}
			vendorCurrentPage = null;
		}
	});

	$scope.statusLabel = function(status){
		switch(status) {
			case 'A':
				return 'Aktif';
				break;
			case 'N':
				return 'Non Aktif';
				break;
			case 'B':
				return 'Block';
				break;
			default:
				return 'Aktif';
		}
	}
});
