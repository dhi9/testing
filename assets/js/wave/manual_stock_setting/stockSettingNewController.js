app.controller('StockSettingNewController', function($scope, $modal, $state, ItemLookupService, ItemService, SiteService, InventoryService, SweetAlert, AttributeFactory) {
	$scope.itemList = ItemLookupService.getAllItems();
	$scope.attributeList = AttributeFactory.attributeList;
	AttributeFactory.getAttributeList().then(function(){
		$scope.attributeList = AttributeFactory.attributeList;
	});
	$scope.stockSetting = {};
	$scope.stockSetting.type = "VPS1";
	
	$scope.itemSettingList = [];
	
	$scope.addItemSetting = function() {
		var newItemSetting = {
			item_code:''
		};
		$scope.itemSettingList.push(newItemSetting);
	};
	$scope.addItemSetting();
	
	$scope.removeItemSetting = function(itemSetting) {
		$scope.itemSettingList.splice($scope.itemSettingList.indexOf(itemSetting), 1);
	};
	
	$scope.setItemCodeRequest = function(index, itemCode) {
		ItemService.getItemWithUomByItemCode(itemCode).success(function(data){
			if (data.call_status === "success") {
				$scope.itemSettingList[index] = data.item_details;
			}
		});
	};
	
	SiteService.getSiteList().success(function(data){
		$scope.siteList = data.site_list;
	});
	
	$scope.setStorage = function(){
		SiteService.getStorageListBySiteId($scope.stockSetting.site_id).success(function(data){
			$scope.storageList = data.storage_list;
		});
	};
	
	$scope.displayItemModal = function(index) {
		var pass_data = {
			index: index
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'item_modal',
			controller: 'ItemModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};
	
	$scope.displayBinModal = function(index, item) {
		var pass_data = {
			index: index,
			item: item,
			storage_id: $scope.stockSetting.storage_id
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'bin_modal',
			controller: 'BinModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	}
	
	$scope.isStockSettingValid = function (){
		var valid = false;
		var stockSetting = $scope.stockSetting;
		if (stockSetting.posting_date !== undefined && stockSetting.posting_name !== undefined && stockSetting.site_id !== undefined && stockSetting.storage_id !== undefined) {
			valid = true;
		}
		return valid;
	}
	
	$scope.isStockSettingItemsValid = function (){
		var valid = false;
		var stockSettingItems = $scope.itemSettingList;
		for (var i = 0; i < stockSettingItems.length; i += 1) {
			//if (stockSettingItems[i].item_code !== undefined && stockSettingItems[i].quantity !== undefined && stockSettingItems[i].item_uom !== undefined  ) {
			if (stockSettingItems[i].item_code !== undefined && stockSettingItems[i].quantity !== undefined ) {
				valid = true;
			}
		}
		return valid;
	}
	
	$scope.submit = function() {
		
		if ($scope.isStockSettingValid() && $scope.isStockSettingItemsValid()) {
			for(var i = 0; i < $scope.itemSettingList.length; i++){
				delete $scope.itemSettingList[i].uom_list;
				$scope.itemSettingList[i].attributes = {};
				for(var j = 0; j < $scope.attributeList.length; j+=1){
					var attribValue = $scope.itemSettingList[i][$scope.attributeList[j].attribute_name];
					$scope.itemSettingList[i].attributes[$scope.attributeList[j].attribute_name] = attribValue;
				}
				$scope.itemSettingList[i].attributes = JSON.stringify($scope.itemSettingList[i].attributes);
			}
			
			$scope.stockSetting.posting_date = new Date(moment($scope.stockSetting.posting_date).format("YYYY-MM-DD"));
			
			var data = {
				stock_setting: $scope.stockSetting,
				stock_setting_items: $scope.itemSettingList,
			};
			
			InventoryService.insertStockSetting(data).success(function(data){
				if (data.call_status == 'success') {
						SweetAlert.swal({
							title: "Success",
							text: "Manual Stock Berhasil Disimpan dengan No. Dokumen " + data.reference,
							type: "success",
							animation: "slide-from-top"
						});
						$state.go("app.inventory.manual_stock_setting");
					}
			});
		}else{
			SweetAlert.swal({
				title: "Perhatian",
				text: "Detail Stock Setting atau Detail Item tidak boleh kosong",
				type: "warning",
				animation: "slide-from-top"
			});
		}
		
		
	}
});

app.controller('ItemModalCtrl', function ($scope, $modalInstance, passed_data, ngTableParams, $filter) {
	$scope.filter = {};
	$scope.filter.$ = '';
	
	var index = passed_data.index;
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		}, 
		{
			total: $scope.itemList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.itemList, $scope.filter); 
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentPage = null;
	$scope.$watch("filter.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.filter.$.length > 0) {
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
	
	$scope.setItemCode = function(itemCode) {
		$scope.setItemCodeRequest(index, itemCode);
		
		$modalInstance.dismiss('close');
	}
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
});

app.controller('BinModalCtrl', function ($scope, $modalInstance, $filter, SiteService, passed_data) {
	SiteService.getBinListByItemCodeStorageId(passed_data.item.item_code, passed_data.storage_id).success(function(data){
		$scope.binList = data.bin_list;
		
		for(var i = 0; i < $scope.binList.length; i++){
			$scope.binList[i].uom = passed_data.item.item_unit;
		}
	});
	
	$scope.setBin = function(bin) {
		$scope.itemSettingList[passed_data.index].bin_name = bin.bin_name;
		$scope.itemSettingList[passed_data.index].bin_id = bin.bin_id;
		
		$modalInstance.dismiss();
	}
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};
});