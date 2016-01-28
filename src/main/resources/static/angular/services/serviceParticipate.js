kurento_room.factory("serviceParticipate", serviceParticipate);

serviceParticipate.$inject = [ "$resource", "$timeout", "$q", "$http"];

function serviceParticipate($resource, $timeout, $q, $http) {

	var ParticipateResource = $resource('/participates/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var Participates = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getParticipates : getParticipates,
		getParticipate : getParticipate,		
		newParticipate : newParticipate,
		updateParticipate : updateParticipate,
		deleteParticipate : deleteParticipate,
		getModerators : getModerators
		}

	function reload(){
		return ParticipateResource.query(function(newParticipates){
			Participates.length = 0;
			Participates.push.apply(Participates, newParticipates);
		}).$promise;
	}
	
	function getParticipates() {
		return Participates;
	}

	function getParticipate(id) {
		for (var i = 0; i < Participates.length; i++) {
			if (Participates[i].id.toString() === id.toString()) {
				return Participates[i];
			}
		}
	}
	
	function getModerators(team){
		var deferred = $q.defer();
		$http.get('/participates/:team/privileges', { team: team}).success(function(data, status, headers, config){
			deferred.resolve(data);
		}).
		error(function(data, status, headers, config){
			deferred.reject(status);
		});
		return deferred.promise;;
	}
	
	function newParticipate(newParticipate) {
		new ParticipateResource(newParticipate).$save(function(Participate) {
			Participates.push(Participate);
		});
			
	}

	function updateParticipate(updatedParticipate) {
		updatedParticipate.$update();
	}

	function deleteParticipate(Participate) {
		var participate = $resource('/participates/:id', { id: Participate.id});
		participate.delete();
	}	
	
}