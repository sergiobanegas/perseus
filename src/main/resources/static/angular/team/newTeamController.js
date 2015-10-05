/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('newTeamController', function ($scope, $window, serviceUser, serviceTeam, serviceParticipate, $location, $filter, LxNotificationService) {

	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.password="";
	
	$scope.newTeam = function(Team) {
		if ($filter('filter')(serviceTeam.getTeams(), { name: Team.name, password: Team.password}).length==0){			
				if (Team.password===$scope.password){
					serviceTeam.newTeam(Team);	
					var newParticipate={};
					newParticipate.iduser=$scope.user.id;
					newParticipate.team=Team.name;
					serviceParticipate.newParticipate(newParticipate);
					$window.location.href = '#/home';
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
});