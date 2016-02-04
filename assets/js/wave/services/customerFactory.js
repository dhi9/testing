app.factory('CustomerFactory', function($http, apiUrl) {
	var url = apiUrl + "customerapi/";

    var self = {};

    self.customerList=[];

    self.getAllCustomers = function(){
        return $http.get(url + 'get_all_customers').success(function(data){
            if (data.call_status === "success") {
                self.customerList = data.customer_details_list;
            }
        })
    };
    self.insertCustomer = function(customer){
        return $http.post(url + 'insert_customer', customer).success(function(data){
            if (data.call_status === "success") {

            }
        })
    };

    self.insertDeliveryAddress = function(deliveryAddress){
        return $http.post(url + 'insert_delivery_address', deliveryAddress).success(function(data){
            if (data.call_status === "success") {

            }
        })
    };

    return self

});
