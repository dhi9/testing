app.controller('UserMasterEditController', function($scope, $filter, $stateParams, $state, SweetAlert, UserService) {
	var tabActive =  $stateParams.tab;
	var username =  $stateParams.user;
	
	$scope.tab={
		"0":false,
		"1":false,
		"2":false,
		"3":false
	};
	
	UserService.getUserByUsername(username).success(function(data) {
		$scope.user = data.user;
		
		if ($scope.user.approval.po_max_usd !== null) {
			$scope.user.approval.po_max_usd = parseInt($scope.user.approval.po_max_usd);
		}else{$scope.user.approval.po_max_idr = 0}
		if ($scope.user.approval.po_max_idr !== null) {
			$scope.user.approval.po_max_idr = parseInt($scope.user.approval.po_max_idr);
		}else{$scope.user.approval.po_max_idr = 0}
		if ($scope.user.approval.po_max_eur !== null) {
			$scope.user.approval.po_max_eur = parseInt($scope.user.approval.po_max_eur);
		}else{$scope.user.approval.po_max_eur = 0}
		
		
		if ($scope.user.approval.so_max_usd !== null) {
			$scope.user.approval.so_max_usd = parseInt($scope.user.approval.so_max_usd);
		}else{$scope.user.approval.so_max_idr = 0}
		if ($scope.user.approval.so_max_idr !== null) {
			$scope.user.approval.so_max_idr = parseInt($scope.user.approval.so_max_idr);
		}else{$scope.user.approval.so_max_idr = 0}
		if ($scope.user.approval.so_max_eur !== null) {
			$scope.user.approval.so_max_eur = parseInt($scope.user.approval.so_max_eur);
		}else{$scope.user.approval.so_max_eur = 0}
		
		if ($scope.user.approval.so_max_discount !== null) {
			$scope.user.approval.so_max_discount = parseInt($scope.user.approval.so_max_discount);
		}else{$scope.user.approval.so_max_discount = 0}
		
		if ($scope.user.access == '[]' || $scope.user.access == '' || $scope.user.access == null || $scope.user.access == undefined) {
			$scope.user.access = {};
		}
		if ($scope.user.accept_po_cc == '1') {
			$scope.user.accept_po_cc = true
		}
		if ($scope.user.accept_so_cc == '1') {
			$scope.user.accept_so_cc = true
		}
		
	});
	
	$scope.tab[tabActive]=true;
	$scope.usersList = [];
	$scope.createNewUserPanel = false;
	$scope.newUser = {};
	
	$scope.search = {};
	$scope.search.$ = '';
	$scope.isApprovalvalid = function(){
		var poApproval =  true;
		var soApproval =  true;
		var soMaxDiscount =  true;
		var valid =  false;
		if ($scope.user.approval.po_approval == true) {
			if ($scope.user.approval.po_max_usd == null || $scope.user.approval.po_max_usd == '' || $scope.user.approval.po_max_usd == undefined ||
				$scope.user.approval.po_max_idr == null || $scope.user.approval.po_max_idr == '' || $scope.user.approval.po_max_idr == undefined ||
				$scope.user.approval.po_max_eur == null || $scope.user.approval.po_max_eur == '' || $scope.user.approval.po_max_eur == undefined ) {
					poApproval = false;
			}else{poApproval=true}
		}
		if ($scope.user.approval.so_approval == true) {
			if ($scope.user.approval.so_max_usd == null || $scope.user.approval.so_max_usd == '' || $scope.user.approval.so_max_usd == undefined ||
				$scope.user.approval.so_max_idr == null || $scope.user.approval.so_max_idr == '' || $scope.user.approval.so_max_idr == undefined ||
				$scope.user.approval.so_max_eur == null || $scope.user.approval.so_max_eur == '' || $scope.user.approval.so_max_eur == undefined ) {
					soApproval = false;
			}else{soApproval=true}
		}
		if($scope.user.approval.so_max_discount_approval == true){
			if ($scope.user.approval.so_max_discount == null || $scope.user.approval.so_max_discount == '' || $scope.user.approval.so_max_discount == undefined) {
				soMaxDiscount = false;
			}else{soMaxDiscount = true}
		}
		if (poApproval && soApproval && soMaxDiscount) {
			valid = true;
		}
		return valid;
	}
	$scope.isChangePasswordValid = function(){
		var valid = false;
		if ($scope.user.password !== undefined || $scope.user.password !== null || $scope.user.password !== '') {
			if ($scope.user.password == $scope.user.repeatPassword) {
				valid =  true;
			}else{
				valid = false;
			}
		}
		return valid;
	}
	$scope.updateUser = function() {
		if (!$scope.isApprovalvalid()) {
			SweetAlert.swal({
					title: "Perhatian",
					text: "Kolom Max tidak boleh kosong", 
					type: "warning", 
					animation: "slide-from-top"
				});
			$scope.tab['2']=true;
		}else if (!$scope.isChangePasswordValid()) {
			SweetAlert.swal({
				title: "Perhatian",
				text: "Password tidak sama",
				type: "warning",
				animation: "slide-from-top"
			});
			$scope.tab['3']=true;
		}else if ($scope.user.full_name == '' || $scope.user.full_name == null || $scope.user.full_name == undefined) {
			SweetAlert.swal({
				title: "Perhatian",
				text: "Kolom Full Name tidak boleh kosong",
				type: "warning",
				animation: "slide-from-top"
			});
			$scope.tab['0']=true;
		}else{
			UserService.updateUser($scope.user).success(function(data) {
				SweetAlert.swal({
					title: data.title,
					text: data.text, 
					type: data.call_status, 
					animation: "slide-from-top"
				});
				if (data.call_status == 'success') {
					$state.go('app.master.user');
				}
			});
		}
	}

	$scope.accessList=[
		{
			"label":"Dashboard",
			"code":"DASHBOARD"
		},
		{
			"label":"Sales Order",
			"code":""
		},
		{
			"label":"Buat Sales Order",
			"code":"BUATSALESORDER"
		},
		{
			"label":"Sales Order Troli",
			"code":"SALESORDERTROLI"
		},
		{
			"label":"Sales Order Aktif",
			"code":"SALESORDERAKTIF"
		},
		
		{
			"label":"Purchase Order",
			"code":""
		},
		{
			"label":"Purchase Discussion",
			"code":"PURCHASEDISCUSSION"
		},
		{
			"label":"Buat Purchase Request",
			"code":"BUATPURCHASEREQUEST"
		},
		{
			"label":"Buat Service Request",
			"code":"BUATSERVICEREQUEST"
		},
		/*{
			"label":"Buat Stock Transfer Order",
			"code":"BUATSTOCKTRANSFERORDER"
		},*/
		{
			"label":"Approve Request",
			"code":"APPROVEREQUEST"
		},
		{
			"label":"Order Aktif",
			"code":"ORDERAKTIF"
		},
		
		{
			"label":"Inventory",
			"code":""
		},
		{
			"label":"Tag Display",
			"code":"TAGDISPLAY"
		},
		{
			"label":"Stock Status",
			"code":"STOCKSTATUS"
		},
		{
			"label":"Stock Opname",
			"code":"STOCKOPNAME"
		},
		{
			"label":"Pengaturan Stock Manual",
			"code":"STOCKADJUSTMENT"
		},
		{
			"label":"Stock Display",
			"code":"STOCKDISPLAY"
		},
		
		{
			"label":"Pengiriman",
			"code":""
		},
		/*{
			"label":"Atur Dokumen",
			"code":"ATURDOKUMEN"
		},*/
		{
			"label":"Pengiriman Baru",
			"code":"PENGIRIMANBARU"
		},
		{
			"label":"Pengiriman Aktif",
			"code":"PENGIRIMANAKTIF"
		},
		{
			"label":"Credit Block",
			"code":"CREDITBLOCK"
		},
		
		{
			"label":"Report",
			"code":""
		},
		{
			"label":"Alur Dokumen",
			"code":"DOCUMENTFLOW"
		},
		{
			"label":"Laporan Stock",
			"code":"STOCKREPORT"
		},
		{
			"label":"Laporan Inventory",
			"code":"INVENTORYREPORT"
		},
		
		{
			"label":"Master Database",
			"code":""
		},
		{
			"label":"Attribute Master",
			"code":"ATTRIBUTEMASTER"
		},
		{
			"label":"Bank Master",
			"code":"BANKMASTER"
		},
		{
			"label":"Category Master",
			"code":"CATEGORYMASTER"
		},
		{
			"label":"Company Master",
			"code":"COMPANYMASTER"
		},
		{
			"label":"Customer Master",
			"code":"CUSTOMERMASTER"
		},
		{
			"label":"Site Master",
			"code":"SITEMASTER"
		},
		{
			"label":"Stock Master",
			"code":"STOCKMASTER"
		},
		{
			"label":"User Master",
			"code":"USERMASTER"
		},
		{
			"label":"Vendor Master",
			"code":"VENDORMASTER"
		},
	];
});