/*
 * @author Micael Gallego (micael.gallego@gmail.com)
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('homeController', function ($scope, $window, serviceUser, serviceParticipate, $location, $route, $filter, LxNotificationService, LxDialogService) {
	$scope.user = serviceUser.getSession();
	$scope.users = serviceUser.getUsers();
	$scope.prueba = serviceUser.getUser(1);
	$scope.teams= serviceParticipate.getParticipates();
	$scope.primerUser=serviceUser.getUser(1);
	
	$scope.userName = "";
		
	$scope.password = "";
		
	$scope.login = function() {
			if ($scope.userName && $scope.password){
				var array= $filter('filter')($scope.users, { name: $scope.userName, password: $scope.password });
				if (array.length!=0){
					serviceUser.loginUser(array[0]);
					$scope.user=serviceUser.getSession();
					$window.location.reload();
					LxNotificationService.success("Welcome "+$scope.user.name+"!");
				}
				else{
					LxNotificationService.error('The user name or the password are incorrect');	
				}
			}
			else{
				LxNotificationService.error('Rellena todos los campos');
			}
	};
	
	$scope.logout = function(){		
		serviceUser.logout();
		user={};
		$route.reload();
		LxNotificationService.success("Goodbye!");
	}
	
	$scope.opendDialog = function(dialogId){
	    LxDialogService.open(dialogId);
	};
	
	$scope.closingDialog = function(dialogId){
	    LxDialogService.close(dialogId);
	};
});