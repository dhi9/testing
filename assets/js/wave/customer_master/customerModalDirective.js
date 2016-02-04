app.directive('customerModalDirective', function () {
    return {
        restrict: "E",
        transclude: true,
        templateUrl : 'assets/js/wave/customer_master/customer_modals.html',
    };
});