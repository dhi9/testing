app.controller('CategoryMasterListController', function($filter, $scope, $http, ngTableParams, CategoryFactory) {
    $scope.categoryList = CategoryFactory.categoryList;
	
	$scope.search = {};
	$scope.search.$ = '';

    CategoryFactory.getCategoryList().then(function(){
        $scope.categoryList = CategoryFactory.categoryList;
        $scope.tableParams.total($scope.categoryList.length);
        $scope.tableParams.reload();
    })
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'category_code': 'asc'
			}
		}, 
		{
			total: $scope.categoryList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.categoryList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var categoryCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (categoryCurrentPage === null) {
				categoryCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (categoryCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(categoryCurrentPage);
			}
			categoryCurrentPage = null;
		}
	});
	
	$scope.statusLabel = function(status){
		var label;
		if (status == 'A') {
			label = 'Aktif';
		}
		else {
			label = 'Non Aktif';
		}
		return label;
	};
});