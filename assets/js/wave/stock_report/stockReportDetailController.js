app.controller('StockReportDetailController', function($scope, $filter, ngTableParams, $location, $state, $stateParams, SweetAlert, $modal, ApiCallService, ItemService, SiteService) {
	$scope.search = {
		searchSite:$stateParams.site_id,
		searchDateFrom: new Date($stateParams.date_from),
		searchDateTo: new Date($stateParams.date_to),
		searchItem:$stateParams.items
	};
	$scope.siteList = [];

	$scope.stockReport=[];
	$scope.report = {};

	ApiCallService.getStockReport($scope.search).success(function(data){
		if(data.call_status == "success"){
			$scope.report = data.report;
			$scope.stockReport = data.result;
		}
	});

	SiteService.getSiteList().success(function(data){
		if (data.call_status === "success") {
			$scope.siteList = data.site_list;
		}
	});

	$scope.itemListModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'modal_item_list',
			controller: 'ItemListModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};

	$scope.exportStockReport = function (){
		var data = {
			report : $scope.report,
			stock_report : $scope.stockReport
		}
		ApiCallService.exportStockReport(data);
	}

	$scope.init = function() {
	};
	
	$scope.init();

});


app.controller('ItemListModalCtrl', function ($scope, $modalInstance, ngTableParams, $filter, ItemService) {
	$scope.itemList = [];

	$scope.filter = {};
	$scope.filter.$ = '';

	ItemService.getItemList().success(function(data){
		if (data.call_status === "success") {
			$scope.itemList = data.item_details_list;

			$scope.tableParams.total($scope.itemList.length);
			$scope.tableParams.reload();
		}
	});

	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		},
		{
			total: $scope.itemList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.itemList, $scope.filter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);

	var currentPage = null;
	$scope.$watch("filter.$", function () {
		$scope.tableParams.reload();

		if ($scope.filter.$.length > 0) {
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

	$scope.setItemCode = function (itemCode) {
		$scope.search.searchItem = itemCode;

		$modalInstance.dismiss();
	};

	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});
