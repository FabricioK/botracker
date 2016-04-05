(function (app) {

    'use strict';

    app.controller("homeController", homeController);
    homeController.$inject = ['$scope', '$rootScope', '$stateParams', 'homeService']
    function homeController($scope, $rootScope, $stateParams, homeService) {
       
    };
})(window.app);