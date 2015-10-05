/*
 * @author Micael Gallego (micael.gallego@gmail.com)
 * @author Raquel Díaz González
 */

kurento_room.controller('loginController', function ($scope, $route, ServiceParticipant, $window, ServiceRoom, serviceUser, LxNotificationService, $translate) {
 
    $scope.user=serviceUser.getSession();
    
    $scope.logout = function(){		
		serviceUser.logout();
		$route.reload();
		if ($translate.use()==='es'){
			LxNotificationService.success("¡Hasta pronto!");
		}
		else if ($translate.use()==='en'){
			LxNotificationService.success("Goodbye!");
		}
	}
});


