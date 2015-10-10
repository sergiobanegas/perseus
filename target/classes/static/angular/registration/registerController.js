/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('registerController', function ($scope, $window, serviceUser, $location, $route, $filter, LxNotificationService) {
	$scope.users=serviceUser.getUsers();
	$scope.user=serviceUser.getSession();
	$scope.register = function(newUser) {
		if ( $filter('filter')($scope.users, { name: newUser.name }).length==0 ){			
			if ((newUser.name==="admin")&&(newUser.password==="1234")){
				newUser.privileges=1;				
			}
			else {
				newUser.privileges=0;
			}
			serviceUser.newUser(newUser);	
			$window.location.href = '#/';
			LxNotificationService.success("¡Bienvenido "+newUser.name+"!, ya puedes iniciar sesión con tu cuenta");	
		}
		else{
			LxNotificationService.error('¡Ya existe un usuario con ese nombre!');
		}
	};
});