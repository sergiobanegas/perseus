/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('newTeamController', function ($scope, $window, serviceUser, serviceTeam, serviceParticipate, $location, $filter, LxNotificationService) {

	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.password="";
	
	$scope.newTeam = function(Team) {//conseguir id de team
		if ($filter('filter')(serviceTeam.getTeams(), { name: Team.name}).length==0){			
				if (Team.password===$scope.password){
					serviceTeam.newTeam(Team);
					$window.location.href = '#/';
					LxNotificationService.success("You succesfully created "+Team.name+"!");
				}
				else{
					LxNotificationService.success("The password doesn't match!");
				}					
		}
		else{
			LxNotificationService.error("A team with that name already exists!");
		}
	};
	
	$scope.exit = function(){
		$window.location.href = '#/';
	}
});