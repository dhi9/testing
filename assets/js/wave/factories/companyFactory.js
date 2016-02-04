app.factory('CompanyFactory', function ($http, apiUrl, SweetAlert) {
	var url = apiUrl + 'companyapi/';
	var self = {};
	
	self.company = {};
	self.companyNew = false;

	
	self.getCompanyDetail = function () {
    return $http.get(url + 'get_company')
			.success(function (data) {
			   	if (data.call_status == 'success') {
					self.company = data.company;
					if(data.company.company_id == 0 || data.company.company_id == undefined || data.company.company_id == null){
						self.companyNew = true;
					}else{
						self.companyNew = false;
					}
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
	
	self.updateCompany = function(updateData){
		return $http.post(url + 'update_company', updateData)
			.success(function (data) {
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Success",
						//text: "Customer consignment "+ updateData.customer_name +" berhasil diubah",
						type: "success",
						animation: "slide-from-top"
					});
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	}

	self.insertCompany = function (companyData) {
		console.log(companyData);
		return $http.post(url + 'insert_company', companyData)
			.success(function (data) {
				if (data.call_status == 'success') {
					SweetAlert.swal({
						title: "Success",
						text: "Company berhasil diperbaharui",
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

    self.clear = function(){
        self.customer = {};
        self.customerList = [];
        self.deliveryAddress = {};
        self.deliveryAddressList = [];
    }
	
	return self;
});