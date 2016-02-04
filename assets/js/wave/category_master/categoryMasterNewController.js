app.controller('CategoryMasterNewController', function($scope, $modal, $state, SweetAlert, CategoryFactory) {
	$scope.clear = function(){
		CategoryFactory.clear();	
	}
	$scope.clear();
	
	$scope.category = CategoryFactory.newCategory;
	
    $scope.categoryList = CategoryFactory.categoryList;
	CategoryFactory.getCategoryList().then(function(){
		$scope.categoryList = CategoryFactory.categoryList;
	});
	$scope.isCategoryExist = function(){
		var exist = false;
		for (var i = 0; i < $scope.categoryList.length; i += 1) {
			if (angular.lowercase($scope.category.category_name) == angular.lowercase($scope.categoryList[i].category_name)) {
				exist = true;
			}
		}
		return exist;
	}
	$scope.insertCategory = function () {
		CategoryFactory.insertCategory().then(function(){
			$state.go('app.master.category');
		})
	};
});