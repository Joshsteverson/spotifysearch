/*global angular */


angular.module('mainApp')

	.controller('spotify', function Spotify($scope, $routeParams, $filter, $location, $spotifyapi) {
		'use strict';
        
        var Spotify = $scope.Spotify = new (function() {

            var self = this, 
                tab = $scope.tab = '',
                tabs = $scope.tabs = [
                {name:'artist', c:0, active:false, page:0, data:{}, maxpages:0}, 
                {name:'album', c:0, active:false, page:0, data:{}, maxpages:0}, 
                {name:'track', c:0, active:false, page:0, data:{}, maxpages:0}],
                alldata = $scope.alldata = {}, 
                missingImage = $scope.missingImage = 'assets/missingimage.jpg';

        	this.initiateSearch = function($e) {
        		if($e)
        			if($e.keyCode === 13){

                        //clear existing search data if 
                        //the search term has changed
                        if($scope.displayTerm)
                            if($scope.displayTerm !== $scope.searchTerm)
                                $scope.alldata.clear();
                            
                        for(var t in $scope.tabs)
                            this.search($scope.tabs[t].name, 0);
        	
                        this.setTab('artist');
        	       }
            };

            this.setTab = function(t) {
                console.log('SETTAB!!')
                this.tab = $scope.tab = t;
                if($filter('filter')($scope.tabs, {active: true})[0])
                    $filter('filter')($scope.tabs, {active: true})[0].active=false;

                if($filter('filter')($scope.tabs, {name: t})[0])
                    $filter('filter')($scope.tabs, {name: t})[0].active=true,
                    $scope.currentTab = $filter('filter')(tabs, {name:t})[0];

            };

            /*
                This function assigns the page data for the page number and tab name passed. 
                This function is used to handle calls for pages that are not yet pulled locally
                by checking for the existence of the page number in the alldata object for the 
                given tab. If found, and not empty, a new search is not done.  
            */
            this.setTabData = function(tab, page) {
                console.log('SETTABDATA!!')
                if( page === -1 )
                    page = 0;

                var newsearch=false;
                if(typeof $scope.alldata[tab].pages[page] === 'undefined'){
                    newsearch = true;
                }else{
                     if(typeof $scope.alldata[tab].pages[page].length === 'undefined')
                        newsearch=true;
                }

                if(newsearch)
                    this.search(tab, page);
                
                $filter('filter')($scope.tabs, {name: tab})[0].data = $scope.alldata[tab].pages[page];
                $filter('filter')($scope.tabs, {name: tab})[0].page = page;
       
            };

            /*
                There is probably a better way to do this. 
                This function returns an array of numbers for the pagination. 
                Based on the current page selected on the tab the "middle" is 
                determined and then five is added on either side. For example:
                middle = 7; ==> [2,3,4,5,6,7,8,9,10,11,12]
            */
            this.getPageNav = function() {
                var pagenav = [],
                    middle = (($scope.currentTab) ? $scope.currentTab.page : 0),
                    bottom = 0,
                    top = 0;
               
                if(middle <= 5){
                    bottom = 0;
                    top = 10;
                }
                if(middle > 5) {
                    bottom = middle-5;
                    top = middle + 5;
                }

                //handling cases of results less than 20 (1 page).
                if($scope.currentTab)
                    if(top>$scope.currentTab.maxpages)
                        top = $scope.currentTab.maxpages;
                
                //adjust up to allow me to globally adjust down. 
                if(top===0)
                    top = 1;

                //globally adjust down.
                if(top>0)
                    top--;

                for(var i=bottom; i<=top; i++ )
                    pagenav.push(i);

                return pagenav;

            };

            /*
                this function performs a search for each of the tabs in $scope.tabs. 
            */
            this.search = function(type, page) {

                var success = function(s) {
                        //console.log(JSON.parse(s.body));
                        s = JSON.parse(s.body);
                        $filter('filter')($scope.tabs, {name: type})[0].c =s[type+'s'].total;
                        $scope.displayTerm = $scope.searchTerm;
                        $scope.alldata.addData(type, page, s[type+'s'].total, s[type+'s'].items);
                        self.setTabData(type, (page || -1));
                    },
                    params = {},
                    opt = {};

                params.q = $scope.searchTerm,
                params.type = type,
                params.offset = (function(){
                   if(!page)
                        return 0;

                    return (page * 20);
                })(),
                opt = {params: params},
                opt.success = success;
                
                $spotifyapi.sendRequest(opt);                       
            };

            /*
                This function extends the alldata object.

            */
            alldata.addData = function(tab, page, total, d){
                var self = this;

                if(self[tab]){
                    self[tab].pages[page] = d;
                    
                    if($scope.currentTab)
                        $filter('filter')($scope.tabs, {name:tab})[0].maxpages = Math.round(total/20);
                    
                }else{
                    self[tab] = {};
                    self[tab].pages = [];

                    for(var i=0; i<Math.round(total/20);i++)
                       self[tab].pages.push({}); 
                    
                    if($scope.currentTab)
                        $filter('filter')($scope.tabs, {name:tab})[0].maxpages = Math.round(total/20);
                    
                    self[tab].pages[0] = d;
                }
                return self;
            };

            /*
                This function extends the alldata object.
                
            */
            alldata.clear = function() {
                var self = this;

                for(var t in self) {
                    
                    if(typeof self[t] === 'function')
                        continue;

                    var total = self[t].pages.length;
                    console.log('t='+t);
                    self[t] = {};
                    self[t].pages = [];

                    for(var i=0; i<Math.round(total/20);i++)
                       self[t].pages.push({}); 

                }
                
                return self;
            };

            Number.prototype.friendly = function() {
                var n = this;

                if(n > 1000) {
                    n = String(n / 1000);
                    n = n.substring(0, n.indexOf('.')) + 'k';
                }

                return n;
            };

            String.prototype.friendly = function() {
                var self = this;
                
                if(self.length>10)
                    self = self.substring(0, 10) + '..';

                return self;
            };

        })();

	})


