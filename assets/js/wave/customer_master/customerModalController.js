app.controller('customerModalController', function ($scope, $modalInstance, passed_data, CustomerFactory) {
    $scope.item = passed_data.item;
    $scope.modal_type = passed_data.modal_type;

    /* NEW CUSTOMER ADD */
    $scope.addDeliveryAddress = function(deliveryAddress) {
        CustomerFactory.addDeliveryAddress(deliveryAddress);
        $scope.closeModal();

    };

    /* NEW CUSTOMER EDIT */
    $scope.changeDeliveryAddress = function(deliveryAddress){
        CustomerFactory.changeDeliveryAddress(deliveryAddress);
        $scope.closeModal();
    };

    $scope.removeDeliveryAddress = function(deliveryAddress) {
        CustomerFactory.removeDeliveryAddress(deliveryAddress);
        $scope.closeModal();
    };

    $scope.closeModal = function () {
        $modalInstance.dismiss();
    };

});
