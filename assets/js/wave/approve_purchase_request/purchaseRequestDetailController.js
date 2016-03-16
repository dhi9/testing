app.controller('PurchaseRequestDetailController', function($filter, $scope, $http, $modal, $stateParams, $rootScope, $state, PurchaseService, VendorService, WarehouseService, SweetAlert, AttributeFactory, SiteService, UserService) {
	var draftReference = $stateParams.reference;
	//var purchaseId = $stateParams.purchase_id;
	var draftId = 2;

	//$scope.username = $rootScope.username;
	
	$scope.approver = false;
	
	$scope.itemRequestList = [];
	$scope.edit=[];
	$scope.warehouse = {};
	$scope.warehouse.addresses = [];

    $scope.siteList = [];
    SiteService.getSiteList().success(function(data){
        if (data.call_status == "success") {
            $scope.siteList = data.site_list;
        }
    });

    $scope.attributeList = AttributeFactory.attributeList;
    AttributeFactory.getAttributeList().then(function(){
        $scope.attributeList = AttributeFactory.attributeList;
    });

    WarehouseService.getAddressList().success(function(data){
		if (data.call_status === "success") {
			$scope.warehouse.addresses = data.address_list;
		}
	});
	
	PurchaseService.getDraftByDraftReference(draftReference).success(function(data){
		if (data.call_status === "success") {
			$scope.draft = data.draft_purchase;
            $scope.purchase = JSON.parse(data.draft_purchase.draft_data);
			$scope.edit.sendEmail = $scope.purchase.send_email;
			$scope.currency = $scope.purchase.currency;
            $scope.itemRequestList = $scope.purchase.item_request_list;
			$scope.deliveryRequestList = $scope.purchase.delivery_request_list;

			UserService.getUserByUserId($scope.draft.draft_approver).success(function(data){
				$scope.draft.approver = data.user.username;
			});
            for(var i = 0; i < $scope.deliveryRequestList.length; i++){
                $scope.deliveryRequestList[i].date = new Date(moment($scope.deliveryRequestList[i].date));
            }

            /*for(var ji = 0; ji < $scope.itemRequestList.length; ji++){
                if($scope.itemRequestList[ji].attributes != null){
                    $scope.itemRequestList[ji].attributes = JSON.parse($scope.itemRequestList[ji].attributes);
                }
            }*/
			/*
            for (var j = 0; j < $scope.deliveryRequestList.length; j++) {
                for (var k = 0; k < $scope.deliveryRequestList[j].item_delivery_request_list.length; k++) {
                    $scope.deliveryRequestList[j].item_delivery_request_list[k].attributes = JSON.parse($scope.deliveryRequestList[j].item_delivery_request_list[k].attributes);
                }
            }
            */
            /*.getUserById($scope.draft.draft_approver).success(function(data){
                if (data.call_status === "success") {
                    $scope.username = data.user.username;
                }
            });*/
			
			VendorService.getVendorById($scope.purchase.supplier_id).success(function(data){
				if (data.call_status === "success") {
					$scope.supplier = data.vendor;
				}
			});
			var dataApprover = {
				draft_id : $scope.draft.draft_id,
                draft_approver : $scope.draft.draft_approver,
                currency : $scope.currency,
                type : "PO",
			}
			PurchaseService.isUserApprover(dataApprover).success(function(data){
			if (data.call_status === 'success') {
				$scope.approver = data.approver;
			}
		});
		}
	});
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	$scope.getDataDraft = function () {
		/*
        for(var ji = 0; ji < $scope.purchase.item_request_list.length; ji++){
            $scope.purchase.item_request_list[ji].attributes = JSON.stringify($scope.purchase.item_request_list[ji].attributes);
        }

        for (var j = 0; j < $scope.deliveryRequestList.length; j++) {
            for (var k = 0; k < $scope.deliveryRequestList[j].item_delivery_request_list.length; k++) {
                $scope.deliveryRequestList[j].item_delivery_request_list[k].attributes = JSON.stringify($scope.deliveryRequestList[j].item_delivery_request_list[k].attributes);
            }
        }
        */
        var dataDraft = {
			draft_reference: draftReference,
			supplier_id: $scope.purchase.supplier_id,
			supplier_email: $scope.purchase.supplier_email,
			requests_reference: $scope.draft.draft_reference,
			date_modified: $scope.getCurrentDateString(),
			currency: $scope.currency,
			draft: $scope.draft,
			draft_creator: $scope.draft.draft_creator,
			purchase: $scope.purchase,
			delivery_request_list: $scope.deliveryRequestList,
			item_request_list: $scope.purchase.item_request_list,
			send_email: $scope.edit.sendEmail
		};
		return dataDraft;
	}
	$scope.approveDraftPurchaseOrder = function() {
		$scope.approveButtonLoading = true;
		var data = $scope.getDataDraft();
		PurchaseService.approveDraftOrder(data).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal(data.draft_reference, "Telah disetujui", "success");
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
		var data = $scope.getDataDraft();
		PurchaseService.needChangedDraftOrder(data).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal( data.draft_reference, "Telah dikembalikan ke user untuk direvisi.", "success");
					$state.go('app.purchase.purchase_discussion');
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
		$scope.needChangedButtonLoading = true;
		PurchaseService.deleteDraftPurchaseOrder(draftReference).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal(data.draft_reference, "Telah dihapus.", "success");
					//$state.go('app.purchase.approve_purchase_request');
					//$scope.submitted_order_reference = data.order_reference;
					//$scope.is_order_saved = true;
				}
				else {
					SweetAlert.swal({
						title: "Gagal menghapus",
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