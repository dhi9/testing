app.service('InventoryService', function($http, apiUrl) {
	var url = apiUrl + 'inventoryapi/';
	
	this.getStockSettingByReference = function(reference){
		return $http.get(url + 'get_stock_setting_by_reference/' + reference);
	}
	
	this.insertStockSetting = function(data){
		return $http.post(url + 'insert_stock_setting', data);
	}

	this.rejectStockSettingByReference = function(reference){
		return $http.get(url + 'reject_stock_setting_by_reference/' + reference)
	}
	
	this.getStockMovementListByItemCode = function(item_code){
		return $http.get(url + 'get_stock_movement_list_by_item_code/' + item_code)
	}
	
	this.isSiteEmpty = function(siteId){
		return $http.get(url + 'is_site_empty/' + siteId)
	}
    this.getOpnameListByCreatorId = function(){
        return $http.get(url + 'get_opname_by_creator_id');
    }

    this.insertStockOpname = function(data){
        return $http.post(url + 'insert_stock_opname', data);
    }

    this.getSiteItemListByMonth = function(data){
        return $http.post(url + 'start_opname_item_by_month', data);
    }

    this.getOpnameList = function(){
        return $http.get(url + 'get_opname_list');
    }

    this.getOpnameDetail = function(stockOpnameId){
        return $http.get(url + 'get_opname_detail/' + stockOpnameId);
    }

    this.getOpnameItemList = function(stockOpnameId){
        return $http.get(url + 'get_opname_item_list/' + stockOpnameId);
    }

    this.isUserHasOpnameAccess = function(){
        return $http.get(url + 'is_user_has_opname_access');
    }

    this.approveOpnameItem = function(data){
        return $http.post(url + 'approve_opname_item', data);
    }

    this.startOpname = function(data){
        return $http.post(url + 'start_opname_by_month', data);
    }

    this.getStockDisplay = function(){
        return $http.get(url + 'get_stock_display');
    }
	this.getStockDisplayByFilter = function(data){
		return $http.post(url + 'get_stock_display_by_filter', data);
	}

	this.isDataForImportStockValid = function(data){
		return $http.post(url + 'is_data_for_import_stock_valid', data);
	}

	this.startImportStock = function(data){
		return $http.post(url + 'start_import_stock', data);
	}

	this.getAttributeValueListByAttributeName = function(data){
		return $http.get(url + 'get_attribute_value_list_by_attribute_name/' + data);
	}
});
