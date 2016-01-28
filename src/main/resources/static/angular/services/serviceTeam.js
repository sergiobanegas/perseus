kurento_room.factory("serviceTeam", serviceTeam);

serviceTeam.$inject = [ "$resource", "$timeout", "$http", "serviceParticipate", "$cookieStore"];

function serviceTeam($resource, $timeout, $http, serviceParticipate, $cookieStore) {

	var TeamResource = $resource('/teams/:id', 
			{ id : '@id'}, 
			{ update : {method : "PUT"}}
		);
 
	var teams = [];
	
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getTeams : getTeams,
		getTeam : getTeam,		
		newTeam : newTeam,
		updateTeam : updateTeam,
		deleteTeam : deleteTeam,
		getOne : getOne,
		getTeamByName : getTeamByName
	}

	function reload(){
		var promise = TeamResource.query(function(newteams){
			teams.length = 0;
			teams.push.apply(teams, newteams);
		}).$promise;
		return promise;
	}
	
	function getTeams() {
		return teams;
	}
	
	function getOne(teamId){
		var team = TeamResource.get({id:teamId});
		return team;
	}

	function getTeam(id) {
		for (var i = 0; i < teams.length; i++) {
			if (teams[i].id.toString() === id) {
				return teams[i];
			}
		}
	}
	
	function getTeamByName(teamname){
		var team = $resource('/teams/name/:name', { name: teamname});
		return team;
	}

	function newTeam(newTeam) {
		new TeamResource(newTeam).$save(function(team) {
			teams.push(team);
			var user=$cookieStore.get("user");
			var newParticipate={};
			newParticipate.iduser=user.id;
			newParticipate.userName=user.name;
			newParticipate.teamName=team.name;
			newParticipate.idteam=team.id;
			newParticipate.teamPrivileges=2;
			serviceParticipate.newParticipate(newParticipate);
		});		
	}

	function updateTeam(updatedTeam) {
		updatedTeam.$update();
	}
	

	function deleteTeam(team) {
		var team = $resource('/teams/:id', { id: team.id});
		team.delete();
	};
}