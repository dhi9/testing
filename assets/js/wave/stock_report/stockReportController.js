app.controller('StockReportController', function($scope, $filter, ngTableParams, $state, $stateParams, SweetAlert, $modal, ApiCallService, ItemService, SiteService) {

	$scope.search = {
		searchSite:"",
		searchDateFrom:"",
		searchDateTo:"",
		searchItem:""
	};
	$scope.siteList = [];

	$scope.hasil=[];

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

	$scope.reset = function (){
		$scope.search = {
			searchSite:"",
			searchDateFrom:"",
			searchDateTo:"",
			searchItem:""
		};
	}

	$scope.isDataValid = function (){
		var valid = false;
		if($scope.search.searchSite != null
			&& $scope.search.searchSite != undefined
			&& $scope.search.searchSite != ""
			&&$scope.search.searchDateFrom != null
			&& $scope.search.searchDateFrom != undefined
			&& $scope.search.searchDateFrom != ""
			&&$scope.search.searchDateTo != null
			&& $scope.search.searchDateTo != undefined
			&& $scope.search.searchDateTo != ""
		){
			valid = true;
		}
		return valid;
	}

	$scope.submitSearch = function (){
		if($scope.isDataValid()){
			$state.go('app.report.stock_report_detail',{site_id : $scope.search.searchSite, date_from : $scope.search.searchDateFrom, date_to : $scope.search.searchDateTo, items : $scope.search.searchItem });
			/*
			ApiCallService.getStockReport($scope.search).success(function(data){
				if(data.call_success == "success"){
					console.log(data);
					$scope.hasil = data.report;
				}
			});
			*/
		}else{
			console.log("error", $scope.search);
		}
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
