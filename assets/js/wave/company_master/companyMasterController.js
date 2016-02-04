app.controller('CompanyMasterController', function($scope, $modal, $state, SweetAlert, CompanyFactory) {
	$scope.company = CompanyFactory.company;
	$scope.companyNew = CompanyFactory.companyNew;
		CompanyFactory.getCompanyDetail().then(function(){
			$scope.company =  CompanyFactory.company;
			if ($scope.company.pkp == null || $scope.company.pkp == undefined || $scope.company.pkp == 0) {
				$scope.company.pkp = false;
			}else{
				$scope.company.pkp = true;
			}
			$scope.companyNew = CompanyFactory.companyNew;
		});
	$scope.submitCompany = function(){
		if ($scope.companyNew !== true) {
			CompanyFactory.updateCompany($scope.company);
			console.log($scope.company);
		}else{
			CompanyFactory.insertCompany($scope.company);
		}
	}
	$scope.copyCompanyAddress = function(){
		$scope.company.company_pos_name = $scope.company.company_name;
		$scope.company.company_pos_address = $scope.company.company_address;
		$scope.company.company_pos_city = $scope.company.company_city;
		$scope.company.company_pos_postcode = $scope.company.company_postcode;
		$scope.company.company_pos_phone_number = $scope.company.company_phone_number;
		$scope.company.company_pos_fax_number = $scope.company.company_fax_number;
	}
	// Editor options.
    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };

    // Called when the editor is completely ready.
    $scope.onReady = function () {
        // ...
    };
});

app.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return;

        ngModel.$render = function() {}

        element.bind('change', function(e) {
          var element = e.target;
          if(!element.value) return;

          element.disabled = true;
          $q.all(slice.call(element.files, 0).map(readFile))
            .then(function(values) {
              if (element.multiple) ngModel.$setViewValue(values);
              else ngModel.$setViewValue(values.length ? values[0] : null);
              element.value = null;
              element.disabled = false;
            });

          function readFile(file) {
            var deferred = $q.defer();

            var reader = new FileReader()
            reader.onload = function(e) {
              deferred.resolve(e.target.result);
            }
            reader.onerror = function(e) {
              deferred.reject(e);
            }
            reader.readAsDataURL(file);

            return deferred.promise;
          }

        }); //change

      } //link

    }; //return

  }) //appFilereader
;