app.controller('StockOpnameNewController', function($filter, $scope, $modal, $state, SweetAlert, SiteService, InventoryService) {
	$scope.opname = [];
    $scope.siteList = [];

    SiteService.getSiteList().success(function(data){
        if (data.call_status === "success") {
            $scope.siteList = data.site_list;
        }
    });

    $scope.insertOpname = function () {
        $scope.submitButtonLoading = true;
        var data = {
            site_id:$scope.opname.site_id,
            opname_start_date:$scope.opname.opname_start_date,
        };
        InventoryService.startOpname(data).success(function(data){
           if(data.call_status == "success"){
               $scope.opname.stock_opname_id = data.stock_opname_id;
               $scope.opnameModal($scope.opname);
               $scope.submitButtonLoading = false;
           }else{
               SweetAlert.swal("Error", data.error_message, data.call_status);
           }
        });
	};

    $scope.opnameModal = function (opname) {
        var pass_data = {
            opname: opname
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

    $scope.getYearMonth = function (){
        $scope.opname.opname_date = $filter('date')($scope.opname.opname_start_date,'yyyy/MM');
    }
});


app.controller('OpnameModalCtrl', function ($filter, $scope, $modalInstance, passed_data, InventoryService, SweetAlert) {
    $scope.opname = passed_data.opname;
    $scope.opname.opname_start_date = $filter('date')($scope.opname.opname_start_date,'yyyy-MM-dd');
    $scope.list = [];
    var data = {
        site_id:$scope.opname.site_id,
        opname_start_date:$scope.opname.opname_start_date,
        stock_opname_id:$scope.opname.stock_opname_id,
    };
     InventoryService.getSiteItemListByMonth(data).success(function(data){
         if (data.call_status == 'success') {
             $scope.list = data.list;
             $scope.submitButtonLoading = false;
         }
     });

    $scope.closeModal = function () {
        $modalInstance.dismiss();
    };
});