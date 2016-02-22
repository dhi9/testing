app.controller('PurchaseDeliveryRequestDetailController', function($scope, $modal, PurchaseService, $stateParams, ItemService, SweetAlert, $state, ItemFactory, AttributeFactory ) {
	var deliveryRequestsId = $stateParams.requests_delivery_requests_id;

	$scope.deliveryRequests = [];
	$scope.deliveryItemList = [];
	$scope.deliveredItemList = [];
	$scope.newDeliveredItemList = [];
	$scope.deliveryItemRequestsList = [];
	$scope.siteList = [];
	$scope.storageList = [];
    $scope.binList = [];
    $scope.batchList = [];
    $scope.gr = {};
    $scope.gr.status = false;
	PurchaseService.getSiteList().success(function(data){
		if(data.call_status == "success"){
			$scope.siteList = data.site_list;
		}
	});
	PurchaseService.getStorageList().success(function(data){
		if(data.call_status == "success"){
			$scope.storageList = data.storage_list;
		}
	});
	PurchaseService.getBinList().success(function(data){
		if(data.call_status == "success"){
			$scope.binList = data.bin_list;
		}
	});
    PurchaseService.getBatchList().success(function(data){
        if(data.call_status == "success"){
            $scope.batchList = data.batch_list;
        }
    });
    $scope.attributeList = AttributeFactory.attributeList;
    AttributeFactory.getAttributeList().then(function(){
        $scope.attributeList = AttributeFactory.attributeList;
    });

	PurchaseService.getActiveDeliveryRequestsByDeliveryRequestsId(deliveryRequestsId).success(function(data){
		if(data.call_status == "success"){
			$scope.deliveryRequests = data.delivery_requests;
			$scope.deliveryRequests.status = data.delivery_requests[0].status;
			PurchaseService.getActiveItemRequestsByRequestsId($scope.deliveryRequests[0].requests_id).success(function(data){
				if(data.call_status == "success"){
					$scope.deliveryItemRequestsList = data.item_requests;
				}
			})
		}
	});
    $scope.getUom = function (index, itemCode){
        ItemService.getItemUomConversionListByItemCode(itemCode).success(function(data) {
            if (data.call_status == "success") {
                $scope.deliveryItemList[index].uom_list = data.conversion_list;
            }
        });
    }
	PurchaseService.getActiveDeliveryRequestsItemsByRequestsId(deliveryRequestsId).success(function(data){
		if (data.call_status == "success") {
			$scope.deliveryItemList = data.delivery_requests_items;
			PurchaseService.getDeliveredItemsListByDeliveryRequestsId(deliveryRequestsId).success(function(data){
				if (data.call_status == "success") {
					$scope.deliveredItemList = data.delivered_items_list;
					if($scope.deliveredItemList.length == 0) {
						$scope.addNewDeliveredItem();
					}
                    for(var i = 0; i < $scope.deliveredItemList.length; i += 1){
                        $scope.deliveredItemList[i].date_recieved = new Date($scope.deliveredItemList[i].date_recieved);
                        $scope.deliveredItemList[i].attributes = JSON.parse($scope.deliveredItemList[i].attributes);
                    }
				}
			});
            for(var i = 0; i < $scope.deliveryItemList.length; i += 1){
                $scope.getUom(i, $scope.deliveryItemList[i].item_code);
                $scope.deliveryItemList[i].attributes = JSON.parse($scope.deliveryItemList[i].attributes);
            }
		}
	});

	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	};

	$scope.removeItemRequest = function(item) {
		$scope.newDeliveredItemList.splice($scope.newDeliveredItemList.indexOf(item), 1);
	};

	$scope.lookupItemName = function(itemCode) {
		return ItemService.getItemName(itemCode);
	};
	
	$scope.setItemCodeRequest = function(index, item) {
        ItemService.getItemDeliveryByDeliveryItemId(item.purchase_delivery_request_item_id).success(function(data) {
            if (data.call_status === "success") {
                $scope.newDeliveredItemList[index].attributes = JSON.parse(data.item.attributes);
                $scope.newDeliveredItemList[index].item_code = data.item.item_code;
                ItemService.getItemUomConversionListByItemCode(data.item.item_code).success(function(data) {
                    if (data.call_status === "success") {
                        $scope.newDeliveredItemList[index].uom_list = data.conversion_list;
                        $scope.newDeliveredItemList[index].site_id = $scope.deliveryRequests[0].site_id;
                    }
                });
            }
        });
	}

	$scope.totalOrder = function (item){

		var total = 0;
		for(var i=0; i<$scope.deliveryItemRequestsList.length; i +=1){
            if($scope.deliveryItemRequestsList[i].item_code == item.item_code && $scope.deliveryItemRequestsList[i].item_unit == item.item_unit){
                total += $scope.deliveryItemRequestsList[i].quantity;
            }
		}
		return parseInt(total);
	};

    $scope.lookupItemBatch = function(batch_id) {
        for(var i = 0; i < $scope.batchList.length; i += 1){
            if(batch_id == $scope.batchList[i].batch_id){
                return $scope.batchList[i].batch_reference;
            }
        }
    };

    $scope.lookupItemSite = function(site_id) {
        for(var i = 0; i < $scope.siteList.length; i += 1){
            if(site_id == $scope.siteList[i].site_id){
                return $scope.siteList[i].site_name;
            }
        }
    };

    $scope.lookupItemStorage = function(storage_id) {
        for(var i = 0; i < $scope.storageList.length; i += 1){
            if(storage_id == $scope.storageList[i].storage_id){
                return $scope.storageList[i].storage_name;
            }
        }
    };

    $scope.lookupItemBin = function(bin_id) {
        for(var i = 0; i < $scope.binList.length; i += 1){
            if(bin_id == $scope.binList[i].bin_id){
                return $scope.binList[i].bin_name;
            }
        }
    };

    $scope.changeDateFormat = function(date) {
		return Date(date);
	};

	$scope.addNewDeliveredItem = function(){
		var date = new Date();
		var newDeliveryRequest = {
			requests_delivery_request_id: deliveryRequestsId,
			item_code_list: $scope.deliveryItemList,
			item_code: '',
			quantity: '',
			date_recieved: new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),	date.getHours(),date.getMinutes())),
			new_item: 'TRUE',
		};
		$scope.newDeliveredItemList.push(newDeliveryRequest);
	};

    $scope.updateCompletedDeliveryRequest = function(){
        PurchaseService.updateCompletedDeliveryRequest(deliveryRequestsId).success(function(data){
            if(data.call_status){
                $scope.isPurchaseRequestsComplete();
            }
        });
    }
		
		$scope.insertDeliveredItems = function(newDeliveredItemList){
			PurchaseService.insertDeliveredItems(newDeliveredItemList).success(function(data){
				if(data.call_status == "success"){
					SweetAlert.swal("Success!", "Berhasil.", "success");
					for(var j = 0; j<data.gr.length; j += 1){
						$scope.deliveredItemList.push(data.gr[j]);
					}
					for(var k = 0; k<newDeliveredItemList.length; k += 1){
					}
					$scope.newDeliveredItemList=[];
				}
			});
		}
		
    $scope.isPurchaseRequestsComplete = function(){
        PurchaseService.isPurchaseRequestsComplete($scope.deliveryRequests[0].requests_id).success(function(data){});
    };

    $scope.isDeliveredItemRequestsValid = function(){
        var deliveredItems = $scope.newDeliveredItemList;
        var validity = true;
				angular.forEach(deliveredItems, function(deliveredItem) {
            if(
                deliveredItem.site_id !== undefined &&
                deliveredItem.storage_id !== undefined &&
                deliveredItem.item_code !== "" &&
                deliveredItem.quantity !== "" &&
                deliveredItem.item_unit !== undefined){

                validity = true;
            }
            else {
                validity = false;
            }
        });
        return validity;
    };

    $scope.checkGRBeforeSave = function(){
        var reviewedItem = [];
        var delivered_quantity = {};
        for (var i = 0; i < $scope.deliveryItemList.length; i += 1){
            $scope.deliveryItemList[i].received_quantity = 0;
            delivered_quantity[$scope.deliveryItemList[i].item_code] = 0;
            for (var j = 0; j < $scope.newDeliveredItemList.length; j += 1){
                if($scope.deliveryItemList[i].item_code == $scope.newDeliveredItemList[j].item_code){
                    for(var l = 0; l < $scope.newDeliveredItemList[j].uom_list.length; l += 1){
                        if($scope.newDeliveredItemList[j].uom_list[l].alternative_uom == $scope.newDeliveredItemList[j].item_unit ){
                            $scope.deliveryItemList[i].received_quantity += $scope.newDeliveredItemList[j].uom_list[l].base_amount *  parseInt($scope.newDeliveredItemList[j].quantity);
                            }
                    }
                }
            }
            for(var k = 0;k < $scope.deliveredItemList.length; k += 1){
                if($scope.deliveryItemList[i].item_code == $scope.deliveredItemList[k].item_code ){
                    //$scope.deliveryItemList[i].received_quantity += parseInt($scope.deliveredItemList[k].quantity);
                    delivered_quantity[$scope.deliveryItemList[i].item_code] += parseInt($scope.deliveredItemList[k].quantity);
                }
            }
        }

        for (var m = 0; m < $scope.deliveryItemList.length; m += 1){
            for(var n = 0; n < $scope.deliveryItemList[m].uom_list.length; n += 1){
                if($scope.deliveryItemList[m].uom_list[n].alternative_uom == $scope.deliveryItemList[m].item_unit ){
                    $scope.deliveryItemList[m].aktual_quantity = parseInt($scope.deliveryItemList[m].uom_list[n].base_amount) *  parseInt($scope.deliveryItemList[m].quantity);
                }
            }
            var quantity = parseInt($scope.deliveryItemList[m].aktual_quantity);
            var received_quantity = parseInt($scope.deliveryItemList[m].received_quantity);
            var delivered = parseInt(delivered_quantity[$scope.deliveryItemList[m].item_code]);
            received_quantity = received_quantity + delivered;
            delivered_quantity[$scope.deliveryItemList[m].item_code] = 0;
            if(received_quantity < quantity){
                $scope.deliveryItemList[m].remain_quantity = quantity - received_quantity;
                reviewedItem.push($scope.deliveryItemList[m]);
            }else if(quantity == received_quantity){
                //reviewedItem.push($scope.deliveryItemList[m]);
            }
        }
        return reviewedItem;
    }
    $scope.check = function(){
        var item = $scope.checkGRBeforeSave();
        var num = false;
        if(item.length > 0){
            $scope.displayBeforeGRModal(item);
            num = false;
        }else{
            num = true;
        }
        return num;
    }

    $scope.saveGR = function (){
        var valid = $scope.isDeliveredItemRequestsValid();
        if(valid){
            if($scope.gr.status == true){
                var status = $scope.check();
                if(status){
                    $scope.displayAfterGRModal();
                    $scope.updateCompletedDeliveryRequest();
                    $scope.deliveryRequests.status = "C";
					
                    var data = $scope.newDeliveredItemList ;
                    $scope.insertDeliveredItems(data);
					
                    PurchaseService.getBatchList().success(function(data){
                        if(data.call_status == "success"){
                            $scope.batchList = data.batch_list;
                        }
                    });
                }
            }else{
                var data = $scope.newDeliveredItemList ;
                $scope.insertDeliveredItems(data);
			
            }
        }else{
            SweetAlert.swal({
                title: "Perhatian!",
                text: "Item, Batch, dan Lokasi tidak boleh kosong",
                type: "warning",
                //confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                closeOnConfirm: true,
                animation: "slide-from-top"
            });
        }
    }

    $scope.checkDeliveredItemBeforeSaving = function(newDeliveredItemList){
        var valid = $scope.isDeliveredItemRequestsValid();
        if(valid){
            var over = false;
            var same = false;
            for (var i = 0; i < $scope.deliveryItemList.length; i += 1){
                for (var j = 0; j < newDeliveredItemList.length; j += 1){
                    if($scope.deliveryItemList[i].item_code == newDeliveredItemList[j].item_code){
                        $scope.deliveryItemList[i].received_quantity += parseInt(newDeliveredItemList[j].quantity);
                    }
                }
                for(var k = 0;k < $scope.deliveredItemList.length; k += 1){
                    if($scope.deliveryItemList[i].item_code == $scope.deliveredItemList[k].item_code){
                        $scope.deliveryItemList[i].received_quantity += parseInt($scope.deliveredItemList[k].quantity);
                    }
                }
            }
            for (var i = 0; i < $scope.deliveryItemList.length; i += 1){
                var quantity = parseInt($scope.deliveryItemList[i].quantity);
                var received_quantity = parseInt($scope.deliveryItemList[i].received_quantity);
                if(quantity < received_quantity){
                    over = true;
                }else if(quantity == received_quantity){
                    var same = true;
                }
            }

            if(over){
                SweetAlert.swal({
                        title: "Total Received Melebihi Total Purchase",
                        text: "Data tidak dapat diubah setelah diproses!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Kembali, Revisi Good Recieve!",
                        cancelButtonText: "Lanjutkan!",
                        closeOnConfirm: true,
                        closeOnCancel: false,
                        animation: "slide-from-top" },
                    function(isConfirm){
                        if (isConfirm) {

                        }else{
                            SweetAlert.swal({
                                    title: "Good Received Selesai ?",
                                    text: "Data tidak dapat diubah setelah diproses!",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Selesai!",
                                    cancelButtonText: "Belum Selesai!",
                                    closeOnConfirm: false,
                                    closeOnCancel: false,
                                    animation: "slide-from-top" },
                                function(isConfirm){
                                    if (isConfirm) {
                                        $scope.updateCompletedDeliveryRequest();
                                        $scope.deliveryRequests.status = "C";
                                        var data = newDeliveredItemList ;
                                        $scope.insertDeliveredItems(data);
                                    }else{
                                        var data = newDeliveredItemList ;
                                        $scope.insertDeliveredItems(data);
                                    }
                                });
                        }
                    });
            }else if(same){
                SweetAlert.swal({
                        title: "Good Received Selesai ?",
                        text: "Data tidak dapat diubah setelah di proses!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Selesai!",
                        cancelButtonText: "Belum Selesai!",
                        closeOnConfirm: false,
                        closeOnCancel: false,
                        animation: "slide-from-top" },
                    function(isConfirm){
                        if (isConfirm) {
                            $scope.updateCompletedDeliveryRequest();
                            $scope.deliveryRequests.status = "C";
                            var data = newDeliveredItemList ;
                            $scope.insertDeliveredItems(data);
                        }else{
                            var data = newDeliveredItemList ;
                            $scope.insertDeliveredItems(data);
                        }
                    });
            }else{
                var data = newDeliveredItemList ;
                $scope.insertDeliveredItems(data);
            }
        }else{
            SweetAlert.swal({
                title: "Perhatian!",
                text: "Item, Batch, dan Lokasi tidak boleh kosong",
                type: "warning",
                //confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ok",
                closeOnConfirm: true,
                animation: "slide-from-top"
            });
        }


	}

	$scope.displayBatchModal = function(item) {
		var pass_data = {
			item: item
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_batch',
			controller: 'BatchModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};
	
	$scope.displayLocationModal = function(item) {
		var pass_data = {
			item: item
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_location',
			controller: 'LocationModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};
	
	$scope.displayRemarkModal = function(item) {
		var pass_data = {
			item: item
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_remark',
			controller: 'RemarkModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	}

    $scope.displayAfterGRModal = function() {
        var pass_data = {
            item: $scope.deliveredItemList
        };

        var modalInstance = $modal.open({
            templateUrl: 'modal_after_gr',
            controller: 'AfterGRModalCtrl',
            size: 'lg',
            resolve: {
                passed_data: function () {
                    return pass_data;
                }
            },
            scope: $scope
        });
    }

    $scope.displayBeforeGRModal = function(item) {
        var pass_data = {
            item: item
        };

        var modalInstance = $modal.open({
            templateUrl: 'modal_before_gr',
            controller: 'BeforeGRModalCtrl',
            size: 'lg',
            resolve: {
                passed_data: function () {
                    return pass_data;
                }
            },
            scope: $scope
        });
    }
});

app.controller('BatchModalCtrl', function ($filter, $scope, $modalInstance, PurchaseService, passed_data, SweetAlert) {
    $scope.batch = passed_data.item;
    $scope.searchBatchById = function(id) {
        if (id !== null) {
            var found = $filter('filter')($scope.batchList, {batch_id: id}, true);
            if (found.length) {
                $scope.batch.batch_reference = found[0].batch_reference;
                $scope.batch.production_date = new Date(found[0].production_date);
                $scope.batch.expired_date = new Date(found[0].expired_date);
            }
        }
    };

    $scope.searchBatchById($scope.batch.batch_id);

    $scope.saveBatch = function(data){
        if(data.new_item == "TRUE"){
            $scope.closeModal();
        }else{
            PurchaseService.updateBatchDeliveredRequestItem(data).success(function(data){
                if(data.call_status == "success"){
                    $scope.closeModal();
                    SweetAlert.swal("Success!", "Berhasil.", "success");
                }
            });
        }
    };

    $scope.closeModal = function () {
		$modalInstance.dismiss();
	};

});

app.controller('LocationModalCtrl', function ($scope, $modalInstance, PurchaseService, passed_data, SweetAlert) {
    $scope.locations = passed_data.item;

    $scope.saveLocation = function(data){
        if(data.new_item == "TRUE"){
            $scope.closeModal();
        }else{
            PurchaseService.updateLocationsDeliveredRequestItem(data).success(function(data){
                if(data.call_status == "success"){
                    $scope.closeModal();
                    SweetAlert.swal("Success!", "Berhasil.", "success");
                }
            });
        }
    };

    $scope.closeModal = function () {
        $modalInstance.dismiss();
    };
});

app.controller('AfterGRModalCtrl', function ($scope, $modalInstance, PurchaseService, passed_data, SweetAlert) {
    $scope.deliveredItemList = passed_data.item;

    $scope.openStockCard = function (requests_delivery_request_id){
        PurchaseService.createStockCard(requests_delivery_request_id).success(function(){});
    }
    $scope.openGR = function (){
        PurchaseService.createGRReport().success(function(){});
    }
    $scope.saveLocation = function(data){
        if(data.new_item == "TRUE"){
            $scope.closeModal();
        }else{
            PurchaseService.updateLocationsDeliveredRequestItem(data).success(function(data){
                if(data.call_status == "success"){
                    $scope.closeModal();
                    SweetAlert.swal("Success!", "Berhasil.", "success");
                }
            });
        }
    };

    $scope.closeModal = function () {
        $modalInstance.dismiss();
    };
});

app.controller('BeforeGRModalCtrl', function ($scope, $modalInstance, PurchaseService, passed_data, SweetAlert) {
    $scope.beforeGRItemList = passed_data.item;

    for(var i = 0; i < $scope.beforeGRItemList.length; i += 1){
        for(var j = 0; j < $scope.beforeGRItemList[i].uom_list.length; j += 1){
            if($scope.beforeGRItemList[i].item_unit == $scope.beforeGRItemList[i].uom_list[j].alternative_uom){
                $scope.beforeGRItemList[i].base_unit = $scope.beforeGRItemList[i].uom_list[j].base_uom
            }
        }
    }
    $scope.openStockCard = function (requests_delivery_request_id){
        PurchaseService.createStockCard(requests_delivery_request_id).success(function(){});
    }
    $scope.openGR = function (){
        PurchaseService.createGRReport().success(function(){});
    }
    $scope.saveLocation = function(){
        $modalInstance.dismiss();
        $scope.displayAfterGRModal();
        $scope.updateCompletedDeliveryRequest();
        $scope.deliveryRequests.status = "C";
        var data = $scope.newDeliveredItemList ;
        $scope.insertDeliveredItems(data);
        PurchaseService.getBatchList().success(function(data){
            if(data.call_status == "success"){
                $scope.batchList = data.batch_list;
            }
        });
    };

    $scope.closeModal = function () {
        $modalInstance.dismiss();
    };
});

app.controller('RemarkModalCtrl', function ($scope, $modalInstance, PurchaseService, passed_data, SweetAlert, ItemFactory) {
	$scope.remark = passed_data.item;
    var itemCode = $scope.remark.item_code
	$scope.saveRemark = function(data){
		if(data.new_item == "TRUE"){
			$scope.closeModal();
		}else{
			PurchaseService.updateRemarkDeliveredRequestItem(data).success(function(data){
				if(data.call_status == "success"){
					$scope.closeModal();
					SweetAlert.swal("Success!", "Berhasil.", "success");
				}
			});
		}
	};


    $scope.tagList = ItemFactory.tagList;
    ItemFactory.getTagList().then(function(){
        $scope.tagList = ItemFactory.tagList;
    });
    $scope.itemTagList = ItemFactory.itemTagList;
    ItemFactory.getItemTagList(itemCode).then(function(){
        $scope.itemTagList = ItemFactory.itemTagList;
    });
    $scope.addItemTag = function(add_tag_input){
        ItemFactory.insertItemTag(add_tag_input, itemCode).then(function(){
            ItemFactory.getItemTagList(itemCode).then(function(){
                $scope.itemTagList = ItemFactory.itemTagList;
            });
        });
    };

    $scope.removeItemTag = function(tag){
        SweetAlert.swal({
            title: "Perhatian!",
            text: "Anda yakin akan menghapus tag ini?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: " Yes ",
            closeOnConfirm: false,
            closeOnCancel: true,
            animation: "slide-from-top"
        }, function(isConfirm){
            if (isConfirm) {
                ItemFactory.removeItemTag(tag);
                ItemFactory.getItemTagList(itemCode).then(function(){
                    $scope.itemTagList = ItemFactory.itemTagList;
                });
            }
        });
    };

	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};

});
