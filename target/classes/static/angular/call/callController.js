/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('callController', function ($scope, $window, serviceUser, ServiceParticipant, serviceKurentoRoom, serviceChatMessage, Fullscreen, LxNotificationService) {
	
	$scope.user=serviceUser.getSession();
	$scope.team = serviceKurentoRoom.getTeam();
    $scope.roomName = serviceKurentoRoom.getRoomName();
    $scope.userName = serviceKurentoRoom.getUserName();
    $scope.participants = ServiceParticipant.getParticipants();
    $scope.kurento = serviceKurentoRoom.getKurento();
    $scope.chatMessages = serviceChatMessage.getChatMessages();
    
    $scope.leaveRoom = function () {

        serviceKurentoRoom.getKurento().close();

        ServiceParticipant.removeParticipants();

        $window.location.href = '#/team/'+$scope.team;
    };

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
    		LxNotificationService.alert('Error!', "Not connected yet", 'Ok', function(answer) {
            });
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
    	  message.team=$scope.team.id;
    	  message.text=$scope.chatMessage;
    	  message.user=$scope.userName;
    	  $scope.chatMessage="";
    	  serviceChatMessage.newChatMessage(message);
    };
    
    $scope.desktopShare = function(){
    	
    }
});