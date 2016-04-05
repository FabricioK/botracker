(function(app) {
    'use strict';
    app.directive('leafletMap', ['$timeout', function($timeout) {

        return {
            restrict: 'EA',
            templateUrl: 'dist/templates/diretivas/leaflet-map.html',
            scope: {

            },
            replace: true,
            compile: function(element, attributes) {
                return {
                    pre: function(scope, element, attributes) {
                        scope.id = 'testando123';
                    },
                    post: function(scope, element, attributes) {
                        $timeout(function() {


                            var mymap = L.map(scope.id).setView([-26.858285, -49.0512394], 18);

                            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                
                            }).addTo(mymap);

                        }, 100
                        )
                    }
                }
            }
        };
    }]);
})(window.app);