kurento_room.factory("serviceChatMessage", serviceChatMessage);

serviceChatMessage.$inject = [ "$resource", "$timeout"];

function serviceChatMessage($resource, $timeout) {

	var ChatMessageResource = $resource('/chatmessages/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var chatMessages = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getChatMessages : getChatMessages,
		getChatMessage : getChatMessage,		
		newChatMessage : newChatMessage,
		updateChatMessage : updateChatMessage,
		deleteChatMessage : deleteChatMessage
	}

	function reload(){
		return ChatMessageResource.query(function(newchatMessages){
			chatMessages.length = 0;
			chatMessages.push.apply(chatMessages, newchatMessages);
		}).$promise;
	}
	
	function getChatMessages() {
		return chatMessages;
	}

	function getChatMessage(id) {
		for (var i = 0; i < chatMessages.length; i++) {
			if (chatMessages[i].id.toString() === id.toString()) {
				return chatMessages[i];
			}
		}
	}
	
	function newChatMessage(newChatMessage) {
		new ChatMessageResource(newChatMessage).$save(function(chatMessage) {
			chatMessages.push(chatMessage);
		});			
	}

	function updateChatMessage(updatedChatMessage) {
		updatedChatMessage.$update();
	}

	function deleteChatMessage(chatMessage) {
		var chatmessage = $resource('/chatmessages/:id', { id: chatMessage.id});
		chatmessage.delete();
	}	
}