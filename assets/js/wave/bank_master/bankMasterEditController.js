app.controller('BankMasterEditController', function($scope, $modal, $state, $stateParams, SweetAlert, BankFactory) {
	var bank_id = $stateParams.bank_id;
	
	$scope.bank = BankFactory.bank;
	
	BankFactory.getBankById(bank_id).then(function(){
		$scope.bank = BankFactory.bank;
	});
	
	$scope.updateBank = function () {
		BankFactory.updateBank().then(function(data){
			if (data.data.call_status == 'success') {
				$state.go('app.master.bank');
			}
		});
	};
	
	$scope.historyModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'history_modal',
			controller: 'HistoryModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};
});

app.controller('HistoryModalCtrl', function ($scope, $modalInstance, BankService) {
	BankService.getBankHistoryListByBankId($scope.bank.bank_id).success(function(data){
		if (data.call_status == 'success') {
			$scope.historyList = data.history_list;
			
			for(var i = 0; i < $scope.historyList.length; i++)
			{
				$scope.historyList[i].datetime = new Date($scope.historyList[i].datetime);
			}
		}
	});
	
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});