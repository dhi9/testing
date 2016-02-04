app.service('SiteService', function($http, apiUrl, $window) {
	var url = apiUrl;
	
  this.getSiteByReference = function(reference){
		return $http.get(url + 'siteapi/get_site_by_reference/' + reference);
	}
	
	this.getSiteById = function(reference){
		return $http.get(url + 'siteapi/get_site_by_id/' + reference);
	}

    this.getSiteList = function(){
        return $http.get(url + 'siteapi/get_site_list');
    }

    this.getActiveSiteList = function(){
        return $http.get(url + 'siteapi/get_active_site_list');
    }
	
	this.getSiteConsignmentList = function(){
		return $http.get(url + 'siteapi/get_site_consignment_list');
	}
	this.getSiteConsignmentListByCustomerId = function(customerId){
		return $http.get(url + 'siteapi/get_site_consignment_list_by_customer_id/' + customerId);
	}
	this.getSiteHistoryListBySiteId = function(siteId){
		return $http.get(url + 'siteapi/get_site_history_list_by_site_id/' + siteId);
	}
	
	this.insertSite = function(data){
		return $http.post(url + 'siteapi/insert_site', data);
	}
	
	this.updateSite = function(data){
		return $http.post(url + 'siteapi/update_site', data);
	}

    this.getSiteLocationListBySiteId = function(siteId){
        return $http.get(url + 'siteapi/get_site_location_list_by_site_id/' + siteId);
    }

    this.getSiteLocationListByMassSiteId = function(siteId){
        return $http.get(url + 'siteapi/get_site_location_list_by_mass_site_id/' + siteId);
    }

    this.getStorageListBySiteId = function(siteId){
		return $http.get(url + 'siteapi/get_storage_list_by_site_id/' + siteId);
	}
	
	this.getSiteLocationList = function(){
		return $http.get(url + 'siteapi/get_site_location_list/');
	}
	
	this.getStorageList = function(){
		return $http.get(url + 'siteapi/get_storage_list');
	}
	
	this.getStorageById = function(storageId){
		return $http.get(url + 'siteapi/get_storage_by_id/' + storageId);
	}

	this.insertStorage = function(data){
		return $http.post(url + 'siteapi/insert_storage', data);
	}
	
	this.updateStorage = function(data){
		return $http.post(url + 'siteapi/update_storage', data);
	}
	
	this.getSiteBinListByStorageId = function(storageId){
		return $http.get(url + 'siteapi/get_site_bin_list_by_storage_id/' + storageId);
	}
	
	this.getBinById = function(binId){
		return $http.get(url + 'siteapi/get_bin_by_id/' + binId);
	}
	
	this.updateBin = function(data){
		return $http.post(url + 'siteapi/update_bin', data);
	}
	
	this.insertBin = function(data){
		return $http.post(url + 'siteapi/insert_bin', data);
	}
	
	this.getStorageHistoryListByStorageId = function(storageId){
		return $http.get(url + 'siteapi/get_storage_history_list_by_storage_id/' + storageId);
	}
	
	this.getBinHistoryListByBinId = function(binId){
		return $http.get(url + 'siteapi/get_bin_history_list_by_bin_id/' + binId);
	}
	
	this.getStockStatusList = function(){
		return $http.get(url + 'siteapi/get_stock_status');
	}
	
	this.getMovementCodeList = function(){
		return $http.get(url + 'siteapi/get_movement_code_list');
	}
	
	this.getBinListByItemCodeStorageId = function(itemCode, storageId){
		return $http.get(url + 'siteapi/get_bin_list_by_item_code_storage_id/' + itemCode + '/' + storageId);
	}
	
	this.stockCardPDF = function(batchReference){
		//return $http.post(url + 'create_pdf' , requestReference);
		
		var download = $window.open(url + 'siteapi/stock_card_pdf/' + batchReference,"location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
		download.history.pushState("blank", "blank", "blank");
		//							( STRING, TITLE, URL)
	}
});