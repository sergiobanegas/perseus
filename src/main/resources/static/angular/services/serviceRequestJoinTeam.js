perseus.factory("serviceRequestJoinTeam", serviceRequestJoinTeam);

serviceRequestJoinTeam.$inject = [ "$resource", "$timeout"];

function serviceRequestJoinTeam($resource, $timeout) {

	var RequestJoinTeamResource = $resource('/requestjointeams/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var RequestJoinTeams = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getRequestJoinTeams : getRequestJoinTeams,
		getRequestJoinTeam : getRequestJoinTeam,		
		newRequestJoinTeam : newRequestJoinTeam,
		updateRequestJoinTeam : updateRequestJoinTeam,
		deleteRequestJoinTeam : deleteRequestJoinTeam
		}

	function reload(){
		return RequestJoinTeamResource.query(function(newRequestJoinTeams){
			RequestJoinTeams.length = 0;
			RequestJoinTeams.push.apply(RequestJoinTeams, newRequestJoinTeams);
		}).$promise;
	}
	
	function getRequestJoinTeams() {
		return RequestJoinTeams;
	}

	function getRequestJoinTeam(id) {
		for (var i = 0; i < RequestJoinTeams.length; i++) {
			if (RequestJoinTeams[i].id.toString() === id.toString()) {
				return RequestJoinTeams[i];
			}
		}
	}
	
	function newRequestJoinTeam(newRequestJoinTeam) {
		new RequestJoinTeamResource(newRequestJoinTeam).$save(function(RequestJoinTeam) {
			RequestJoinTeams.push(RequestJoinTeam);
		});
			
	}

	function updateRequestJoinTeam(updatedRequestJoinTeam) {
		updatedRequestJoinTeam.$update();
	}

	function deleteRequestJoinTeam(RequestJoinTeam) {
		var request = $resource('/requestjointeams/:id', { id: RequestJoinTeam.id});
		request.delete();
	}	
	
}