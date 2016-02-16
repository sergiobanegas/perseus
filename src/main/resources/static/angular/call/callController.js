/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('callController', function ($mdDialog, $mdToast, $scope, $route, $window, serviceUser, serviceRoom, serviceParticipate, serviceTeam, ServiceParticipant, serviceKurentoRoom, serviceChatMessage, serviceParticipateRoom, Fullscreen) {
	
	$scope.user=serviceUser.getSession();
    $scope.roomName = serviceKurentoRoom.getRoomName();
    $scope.roomId=serviceKurentoRoom.getRoomId();
    $scope.creator=serviceKurentoRoom.getCreator();    
    
    $scope.userName = serviceKurentoRoom.getUserName();
    $scope.participants = ServiceParticipant.getParticipants();
    $scope.kurento = serviceKurentoRoom.getKurento();
    $scope.chatMessages = serviceChatMessage.getChatMessages();
    
    $scope.findUserById = function(id){
    	return serviceUser.getUser(id);
    }
    
    $scope.room={};
    serviceRoom.getRoomHttp(serviceKurentoRoom.getRoomId()).then(function (result){
	    $scope.room = result.data;
	    $("#chatscroll").delay(300).scrollTop($("#chatscroll")[0].scrollHeight);
	});
    
    $scope.teamUsers=[];
    serviceParticipate.getTeamParticipates(serviceKurentoRoom.getTeam()).then(function (result){
	    $scope.teamUsers=result.data;
	});
    
    $scope.memberUser={};
    serviceParticipate.getUserParticipate(serviceKurentoRoom.getTeam(), $scope.user.id).then(function (result){
    	$scope.memberUser=result.data;
    });
    
    $scope.room = function(){
    	return serviceRoom.getRoom($scope.roomId);
    }
    
    $scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	};
	
	//has to be fixed
	$scope.memberUser= function(){
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
    		if (serviceParticipateRoom.getParticipateRooms()[i].user==$scope.user.id && serviceParticipateRoom.getParticipateRooms()[i].room==serviceKurentoRoom.getRoomId()){
    			return serviceParticipateRoom.getParticipateRooms()[i];
    		}
    	}
	}
    //has to be fixed
    $scope.members= function(){
    	var members=[];
    	for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
    		if (serviceParticipateRoom.getParticipateRooms()[i].room==$scope.roomId){
    			members.push(serviceParticipateRoom.getParticipateRooms()[i]);
    		}
    	}
    	return members;
    }
    
    $scope.kickUser = function(member){
    	serviceParticipateRoom.deleteParticipateRoom(member);
    	$scope.notification("User kicked from "+$scope.roomName);
    }
    
    $scope.setModerator = function (member){
    	member.roomPrivileges=1;
		serviceParticipateRoom.updateParticipateRoom(member);
		$scope.notification("New moderator added");
    };

	$scope.removeModerator = function (member){
		member.roomPrivileges=0;
		serviceParticipateRoom.updateParticipateRoom(member);
		$scope.notification("Moderation permissions removed");
	}
    
    $scope.leavePrivateRoom = function($event){
    	var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose: true,
	      templateUrl: 'angular/call/dialogs/leaveRoom.tmpl.html',
	      locals: {
	    	team: serviceKurentoRoom.getTeam(),
	    	room: serviceKurentoRoom.getRoomId(),
	    	user : $scope.user
	      },
	      controller: leaveRoomController
	   })
    }
        
    $scope.leaveRoom = function () {
        serviceKurentoRoom.getKurento().close();
        ServiceParticipant.removeParticipants();
        $window.location.href = '#/team/'+serviceKurentoRoom.getTeam();
    };
    
    $scope.inviteToRoom = function($event){ 
    	var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose: true,
	      templateUrl: 'angular/call/dialogs/invite.tmpl.html',
	      locals: {
	    	team: serviceKurentoRoom.getTeam(),
	    	room: serviceRoom.getRoom($scope.roomId),
	    	teamUsers: $scope.teamUsers,
	    	user : $scope.user
	      },
	      controller: inviteRoomController
	   })	
    }

    window.onbeforeunload = function () {
    	//not necessary if not connected
    	if (ServiceParticipant.isConnected()) {
    		serviceKurentoRoom.getKurento().close();
    	}
    };
    
    $scope.goFullscreen = function () {

        if (Fullscreen.isEnabled())
            Fullscreen.cancel();
        else
            Fullscreen.all();

    };

    $scope.onOffVolume = function () {
        var localStream = serviceKurentoRoom.getLocalStream();
        var element = document.getElementById("buttonVolume");

        if (element.classList.contains("mdi-volume-off")) { //on
            element.classList.remove("mdi-volume-off");
            element.classList.add("mdi-volume-high");
            localStream.audioEnabled = true;
        } else { //off
            element.classList.remove("mdi-volume-high");
            element.classList.add("mdi-volume-off");
            localStream.audioEnabled = false;

        }
    };

    $scope.onOffVideocam = function () {
        var localStream = serviceKurentoRoom.getLocalStream();
        var element = document.getElementById("buttonVideocam");
        if (element.classList.contains("mdi-video-off")) {//on
            element.classList.remove("mdi-video-off");
            element.classList.add("mdi-video");
            localStream.videoEnabled = true;
        } else {//off
            element.classList.remove("mdi-video");
            element.classList.add("mdi-video-off");
            localStream.videoEnabled = false;
        }
    };

    //not used for now
    $scope.disconnectStream = function() {
    	var localStream = serviceKurentoRoom.getLocalStream();
    	var participant = ServiceParticipant.getMainParticipant();
    	if (!localStream || !participant) {
    		$mdDialog.show(
    			      $mdDialog.alert()
    			        .parent(angular.element(document.querySelector('#popupContainer')))
    			        .clickOutsideToClose(true)
    			        .title('Error')
    			        .textContent('Not conected yet')
    			        .targetEvent(ev)
    		);
    		return false;
    	}
    	ServiceParticipant.disconnectParticipant(participant);
    	serviceKurentoRoom.getKurento().disconnectParticipant(participant.getStream());
    }
    
    //chat
    $scope.chatMessage;

    $scope.sendMessage = function () {   	
    	  serviceChatMessage.newChatMessage({room:$scope.roomId, team: serviceKurentoRoom.getTeam(), text: $scope.chatMessage, user: $scope.user.id});
    	  $scope.chatMessage="";
    	  setTimeout(function(){
    			$("#chatscroll").scrollTop($("#chatscroll")[0].scrollHeight);
    	    }, 500);
    };
});

