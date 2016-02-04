app.controller('AttributeMasterNewController', function($scope, $modal, $state, SweetAlert, AttributeFactory) {
	$scope.attribute = AttributeFactory.newAttribute;
	$scope.attributeList = AttributeFactory.attributeList;
	
	AttributeFactory.getAttributeList().then(function(){
		$scope.attributeList = AttributeFactory.attributeList;
	});
	
	$scope.isAttributeExist = function(){
		var exist = false;
		for (var i = 0; i < $scope.attributeList.length; i += 1) {
			if (angular.lowercase($scope.attribute.attribute_name) == angular.lowercase($scope.attributeList[i].attribute_name)) {
				exist = true;
			}
		}
		return exist;
	}
	
	$scope.insertAttribute = function () {
		AttributeFactory.insertAttribute().then(function(data){
			if (data.data.call_status == 'success') {
				$state.go('app.master.attribute');
			}
		})
	};
});