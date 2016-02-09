perseus.factory("serviceTeam", serviceTeam);

serviceTeam.$inject = [ "$resource", "$timeout"];

function serviceTeam($resource, $timeout) {

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
	
	function getTeam(id){
		for (var i=0; i<teams.length;i++){
			if (teams[i].id==id){
				return teams[i];
				break;
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