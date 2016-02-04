app.factory('CustomerFactory', function ($http, apiUrl, SweetAlert) {
	var url = apiUrl + 'customerapi/';
	var self = {};
	
	self.customer = {};
	self.customerList = [];
	self.customerConsignment = [];
	self.customerConsignmentList = [];
	self.deliveryAddress = {};
	self.deliveryAddressList = [];
	self.customerCombinedItemList = [];
	self.historyList = [];

	self.addDeliveryAddress = function(address){
		address.status = 'A';
		self.deliveryAddressList.push(address);
	}
	
	self.changeDeliveryAddress = function(address){
		var index = self.deliveryAddressList.indexOf(address);
		self.deliveryAddressList[index] = address;
	}
	
	self.getCustomerById = function (Id) {
    return $http.get(url + 'get_customer/' + Id)
			.success(function (data) {
				if (data.call_status == 'success') {
					self.customer = data.customer_details;
					self.customerConsignment = data.customer_list;
					self.deliveryAddressList = data.delivery_address_list;
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
    };

    self.getCustomerList = function () {
        return $http.get(url + 'get_all_customers')
            .success(function (data) {
                if (data.call_status == 'success') {
                    self.customerList = data.customer_details_list;
                }
            })
            .error(function () {
                //NotificationFactory.showError();
            });
    };
	self.getCustomerConsignmentList = function () {
        return $http.get(url + 'get_customer_consignment_list')
            .success(function (data) {
                if (data.call_status == 'success') {
                    self.customerConsignmentList = data.customer_list;
                }
            })
            .error(function () {
                //NotificationFactory.showError();
            });
    };
	self.getCustomerCombinedItemList = function (customerId) {
		return $http.get(url + 'get_customer_combined_item_list/' + customerId)
			.success(function (data) {
				if (data.call_status == 'success') {
					self.customerCombinedItemList = data.customer_combined_item_list;
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	};

	self.insertCustomer = function () {
		var insertData = {
			customer: self.customer,
			delivery_address_list: self.deliveryAddressList
		};
		
		return $http.post(url + 'insert_customer', insertData)
			.success(function (data) {
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Success",
						text: "Customer "+ insertData.customer.customer_name +" berhasil disimpan dengan ID " + data.customer_reference,
						type: "success",
						animation: "slide-from-top"
					});
					
					self.customer = {};
				}
				else {
					if (data.error_code == "701") {
						SweetAlert.swal({
							title: "Perhatian!",
							text: "Harap login kembali",
							type: "error",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						},
						function() {
							$state.go('app.login');
						});
					}
					else {
						SweetAlert.swal({
							title: "Error",
							text: data.error_message,
							type: "error",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	};
	
	self.removeDeliveryAddress = function(address){
		var index = self.deliveryAddressList.indexOf(address);
		self.deliveryAddressList.splice(index, 1); 
	}
	
	self.updateCustomer = function () {
		var updateData = {
			customer: self.customer,
			delivery_address_list: self.deliveryAddressList
		};
		
		return $http.post(url + 'update_customer', updateData)
			.success(function (data) {
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Success",
						text: "Customer "+ updateData.customer.customer_name +" berhasil diubah",
						type: "success",
						animation: "slide-from-top"
					});
				}
				else {
					if (data.error_code == "701") {
						SweetAlert.swal({
							title: "Perhatian!",
							text: "Harap login kembali",
							type: "error",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						},
						function() {
							$state.go('app.login');
						});
					}
					else {
						SweetAlert.swal({
							title: "Error",
							text: data.error_message,
							type: "error",
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	};
	
	self.updateCustomerPayment = function(updateData){
		return $http.post(url + 'update_customer_payment', updateData)
			.success(function (data) {
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Success",
						text: "Customer payment "+ updateData.customer_name +" berhasil diubah",
						type: "success",
						animation: "slide-from-top"
					});
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	}
	
	self.updateCustomerCommission = function(updateData){
		return $http.post(url + 'update_customer_commission', updateData)
			.success(function (data) {
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Success",
						text: "Customer commission "+ updateData.customer_name +" berhasil diubah",
						type: "success",
						animation: "slide-from-top"
					});
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	}
	
	self.updateCustomerConsignment = function(updateData){
		return $http.post(url + 'update_customer_consignment', updateData)
			.success(function (data) {
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Success",
						text: "Customer consignment "+ updateData.customer_name +" berhasil diubah",
						type: "success",
						animation: "slide-from-top"
					});
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	}
	
	self.clear = function(){
		self.customer = {};
		self.customerList = [];
		self.deliveryAddress = {};
		self.deliveryAddressList = [];
	}
	
	self.getCustomerHistoryListByCustomerId = function(customerId){
		return $http.get(url + 'get_customer_history_list_by_customer_id/' + customerId)
			.success(function (data) {
				if (data.call_status == 'success') {
					self.historyList = data.history_list;
					
					for(var i = 0; i < self.historyList.length; i++)
					{
						self.historyList[i].datetime = new Date(self.historyList[i].datetime);
					}
				}
			});
	}
	
	return self;
});