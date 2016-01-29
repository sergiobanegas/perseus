/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('callController', function ($mdDialog, $mdToast, $scope, $http, $route, $window, serviceUser, serviceRoom, serviceTeam, ServiceParticipant, serviceKurentoRoom, serviceChatMessage, serviceParticipateRoom, Fullscreen) {
	
	$scope.user=serviceUser.getSession();
    $scope.roomName = serviceKurentoRoom.getRoomName();
    $scope.roomId=serviceKurentoRoom.getRoomId();
    $scope.creator=serviceKurentoRoom.getCreator();
    
    $scope.userName = serviceKurentoRoom.getUserName();
    $scope.participants = ServiceParticipant.getParticipants();
    $scope.kurento = serviceKurentoRoom.getKurento();
    $scope.chatMessages = serviceChatMessage.getChatMessages();
    
    $scope.room={};
    $http.get('/rooms/'+serviceKurentoRoom.getTeam()+'/'+serviceKurentoRoom.getRoomName())
	  .then(function(result) {
	    $scope.room = result.data;
	});
    
    $scope.room = function(){
    	for (var i=0;i<serviceRoom.getRooms().length;i++){
    		if (serviceRoom.getRooms()[i].id==$scope.roomId){
    			return serviceRoom.getRooms()[i];
    		}
    	}
    }
    
    $scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	};
    
    $scope.memberUser = function(){
    	for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
    		if (serviceParticipateRoom.getParticipateRooms()[i].user==$scope.user.id){
    			return serviceParticipateRoom.getParticipateRooms()[i];
    		}
    	}
    }
    
    $scope.findUserById = function(iduser){
		for (var i=0; i< serviceUser.getUsers().length;i++){
			if (serviceUser.getUsers()[i].id==iduser){
				return serviceUser.getUsers()[i];
				break;
			}
		}
	}
    
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
    
    
    $scope.teamUsers=[];
    $http.get('/participates/'+serviceKurentoRoom.getTeam()+'/members')
	  .then(function(result) {
	    $scope.teamUsers = result.data;
	});

    
    $scope.leavePrivateRoom = function($event){
    	var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	    	  '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
		        '<md-toolbar>'+
		        '<div class="md-toolbar-tools">'+
		          '<span flex><h2>Leave room</h2></span>'+
		          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
		           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
		          '</md-button>'+
		        '</div>'+
		        '</md-toolbar>'+
		        '<md-dialog-content>'+
		        '<div class="md-dialog-content">'+
		        "Are you sure you want to leave this room? You'll have to send a petition to enter again "+
		        '</div>'+
		        '  <md-dialog-actions>' +
		        '  <md-button style="background-color:red" ng-click="leaveRoom()" >' +
		        '      Leave' +
		        '    </md-button>' +
		        '    <md-button ng-click="closeDialog()" class="md-primary">' +
		        '      Cancel' +
		        '    </md-button>' +
		        '  </md-dialog-actions>' +
		        '</md-dialog>',
	      locals: {
	    	team: serviceKurentoRoom.getTeam(),
	    	room: serviceKurentoRoom.getRoomName(),
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
    	var roomInvite;
    	for (var i=0;i<serviceRoom.getRooms().length;i++){
			if (serviceRoom.getRooms()[i].name==$scope.roomName){
				roomInvite=serviceRoom.getRooms()[i].id;
			}
		}
    	
    	
    	var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" style="height:100%;width:100%"ng-cloak>' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	          '<span flex><h2>Leave team</h2></span>'+
	          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        'Invite people to the room!'+
	        '<div>'+
	        '<md-list-item ng-click="" class="md-2-line" ng-repeat="user in teamUsers" ng-show="!roomMember(user)">'+
	        '<div class="md-list-item-text">'+
	        '<p>{{user.userName}}</p>'+
	        '<md-icon ng-click="inviteUser(user.iduser, $event)" aria-label="Invite user" class="material-icons md-secondary md-hue-3" style="color: blue;">clear</md-icon>'+
	        '</div>'+
      '</md-list-item>'+
	        '<md-button class="md-primary" ng-click="sendInvitation(email)">'+
	        'Enviar'+
	        '</md-button>'+
	        '</div>'+
	        '</div>'+
	        '</md-dialog>',
	      locals: {
	    	team: serviceKurentoRoom.getTeam(),
	    	room: roomInvite,
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
    	  var message = {};
    	  message.room=$scope.roomName;
    	  message.team=serviceKurentoRoom.getTeam();
    	  message.text=$scope.chatMessage;
    	  message.user=$scope.userName;
    	  $scope.chatMessage="";
    	  serviceChatMessage.newChatMessage(message);
    };
    
    $scope.desktopShare = function(){
    	
    }
});

function inviteRoomController($scope, $filter, $mdDialog, $mdToast, serviceRoom, serviceParticipateRoom, $window, serviceParticipate, serviceRoom, serviceTeam, serviceRoomInvite, team, room, teamUsers, user) {

	$scope.selectedUser='';
	$scope.sessionUser=user;
	$scope.teamUsers=teamUsers;
	$scope.roomMember = function(participate){
		for (var i=0;serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].user==participate.iduser && serviceParticipateRoom.getParticipateRooms()[i].room == room){
				return true;
			}
		}
		return false;
	}		
	$scope.inviteUser = function(userid){
		var roominvite={};
		roominvite.user=userid;
		roominvite.transmitter=user.id;
		roominvite.room=room;
		var exists=false;
		for (var i=0;i<serviceRoomInvite.getRoomInvites().length;i++){
			if (serviceRoomInvite.getRoomInvites()[i].room==roominvite.room && serviceRoomInvite.getRoomInvites()[i].user==userid){
				exists=true;
				break;
			}
		}
		if (exists){
			$scope.notification("An invitation was already sent to this user");
		}else{
			serviceRoomInvite.newRoomInvite(roominvite);
			
			$scope.notification("Invited");
		}
		
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
function leaveRoomController($scope, $filter, $mdDialog, $mdToast, serviceRoom, $window, serviceParticipateRoom, serviceRoom, serviceTeam, serviceRoomInvite, team, room, user) {
		
		$scope.leaveRoom = function(){	
			var thisroom={};
	    	for (var i=0;i<serviceRoom.getRooms().length;i++){
	    		if (serviceRoom.getRooms()[i].name==room){
	    			thisroom=serviceRoom.getRooms()[i];
	    		}
	    	}
				for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
					if (serviceParticipateRoom.getParticipateRooms()[i].user==user.id && serviceParticipateRoom.getParticipateRooms()[i].room==thisroom.id){
						serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
						break;
					}				
				}
				$mdDialog.hide();
				$window.location.href = '#/team/'+team;
				$scope.notification("You left the room");			
		}
		
		$scope.notification = function(text) {
		    $mdToast.show(
		      $mdToast.simple()
		        .textContent(text)
		        .position("bottom right")
		        .hideDelay(3000)
		    );
		};
		
		$scope.closeDialog = function() {
			$mdDialog.hide();
		}

}