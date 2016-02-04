app.controller('BankMasterNewController', function($scope, $modal, $state, SweetAlert, BankFactory) {
	BankFactory.clean();
	
	$scope.bank = BankFactory.bank;
	
	$scope.insertBank = function () {
		BankFactory.insertBank().then(function(data){
			if(data.data.call_status == 'success'){
				$state.go('app.master.bank');
			}
		})
	};
});