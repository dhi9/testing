app.controller('AttributeMasterListController', function($filter, $scope, $http, ngTableParams, AttributeFactory) {
    $scope.attributeList = AttributeFactory.attributeList;
	
	$scope.search = {};
	$scope.search.$ = '';

    AttributeFactory.getAttributeList().then(function(){
        $scope.attributeList = AttributeFactory.attributeList;
        for(var i = 0 ; i < $scope.attributeList.length; i += 1){
            $scope.attributeList[i].restatus = $scope.statusLabel($scope.attributeList[i].status);
        }
        $scope.tableParams.total($scope.attributeList.length);
        $scope.tableParams.reload();
    });
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'attribute_code': 'asc'
			}
		}, 
		{
			total: $scope.attributeList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.attributeList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var attributeCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (attributeCurrentPage === null) {
				attributeCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (attributeCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(attributeCurrentPage);
			}
			attributeCurrentPage = null;
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