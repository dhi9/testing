app.controller('ServiceExecutionDetailController', function($scope, $modal, PurchaseService, $stateParams, SweetAlert, $state) {
    var requestsReference = $stateParams.requests_reference;

    $scope.requestDetail = [];
    $scope.deliveryRequestDetail = [];
    $scope.completedService = [];
    $scope.service = [];
    $scope.userList = [];

    PurchaseService.getActiveRequestsByDraftReference(requestsReference).success(function(data){
        if(data.call_status == "success"){
            $scope.requestDetail = data.requests;
            $scope.completedService.up = "TRUE";
            PurchaseService.getActiveDeliveryRequestsByRequestsId($scope.requestDetail.requests_id).success(function(data){
                if(data.call_status == "success"){
                    $scope.deliveryRequestDetail = data.delivery_requests;

                    PurchaseService.getCompletedServiceByDeliveryRequestId($scope.deliveryRequestDetail[0].requests_delivery_request_id).success(function(data){
                        if(data.call_status == "success"){
                            if (data.completed_service.length > 0) { 
                                $scope.completedService =  data.completed_service[0];
                                $scope.completedService.date_created = new Date($scope.completedService.date_created);
                                $scope.completedService.date_completed = new Date($scope.completedService.date_completed);
                                if(typeof($scope.completedService) !== 'undefined'){
                                    if($scope.completedService.length < 1){
                                        $scope.completedService.confirmed = "FALSE";
                                    }else{
                                        $scope.completedService.confirmed = "TRUE";
                                    }
                                }
                            }
                        }
                    })
                }
            })
        }
    });

    PurchaseService.getUsersList().success(function(data){
        if(data.call_status == "success"){
            $scope.userList = data.users_list;
        }
    });

    $scope.confirmedByUser = function(confirmed_by){
        for(var i = 0; i<$scope.userList.length; i += 1){
            if($scope.userList[i].user_id == confirmed_by){
               return $scope.userList[i].username ;
            }
        }
    };
    $scope.submitCompletedService =  function(){
        var completeDate = moment($scope.service.date_completed).format('YYYY-MM-DD HH:mm:ss');
        var completedData = {
            requests_delivery_request_id: $scope.deliveryRequestDetail[0].requests_delivery_request_id,
            date_completed: completeDate,
            remark: $scope.service.remark || "",
        };
        PurchaseService.updateServiceRequestToCompleteServiceRequest($scope.requestDetail.requests_reference).success(function(data){});
        PurchaseService.insertCompletedService(completedData).success(function(data){
            if(data.call_status == "success"){
                SweetAlert.swal({
                    title: "Success?",
                    text: "Berhasil!",
                    type: "success",
                    confirmButtonText: "OK, Kembali!",
                    closeOnConfirm: true},
                function(){
                });

                $state.reload();
            }
        })
    }
});