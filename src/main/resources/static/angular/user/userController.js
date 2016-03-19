/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('userController', function ($mdDialog, $mdToast, $scope, $route, $http, $routeParams, $window, serviceUser) {
  
	$scope.user=serviceUser.getSession();
	$scope.userProfile={};
	serviceUser.getUserHttp($routeParams.id).then(function (result){
		$scope.userProfile = result.data;
	});
	
	$scope.editName=0;
	$scope.editEmail=0;
	
	$scope.actualpassword;
	$scope.password1;
	$scope.password2;
	$scope.updateUser = function(){
		if ($scope.userProfile.password==$scope.currentPassword && $scope.password1==$scope.password2){
			$scope.userProfile.password=$scope.password1;
		}
		serviceUser.updateUser($scope.userProfile);
		serviceUser.logout();
		serviceUser.loginUser($scope.userProfile);
		$scope.editName=0;
		$scope.editEmail=0;
		$route.reload();
	};
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
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
	$scope.userImage;
	
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
	
	$("#editProfileLaunchButton").click(function(){
		$("#editProfile").toggle("blind");
	});
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