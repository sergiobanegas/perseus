perseus.factory("servicePrivateMessage", servicePrivateMessage);

servicePrivateMessage.$inject = [ "$resource", "$timeout"];

function servicePrivateMessage($resource, $timeout) {

	var PrivateMessageResource = $resource('/privatemessages/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var privateMessages = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getPrivateMessages : getPrivateMessages,
		getPrivateMessage : getPrivateMessage,		
		newPrivateMessage : newPrivateMessage,
		updatePrivateMessage : updatePrivateMessage,
		deletePrivateMessage : deletePrivateMessage
	}

	function reload(){
		return PrivateMessageResource.query(function(newprivateMessages){
			privateMessages.length = 0;
			privateMessages.push.apply(privateMessages, newprivateMessages);
		}).$promise;
	}
	
	function getPrivateMessages() {
		return privateMessages;
	}

	function getPrivateMessage(id) {
		for (var i = 0; i < privateMessages.length; i++) {
			if (privateMessages[i].id.toString() === id.toString()) {
				return privateMessages[i];
			}
		}
	}
	
	function newPrivateMessage(newPrivateMessage) {
		new PrivateMessageResource(newPrivateMessage).$save(function(privateMessage) {
			privateMessages.push(privateMessage);
		});			
	}

	function updatePrivateMessage(updatedPrivateMessage) {
		updatedPrivateMessage.$update();
	}

	function deletePrivateMessage(privateMessage) {
		var privatemessage = $resource('/privatemessages/:id', { id: privateMessage.id});
		privatemessage.delete();
	}	
}