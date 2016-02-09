perseus.factory("serviceUser", serviceUser);

serviceUser.$inject = [ "$resource", "$timeout", "$cookieStore"];

function serviceUser($resource, $timeout, $cookieStore) {
	
	
	var UserResource = $resource('/users/:id', 
		{ id : '@id'}, 
		{ update : {method : 'PUT'}}
	);

	var users = [];
	
	var session = $cookieStore.get("user");
	
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getSession : getSession,
		loginUser : loginUser,
		logout : logout,
		getUsers : getUsers,
		getUser : getUser,
		newUser : newUser,
		updateUser : updateUser,
		deleteUser : deleteUser
	}

	function reload(){
		return UserResource.query(function(newusers){
			users.length = 0;
			users.push.apply(users, newusers);
		}).$promise;
	}
	
	function getUsers() {
		return users;
	}
	
	function getSession(){
		return session;
	}

	function getUser(id) {
		for (var i=0; i< users.length;i++){
			if (users[i].id==id){
				return users[i];
				break;
			}
		}
	};
	
	function newUser(newUser) {
		new UserResource(newUser).$save(function(user) {
			users.push(user);
		});	
	}
	
	function loginUser(user) {
		$cookieStore.put("user", user);
		session=user;
	}
	
	function logout() {
		$cookieStore.remove("user");
		session={};
	}

	function updateUser(updatedUser) {
		UserResource.update({id: updatedUser.id}, updatedUser);
	}

	function deleteUser(user) {
		var user = $resource('/users/:id', { id: user.id});
		user.delete();
	}	
}