function inviteRoomController($scope, $mdDialog, $mdToast, serviceNotification, serviceUser, serviceParticipateRoom, serviceRoomInvite, team, room, teamUsers, user) {

	$scope.selectedUser='';
	$scope.sessionUser=user;
	$scope.teamUsers=teamUsers;
	$scope.hola="works";
	
	$scope.notMembers= function(){
		var notMembers=[];
		for (var i=0;i<teamUsers.length;i++){
			if (!serviceParticipateRoom.isMember(teamUsers[i].user)){
				notMembers.push(teamUsers[i]);
			}
		}
		return notMembers;
	};
	
	$scope.inviteUser = function(userid){
		var exists=false;
		for (var i=0;i<serviceRoomInvite.getRoomInvites().length;i++){
			if (serviceRoomInvite.getRoomInvites()[i].room==room && serviceRoomInvite.getRoomInvites()[i].user==userid){
				exists=true;
				break;
			}
		}
		if (exists){
			$scope.notification("An invitation was already sent to this user");
		}else{
			serviceRoomInvite.newRoomInvite({user: userid, transmitter: user.id, room: room});
			serviceNotification.showNotification("The invitation was sent", "Sent");			
		}		
	}
	
	$scope.findUserById = function(iduser){
		return serviceUser.getUser(iduser);
	}
	
	$scope.closeDialog = function() {
		$mdDialog.hide();
	}
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	};
}
function leaveRoomController($scope, $mdDialog, $window, serviceNotification, serviceKurentoRoom, ServiceParticipant, serviceParticipateRoom, team, room, user) {
		
		$scope.leaveRoom = function(){	
			for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
				if (serviceParticipateRoom.getParticipateRooms()[i].user==user.id && serviceParticipateRoom.getParticipateRooms()[i].room==room){
					serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
					break;
				}				
			}
			serviceKurentoRoom.getKurento().close();
	        ServiceParticipant.removeParticipants();
			$mdDialog.hide();
			$window.location.href = '#/team/'+team;
			serviceNotification.showNotification("You left the room", "Goodbye!");			
		}
		
		$scope.closeDialog = function() {
			$mdDialog.hide();
		}
		
}