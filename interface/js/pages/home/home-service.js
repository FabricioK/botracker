; (function (ng, app) {
    "use strict";

    app.factory("homeService", homeService);
    homeService.$inject = ['$http']
    function homeService($http) {
        return {           
        }
    }
}
    )(window.angular, window.app);
