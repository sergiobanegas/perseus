/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('emailValidationController', function ($routeParams, $scope, $window, $http, serviceNotification) {

	$http.get('/emailvalidation/'+$routeParams.code)
	  .then(function(result) {
		  $window.location.href = '#/';
		  serviceNotification.showNotification("Email validated", "Welcome to Perseus!, now you can login with your credentials");
	});
});