app.controller('AttributeMasterEditController', function($scope, $modal, $state, $stateParams, SweetAlert, AttributeFactory) {
	var attributeId = $stateParams.attribute_id;

	$scope.attribute = AttributeFactory.attribute;
	$scope.attribute_items = AttributeFactory.attribute_items;
	
	AttributeFactory.getAttributeById(attributeId).then(function(){
		$scope.attribute = AttributeFactory.attribute;
		$scope.attribute_items = AttributeFactory.attribute_items;
	});
	
	$scope.updateAttribute = function () {
		AttributeFactory.updateAttribute().then(function(data){
			$state.go('app.master.attribute');
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

	$scope.displayNewAttributeItemModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'add_attribute_item_modal',
			controller: 'NewAttributeItemModalCtrl',
			size: 'md',
			scope: $scope
		});
	};
});

app.controller('HistoryModalCtrl', function ($scope, $modalInstance, AttributeService) {
	AttributeService.getAttributeHistoryListByAttributeId($scope.attribute.attribute_id).success(function(data){
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

app.controller('NewAttributeItemModalCtrl', function ($scope, $modalInstance, AttributeFactory) {
	$scope.newValue = "";

	$scope.submitNewValue = function(){
		AttributeFactory.insertNewAttributeItem($scope.newValue).then(function(){

			$modalInstance.dismiss();
		});
	}

	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});