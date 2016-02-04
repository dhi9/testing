app.controller('ServiceRequestApprovedDetailController', function($filter, $scope, $http, $modal, $stateParams, $rootScope, PurchaseService, VendorService, WarehouseService, SweetAlert) {
	var draftReference = $stateParams.reference;
	//var purchaseId = $stateParams.purchase_id;
	var draftId = 2;
	
	//$scope.username = $rootScope.username;
	
	$scope.approver = false;
	
	$scope.itemRequestList = [];
	
	$scope.warehouse = {};
	$scope.warehouse.addresses = [];
	
	WarehouseService.getAddressList().success(function(data){
		if (data.call_status === "success") {
			$scope.warehouse.addresses = data.address_list;
		}
	});
	
	PurchaseService.getDraftByDraftReference(draftReference).success(function(data){
		if (data.call_status === "success") {
			$scope.draft = data.draft_purchase;
			$scope.purchase = JSON.parse(data.draft_purchase.draft_data);
			
			$scope.currency = $scope.purchase.currency;
			$scope.itemRequestList = $scope.purchase.item_request_list;
			$scope.deliveryRequestList = $scope.purchase.delivery_request_list;
			
			for(var i = 0; i < $scope.deliveryRequestList.length; i++){
				$scope.deliveryRequestList[i].date = new Date($scope.deliveryRequestList[i].date);
			}
						
			VendorService.getVendorById($scope.purchase.supplier_id).success(function(data){
				if (data.call_status === "success") {
					$scope.supplier = data.vendor;
				}
			});
			
			PurchaseService.isUserApprover($scope.draft.draft_id).success(function(data){
				if (data.call_status === 'success') {
					$scope.approver = data.approver;
				}
			});
			PurchaseService.getRequestsByDraftReference(draftReference).success(function(data){
			if (data.call_status === "success") {
					$scope.draft.approved = data.purchase;
				}
			});
		}
	});
	
	$scope.approveDraftPurchaseOrder = function() {
		$scope.approveButtonLoading = true;
		var data = {
			draft_reference: draftReference,
			supplier_id: $scope.supplier.vendor_id,
			purchase_reference: $scope.draft.draft_reference,
			date_created: $scope.draft.date_created,
			draft: $scope.draft,
			purchase: $scope.purchase,
			delivery_request_list: $scope.purchase.delivery_request_list,
			item_request_list: $scope.purchase.item_request_list
		};
		PurchaseService.approveDraftOrder(data).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal("Penyetujuan Draft Purchase Berhasil", "Order No. " + data.draft_reference + " sudah tersimpan dengan sukses.", "success");
					$scope.submitted_order_reference = data.order_reference;
					$scope.is_order_saved = true;
					
					$scope.draft.status = 'C';
					$state.go('app.purchase.approve_purchase_request');
				}
				else {
					SweetAlert.swal({
						title: "Submit Order Gagal",
						text: data.error_message, 
						type: "error", 
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
				
				$scope.approveButtonLoading = false;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
				
				$scope.approveButtonLoading = false;
		});
	};
	
	$scope.needChangedDraftPurchaseOrder = function() {
		$scope.needChangedButtonLoading = true;
		
		$scope.draft.draft_data = JSON.stringify($scope.order);
		ApiCallService.needChangedDraftOrder($scope.draft).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal("Perubahan Draft Order Berhasil", "Draft order berhasil diubah.", "success");
					//$scope.submitted_order_reference = data.order_reference;
					//$scope.is_order_saved = true;
					$scope.draft.status = 'U';
				}
				else {
					SweetAlert.swal({
						title: "Submit Order Gagal",
						text: data.error_message, 
						type: "error", 
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
				
				$scope.needChangedButtonLoading = false;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
				
				$scope.needChangedButtonLoading = false;
		});
	};
	
	$scope.deleteDraftPurchaseOrder = function() {
		$scope.draft.draft_data = JSON.stringify($scope.order);
		ApiCallService.deleteDraftOrder($scope.draft).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal("Penghapusan Draft Order Berhasil", "Draft order berhasil dihapus.", "success");
					$state.go('app.order.division_draft_order_list');
					//$scope.submitted_order_reference = data.order_reference;
					//$scope.is_order_saved = true;
				}
				else {
					SweetAlert.swal({
						title: "Submit Order Gagal",
						text: data.error_message, 
						type: "error", 
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
		});
	};
	
	$scope.sumTotal = function(){
		var sum = 0;
		for(var i = 0; i < $scope.itemRequestList.length; i++){
			var total = $scope.itemRequestList[i].quantity * $scope.itemRequestList[i].cost;
			sum += total;
		};
		
		return sum;
	};

});