kurento_room.factory("serviceParticipate", serviceParticipate);

serviceParticipate.$inject = [ "$resource", "$timeout"];

function serviceParticipate($resource, $timeout) {

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
		deleteParticipate : deleteParticipate
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
	
	function newParticipate(newParticipate) {
		new ParticipateResource(newParticipate).$save(function(Participate) {
			Participates.push(Participate);
		});
			
	}

	function updateParticipate(updatedParticipate) {
		updatedParticipate.$update();
	}

	function deleteParticipate(Participate) {
		Participate.$remove(function() {
			Participates.splice(Participates.indexOf(Participate), 1);
		});
	}	
	
}