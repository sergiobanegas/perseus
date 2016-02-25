perseus.factory("serviceTeamInvite", serviceTeamInvite);

serviceTeamInvite.$inject = [ "$resource", "$timeout"];

function serviceTeamInvite($resource, $timeout) {

	var TeamInviteResource = $resource('/teaminvites/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var TeamInvites = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getTeamInvites : getTeamInvites,
		getTeamInvite : getTeamInvite,		
		newTeamInvite : newTeamInvite,
		updateTeamInvite : updateTeamInvite,
		deleteTeamInvite : deleteTeamInvite
		}

	function reload(){
		return TeamInviteResource.query(function(newTeamInvites){
			TeamInvites.length = 0;
			TeamInvites.push.apply(TeamInvites, newTeamInvites);
		}).$promise;
	}
	
	function getTeamInvites() {
		return TeamInvites;
	}

	function getTeamInvite(id) {
		for (var i = 0; i < TeamInvites.length; i++) {
			if (TeamInvites[i].id.toString() === id.toString()) {
				return TeamInvites[i];
			}
		}
	}
	
	function newTeamInvite(newTeamInvite) {
		new TeamInviteResource(newTeamInvite).$save(function(TeamInvite) {
			TeamInvites.push(TeamInvite);
		});
			
	}

	function updateTeamInvite(updatedTeamInvite) {
		updatedTeamInvite.$update();
	}

	function deleteTeamInvite(TeamInvite) {
		var request = $resource('/teaminvites/:id', { id: TeamInvite.id});
		request.delete();
	}	
	
}