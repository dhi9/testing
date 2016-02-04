app.controller('stockMovementController', function($scope, $modal, $state, $stateParams, SiteService, ItemService, SweetAlert) {
	var itemCode = "A120";
    $scope.movementCodeList = [ ];

    SiteService.getMovementCodeList().success(function(data){
        if (data.call_status == 'success') {
            $scope.movementCodeList = data.movement_code_list;
        }
    });

	ItemService.getItemByItemCode(itemCode).success(function(data){
		if (data.call_status == 'success') {
			$scope.item = data.item_details;
			$scope.item.value_amount = parseFloat($scope.item.value_amount);
		}
	});

	$scope.helperModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'helper_modal',
			controller: 'HistoryModalCtrl',
			size: 'lg',
            scope: $scope
		});
	};

});

app.controller('HistoryModalCtrl', function ($scope, $modalInstance) {
    $scope.closeModal = function () {
        $modalInstance.dismiss();
    };
});