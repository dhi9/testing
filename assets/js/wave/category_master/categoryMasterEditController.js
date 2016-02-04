app.controller('CategoryMasterEditController', function($scope, $modal, $state, $stateParams, SweetAlert, CategoryFactory) {
	var categoryId = $stateParams.category_id;
	
	$scope.category = CategoryFactory.category;
	
	CategoryFactory.getCategoryById(categoryId).then(function(){
		$scope.category = CategoryFactory.category;
		console.log($scope.category);
	});
	
	$scope.updateCategory = function () {
		CategoryFactory.updateCategory().then(function(data){
			$state.go('app.master.category');
		});
	};
	
	$scope.historyModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'history_modal',
			controller: 'HistoryModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};
});

app.controller('HistoryModalCtrl', function ($scope, $modalInstance, categoryService) {
	categoryService.getcategoryHistoryListBycategoryId($scope.category.category_id).success(function(data){
		if (data.call_status == 'success') {
			$scope.historyList = data.history_list;
			
			for(var i = 0; i < $scope.historyList.length; i++)
			{
				$scope.historyList[i].datetime = new Date($scope.historyList[i].datetime);
			}
		}
	});
	
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});