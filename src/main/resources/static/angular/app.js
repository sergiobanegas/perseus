/*
 * @author Sergio Banegas Cortijo
 */

var kurento_room = angular.module('kurento_room', ['ngMaterial', 'ngResource', 'ngRoute', 'FBAngular', 'ngCookies', 'ngLetterAvatar']);

kurento_room.config(function ($routeProvider) {

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
                templateUrl: 'angular/registration/registration.html'
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
                templateUrl: 'error.html',
            });
});