/*
 * @author Sergio Banegas Cortijo
 */

var perseus = angular.module('perseus', ['ngMaterial', 'ngResource', 'ngRoute', 'FBAngular', 'ngCookies', 'ngLetterAvatar', 'angular-web-notification', 'ngEmoticons', 'ngSanitize', 'emojiApp']);

perseus.config(function ($routeProvider, $mdIconProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'angular/home/home.html',
                controller: 'homeController'
            })
            .when('/admin', {
                templateUrl: 'angular/admin/admin.html',
                controller: 'adminController'
            })
            .when('/registration', {
                templateUrl: 'angular/registration/registration.html',
                controller: 'registerController'
            })
            .when('/emailvalidation/:code', {
            	controller: 'emailValidationController',
                templateUrl: 'angular/registration/emailvalidation.html'
            })
            .when('/user/:id', {
                templateUrl: 'angular/user/user.html',
                controller: 'userController'
            })
            .when('/newteam', {
                templateUrl: 'angular/team/newteam.html',
                controller: 'newTeamController'
            })
            .when('/jointeam', {
                templateUrl: 'angular/team/jointeam.html',
                controller: 'joinTeamController'
            })
            .when('/team/:id', {
                templateUrl: 'angular/team/team.html',
                controller: 'teamController'
            })
            .when('/team/:id/admin', {
                templateUrl: 'angular/team/admin.html',
                controller: 'adminTeamController'
            })
            .when('/call', {
                templateUrl: 'angular/call/call.html',
                controller: 'callController'
            })
            .otherwise({
                templateUrl: 'angular/error.html'
            });
    $mdIconProvider.defaultFontSet("material-icons");
});