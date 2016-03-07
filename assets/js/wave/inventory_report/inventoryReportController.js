app.controller('InventoryReportController', function($filter, $scope, $http, $modal, ngTableParams, InventoryService, CategoryFactory, ItemService, ItemFactory, SiteService, ApiCallService) {
	$scope.stockDisplayList = [];
	$scope.itemList = [];
	$scope.siteList = [];
	$scope.storageList = [];


	console.log($scope);

	$scope.categoryList = CategoryFactory.categoryList;

	$scope.search = {};
	$scope.search.$ = '';
	$scope.search.tag = [];

	SiteService.getSiteList().success(function (data) {
		$scope.siteList = data.site_list;
	});

	ItemService.getItemList().success(function (data) {
		$scope.itemList = data.item_list;
	});

	SiteService.getStorageList().success(function (data){
		$scope.storageList = data.storage_list;
	})

	$scope.setAttributes = function () {
		if ($scope.stockDisplayList.length > 0) {
			for (var i = 0; i < $scope.stockDisplayList.length; i += 1) {
				$scope.stockDisplayList[i].attributes = JSON.parse($scope.stockDisplayList[i].attributes);
				var sum = 1;
				angular.forEach($scope.stockDisplayList[i].attributes, function (attributeValue, attributeName) {
					if ($scope.stockDisplayList[i].attributes['string'] == undefined) {
						$scope.stockDisplayList[i].attributes['string'] = "";
						$scope.stockDisplayList[i].attributes['link'] = "";
					}
					if (sum > 1) {
						$scope.stockDisplayList[i].attributes['string'] = $scope.stockDisplayList[i].attributes['string'] + ", ";
						$scope.stockDisplayList[i].attributes['link'] = $scope.stockDisplayList[i].attributes['link'] + "-";
					}
					$scope.stockDisplayList[i].attributes['string'] = $scope.stockDisplayList[i].attributes['string'] + attributeName + ":" + attributeValue;
					$scope.stockDisplayList[i].attributes['link'] = $scope.stockDisplayList[i].attributes['link'] + attributeName + "-" + attributeValue;
					sum += 1;
				});
			}
		}
	};
	InventoryService.getStockDisplay().success(function (data) {
		$scope.stockDisplayList = data.stock_display_list;

		$scope.setAttributes();
		$scope.stockTableParams.total($scope.stockDisplayList.length);
		$scope.stockTableParams.reload();

	});

	$scope.siteListModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'modal_site_list',
			controller: 'SiteListModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};

	$scope.storageListModal = function(site) {
		var pass_data = {
			site: site
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_storage_list',
			controller: 'StorageListModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};

	$scope.applyFilter = function () {
		var data = {
			site_reference: $scope.search.searchSite,
			//tag: $scope.search.tag
			storage_name: $scope.search.searchStorage
		};
		ApiCallService.getInventoryReport(data).success(function (data) {
			if (data.call_status == "success") {
				console.log(data);
				$scope.stockDisplayList = data.result;
				$scope.setAttributes();
				$scope.stockTableParams.total($scope.stockDisplayList.length);
				$scope.stockTableParams.reload();
			}
		});
	};
	$scope.isAlreadyChoosen = function (tag_name) {
		var valid = false;
		for (var j = 0; j < $scope.search.tag.length; j += 1) {
			if (tag_name == $scope.search.tag[j].tag_name) {
				valid = true;
			}
		}
		return valid;
	};
	$scope.isTagAvaiable = function () {
		var valid = false;
		for (var i = 0; i < $scope.tagList.length; i += 1) {
			if ($scope.tag_input == $scope.tagList[i].tag_name) {
				if (!$scope.isAlreadyChoosen($scope.tag_input)) {
					valid = true;
				}
			}
		}
		return valid;
	};
	$scope.lookupCategoryName = function (categoryID) {
		for (var i = 0; i < $scope.categoryList.length; i++) {
			if ($scope.categoryList[i].category_id == categoryID) {
				return $scope.categoryList[i].category_name;
			}
		}
	};
	$scope.addItemTag = function (tag_name) {
		var data_tag = {
			tag_name: tag_name
		}
		$scope.search.tag.push(data_tag);
	};

	ItemService.getItemList().success(function (data) {
		$scope.itemList = data.item_details_list;

		for (var i = 0; i < $scope.itemList.length; i++) {
			$scope.itemList[i].date_created = moment($scope.itemList[i].date_created).format('DD/MM/YYYY');

			if ($scope.itemList[i].date_updated != null && $scope.itemList[i].date_updated != undefined && $scope.itemList[i].date_updated != "0000-00-00 00:00:00") {
				$scope.itemList[i].date_updated = moment($scope.itemList[i].date_updated).format('DD/MM/YYYY');
			} else {
				$scope.itemList[i].date_updated = "";
			}
		}

	});

	$scope.stockTableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				'item_code': 'asc'
			}
		},
		{
			total: $scope.stockDisplayList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter')($scope.stockDisplayList, $scope.search.$);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

				params.total(orderedData.length);

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);

	var stockCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.stockTableParams.reload();

		if ($scope.search.$.length > 0) {
			if (stockCurrentPage === null) {
				stockCurrentPage = $scope.stockTableParams.$params.page;
			}
			$scope.stockTableParams.page(1);
		} else {
			if (stockCurrentPage === null) {
				$scope.stockTableParams.page(1);
			}
			else {
				$scope.stockTableParams.page(stockCurrentPage);
			}
			stockCurrentPage = null;
		}
	});

	$scope.tagList = ItemFactory.tagList;
	ItemFactory.getTagList().then(function () {
		$scope.tagList = ItemFactory.tagList;
	});

	$scope.chooseTag = [];

	$scope.removeChooseTag = [];

	$scope.addChooseTag = [];

});


app.controller('SiteListModalCtrl', function ($scope, $modalInstance, ngTableParams, $filter, SiteService) {
	$scope.siteList = [];

	$scope.filter = {};
	$scope.filter.$ = '';

	SiteService.getSiteList().success(function(data){
		if (data.call_status === "success") {
			$scope.siteList = data.site_list;

			$scope.tableParams.total($scope.siteList.length);
			$scope.tableParams.reload();
		}
	});

	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		},
		{
			total: $scope.siteList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.siteList, $scope.filter);
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

	$scope.saveModal = function () {
		var selectedSite = $filter('filter')($scope.siteList, {selected:true});

		var text = '';
		for(var i = 0; i < selectedSite.length; i++){
			text = text + selectedSite[i].site_reference + '-';
		}

		$scope.search.searchSite = text;

		$modalInstance.dismiss();
	};

	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});


app.controller('StorageListModalCtrl', function ($scope, $modalInstance, ngTableParams, passed_data, $filter, SiteService, ItemFactory) {
	$scope.site_reference = passed_data.site;

	$scope.storageList = [];

	$scope.filter = {};
	$scope.filter.$ = '';

	SiteService.getSiteLocationListByMassSiteId($scope.site_reference).success(function(data){
		if(data.call_status == "success"){
			$scope.storageList = data.location_list;
			$scope.tableParams.total($scope.storageList.length);
			$scope.tableParams.reload();

			$scope.table_loading = false;
		}
	});

	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		},
		{
			total: $scope.storageList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.storageList, $scope.filter);
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
	$scope.saveModal = function () {
		var selectedSite = $filter('filter')($scope.storageList, {selected:true});

		var text = '';
		for(var i = 0; i < selectedSite.length; i++){
			text = text + selectedSite[i].storage_name + '-';
		}

		$scope.search.searchStorage = text;

		$modalInstance.dismiss();
	};

	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});
