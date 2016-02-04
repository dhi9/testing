app.controller('CustomerMasterNewController', function($scope, $modal, $state, CustomerFactory) {

    CustomerFactory.clear();

    $scope.customer = CustomerFactory.customer;
    $scope.customerDeliveryAddressList = CustomerFactory.deliveryAddressList;
    
    $scope.insertCustomer = function () {
        CustomerFactory.insertCustomer().then(function (data) {
            if (data.data.call_status == 'success') {
                $state.go('app.master.customer_list');
            }
        });
    }

    $scope.displayNewCustomerModal = function () {
        var pass_data = {
            //item: item,
            modal_type: 'newCustomerAdd' // newCustomerAdd, newCustomerEdit, detailCustomerAdd, detailCustomerEdit
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

    $scope.displayEditCustomerModal = function (item) {
        var pass_data = {
            item: item,
            modal_type: 'newCustomerEdit' // newCustomerAdd, newCustomerEdit, detailCustomerAdd, detailCustomerEdit
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
});