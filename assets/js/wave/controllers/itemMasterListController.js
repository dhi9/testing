app.controller('ItemMasterListController', function($scope, $filter, ApiCallService, ngTableParams, SweetAlert) {
	$scope.table_loading = false;

	$scope.itemList = [];
	$scope.item = {};
	$scope.search = {};
	$scope.search.$ = '';
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'item_code': 'asc'
			}
		}, 
		{
			total: $scope.itemList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.itemList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var itemCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (itemCurrentPage === null) {
				itemCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (itemCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(itemCurrentPage);
			}
			itemCurrentPage = null;
		}
	});
	
	$scope.insertItem = function(item) {
		$scope.loading = true;
		
		ApiCallService.insertItem(item).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Buat Item Baru Berhasil",
						text: "Item " + item.item_name + " berhasil disimpan.", 
						type: "success", 
						animation: "slide-from-top"
					});
					
					$scope.table_loading = true;
					ApiCallService.getAllItems().
						success(function(data, status, headers, config) {
							if (data.call_status === "success") {
								$scope.itemList = data.item_details_list;
								
								$scope.tableParams.total($scope.itemList.length);
								$scope.tableParams.reload();
							}
							else {
								console.log(data);
							}
							
							$scope.table_loading = false;
						}).
						error(function(data, status, headers, config) {
							console.log(data);
							console.log(status);
							console.log(header);
							console.log(config);
							
							$scope.table_loading = false;
						});
					
					$scope.item = {};
					$scope.loading = false;
				}
				else {
					SweetAlert.swal({
						title: "Buat Item Baru Gagal",
						text: data.error_message, 
						type: "error", 
						animation: "slide-from-top"
					});
					
					$scope.loading = false;
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}
	
	$scope.init = function() {
		$scope.table_loading = true;
	
		ApiCallService.getAllItems().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.itemList = data.item_details_list;
					
					$scope.tableParams.total($scope.itemList.length);
					$scope.tableParams.reload();
				}
				else {
					console.log(data);
				}
				
				$scope.table_loading = false;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
				
				$scope.table_loading = false;
			});
	
	};
	
	$scope.init();

});