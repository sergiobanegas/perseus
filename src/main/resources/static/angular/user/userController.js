/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('userController', function ($mdDialog, $http, $scope, $route, $routeParams, $window, serviceUser) {
  
	$scope.user=serviceUser.getSession();
	$scope.userProfile={};
	$http.get('/users/'+$routeParams.id)
	  .then(function(result) {
	    $scope.userProfile = result.data;
	});
	$scope.editName=0;
	$scope.editEmail=0;
	
	$scope.updateUser = function(){
		serviceUser.updateUser($scope.userProfile);
		serviceUser.logout();
		serviceUser.loginUser($scope.userProfile);
		$scope.editName=0;
		$scope.editEmail=0;
		$route.reload();
	};
	
	$scope.showInput = function(option){
		switch (option){
			case "name":
				if($scope.editName==1){
					$scope.editName=0;
				}
				else{
					$scope.editName=1;
				}
				break;
			case "email":
				if($scope.editEmail==1){
					$scope.editEmail=0;
				}
				else{
					$scope.editEmail=1;
				}
				break;
		}
	};
	
	$scope.deleteAccount = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose: true,
	      templateUrl: 'angular/user/dialogs/deleteAccount.tmpl.html',
	      locals: {
	        user: $scope.userProfile
	      },
	      controller: userActionsController
	   })
	}
});


function userActionsController($scope, $mdDialog, $window, serviceNotification, serviceUser, user) {

	$scope.deleteAccount = function(){
		serviceUser.deleteUser(user);
		serviceUser.logout();
		$mdDialog.hide();
		$window.location.href = '#/';
		serviceNotification.showNotification("Goodbye "+user.name, "Come back soon!");
	};
	
	$scope.closeDialog = function() {
		$mdDialog.hide();
	}
	
}