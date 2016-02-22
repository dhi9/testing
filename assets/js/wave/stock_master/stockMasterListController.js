app.controller('StockMasterListController', function($filter, $scope, $http, ItemService, ngTableParams, CategoryFactory) {
	$scope.itemList = [];

	$scope.categoryList = CategoryFactory.categoryList;

	$scope.search = {};
	$scope.search.$ = '';

	CategoryFactory.getCategoryList().then(function(){
		$scope.categoryList = CategoryFactory.categoryList;
	});
	$scope.lookupCategoryName = function(categoryID){
		for (var i = 0; i < $scope.categoryList.length; i++) {
			if($scope.categoryList[i].category_id == categoryID){
				return $scope.categoryList[i].category_name;
			}
		}
	}

	$scope.statusLabel = function(status){
		switch(status) {
			case 'A':
				return 'Aktif';
				break;
			case 'X':
				return 'Non Aktif';
				break;
			default:
				return 'Aktif';
		}
	}

	ItemService.getItemList().success(function(data){
		$scope.itemList = data.item_details_list;

		for (var i = 0; i < $scope.itemList.length; i++) {
			$scope.itemList[i].date_created = moment($scope.itemList[i].date_created).format('DD/MM/YYYY');
			$scope.itemList[i].statusLabel = $scope.statusLabel($scope.itemList[i].status);
			if ($scope.itemList[i].date_updated != null && $scope.itemList[i].date_updated != undefined && $scope.itemList[i].date_updated != "0000-00-00 00:00:00") {
				$scope.itemList[i].date_updated = moment($scope.itemList[i].date_updated).format('DD/MM/YYYY');
			}else{
				$scope.itemList[i].date_updated = "";
			}
		}

		$scope.tableParams.total($scope.itemList.length);
		$scope.tableParams.reload();
	});

	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'item_code': 'asc'
			}
		},
		{
			total: $scope.itemList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.itemList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

				params.total(orderedData.length);

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);

	var itemCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();

		if ($scope.search.$.length > 0) {
			if (itemCurrentPage === null) {
				itemCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (itemCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(itemCurrentPage);
			}
			itemCurrentPage = null;
		}
	});

	$scope.employeeExpenses = $scope.itemList;

	$scope.saveExpenses = function () {
		var sheets = [{
			Advance: 1000,
			Attachment: true,
			//Department: "Sales",
			Expenses:$scope.itemList,
			//Id: "E892659",
			//Manager: "Andrew Fuller",
			Name: "Stock Master",
			//Position: "Sales Representative",
			//Purpose: "On business",
			//SSN: "A37830"
		}]
		var workbook = XlsxExport.exportExpenseReport(sheets);
		console.log(workbook);
		var xlsx = wijmo.xlsx.XlsxConverter.exportToFile(workbook, 'VONTIS-STOCK-DATA-EXPORT.xlsx');
	}
	$scope.downloadTemplate = function () {
		var workbook = XlsxExport.downloadTemplate();
		console.log(workbook);
		var xlsx = wijmo.xlsx.XlsxConverter.exportToFile(workbook, 'VONTIS-STOCK-TEMPLATE.xlsx');
	}
});