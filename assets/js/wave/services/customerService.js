app.service('CustomerService', function($http, apiUrl) {
	var url = apiUrl + "customerapi/";

    this.httpPostConfig = {
        headers: {
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };

    this.getUsersList = function() {
		return $http.get(url + 'get_users_list');
	};

    this.updateCustomer = function(customer) {
        return $http.post(url + 'update_customer', customer);
    };

    this.updateDeliveryAddress = function(deliveryAddress) {
        return $http.post(url + 'update_delivery_address', deliveryAddress);
    };

    this.insertCustomer = function(customer) {
        return $http.post(url + 'insert_customer', customer);
    };

    this.submitDeliveryAddress = function(deliveryAddress) {
        return $http.post(url + 'insert_delivery_address', deliveryAddress);
    };

    this.getCustomerById = function(customer_id) {
        return $http.get(url + 'get_customer/' + customer_id);
    };

    this.getDeliveryAddresses = function(customer_id) {
        return $http.get(url + 'get_delivery_addresses/' + customer_id);
    };

});
