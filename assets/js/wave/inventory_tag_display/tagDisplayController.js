app.controller('TagDisplayController', function($scope, $filter, $modal, ngTableParams, $state, ItemFactory, SweetAlert) {
	$scope.table_loading = true;

	$scope.tagList = ItemFactory.tagListWithStock;
	
	$scope.search = {};
	$scope.search.$ = '';
	
	ItemFactory.getTagListWithStock().then(function(){
		$scope.tagList = ItemFactory.tagListWithStock;
		$scope.tableParams.total($scope.tagList.length);
		$scope.tableParams.reload();
		
		$scope.table_loading = false;
	});
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10 // count per page
		}, 
		{
			total: $scope.tagList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.tagList, $scope.search);
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
	
	$scope.displayEditTagModal = function(item) {
		var pass_data = {
			item: item
		};

		var modalInstance = $modal.open({
			templateUrl: 'edit_tag_modal',
			controller: 'EditTagModalCtrl',
			size: 'md',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	};
	
	$scope.displayNewTagModal = function() {

		var modalInstance = $modal.open({
			templateUrl: 'new_tag_modal',
			controller: 'NewTagModalCtrl',
			size: 'md',
			scope: $scope
		});
	};

    $scope.removeTag = function (tag) {
        SweetAlert.swal({
                title: "Perhatian",
                text: "Mohon konfirmasi untuk menghapus tag ini. Setelah dihapus, anda harus membuat ulang tag ini apabila diperlukan.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Hapus",
                cancelButtonText: "Batal",
                closeOnConfirm: false,
                closeOnCancel: true },
            function(isConfirm){
                if (isConfirm) {
                    tag.status = "X";
                    ItemFactory.removeTag(tag).then(function(){
                    });
                }
            });
    }
	
});

app.controller('EditTagModalCtrl', function ($filter, $scope, $modalInstance, ItemFactory, passed_data, SweetAlert) {
    $scope.tag = passed_data.item;

    $scope.updateTag = function(data){
        ItemFactory.updateTag(data).then(function(){
				 $modalInstance.dismiss();
			
		});
	};

    $scope.closeModal = function () {
		$modalInstance.dismiss();
	};

});
app.controller('NewTagModalCtrl', function ($filter, $scope, $state, $modalInstance, ItemFactory, SweetAlert) {
    $scope.tag = {};

	$scope.insertTag = function(){
        ItemFactory.insertTag($scope.tag).then(function(){
            $state.reload();
            $modalInstance.dismiss();
			
		});
	}
    $scope.closeModal = function () {
		$modalInstance.dismiss();
	};

});