/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('loginController', function ($scope, $window, $location, serviceUser, LxNotificationService, $filter) {
	
	$scope.users = serviceUser.getUsers();
	
	$scope.userName = "";
		
	$scope.password = "";
	
	$scope.user = serviceUser.getSession();
	
	$scope.login = function() {
			if ($scope.userName && $scope.password){
				var array= $filter('filter')($scope.users, { name: $scope.userName, password: $scope.password });
				if (array.length!=0){
					serviceUser.loginUser(array[0]);
					$scope.user=serviceUser.getSession();//sólo para mostra el name en el mensaje de bienvenida
					$window.location.href = '#/';
					LxNotificationService.success("¡Bienvenido "+$scope.user.name+"!");
				}
				else{
					LxNotificationService.error('User o contraseña erróneos');	
				}
			}
			else{
				LxNotificationService.error('Rellena todos los campos');
			}
	};
	
	$scope.logout = function(){		
		serviceUser.logout();
		$route.reload();
		LxNotificationService.success("¡Hasta pronto!");
	}
	
	$scope.opendDialog = function(dialogId){
	    LxDialogService.open(dialogId);
	};
});