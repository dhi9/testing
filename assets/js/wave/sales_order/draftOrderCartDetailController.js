app.controller('DraftOrderCartDetailController', function($scope, $state, $modal, $http, ItemLookupService, ApiCallService, CustomerService, CustomerFactory, SweetAlert, $state, $stateParams, AuthService, AttributeFactory) {
	var draft_id = $stateParams.draft_id;
	console.log(draft_id);
	$scope.itemLookupList = [];
    $scope.attributeList = AttributeFactory.attributeList;
	AttributeFactory.getAttributeList().then(function(){
		$scope.attributeList = AttributeFactory.attributeList;
	});

	$scope.order = {
			"customer_input_type": "E",
			"customer_id": null,
			"customer_details": {
				"customer_id": null,
				"customer_name": "",
				"pic_name": "",
				"address": "",
				"city": "",
				"postcode": "",
				"phone_number": "",
				"fax_number": "",
				"customer_email": ""
			},
			"order_details": {
				order_items: [{
					"item_code": "",
					"color": "",
					"quantity": "",
					"cost": 0,
					"disc_percent": 0,
                    "disc_value": 0,
					"remark":""
				}],
				"HLPFIELD_items_is_edit_mode": true
			},
			"delivery_request_details": [],
            "payment_type" : 'cash',
			"payment_detail": {},
            "order_type" : 'biasa',
			"product_type": ""
		};

	$scope.delivery = 'D';
	 $scope.tabs = [{
        title: 'cash',
        content: '/cash.html',
        active: false
    }, {
        title: 'transfer',
        content: '/transfer.html',
        active: false
    }, {
        title: 'debit',
        content: '/debit.html',
        active: false
    }, {
        title: 'credit',
        content: '/credit.html',
        active: false
    }, {
        title: 'term',
        content: '/term.html',
        active: false
    }, {
        title: 'konsinyasi',
        content: '/konsinyasi.html',
        active: false
    }];
	
	$scope.bankList = [{"No":1,"bank_code":"'002'","bank_name":"PT. BANK RAKYAT INDONESIA (PERSERO), Tbk"},
{"No":2,"bank_code":"'008'","bank_name":"PT. BANK MANDIRI (PERSERO), Tbk"},
{"No":3,"bank_code":"'009'","bank_name":"PT. BANK NEGARA INDONESIA (PERSERO),Tbk"},
{"No":4,"bank_code":"'011'","bank_name":"PT. BANK DANAMON INDONESIA, Tbk"},
{"No":5,"bank_code":"'013'","bank_name":"PT. BANK PERMATA, Tbk (d/h PT BANK BALI Tbk)"},
{"No":6,"bank_code":"'014'","bank_name":"PT. BANK CENTRAL ASIA, Tbk."},
{"No":7,"bank_code":"'016'","bank_name":"PT. BANK INTERNASIONAL INDONESIA, Tbk"},
{"No":8,"bank_code":"'019'","bank_name":"PT. PAN INDONESIA BANK, Tbk"},
{"No":9,"bank_code":"'022'","bank_name":"PT. BANK CIMB NIAGA, Tbk d/h NIAGA"},
{"No":10,"bank_code":"'023'","bank_name":"PT. BANK UOB INDONESIA TBK"},
{"No":11,"bank_code":"'028'","bank_name":"PT. BANK OCBC NISP, Tbk d/h PT BANK NISP TBK"},
{"No":12,"bank_code":"'031'","bank_name":"CITIBANK N.A."},
{"No":13,"bank_code":"'032'","bank_name":"JP MORGAN CHASE BANK, NA"},
{"No":14,"bank_code":"'033'","bank_name":"BANK OF AMERICA, N.A"},
{"No":15,"bank_code":"'036'","bank_name":"PT. BANK WINDU KENTJANA INTERNASIONAL TBK"},
{"No":16,"bank_code":"'037'","bank_name":"PT. BANK ARTA GRAHA INTERNASIONAL, Tbk"},
{"No":17,"bank_code":"'040'","bank_name":"THE BANGKOK BANK COMP, LTD"},
{"No":18,"bank_code":"'041'","bank_name":"THE HONGKONG & SHANGHAI B.C."},
{"No":19,"bank_code":"'042'","bank_name":"THE BANK OF TOKYO-MITSUBISHI UFJ, LTD"},
{"No":20,"bank_code":"'045'","bank_name":"PT. BANK SUMITOMO MITSUI INDONESIA"},
{"No":21,"bank_code":"'046'","bank_name":"PT. BANK DBS INDONESIA"},
{"No":22,"bank_code":"'047'","bank_name":"PT. BANK RESONA PERDANIA"},
{"No":23,"bank_code":"'048'","bank_name":"PT. BANK MIZUHO INDONESIA"},
{"No":24,"bank_code":"'050'","bank_name":"STANDARD CHARTERED BANK"},
{"No":25,"bank_code":"'052'","bank_name":"THE ROYAL BANK OF SCOTLAND NV D/H ABN AMRO BANK"},
{"No":26,"bank_code":"'054'","bank_name":"PT. BANK CAPITAL INDONESIA(d/h CREDIT LYONNAIS)"},
{"No":27,"bank_code":"'057'","bank_name":"PT. BANK BNP PARIBAS INDONESIA"},
{"No":28,"bank_code":"'059'","bank_name":"PT. KOREA EXCHANGE BANK DANAMON"},
{"No":29,"bank_code":"'061'","bank_name":"PT. BANK ANZ INDONESIA D/H ANZ PANIN BANK"},
{"No":30,"bank_code":"'067'","bank_name":"DEUTSCHE BANK AG."},
{"No":31,"bank_code":"'068'","bank_name":"PT. BANK WOORI INDONESIA"},
{"No":32,"bank_code":"'069'","bank_name":"BANK OF CHINA, LTD"},
{"No":33,"bank_code":"'076'","bank_name":"PT. BANK BUMI ARTA"},
{"No":34,"bank_code":"'087'","bank_name":"PT. BANK EKONOMI RAHARJA TBK"},
{"No":35,"bank_code":"'088'","bank_name":"PT. BANK ANTAR DAERAH"},
{"No":36,"bank_code":"'089'","bank_name":"PT. BANK RABOBANK INT IND d/h BANK HAGA"},
{"No":37,"bank_code":"'095'","bank_name":"PT. BANK MUTIARA, Tbk D/H PT BANK CENTURY TBK"},
{"No":38,"bank_code":"'097'","bank_name":"PT. BANK MAYAPADA INTERNASIONAL TBK"},
{"No":39,"bank_code":"'110'","bank_name":"PT. BPD JAWA BARAT DAN BANTEN"},
{"No":40,"bank_code":"'111'","bank_name":"PT. BANK DKI"},
{"No":41,"bank_code":"'112'","bank_name":"BPD YOGYAKARTA"},
{"No":42,"bank_code":"'113'","bank_name":"PT. BPD JAWA TENGAH"},
{"No":43,"bank_code":"'114'","bank_name":"PT. BPD JAWA TIMUR"},
{"No":44,"bank_code":"'115'","bank_name":"BPD JAMBI"},
{"No":45,"bank_code":"'116'","bank_name":"PT. BANK ACEH D/H BPD ACEH"},
{"No":46,"bank_code":"'117'","bank_name":"PT. BPD SUMATERA UTARA"},
{"No":47,"bank_code":"'118'","bank_name":"BPD SUMATERA BARAT"},
{"No":48,"bank_code":"'119'","bank_name":"PT. BPD RIAU"},
{"No":49,"bank_code":"'120'","bank_name":"PT. BPD SUMATERA SELATAN DAN BANGKA BELITUNG"},
{"No":50,"bank_code":"'121'","bank_name":"PT. BANK LAMPUNG"},
{"No":51,"bank_code":"'122'","bank_name":"PT. BPD KALIMANTAN SELATAN"},
{"No":52,"bank_code":"'123'","bank_name":"PT. BPD KALIMANTAN BARAT"},
{"No":53,"bank_code":"'124'","bank_name":"BPD KALIMANTAN TIMUR"},
{"No":54,"bank_code":"'125'","bank_name":"PT. BPD BANK KALIMANTAN TENGAH"},
{"No":55,"bank_code":"'126'","bank_name":"PT. BPD SULAWESI SELATAN DAN SULAWESI BARAT"},
{"No":56,"bank_code":"'127'","bank_name":"PT. BPD SULAWESI UTARA"},
{"No":57,"bank_code":"'128'","bank_name":"PT. BPD NUSA TENGGARA BARAT"},
{"No":58,"bank_code":"'129'","bank_name":"PT. BPD BALI"},
{"No":59,"bank_code":"'130'","bank_name":"PT. BPD NUSA TENGGARA TIMUR"},
{"No":60,"bank_code":"'131'","bank_name":"PT. BPD MALUKU"},
{"No":61,"bank_code":"'132'","bank_name":"PT. BPD PAPUA"},
{"No":62,"bank_code":"'133'","bank_name":"PT. BPD BENGKULU"},
{"No":63,"bank_code":"'134'","bank_name":"PT. BPD SULAWESI TENGAH"},
{"No":64,"bank_code":"'135'","bank_name":"PT. BPD SULAWESI TENGGARA"},
{"No":65,"bank_code":"'145'","bank_name":"PT. BANK NUSANTARA PARAHYANGAN TBK."},
{"No":66,"bank_code":"'146'","bank_name":"PT. BANK SWADESI, Tbk"},
{"No":67,"bank_code":"'147'","bank_name":"PT. BANK MUAMALAT INDONESIA"},
{"No":68,"bank_code":"'151'","bank_name":"PT. BANK MESTIKA DHARMA"},
{"No":69,"bank_code":"'152'","bank_name":"PT. BANK METRO EKSPRESS"},
{"No":70,"bank_code":"'153'","bank_name":"PT. BANK SINAR MAS"},
{"No":71,"bank_code":"'157'","bank_name":"PT. BANK MASPION INDONESIA"},
{"No":72,"bank_code":"'161'","bank_name":"PT. BANK GANESHA"},
{"No":73,"bank_code":"'164'","bank_name":"PT. BANK ICBC INDONESIA"},
{"No":74,"bank_code":"'167'","bank_name":"PT. BANK QNB KESAWAN, Tbk"},
{"No":75,"bank_code":"'200'","bank_name":"PT. BANK TABUNGAN NEGARA (PERSERO)"},
{"No":76,"bank_code":"'212'","bank_name":"PT. BANK HIMPUNAN SAUDARA 1906"},
{"No":77,"bank_code":"'213'","bank_name":"PT. BANK TABUNGAN PENSIUNAN NASIONAL TBK"},
{"No":78,"bank_code":"'405'","bank_name":"PT. BANK VICTORIA SYARIAH d/h BANK SWAGUNA"},
{"No":79,"bank_code":"'422'","bank_name":"PT. BANK BRI SYARIAH d/h DJASA ARTHA"},
{"No":80,"bank_code":"'425'","bank_name":"PT BANK JABAR BANTEN SYARIAH"},
{"No":81,"bank_code":"'426'","bank_name":"PT BANK MEGA, Tbk"},
{"No":82,"bank_code":"'427'","bank_name":"PT BANK BNI SYARIAH"},
{"No":83,"bank_code":"'441'","bank_name":"PT. BANK BUKOPIN"},
{"No":84,"bank_code":"'451'","bank_name":"PT. BANK SYARIAH MANDIRI, Tbk"},
{"No":85,"bank_code":"'459'","bank_name":"PT. BANK BISNIS INTERNASIONAL"},
{"No":86,"bank_code":"'466'","bank_name":"PT. BANK ANDARA d/h SRI PARTHA"},
{"No":87,"bank_code":"'472'","bank_name":"PT. BANK JASA JAKARTA"},
{"No":88,"bank_code":"'484'","bank_name":"PT. BANK HANA D/H BINTANG MANUNGGAL"},
{"No":89,"bank_code":"'485'","bank_name":"PT. BANK ICB BUMIPUTERA,Tbkd/hBumiputera Indonesia"},
{"No":90,"bank_code":"'490'","bank_name":"PT. BANK YUDHA BHAKTI"},
{"No":91,"bank_code":"'491'","bank_name":"PT. BANK MITRANIAGA"},
{"No":92,"bank_code":"'494'","bank_name":"PT. BANK RAKYAT INDONESIA AGRONIAGA, TBK"},
{"No":93,"bank_code":"'498'","bank_name":"PT. BANK SBI INDONESIA d/h INDOMONEX"},
{"No":94,"bank_code":"'501'","bank_name":"PT. BANK ROYAL INDONESIA"},
{"No":95,"bank_code":"'503'","bank_name":"PT. BANK NATIONALNOBU D/H PT BANK ALFINDO"},
{"No":96,"bank_code":"'506'","bank_name":"PT. BANK MEGA SYARIAH(dh B MG SY IND/TUGU)"},
{"No":97,"bank_code":"'513'","bank_name":"PT. BANK INA PERDANA"},
{"No":98,"bank_code":"'517'","bank_name":"PT. BANK PANIN SYARIAH D/H HARFA"},
{"No":99,"bank_code":"'520'","bank_name":"PT. BANK PRIMA MASTER"},
{"No":100,"bank_code":"'521'","bank_name":"PT. BANK SYARIAH BUKOPIN D/H PERSYARIKATAN IND."},
{"No":101,"bank_code":"'523'","bank_name":"PT. BANK SAHABAT SAMPOERNA"},
{"No":102,"bank_code":"'526'","bank_name":"PT. BANK DINAR INDONESIA"},
{"No":103,"bank_code":"'531'","bank_name":"PT. BANK ANGLOMAS INTERNASIONAL"},
{"No":104,"bank_code":"'535'","bank_name":"PT. BANK KESEJAHTERAAN EKONOMI"},
{"No":105,"bank_code":"'536'","bank_name":"PT. BANK BCA SYARIAH d/h UIB"},
{"No":106,"bank_code":"'542'","bank_name":"PT. BANK ARTOS INDONESIA"},
{"No":107,"bank_code":"'547'","bank_name":"PT. BANK SAHABAT PURBA DANARTA"},
{"No":108,"bank_code":"'548'","bank_name":"PT. BANK MULTI ARTA SENTOSA"},
{"No":109,"bank_code":"'553'","bank_name":"PT. BANK MAYORA"},
{"No":110,"bank_code":"'555'","bank_name":"PT. BANK INDEX SELINDO"},
{"No":111,"bank_code":"'558'","bank_name":"PT BANK PUNDI INDONESIA,Tbk d/h EKSEKUTIF INTL"},
{"No":112,"bank_code":"'559'","bank_name":"PT. CENTRATAMA NASIONAL BANK"},
{"No":113,"bank_code":"'562'","bank_name":"PT. BANK FAMA INTERNASIONAL"},
{"No":114,"bank_code":"'564'","bank_name":"PT. BANK SINAR HARAPAN BALI"},
{"No":115,"bank_code":"'566'","bank_name":"PT. BANK VICTORIA INTERNATIONAL"},
{"No":116,"bank_code":"'567'","bank_name":"PT. BANK HARDA INTERNASIONAL"},
{"No":117,"bank_code":"'945'","bank_name":"PT. BANK AGRIS D/H FINCONESIA"},
{"No":118,"bank_code":"'947'","bank_name":"PT. BANK MAYBANK INDOCORP"},
{"No":119,"bank_code":"'949'","bank_name":"PT. BANK CHINATRUST INDONESIA"},
{"No":120,"bank_code":"'950'","bank_name":"PT. BANK COMMONWEALTH"}];
	$scope.customerCombinedItemList = CustomerFactory.customerCombinedItemList;
	/*
	CustomerFactory.getCustomerCombinedItemList($scope.customerIdToSearch).then(function () {
		$scope.customerCombinedItemList = CustomerFactory.customerCombinedItemList;
	});
	
	*/
	
	$scope.customerLookupList = [];

	$scope.open = true;

	$scope.customerIdToSearch = "";
	
	$scope.HLPFIELD_items_is_edit_mode = true;
	
	$scope.is_order_saved = false;
	$scope.submitted_order_reference = "";
	
	$scope.OPTIONS_department_types = [
		{value: '', label:'--- Pilih Divisi ---'},
		{value: 'B', label:'Busa'},
		{value: 'S', label:'Superland'},
		{value: 'C', label:'Charis'},
		{value: 'T', label:'Theraspine'},
		{value: 'U', label:'Cushion'}
	];
	
	$scope.isLengthWidthHeightValid = function(itemChild){
		var valid = false;
		if (itemChild.length_width_height !== null || itemChild.length !== null || itemChild.width !== null || itemChild.height !== null) {
			valid = true;
		}else{
			valid = false;
		}
		return valid;
	}
	
    $scope.changeOrderType = function(defaultChoosen){
      $scope.order.payment_type = defaultChoosen;
      for (var i = 0; i < $scope.tabs.length; i += 1) {
         if ($scope.tabs[i].title == defaultChoosen) {
            $scope.tabs[i].active = true;
         }
      }
    }
    
    $scope.total = function(){
      var total = 0;
      for (var i = 0; i < $scope.order.order_details.order_items.length; i += 1) {
         total += ($scope.order.order_details.order_items[i].quantity*$scope.order.order_details.order_items[i].cost)-($scope.order.order_details.order_items[i].quantity*$scope.order.order_details.order_items[i].cost*$scope.order.order_details.order_items[i].disc_percent/100);
      }
      return total;
    
    }
     $scope.totalWithoutDisc = function(){
      var total = 0;
      for (var i = 0; i < $scope.order.order_details.order_items.length; i += 1) {
         total += ($scope.order.order_details.order_items[i].quantity*$scope.order.order_details.order_items[i].cost);
      }
      return total;
    
    }
    $scope.totalDiscPercent = function(){
      var total = 0;
      for (var i = 0; i < $scope.order.order_details.order_items.length; i += 1) {
         total += ($scope.order.order_details.order_items[i].quantity*$scope.order.order_details.order_items[i].cost*$scope.order.order_details.order_items[i].disc_percent/100)
      }
      return total;
    }
    $scope.totalDiscValue = function(){
      var total = 0;
      for (var i = 0; i < $scope.order.order_details.order_items.length; i += 1) {
         total += $scope.order.order_details.order_items[i].disc_value;
      }
      return total;
    }
    $scope.totalDisc = function(){
      var total = 0;
      total += ($scope.totalDiscPercent() + $scope.totalDiscValue()); 
      return total;
    }
    $scope.totalGrand = function(){
      var total = 0;
      total += ($scope.totalWithoutDisc() - $scope.totalDisc()); 
      return total;
    }
    
    
	$scope.setLookupItem = function(itemCode, parentIndex, index) {
		var itemUnit = $scope.lookupItemUnit(itemCode);
		var itemName = $scope.lookupItemName(itemCode);
		var plt = $scope.lookupItemLengthWidthHeight(itemCode);
		if (parentIndex == "parent") {
			$scope.order.order_details.order_items[index].item_unit = itemUnit;
			$scope.order.order_details.order_items[index].item_name = itemName;
			$scope.order.order_details.order_items[index].length_width_height = plt;
		}else{
			$scope.order.order_details.order_items[parentIndex].children[index].item_unit = itemUnit;
			$scope.order.order_details.order_items[parentIndex].children[index].item_name = itemName;
			$scope.order.order_details.order_items[parentIndex].children[index].length_width_height = plt;
		}
		/*
		$scope.order.order_details.order_items[parentIndex].children[index] = item;
		console.log(item);
		if (item.length !== null || item.width !== null || item.height !== null) {
			$scope.order.order_details.order_items[parentIndex].children[index].length_width_height = item.length +" x "+ item.width +" x "+ item.height;
		}else{
			$scope.order.order_details.order_items[parentIndex].children[index].length_width_height = "";
		}
		$scope.order.order_details.order_items[parentIndex].children[index].level = 'C';
		*/
	}
	
	$scope.lookupItemLengthWidthHeight = function(itemCode) {
		return ItemLookupService.getItemLengthWidthHeight(itemCode);
	}
	
	$scope.lookupItemUnit = function(itemCode) {
		return ItemLookupService.getItemUnit(itemCode);
	}
	
	$scope.lookupItemName = function(itemCode) {
		return ItemLookupService.getItemName(itemCode);
	}
	
	$scope.lookupItemLWH = function(itemCode, $index) {
		
		this.itemLookup = JSON.parse(localStorage.getItem('vontisItemList'));
			
		if (itemCode !== null) {
			for (var i = 0 ; i < this.itemLookup.length ; i++) {
				if (this.itemLookup[i].item_code == itemCode) {
					var itemLength = this.itemLookup[i].length;
					var itemWidth = this.itemLookup[i].width;
					var itemHeight = this.itemLookup[i].height;
					//return (+itemLength) + 'x' + (+itemWidth) + 'x' + (+itemHeight);
					$scope.length_width_height = (+itemLength) + 'x' + (+itemWidth) + 'x' + (+itemHeight);
					$scope.order.order_details.order_items[$index].length_width_height = $scope.length_width_height;
				}
			}
		}
	}
	
	$scope.createNewCustomer = function() {
		if ($scope.order.order_details.order_items[0].item_code !== "") {
			if ($scope.order.order_details.order_items.length > 0 || $scope.order.delivery_request_details.length > 0 ) {
				SweetAlert.swal({
				title: "Peringatan",
				text: "Mengganti Customer Akan Menghapus Data Yang Telah Dibuat!",
				type: "warning",
				showCancelButton: true,
				confirmButtonText: "Teruskan",
				cancelButtonText: "Batal",
				closeOnConfirm: true,
				closeOnCancel: true,
				animation: "slide-from-top" },
				function(isConfirm){
					if (isConfirm) {
						$scope.order.customer_details = {
							"customer_name": "",
							"pic_name": "",
							"address": "",
							"city": "",
							"postcode": "",
							"phone_number": "",
							"fax_number": "",
							"customer_email": ""
						};
						
						$scope.order.customer_id = "";
						$scope.order.customer_input_type = "N";
						$scope.customerIdToSearch = "";
						
						$scope.order.order_details.order_items = [];
						$scope.addItem();
						$scope.order.delivery_request_details = [];
						$scope.HLPFIELD_items_is_edit_mode = true;
					}else{
						
					}
				});
			}
		}else{
			$scope.order.customer_details = {
				"customer_name": "",
				"pic_name": "",
				"address": "",
				"city": "",
				"postcode": "",
				"phone_number": "",
				"fax_number": "",
				"customer_email": ""
			};
			
			$scope.order.customer_id = "";
			$scope.order.customer_input_type = "N";
			$scope.customerIdToSearch = "";
			
		}
	}
	
	$scope.updateCustomer = function() {
		$scope.order.customer_input_type = "U";
	}
	
	$scope.addItem = function() {
		var newItem = {
         "item_code": "",
         "quantity": "",
         "cost": 0,
         "disc_percent": 0,
         "disc_value": 0,
         "remark":"",
		"material_type": "",
		"level": "S"
		};
		
		$scope.order.order_details.order_items.push(newItem);
	};
	$scope.addItemChild = function(index){
		var childItem =
		{
			"item_code": "",
			"length_width_height": "",
			"material_type": "",
			"remark": "",
			"level": "C"
		};
		$scope.order.order_details.order_items[index].children.push(childItem);
	}
   $scope.combineAttributes = function(orderItems){
      var newItem = {};
      for (var j = 0; j<$scope.attributeList.length; j+=1) {
         if ($scope.attributeList[j].status !== 'X') {
         var attributeName = $scope.attributeList[j].attribute_name;
            if ($scope.attributeList[j].status !== 'X') {
               newItem[$scope.attributeList[j].attribute_name] = orderItems[$scope.attributeList[j].attribute_name];
            }
         }
      }
      return newItem;
   }
	$scope.addDeliveryRequest = function() {
		if ($scope.isNoDeliveryRequestItemRemaining()) {
			SweetAlert.swal({
				title: "Tidak Dapat Menambah Rencana Pengiriman",
				text: "Semua item telah masuk rencana pengiriman.", 
				type: "warning", 
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
		}
		else {
			var deliveryRequestsItems = [];
			var orderItems = $scope.order.order_details.order_items;
			
			for (var i = 0 ; i < orderItems.length ; i++) {
				var totalInDelivery = $scope.getTotalInDeliveryRequests(orderItems[i].item_code, orderItems[i].material_type, orderItems[i].remark);
				
				var newItem = {
					"item_code": orderItems[i].item_code,
					"item_name": orderItems[i].item_name || '',
					"item_unit": orderItems[i].item_unit || '',
					"attributes": $scope.combineAttributes(orderItems[i]),
					"length_width_height": orderItems[i].length_width_height || '',
					"main_quantity": orderItems[i].quantity,
					"quantity": null,
					"remains": orderItems[i].quantity - totalInDelivery,
					"material_type": orderItems[i].material_type,
					"remark": orderItems[i].remark,
					"level": orderItems[i].level,
				};
			   for (var j = 0; j<$scope.attributeList.length; j+=1) {
                  if ($scope.attributeList[j].status !== 'X') {
                  var attributeName = $scope.attributeList[j].attribute_name;
                     if ($scope.attributeList[j].status !== 'X') {
                        newItem[$scope.attributeList[j].attribute_name] = orderItems[i][$scope.attributeList[j].attribute_name];
                     }
                  }
               }
               //newItem.attributes = JSON.stringify(newItem.attributes);
			   deliveryRequestsItems.push(newItem);
			}
			
			var newDeliveryRequest = {
				"requested_delivery_date": "",
				"requested_delivery_address": "",
				"is_new_address": 1,
				"requested_delivery_items": deliveryRequestsItems,
				"HLPFIELD_is_edit_mode": true
			}
			
			$scope.order.delivery_request_details.push(newDeliveryRequest);
		}
	};
	
	$scope.confirmDeliveryRequest = function(deliveryRequest) {
		if ($scope.isDeliveryRequestValid(deliveryRequest)) {
			deliveryRequest.HLPFIELD_is_edit_mode = false;
		}
		else {
			SweetAlert.swal({
				title: "Perhatian!",
				text: "Tanggal dan Alamat rencana pengiriman tidak boleh kosong. Jumlah Permohonan Pengiriman minimal diisi 1. Jumlah Permohonan tidak boleh lebih dari Jumlah Sisa", 
				type: "warning", 
				//confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
		}
	}
	
	$scope.isDeliveryRequestValid = function(deliveryRequest) {
		var validity = true;
		
		if (deliveryRequest.requested_delivery_date == "" || deliveryRequest.requested_delivery_date == null || deliveryRequest.requested_delivery_address == "") {
			validity = false;
		}
		else {
			var quantityNotEmpty = 0;
			
			angular.forEach(deliveryRequest.requested_delivery_items, function(deliveryRequestItem) {
				if (deliveryRequestItem.quantity != null && deliveryRequestItem.quantity != "" && deliveryRequestItem.quantity != 0){
					if (deliveryRequestItem.quantity > deliveryRequestItem.remains) {
						validity = false;
					}
					quantityNotEmpty = quantityNotEmpty + 1;
				}
			});
			
			if (quantityNotEmpty == 0) {
				validity = false;
			}
		}
		
		return validity;
	}
	
	$scope.removeDeliveryRequest = function(deliveryRequest) {
		$scope.order.delivery_request_details.splice($scope.order.delivery_request_details.indexOf(deliveryRequest), 1);
	};
	
	$scope.filterNullAndZero = function() {
		return function(item) {
			if (item.quantity === null) return false;
			if (item.quantity == 0) return false;
			return true;
		}
	}

	$scope.removeItem = function(item) {
		$scope.order.order_details.order_items.splice($scope.order.order_details.order_items.indexOf(item), 1);
	};
	$scope.removeChild = function(item, itemChild) {
		var indexParent = $scope.order.order_details.order_items.indexOf(item);
		$scope.order.order_details.order_items[indexParent].children.splice( $scope.order.order_details.order_items[indexParent].children.indexOf(item), 1);
	};
	
	$scope.activateItemsEditMode = function() {
		SweetAlert.swal({
			title: "Perhatian!",
			text: "Semua rencana pengiriman dalam order ini akan terhapus!", 
			type: "warning", 
			showCancelButton: true, 
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Ya, Teruskan!",
			closeOnConfirm: true,
			animation: "slide-from-top"
		}, 
		function(isConfirm) {
			if (isConfirm) {
				console.log("teruskan");
				$scope.HLPFIELD_items_is_edit_mode = true;
				//if edit mode activated then clear delivery request
				$scope.order.delivery_request_details = [];
			}
			else {
				console.log("batal");   
			}
		});
	}
	
	$scope.isAnyInEditMode = function() {
		
		if ($scope.HLPFIELD_items_is_edit_mode) {
			return true;
		}
		
		for ( var i = 0 ; i < $scope.order.delivery_request_details.length ; i++ ) {  
			if ($scope.order.delivery_request_details[i].HLPFIELD_is_edit_mode) {
				return true;
			}
		}
		
		return false;
	}
	
	$scope.isDuplicateItems = function() {
		for (var i = 0 ; i < $scope.order.order_details.order_items.length - 1 ; i++) {
			for (var j = i+1 ; j < $scope.order.order_details.order_items.length ; j++) {
				if ($scope.order.order_details.order_items[i].item_code == $scope.order.order_details.order_items[j].item_code
					&& $scope.order.order_details.order_items[i].material_type == $scope.order.order_details.order_items[j].material_type
					&& $scope.order.order_details.order_items[i].remark == $scope.order.order_details.order_items[j].remark
				) {
					return true;
				}
			}
		}
		
		return false;
	}

	$scope.confirmItemsEdit = function() {
		
		if ($scope.isDuplicateItems()) {
			SweetAlert.swal({
				title: "Perhatian!",
				text: "Ada barang duplikat.", 
				type: "warning", 
				//confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
		}
		else {
			if ($scope.isOrderItemsValid()) {
				$scope.HLPFIELD_items_is_edit_mode = false;
			}
			else {
				SweetAlert.swal({
					title: "Perhatian!",
					text: "Kode Barang tidak boleh kosong dan Jumlah Order tidak boleh kosong atau bernilai 0.", 
					type: "warning", 
					//confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ok",
					closeOnConfirm: true,
					animation: "slide-from-top"
				});
			}
		}
	}
	
	$scope.isDeliveryRequestsValid = function(deliveryRequests) {
		var validity;
		
		if (! deliveryRequests.length) {
			validity = false;
		}
		else{
			validity = true;
			
			angular.forEach(deliveryRequests, function(deliveryRequest) {
				if (! $scope.isDeliveryRequestValid(deliveryRequest)) {
					validity = false;
				}
			});
		}
		
		return validity;
	}
	
	$scope.isCustomerValid = function() {
		var customer = $scope.order.customer_details;
		
		if(customer.customer_name != null && customer.customer_name != ""){
			validity = true;
		}
		else {
			validity = false;
		}
		
		return validity;
	}
	
	$scope.isOrderItemsValid = function() {
		var orderItems = $scope.order.order_details.order_items;

		angular.forEach(orderItems, function(orderItem) {
			if(orderItem.item_code != "" && orderItem.quantity != "" && orderItem.quantity != 0 && orderItem.length_width_height != ""){
				validity = true;
			}
			else {
				validity = false;
			}
		});
		
		return validity;
	}
	$test = false;
	$scope.insertDraftOrder = function() {
		$scope.submitButtonLoading = true;
		var deliveryRequests = $scope.order.delivery_request_details;
		
		//if (!($scope.isCustomerValid() && $scope.isOrderItemsValid() && $scope.isDeliveryRequestsValid(deliveryRequests))) {
		if ($test == true) {
			SweetAlert.swal({
				title: "Perhatian!",
				text: "Customer, Order Barang, atau Pengiriman tidak boleh kosong", 
				type: "warning", 
				//confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ok",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
			
			$scope.submitButtonLoading = false;
		}
		else {
			//if ($scope.order.product_type == "") {
			if ($test == true) {
				SweetAlert.swal({
					title: "Perhatian!",
					text: "Divisi harus dipilih.", 
					type: "warning", 
					//confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ok",
					closeOnConfirm: true,
					animation: "slide-from-top"
				});
				
				$scope.submitButtonLoading = false;
			}
			else {
				var inputOrder = {};
				for(var i = 0; i < $scope.order.order_details.order_items.length; i++){
                     $scope.order.order_details.order_items[i].attributes = {};
                     for(var j = 0; j < $scope.attributeList.length; j+=1){
                         var attribValue = $scope.order.order_details.order_items[i][$scope.attributeList[j].attribute_name];
                         $scope.order.order_details.order_items[i].attributes[$scope.attributeList[j].attribute_name] = attribValue;
                     }
                     $scope.order.order_details.order_items[i].attributes = JSON.stringify($scope.order.order_details.order_items[i].attributes);
                 }
				 
				angular.copy($scope.order, inputOrder);
				inputOrder.delivery_request_details.forEach(function(deliveryRequestDetail) {
					deliveryRequestDetail.requested_delivery_items.forEach(function(item) {
						if(item.quantity === null || item.quantity == 0) {
							deliveryRequestDetail.requested_delivery_items.splice(deliveryRequestDetail.requested_delivery_items.indexOf(item), 1);
						}
					}); 
					
					deliveryRequestDetail.requested_delivery_date = moment(deliveryRequestDetail.requested_delivery_date).format('YYYY-MM-DD');
				});
                

		ApiCallService.insertDraftOrder(inputOrder).
					success(function(data, status, headers, config) {
						if (data.call_status === "success") {
							SweetAlert.swal("Draft order "+ data.order_reference + " sudah tersimpan dengan sukses.");
							$scope.submitted_order_reference = data.order_reference;
							$scope.is_order_saved = true;
							
							var inputOrder = {};
							angular.copy($scope.order, inputOrder);
							inputOrder.delivery_request_details.forEach(function(deliveryRequestDetail) {
								deliveryRequestDetail.requested_delivery_items.forEach(function(item) {
									if(item.quantity === null || item.quantity == 0) {
										deliveryRequestDetail.requested_delivery_items.splice(deliveryRequestDetail.requested_delivery_items.indexOf(item), 1);
									}
								}); 
								
								deliveryRequestDetail.requested_delivery_date = moment(deliveryRequestDetail.requested_delivery_date).format('YYYY-MM-DD');
							});
					         inputOrder['order_type'] = $scope.order.order_type;

					         var updateInputOrder = {};
					         angular.copy($scope.draft, updateInputOrder);
					         updateInputOrder['draft_data'] = JSON.stringify(inputOrder);
					         ApiCallService.finishCart(updateInputOrder).success(function(){
					         	console.log('SUCC')
					         });
					         $state.go("app.order.draft_order_cart_list");

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
						
						$scope.submitButtonLoading = false;
					}).
					error(function(data, status, headers, config) {
						console.log(data);
						console.log(status);
						console.log(header);
						console.log(config);
						
						$scope.submitButtonLoading = false;
				});
			}
		}
	};
    $scope.saveCart = function(){
      if (!$scope.isCustomerValid()) {
         //code
      }else{
      	var inputOrder = {};
				angular.copy($scope.order, inputOrder);
				inputOrder.delivery_request_details.forEach(function(deliveryRequestDetail) {
					deliveryRequestDetail.requested_delivery_items.forEach(function(item) {
						if(item.quantity === null || item.quantity == 0) {
							deliveryRequestDetail.requested_delivery_items.splice(deliveryRequestDetail.requested_delivery_items.indexOf(item), 1);
						}
					}); 
					
					deliveryRequestDetail.requested_delivery_date = moment(deliveryRequestDetail.requested_delivery_date).format('YYYY-MM-DD');
				});
         inputOrder['order_type'] = $scope.order.order_type;

         var updateInputOrder = {};
         angular.copy($scope.draft, updateInputOrder);
         updateInputOrder['draft_data'] = JSON.stringify(inputOrder);
         ApiCallService.updateDraftOrderCart(updateInputOrder).
					success(function(data, status, headers, config) {
						if (data.call_status === "success") {
							SweetAlert.swal("Draft order "+ data.draft_reference + " sudah tersimpan dengan sukses.");
							$scope.submitted_order_reference = data.order_reference;
							$scope.is_order_saved = true;
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
						
						$scope.submitButtonLoading = false;
					}).
					error(function(data, status, headers, config) {
						console.log(data);
						console.log(status);
						console.log(header);
						console.log(config);
						
						$scope.submitButtonLoading = false;
				});
      }
    }
	$scope.formatSearchCustomerText = function(model) {
		for (var i=0; i< $scope.customerLookupList.length; i++) {
			if (model === $scope.customerLookupList[i].customer_id) {
				return $scope.customerLookupList[i].customer_name + ' - ' + $scope.customerLookupList[i].pic_name;
			}
		}
	}
	$scope.inputCustomer = function(data){
		$scope.order.customer_input_type = "E";
		$scope.order.customer_id = $scope.customerIdToSearch;
		$scope.order.customer_details.customer_id = $scope.customerIdToSearch;
		$scope.order.customer_details.customer_name = data.customer_details.customer_name;
		$scope.order.customer_details.pic_name = data.customer_details.pic_name;
		$scope.order.customer_details.address = data.customer_details.address;
		$scope.order.customer_details.city = data.customer_details.city;
		$scope.order.customer_details.postcode = data.customer_details.postcode;
		$scope.order.customer_details.phone_number = data.customer_details.phone_number;
		$scope.order.customer_details.fax_number = data.customer_details.fax_number;
		$scope.order.customer_details.customer_email = data.customer_details.customer_email;
	}
	$scope.getCustomerById = function() {
		CustomerService.getCustomerById($scope.customerIdToSearch).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					if ($scope.order.order_details.order_items[0].item_code !== "") {
						if ($scope.order.order_details.order_items.length > 0 || $scope.order.delivery_request_details.length > 0 ) {
							SweetAlert.swal({
							title: "Peringatan",
							text: "Mengganti Customer Akan Menghapus Data Yang Telah Dibuat!",
							type: "warning",
							showCancelButton: true,
							confirmButtonText: "Teruskan",
							cancelButtonText: "Batal",
							closeOnConfirm: true,
							closeOnCancel: true,
							animation: "slide-from-top" },
							function(isConfirm){
								if (isConfirm) {
									$scope.order.order_details.order_items = [];
									$scope.addItem();
									$scope.order.delivery_request_details = [];
									$scope.HLPFIELD_items_is_edit_mode = true;
									$scope.inputCustomer(data);
								}else{
									
								}
							});
						}
					}else{
						$scope.inputCustomer(data);
					}
					
					
					
					
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
		CustomerFactory.getCustomerCombinedItemList($scope.customerIdToSearch).then(function () {
		$scope.customerCombinedItemList = CustomerFactory.customerCombinedItemList;
	});
	}
	
	$scope.getTotalInDeliveryRequests = function(itemCode, materialType, remark) {
	
		var deliveryRequests = $scope.order.delivery_request_details;
		var total = 0;
		
		angular.forEach(deliveryRequests, function(deliveryRequest) {
			var deliveryRequestItems = deliveryRequest.requested_delivery_items;
			
			angular.forEach(deliveryRequestItems, function(deliveryRequestItem) {
				if (deliveryRequestItem.item_code == itemCode
					&& deliveryRequestItem.material_type == materialType
					&& deliveryRequestItem.remark == remark
				) {
					quantity = parseInt(deliveryRequestItem.quantity) || 0;
					total = total + quantity;							
				}
			});
		});
		
		return total;
	}
	
	$scope.isNoDeliveryRequestItemRemaining = function() {
		orderItems = $scope.order.order_details.order_items;
		noItemRemaining = true;
		
		orderItems.forEach(function(orderItem) {
			total = $scope.getTotalInDeliveryRequests(orderItem.item_code, orderItem.material_type, orderItem.remark);
			itemRemaining = orderItem.quantity - total;
			
			if (itemRemaining > 0) {
				noItemRemaining = false;
			}
		});
		
		return noItemRemaining;
	}
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}

	$scope.displayItemDetailModal = function(index) {
		if ($scope.customerIdToSearch || $scope.order.customer_input_type == "N") {
		var customer = true;
	}
	else {
		var customer = false;
	}
	
	var pass_data = {
			index: index,
	  customer: customer
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_item_detail',
			controller: 'ItemDetailModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	}

	$scope.displayChildItemDetailModal = function(index, item) {

		var indexParent = $scope.order.order_details.order_items.indexOf(item);
		var pass_data = {
			index: index,
			parent_index:indexParent
		};

		var modalInstance = $modal.open({
			templateUrl: 'modal_child_item_detail',
			controller: 'ItemDetailModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			scope: $scope
		});
	}
	
	$scope.displayCustomerListModal = function() {
		/*var pass_data = {
			index: index
		};*/
		
		console.log("open");
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_customer_list',
			controller: 'CustomerListModalCtrl',
			size: 'lg',
			/*resolve: {
				passed_data: function () {
					return pass_data;
				}
			},*/
			scope: $scope
		});
	}
    
    $scope.displayPaymentReceiptModal = function() {
		/*var pass_data = {
			index: index
		};*/
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_payment_receipt',
			controller: 'PaymentReceiptModalCtrl',
			size: 'lg',
			/*resolve: {
				passed_data: function () {
					return pass_data;
				}
			},*/
			scope: $scope
		});
	}
	
	$scope.init = function() {
		
		ApiCallService.getDraftOrderCartByDraftId(draft_id).success(function(data){
			if (data.call_status === "success") {
				$scope.draft = data.draft_order;
				$scope.draftData = angular.fromJson(data.order);
				for(var i = 0 ; i < $scope.draftData.delivery_request_details.length; i++){
					$scope.draftData.delivery_request_details[i].requested_delivery_date = new Date(moment($scope.draftData.delivery_request_details[i].requested_delivery_date));
				}

				$scope.order = $scope.draftData;
				$scope.changeOrderType($scope.order.order_type);
			};
			console.log($scope);
		});
		
		AuthService.isLoggedOn();
		
		//clear all fields
		$scope.itemLookupList = [];
	
		$scope.customerLookupList = [];

		$scope.customerIdToSearch = "";
		$scope.hasSpecialRequestAccess = false;

		$scope.HLPFIELD_items_is_edit_mode = true;

		$scope.is_order_saved = false;
		$scope.submitted_order_reference = "";
		
		//ItemLookupService.retrieveItemLookup();
		$scope.itemLookupList = ItemLookupService.getAllItems();
		
		ApiCallService.getCustomerLookup().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.customerLookupList = data.customer_indexes_list;
				}
				else {
					console.log(data);
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
		
		ApiCallService.checkUserHasAccessForSpecialRequest().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					if (data.has_access == 1) {
						$scope.hasSpecialRequestAccess = true;
					}
				}
				else {
					console.log(data);
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	};
	
	$scope.clearPage = function() {
		$scope.init();
	};
	
	$scope.init();
});

app.controller('ItemDetailModalCtrl', function ($scope, $modalInstance, passed_data, ngTableParams, $filter, CustomerFactory) {

	$scope.filter = {};
	$scope.filter.$ = '';
  
	var index = passed_data.index;
	var parentIndex = passed_data.parent_index;
	$scope.customer = passed_data.customer;
	/*
	CustomerFactory.getCustomerCombinedItemList($scope.customerIdToSearch).then(function () {
		$scope.customerCombinedItemList = CustomerFactory.customerCombinedItemList;
    
    $scope.tableParamsCustom.total($scope.customerCombinedItemList.length);
  $scope.tableParamsCustom.reload();
	});
	*/
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page,
			sorting:{
				item_code: 'asc'
			}
		},
		{
			total: $scope.itemLookupList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.itemLookupList, $scope.filter);
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

	/*$scope.setItemCode = function(itemCode, itemName) {
		$scope.order.order_details.order_items[index].item_code = itemCode;
		$scope.order.order_details.order_items[index].item_name = itemName;
		$scope.order.order_details.order_items[index].level = 'S';
		$scope.order.order_details.order_items[index].children = [];
		$modalInstance.dismiss('close');
	}*/
	
	$scope.setItemCode = function(item) {
		$scope.order.order_details.order_items[index].item_code = item.item_code;
		$scope.order.order_details.order_items[index].item_name = item.item_name;
		$scope.order.order_details.order_items[index].item_unit = item.item_unit;
		$scope.order.order_details.order_items[index].level = 'S';
		$scope.order.order_details.order_items[index].children = [];
		
		if (item.length !== null || item.width !== null || item.height !== null) {
			$scope.order.order_details.order_items[index].length_width_height = item.length + ' x ' + item.width + ' x ' + item.height;
		}
		$modalInstance.dismiss('close');
	}

	$scope.setItemCustom = function(custom) {
		$scope.order.order_details.order_items[index].item_code = custom.item_code;
		$scope.order.order_details.order_items[index].item_name = custom.item_name;
		$scope.order.order_details.order_items[index].item_unit = custom.item_unit;
		$scope.order.order_details.order_items[index].level = 'E';
		$scope.order.order_details.order_items[index].children = custom.children;
		
		var total_height = 0;
		for(var i = 0; i < custom.children.length; i++){
			var child = custom.children[i];
			
			total_height += parseInt(child.height);
		}
		
		$scope.order.order_details.order_items[index].length_width_height = custom.children[0].length + ' x ' + custom.children[0].width + ' x ' + total_height;
		
		$modalInstance.dismiss('close');
	}

	$scope.setChildItemCode = function(newItem) {
		var item = angular.copy(newItem);
		
		$scope.order.order_details.order_items[parentIndex].children[index] = item;
		
		if (item.length !== null || item.width !== null || item.height !== null) {
			$scope.order.order_details.order_items[parentIndex].children[index].length_width_height = item.length +" x "+ item.width +" x "+ item.height;
			
			if ($scope.order.order_details.order_items[parentIndex].length_width_height == null) {
				$scope.order.order_details.order_items[parentIndex].length_width_height = item.length +" x "+ item.width +" x "+ item.height;
			}
		}else{
			$scope.order.order_details.order_items[parentIndex].children[index].length_width_height = "";
		}
		$scope.order.order_details.order_items[parentIndex].children[index].level = 'C';
		$modalInstance.dismiss('close');
	}

	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};

	$scope.tableParamsCustom = new ngTableParams({
		page: 1,
		count: 10
	}, {
		total: $scope.customerCombinedItemList.length,
		getData: function ($defer, params) {
			var orderedData = params.sorting() ? $filter('orderBy')($scope.customerCombinedItemList, params.orderBy()) : data;
			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		}
	});

	$scope.editId = -1;

	$scope.setEditId = function (pid) {
		$scope.editId = pid;
	};

	$scope.newCustomItem = function (){

		$scope.order.order_details.order_items[index].item_code = '';
		$scope.order.order_details.order_items[index].level = 'N';
		$scope.order.order_details.order_items[index].children = [
			{
				"item_code": "",
				"length_width_height": "",
				"material_type": "",
				"remark": "",
				"level": "C"
			}
		];
		$modalInstance.dismiss('close');
	};
});

app.controller('CustomerListModalCtrl', function ($scope, $modalInstance, ngTableParams, $filter, ApiCallService) {
	
	//var index = passed_data.index;
	$scope.customerList = [];
	
	ApiCallService.getAllCustomers().
		success(function(data, status, headers, config) {
		
			if (data.call_status === "success") {
				$scope.customerList = data.customer_details_list;
				
				$scope.customerListTableParams = new ngTableParams(
					{
						page: 1, // show first page
						count: 10 // count per page
					}, 
					{
						total: $scope.customerList.length, // length of data
						getData: function ($defer, params) {
							var orderedData = params.sorting() ? $filter('orderBy')($scope.customerList, params.orderBy()) : $scope.customerList;
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					}
				);
			}
			else {
				console.log(data);
			}
		
		}).
		error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(header);
			console.log(config);
		});
	
	$scope.setCustomerIdToSearch = function(customerId) {
		$scope.customerIdToSearch = customerId;
		console.log(customerId);
		console.log($scope.customerIdToSearch);
		$modalInstance.dismiss('close');
	}
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};

});

app.controller('PaymentReceiptModalCtrl', function ($scope, $modalInstance, ngTableParams, $filter, ApiCallService) {
		
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};

});
