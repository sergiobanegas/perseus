/*
 * @author Micael Gallego (micael.gallego@gmail.com)
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('homeController', function ($scope, $filter, $route, serviceUser, serviceParticipate, LxNotificationService) {
	$scope.user = serviceUser.getSession();
	$scope.lista=serviceParticipate.getParticipates();
	$scope.prueba = serviceUser.getUser(1);
	$scope.teams = $filter('filter')($scope.lista, { iduser: $scope.user.id });	
	
	$scope.logout = function(){		
			serviceUser.logout();
			user={};
			$route.reload();
			LxNotificationService.success("¡Hasta pronto!");
	}
});