app.controller('StockOpnameListController', function($filter, $scope, $rootScope,$http, $modal, ngTableParams, InventoryService, PurchaseService) {
	
	$scope.opnameList = [];

	$scope.search = {};
	$scope.search.$ = '';
	
	InventoryService.getOpnameList().success(function(data){
		$scope.opnameList = data.opname_list;
		
		for(var i = 0; i < $scope.opnameList.length; i++){
            $scope.opnameList[i].opname_start_date = new Date($scope.opnameList[i].opname_start_date);
            $scope.opnameList[i].opname_finish_date = new Date($scope.opnameList[i].opname_finish_date);
			
			//draft detail dari sini
		}
		$scope.stockOpnameTableParams.total($scope.opnameList.length);
		$scope.stockOpnameTableParams.reload();
	});

	$scope.statusLabel = function(status){
		switch(status) {
			case 'P':
				return 'Approved';
				break;
			case 'C':
				return 'Perlu Diganti';
				break;
			default:
				return 'Aktif';
		}
	}
	$scope.sortingRequest = function(draft_reference){
		var ref = draft_reference.charAt(0,1)
		return ref ;
	}

    $scope.stockOpnameTableParams = new ngTableParams(
        {
            page: 1, // show first page
            count: 10, // count per page
            /*sorting:
             {
             'purchaseRequest_code': 'asc'
             }*/
        },
        {
            total: $scope.opnameList.length, // length of data
            getData: function ($defer, params) {
                var filteredData = $filter('filter') ($scope.opnameList, $scope.search);
                var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                params.total(orderedData.length);

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        }
    );

    var ownPurchaseRequestCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.stockOpnameTableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (ownPurchaseRequestCurrentPage === null) {
				ownPurchaseRequestCurrentPage = $scope.stockOpnameTableParams.$params.page;
			}
			$scope.stockOpnameTableParams.page(1);
		} else {
			if (ownPurchaseRequestCurrentPage === null) {
				$scope.stockOpnameTableParams.page(1);
			}
			else {
				$scope.stockOpnameTableParams.page(purchaseRequestCurrentPage);
			}
			ownPurchaseRequestCurrentPage = null;
		}
	});
		


});