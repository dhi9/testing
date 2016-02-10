app.controller('CustomerMasterEditController', function($scope, $rootScope, $state, $modal, $stateParams, CustomerFactory) {
	$scope.customer = CustomerFactory.customer;
	$scope.deliveryAddresses = CustomerFactory.deliveryAddressList;
	
	CustomerFactory.getCustomerById($stateParams.customer_id).then(function(){
		$scope.customer = CustomerFactory.customer;
		$scope.deliveryAddresses = CustomerFactory.deliveryAddressList;
	});
	
	$scope.updateCustomer = function() {
		CustomerFactory.updateCustomer().then(function(data){
			if (data.data.call_status == 'success') {
				$state.go('app.master.customer_list');
			}
		});
	};
	
	$scope.statusLabel = function(status){
		switch(status) {
			case 'X':
				return 'Non Aktif';
				break;
			case 'A':
				return 'Aktif';
				break;
			default:
				return '';
		}
	};
	
	$scope.displayNewCustomerModal = function() {
		$scope.deliveryAddress = {};
		
		var pass_data = {
            //item: item,
            modal_type:'detailCustomerAdd' // newCustomerAdd, newCustomerEdit, detailCustomerAdd, detailCustomerEdit
        };
        var modalInstance = $modal.open({
            template: '<customer-modal-directive></customer-modal-directive>',
            controller: 'customerModalController',
            size: 'lg',
            resolve: {
                passed_data: function () {
                    return pass_data;
                }
            },
            scope: $scope
        });
    };
	
	$scope.displayEditCustomerModal = function(item) {
        var pass_data = {
            item: item,
            modal_type:'detailCustomerEdit' // newCustomerAdd, newCustomerEdit, detailCustomerAdd, detailCustomerEdit
        };

        var modalInstance = $modal.open({
            template: '<customer-modal-directive></customer-modal-directive>',
            controller: 'customerModalController',
            size: 'lg',
            resolve: {
                passed_data: function () {
                    return pass_data;
                }
            },
            scope: $scope
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

app.controller('HistoryModalCtrl', function ($scope, $modalInstance, CustomerFactory) {
	CustomerFactory.getCustomerHistoryListByCustomerId($scope.customer.customer_id).then(function(){
		$scope.historyList = CustomerFactory.historyList;
	});
	
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});