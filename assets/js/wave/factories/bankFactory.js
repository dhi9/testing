app.factory('BankFactory', function ($http, apiUrl, SweetAlert) {
	var url = apiUrl + 'bankapi/';
	var self = {};
	
	self.bank = {};
	self.bankList = [];
	
	var returnLabel = function(label){
		if (label == 1) {
			return 'Ya';
		}
		else{
			return 'Tidak';
		}
	}
	
	self.clean = function(){
		self.bank = {};
	}
	
	self.getBankList = function(){
		return $http.get(url + 'get_bank_list')
			.success(function(data){
				if(data.call_status == "success"){
					self.bankList = data.bank_list;
					
					for (var i = 0; i < self.bankList.length; i++) {
						self.bankList[i].tt = returnLabel(self.bankList[i].telex_transfer);
						self.bankList[i].kk = returnLabel(self.bankList[i].credit_card);
						self.bankList[i].kd = returnLabel(self.bankList[i].debit_card);
					}
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	}
	
	self.getBankById = function(bankId){
		return $http.get(url + 'get_bank_by_id/' + bankId)
			.success(function(data){
				if(data.call_status == "success"){
					self.bank = data.bank;
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	}
	
	self.insertBank =  function (){
		var insertData = self.bank;
		return $http.post(url + 'insert_bank', insertData)
			.success(function(data){
				if(data.call_status == "success"){
					SweetAlert.swal({
						title: "Success",
						text: "Bank "+ insertData.bank_name +" berhasil disimpan ",
						type: "success",
						animation: "slide-from-top"
					});
					
					self.bank = {};
				}
				else{
					SweetAlert.swal({
						title: "Tambah Bank Gagal",
						text: data.error_message,
						type: "error",
						animation: "slide-from-top"
					});
				}
			})
	}
	
	self.updateBank =  function (){
		return $http.post(url + 'update_bank', self.bank)
			.success(function(data){
				if(data.call_status == "success"){
					SweetAlert.swal({
						title: "Ubah Bank Berhasil",
						text: "Bank "+ self.bank.bank_name +" berhasil diubah ",
						type: "success",
						animation: "slide-from-top"
					});
					
					self.bank = {};
				}
				else{
					SweetAlert.swal({
						title: "Ubah Bank Gagal",
						text: data.error_message,
						type: "error",
						animation: "slide-from-top"
					});
				}
			});
	}
	
	return self;
});