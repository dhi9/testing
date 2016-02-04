app.controller('StockOpnameDetailController', function($scope, $modal, $state, $stateParams, InventoryService, SweetAlert, VendorFactory) {
	var stock_opname_id = $stateParams.stock_opname_id;
    $scope.opname = {};
    InventoryService.getOpnameDetail(stock_opname_id).success(function(data){
        $scope.opname = data.opname;

        $scope.opname.opname_start_date = new Date($scope.opname.opname_start_date);
        $scope.opname.opname_finish_date = new Date($scope.opname.opname_finish_date);
    });

	$scope.opnameModal = function () {
        var pass_data = {
            stock_opname_id: stock_opname_id
        };

		var modalInstance = $modal.open({
			templateUrl: 'opname_modal',
			controller: 'OpnameModalCtrl',
			size: 'lg',
            resolve: {
                passed_data: function () {
                    return pass_data;
                }
            },
			scope: $scope
		});
	};
});

app.controller('OpnameModalCtrl', function ($scope, $modalInstance, InventoryService, passed_data, SweetAlert) {
    var stock_opname_id = passed_data.stock_opname_id;
    $scope.opnameItemList = {};
    $scope.access = false;

    InventoryService.getOpnameItemList(stock_opname_id).success(function(data){
        $scope.opnameItemList = data.opname_item_list;
    });

    InventoryService.isUserHasOpnameAccess().success(function(data){
        if(data.call_status == "success"){
            if(data.stock_opname_access == true){
                $scope.access = true;
            }
        }
    });
    $scope.approveOpnameItem = function(oi){
        $scope.approveLoading = true;
        var data = {
            opname_item : oi,
            opname_id : stock_opname_id
        }
        InventoryService.approveOpnameItem(data).success(function(data){
            var index = $scope.opnameItemList.indexOf(oi);
            $scope.opnameItemList[index].status = 'A';
            SweetAlert.swal("Sukses!", "", "success");
        });
    }
    $scope.adjustmentQuantity = function(oi){
        return oi.aktual_quantity - oi.system_quantity;
    }
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});