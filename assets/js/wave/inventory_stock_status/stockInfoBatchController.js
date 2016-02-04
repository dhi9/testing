app.controller('stockInfoBatchController', function($scope, $modal, $state, $stateParams, ItemService, SweetAlert) {
	var itemCode = "A120";
	$scope.batchRef = $stateParams.batch_reference;

    ItemService.getBatchByBatchReference($scope.batchRef).success(function(batchinfo){
        if (batchinfo.call_status == 'success') {
            $scope.batchs = batchinfo.batch_info;
				$scope.item_code = $scope.batchs.item_code;
                $scope.batchs.production_date = moment($scope.batchs.production_date).format('YYYY-MM-DD');
                $scope.batchs.expired_date = moment($scope.batchs.expired_date).format('YYYY-MM-DD');	
            ItemService.getItemByItemCode($scope.batchs.item_code).success(function(data){
                if (data.call_status == 'success') {
                    $scope.item = data.item_details;
                    $scope.item.value_amount = parseFloat($scope.item.value_amount);
                }
            });
        }
    });
	$scope.back = function (){
		$state.go("app.inventory.stock_status_detail", {'item_code' : $scope.batchs.item_code });
	}
});