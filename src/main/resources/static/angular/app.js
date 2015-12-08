/*
 * @author Sergio Banegas Cortijo
 */

var kurento_room = angular.module('kurento_room', ['ngResource', 'ngRoute', 'FBAngular', 'lumx', 'ngCookies']);

kurento_room.config(function ($routeProvider) {

    $routeProvider
            .when('/', {
                templateUrl: 'angular/home/home.html',
                controller: 'homeController'
            })
            .when('/registration', {
                templateUrl: 'angular/registration/registration.html',
                controller: 'registerController'
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
            .when('/call', {
                templateUrl: 'angular/call/call.html',
                controller: 'callController'
            })
            .otherwise({
                templateUrl: 'error.html',
            });
});