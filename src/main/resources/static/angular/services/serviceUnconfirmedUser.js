perseus.factory("serviceUnconfirmedUser", serviceUnconfirmedUser);

serviceUnconfirmedUser.$inject = [ "$resource", "$timeout"];

function serviceUnconfirmedUser($resource, $timeout) {
	
	
	var UnconfirmedUserResource = $resource('/unconfirmedusers/:id', 
		{ id : '@id'}, 
		{ update : {method : 'PUT'}}
	);

	var unconfirmedUsers = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getUnconfirmedUsers : getUnconfirmedUsers,
		getUnconfirmedUser : getUnconfirmedUser,
		newUnconfirmedUser : newUnconfirmedUser,
		updateUnconfirmedUser : updateUnconfirmedUser,
		deleteUnconfirmedUser : deleteUnconfirmedUser
	}

	function reload(){
		return UnconfirmedUserResource.query(function(newunconfirmedUsers){
			unconfirmedUsers.length = 0;
			unconfirmedUsers.push.apply(unconfirmedUsers, newunconfirmedUsers);
		}).$promise;
	}
	
	function getUnconfirmedUsers() {
		return unconfirmedUsers;
	}

	function getUnconfirmedUser(id) {
		for (var i=0; i< unconfirmedUsers.length;i++){
			if (unconfirmedUsers[i].id==id){
				return unconfirmedUsers[i];
				break;
			}
		}
	};
	
	function newUnconfirmedUser(newUnconfirmedUser) {
		new UnconfirmedUserResource(newUnconfirmedUser).$save(function(unconfirmedUser) {
			unconfirmedUsers.push(unconfirmedUser);
		});	
	}
	
	function updateUnconfirmedUser(updatedUnconfirmedUser) {
		UnconfirmedUserResource.update({id: updatedUnconfirmedUser.id}, updatedUnconfirmedUser);
	}

	function deleteUnconfirmedUser(unconfirmedUser) {
		var unconfirmedUser = $resource('/unconfirmedusers/:id', { id: unconfirmedUser.id});
		unconfirmedUser.delete();
	}	
}