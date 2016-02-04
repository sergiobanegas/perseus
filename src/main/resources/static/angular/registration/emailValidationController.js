/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('emailValidationController', function ($routeParams, $scope, $window, $location, $http, serviceNotification) {

	$scope.code="hola";
	$http.get('/emailvalidation/'+$routeParams.code)
	  .then(function(result) {
		  $scope.code="adios";
		  $window.location.href = '#/';
		  serviceNotification.showNotification("Email validated", "Welcome to Perseus!, now you can login with your credentials");
	});
});