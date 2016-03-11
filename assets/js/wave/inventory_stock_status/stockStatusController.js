app.controller('StockStatusController', function($scope, $modal, $state, SweetAlert, ItemFactory, AttributeFactory) {
	$scope.search = {};
	$scope.attributeList = AttributeFactory.attributeActiveList;

	ItemFactory.getRawItemList().then(function(){
		$scope.itemList = ItemFactory.itemList;
	});

	AttributeFactory.getAttributeActiveList().then(function(){
		$scope.attributeList = AttributeFactory.attributeActiveList;
	});

	$scope.itemListModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'modal_item_list',
			controller: 'ItemListModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};

	$scope.siteListModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'modal_site_list',
			controller: 'storageListModal',
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

	$scope.attributeModal = function(attributeName) {
		var pass_data = {
			attributeName: attributeName
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_attribute_value_list',
			controller: 'AttributeModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};

	$scope.submitSearch = function(search){
		if ($scope.search.searchItem == undefined || $scope.search.searchItem == '') {
			SweetAlert.swal({
					title: "Kode Barang yang dicari tidak boleh kosong",
					type: "error",
					animation: "slide-from-top"
				});
		}else{
			var attribute = "";
			for(var i = 0; i < $scope.attributeList.length; i += 1){
				if($scope.search[$scope.attributeList[i].attribute_name] !== undefined || $scope.search[$scope.attributeList[i].attribute_name] !== "" || $scope.search[$scope.attributeList[i].attribute_name] !== null){
					if(i>0){
						attribute = attribute + "-";
					}
					attribute = attribute + $scope.attributeList[i].attribute_name + "-" + $scope.search[$scope.attributeList[i].attribute_name];
				}
			}
			$state.go('app.inventory.stock_status_detail',{item_code : $scope.search.searchItem, site_reference : $scope.search.searchSite, storage_name : $scope.search.searchStorage , attributes : attribute });
		}
	}
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

app.controller('AttributeModalCtrl', function ($scope, $modalInstance, ngTableParams, passed_data, $filter, InventoryService) {
	$scope.attributeName = passed_data.attributeName;

	$scope.attributeValueList = [];

	InventoryService.getAttributeValueListByAttributeName(passed_data.attributeName).success(function(data){
		if(data.call_status == "success"){
			$scope.attributeValueList = data.attribute_value_list;
			$scope.tableParams.total($scope.attributeValueList.length);
			$scope.tableParams.reload();

			$scope.table_loading = false;
		}
	});

	$scope.filter = {};
	$scope.filter.$ = '';

	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		},
		{
			total: $scope.attributeValueList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.attributeValueList, $scope.filter);
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
		var selectedSite = $filter('filter')($scope.attributeValueList, {selected:true});

		var text = '';
		for(var i = 0; i < selectedSite.length; i++){
				text = text + selectedSite[i].attribute_value + '-';
		}

		$scope.search[$scope.attributeName] = text;

		$modalInstance.dismiss();
	};

	$scope.closeModal = function () {
			$modalInstance.dismiss();
	};
});