/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('userController', function ($scope, $route, $routeParams, $window, serviceUser, LxNotificationService, LxDialogService) {
  
	$scope.user=serviceUser.getSession();
	$scope.userProfile=serviceUser.getUser($routeParams.id);
	$scope.editName=0;
	$scope.editEmail=0;
	
	$scope.updateUser = function(){
		serviceUser.updateUser($scope.userProfile);
		serviceUser.logout();
		serviceUser.loginUser($scope.userProfile);
		$scope.editName=0;
		$scope.editEmail=0;
		$route.reload();
		LxNotificationService.success("¡Changes successfully made!");
	}
	
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
	}
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
		LxNotificationService.success("¡Hasta pronto!");
	}
	
	$scope.deleteAccount = function(){
		serviceUser.deleteUser($scope.userProfile);
		serviceUser.logout();
		$window.location.href = '#/';
	    LxNotificationService.success("Come back soon!");
	}
	
	$scope.opendDialog = function(dialogId){
	    LxDialogService.open(dialogId);
	};
	
	$scope.closingDialog = function(dialogId){
	    LxDialogService.close(dialogId);
	};
	
	$scope.exit = function(){
		$window.location.href = '#/';
	}
});