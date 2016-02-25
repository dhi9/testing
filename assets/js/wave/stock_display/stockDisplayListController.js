app.controller('StockDisplayListController', function($filter, $scope, $http, ngTableParams, InventoryService, CategoryFactory, ItemService, ItemFactory, SiteService) {
	$scope.stockDisplayList = [];
	$scope.itemList = [];
	$scope.siteList = [];

	$scope.categoryList = CategoryFactory.categoryList;

	$scope.search = {};
	$scope.search.$ = '';
	$scope.search.site_id = 0;
	$scope.search.tag = [];
	SiteService.getSiteList().success(function (data) {
		$scope.siteList = data.site_list;
	});
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
	$scope.applyFilter = function () {
		var data = {
			site_id: $scope.search.site_id,
			tag: $scope.search.tag
		};
		InventoryService.getStockDisplayByFilter(data).success(function (data) {
			if (data.call_status == "success") {
				$scope.stockDisplayList = data.stock_display_list;
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
	
	$scope.removeItemTag = function (tag){
		var index = $scope.search.tag.indexOf(tag);
		$scope.search.tag.splice(index, 1);
	};

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