app.controller('CustomerMasterListController', function($scope, $filter, $modal, ngTableParams, $state, CustomerFactory) {
	$scope.table_loading = true;

	$scope.customerList = CustomerFactory.customerList;
	
	$scope.search = {};
	$scope.search.$ = '';
	
	CustomerFactory.getCustomerList().then(function(){
		$scope.customerList = CustomerFactory.customerList;
				
		$scope.tableParams.total($scope.customerList.length);
		$scope.tableParams.reload();
		
		$scope.table_loading = false;
	});
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		}, 
		{
			total: $scope.customerList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.customerList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);

	var currentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (currentPage === null) {
				currentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (currentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(currentPage);
			}
			currentPage = null;
		}
	});

	$scope.statusLabel = function(status){
		if (status == 'A') {
			return 'Aktif';
		}
		else {
			return 'Non Aktif';
		}
	}

	$scope.consignmentLabel = function(consignment){
		if (consignment == '1') {
			return 'Y';
		}
		else {
			return 'N';
		}
	}

	$scope.paymentLabel = function(payment){
		if (payment.payment_term_type == 'C') {
			return 'Cash';
		}
		else {
			return payment.payment_term_value;
		}
	}

	$scope.displayPaymentModal = function(item) {
		var pass_data = {
			item: item
		};

		var modalInstance = $modal.open({
			templateUrl: 'payment_modal',
			controller: 'PaymentModalCtrl',
			size: 'md',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};
	
	$scope.displayConsginmentModal = function(item) {
		var pass_data = {
			item: item
		};

		var modalInstance = $modal.open({
			templateUrl: 'consignment_modal',
			controller: 'ConsignmentModalCtrl',
			size: 'md',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};
	
	$scope.displayMarketingModal = function(item) {
		var pass_data = {
			item: item
		};

		var modalInstance = $modal.open({
			templateUrl: 'marketing_modal',
			controller: 'MarketingModalCtrl',
			size: 'md',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};
	
});

app.controller('PaymentModalCtrl', function ($filter, $scope, $modalInstance, CustomerFactory, passed_data, SweetAlert) {
    $scope.customer = passed_data.item;
	$scope.customer.payment_term_value = parseInt($scope.customer.payment_term_value);
	$scope.customer.payment_term_credit_limit = parseInt($scope.customer.payment_term_credit_limit);
    $scope.savePayment = function(customerData){
		CustomerFactory.updateCustomerPayment(customerData).then(function(){
				 $modalInstance.dismiss();
			
		});
	}

    $scope.closeModal = function () {
		$modalInstance.dismiss();
	};

});
app.controller('ConsignmentModalCtrl', function ($filter, $scope, $modalInstance, CustomerFactory, SiteService, passed_data, SweetAlert) {
    $scope.customer = passed_data.item;
	$scope.customer.old_site_id = passed_data.item.site_id;
	if ($scope.customer.consignment == undefined || $scope.customer.consignment == null || $scope.customer.consignment == 0) {
		$scope.customer.consignment = false;
	}else{
		$scope.customer.consignment = true;
	}
	$scope.siteConsignmentList = [];
	$scope.tempConsignmentList = [];
    SiteService.getSiteConsignmentList().success(function(data){
		if(data.call_status == "success"){
			for(var i = 0; i<data.site_list.length; i+=1){
				$scope.siteConsignmentList.push(data.site_list[i]);
			}
			SiteService.getSiteConsignmentListByCustomerId($scope.customer.customer_id).success(function(result){
				if(data.call_status == "success"){
					for(var j = 0; j<result.site_list.length; j+=1){
						$scope.siteConsignmentList.push(result.site_list[j]);
					}
					console.log($scope.siteConsignmentList);
				}
			});
		}
	});
	$scope.saveConsignment = function(){
		CustomerFactory.updateCustomerConsignment($scope.customer).then(function(){
				 $modalInstance.dismiss();
			
		});
	}
    $scope.closeModal = function () {
		$modalInstance.dismiss();
	};

});
app.controller('MarketingModalCtrl', function ($filter, $scope, $modalInstance, CustomerFactory, passed_data, SweetAlert) {
    $scope.customer = passed_data.item;
	$scope.customer.commission_value = parseInt($scope.customer.commission_value);
	if ($scope.customer.commission == undefined || $scope.customer.commission == null || $scope.customer.commission == 0) {
		$scope.customer.commission = false;
		$scope.customer.commission_type = null;
	}else{
		$scope.customer.commission = true;
	}
	$scope.isCommissionFormValid = function(){
		var valid = true;
		if ($scope.customer.commission == true) {
			if ($scope.customer.commission_type == null || $scope.customer.commission_type == undefined || $scope.customer.commission_type == '') {
				valid = false;
			}
		}
		return valid;
	}
	$scope.saveCommission = function(customerData){
			CustomerFactory.updateCustomerCommission(customerData).then(function(){
				 $modalInstance.dismiss();
			
		});
	}
    

    $scope.closeModal = function () {
		$modalInstance.dismiss();
	};

});