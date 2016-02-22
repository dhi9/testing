app.controller('DocumentFlowController', function($scope, $modal, $stateParams, $location, ApiCallService) {
  
	$scope.overallData = [];
	$scope.orderReference = $stateParams.order_reference;
	
	$scope.search_object_reference = "";
	
	$scope.go = function() {
		$location.path('app/delivery/alurdokumen/' + $scope.search_object_reference).replace();
	}
	
	$scope.isNotExist = false;
	
	$scope.init = function() {
	
		$scope.isNotExist = false;
		
		if ($stateParams.order_reference != null) {
			$scope.search_object_reference = $stateParams.order_reference;
		}
		
		if ($stateParams.order_reference != "cari") {
			
			$scope.isDataRetrieved = true;
			
			ApiCallService.getDocumentFlow($scope.orderReference).
				success(function(data, status, headers, config) {
					if (data.call_status === "success" && data.order != null) {
						$scope.order = data.order;
						if ($scope.order.good_issue_date != null && $scope.order.good_issue_date != undefined && $scope.order.good_issue_date != "0000-00-00 00:00:00") {
							$scope.order.good_issue_date = moment($scope.order.good_issue_date).format('DD-MM-YYYY');
						}
					}
					else {
						$scope.isNotExist = true;
						$scope.isDataRetrieved = false;
					}
				}).
				error(function(data, status, headers, config) {
					$scope.isDataRetrieved = false;
				});
		}
		else {
			$scope.isDataRetrieved = false;
			$scope.search_object_reference = "";
		}
		//console.log("test");
	};
	
	$scope.init();
	//Additional
	$scope.UTILgetStatusLabel = function(status, level) {
	
		var statusLabel;
		
		if (level == "ORDER") {
			switch(status) {
				case 'N':
					statusLabel= "Penyerahan";
					break;
				case 'P':
					statusLabel= "Produksi";
					break;
				case 'R':
					statusLabel= "Tersedia";
					break;
				case 'B':
					statusLabel= "Credit Block";
					break;
				case 'D':
					statusLabel= "Pengiriman";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
			}
		}
		else if (level == "DELIVERYREQUEST") {
			switch(status) {
				case 'A':
					statusLabel= "Aktif";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
				case 'X':
					statusLabel= "Batal";
					break;
			}
		}
		else if(level == "DELIVERY"){
			switch(status) {
				case 'A':
					statusLabel= "Dibuat";
					break;
				case 'L':
					statusLabel= "Pemuatan";
					break;
				case 'S':
					statusLabel= "Tiba";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
				case 'X':
					statusLabel= "Batal";
					break;
			}
		}
		
		return statusLabel;
	}

	$scope.UTILgetStatusClass = function(status, level) {
		var statusLabel;
        
		if (level == "ORDER") {
			switch(status) {
				case 'N':
					statusLabel= "label-default";
					break;
				case 'P':
					statusLabel= "label-warning";
					break;
				case 'R':
					statusLabel= "label-info";
					break;
				case 'B':
					statusLabel= "label-danger";
					break;
				case 'D':
					statusLabel= "label-inverse";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
			}
		}
		else if (level == "DELIVERYREQUEST") {
			switch(status) {
				case 'A':
					statusLabel= "label-default";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
				case 'X':
					statusLabel= "label-inverse";
					break;
			}
		}
		else if(level == "DELIVERY"){
			switch(status) {
				case 'A':
					statusLabel= "label-default";
					break;
				case 'L':
					statusLabel= "label-warning";
					break;
				case 'S':
					statusLabel= "label-info";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
				case 'X':
					statusLabel= "label-inverse";
					break;
			}
		}
        
		return statusLabel;
	}
    $scope.displayCancelModal = function() {
        /*
         var pass_data = {
         item: item
         };
         */

        var modalInstance = $modal.open({
            templateUrl: 'modal_cancel',
            controller: 'CancelModalCtrl',
            size: 'lg',
            /*
             resolve: {
             passed_data: function () {
             return pass_data;
             }
             },
             */
            scope: $scope
        });
    };
    $scope.displayAutoReturModal = function() {
        /*
         var pass_data = {
         item: item
         };
         */

        var modalInstance = $modal.open({
            templateUrl: 'modal_retur',
            controller: 'AutoReturModalCtrl',
            size: 'lg',
            /*
             resolve: {
             passed_data: function () {
             return pass_data;
             }
             },
             */
            scope: $scope
        });
    };

});
app.controller('CancelModalCtrl', function ($scope, $modalInstance, SweetAlert) {

    //var index = passed_data.index;
    $scope.saveModal = function(){
        SweetAlert.swal("Success!", "GR Telah Dibatalkan", "success");
        $modalInstance.dismiss('close');
    }
    $scope.closeModal = function () {
        $modalInstance.dismiss('close');
    };

});
app.controller('AutoReturModalCtrl', function ($scope, $modalInstance, SweetAlert) {

    //var index = passed_data.index;
    $scope.saveModal = function(){
        SweetAlert.swal("Success!", "GR Telah Dibatalkan", "success");
        $modalInstance.dismiss('close');
    }
    $scope.closeModal = function () {
        $modalInstance.dismiss('close');
    };

});