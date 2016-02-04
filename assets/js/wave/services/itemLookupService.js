app.service('ItemLookupService', function($rootScope, ApiCallService) {
        this.itemLookup = [];
	
        this.getAllItems = function() {
            //return $rootScope.itemLookup;
			return JSON.parse(localStorage.getItem('vontisItemList'));
        }
        
        this.getItemName = function(itemCode) {
			
			//this.itemLookup = $rootScope.itemLookup;
            this.itemLookup = JSON.parse(localStorage.getItem('vontisItemList'));
			
            if (itemCode !== null) {
                for (var i = 0 ; i < this.itemLookup.length ; i++) {
                    if (this.itemLookup[i].item_code == itemCode) {
                        return this.itemLookup[i].item_name;
                    }
                }
                return "";
                
            }
            else {
                return "";
            }
            
        }
        
        this.getItemUnit = function(itemCode) {
			//this.itemLookup = $rootScope.itemLookup;
			this.itemLookup = JSON.parse(localStorage.getItem('vontisItemList'));
			
            if (itemCode !== null) {
                for (var i = 0 ; i < this.itemLookup.length ; i++) {
                    if (this.itemLookup[i].item_code == itemCode) {
                        return this.itemLookup[i].item_unit;
                    }
                }
                
                return "";
            }
            else {
                return "";
            }
            
        }
		
		this.getItemType = function(itemCode) {
			this.itemLookup = JSON.parse(localStorage.getItem('vontisItemList'));
			
            if (itemCode !== null) {
                for (var i = 0 ; i < this.itemLookup.length ; i++) {
                    if (this.itemLookup[i].item_code == itemCode) {
                        if (this.itemLookup[i].item_type == null) {
							return "";
						}
						else {
							return this.itemLookup[i].item_type;
						}
                    }
                }
                
                return "";
            }
            else {
                return "";
            }
		}
		
		this.getItemSubType = function(itemCode) {
			this.itemLookup = JSON.parse(localStorage.getItem('vontisItemList'));
			
            if (itemCode !== null) {
                for (var i = 0 ; i < this.itemLookup.length ; i++) {
                    if (this.itemLookup[i].item_code == itemCode) {
						if (this.itemLookup[i].item_subtype == null) {
							return "";
						}
						else { 
                        	return this.itemLookup[i].item_subtype;
						}
                    }
                }
                
                return "";
            }
            else {
                return "";
            }
		}
		
		this.getItemCategory = function(itemCode) {
			this.itemLookup = JSON.parse(localStorage.getItem('vontisItemList'));
			
            if (itemCode !== null) {
                for (var i = 0 ; i < this.itemLookup.length ; i++) {
                    if (this.itemLookup[i].item_code == itemCode) {
						if (this.itemLookup[i].item_category == null) {
							return "";
						}
						else { 
                        	return this.itemLookup[i].item_category;
						}
                    }
                }
                
                return "";
            }
            else {
                return "";
            }
		}
        
        this.getItemLengthWidthHeight = function(itemCode) {
			
			//this.itemLookup = $rootScope.itemLookup;
            this.itemLookup = JSON.parse(localStorage.getItem('vontisItemList'));
			
            if (itemCode !== null) {
                for (var i = 0 ; i < this.itemLookup.length ; i++) {
                    if (this.itemLookup[i].item_code == itemCode) {
                    	if(this.itemLookup[i].length !== null && this.itemLookup[i].width !== null && this.itemLookup[i].height !== null){
	                        var length_width_height = this.itemLookup[i].length + " x " + this.itemLookup[i].width + " x " + this.itemLookup[i].height
	                        return length_width_height;
                    	}else{
	                		var length_width_height = "";
	                        return length_width_height;
                    	}
                    }
                }
                return "";
                
            }
            else {
                return "";
            }
            
        }
        
        this.retrieveItemLookup = function() {
            
            ApiCallService.getItemLookup().
                success(function(data, status, headers, config) {
                    //console.log(data);
                    this.itemLookup = data.item_details_list;
					//$rootScope.itemLookup = this.itemLookup;
					localStorage.setItem('vontisItemList', JSON.stringify(this.itemLookup));
					//console.log($rootScope.itemLookup);
                }).
                error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(header);
                    console.log(config);
                });
            
            //this.itemLookup = 
        }
		

        
    });