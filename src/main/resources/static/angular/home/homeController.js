/*
 * @author Micael Gallego (micael.gallego@gmail.com)
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('homeController', function ($http, $resource, $scope, $window, serviceUser, serviceParticipate, serviceTeam, $location, $route, $filter, LxNotificationService, LxDialogService) {
	
	$scope.user = serviceUser.getSession();
	$scope.users = serviceUser.getUsers();
	$scope.teams= serviceParticipate.getParticipates();
	$scope.primerUser=serviceUser.getUser(1);
	$scope.userName = "";
	
	$scope.teamsUser=[];	
	
	$scope.teamName="";
	
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
				LxNotificationService.error('Fill in all fields');
			}
	};
	
	$scope.logout = function(){		
		serviceUser.logout();
		user={};
		$route.reload();
		LxNotificationService.success("Goodbye!");
	};
	
	
	$scope.opendDialog = function(dialogId){
	    LxDialogService.open(dialogId);
	};
	
	$scope.closingDialog = function(dialogId){
	    LxDialogService.close(dialogId);
	};
});