angular.module('mainApp')

    .directive('ngGrid', function($compile){


        return {
            scope:true,
            controller: function($scope){

                $scope.groupData = function(){
                    if(!$scope.currentTab)
                        return;

                    var groupedData = [],
                        groupedLine = [],
                        i=0;

                    var data = $scope.currentTab.data

                    for(d in data) {
   
                        groupedLine.push(data[d]);

                        i++;

                        if((i%5)==0 && i>0){
                            groupedData.push(groupedLine);
                            groupedLine = [];
                        }
                    }
                    
                    if(groupedLine.length>0)
                        groupedData.push(groupedLine);

                   return groupedData;
                };

                $scope.$watch('currentTab.data', function(){
                    $scope.data = $scope.groupData();
                });
            }, 
            templateUrl: function() {

                return 'templates/ngGrid.html';

            }

            
        };
    });