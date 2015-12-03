/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('callController', function ($scope, $window, ServiceParticipant, serviceKurentoRoom, serviceChatMessage, Fullscreen, LxNotificationService) {

	$scope.team = serviceKurentoRoom.getTeam();
    $scope.roomName = serviceKurentoRoom.getRoomName();
    $scope.userName = serviceKurentoRoom.getUserName();
    $scope.participants = ServiceParticipant.getParticipants();
    $scope.kurento = serviceKurentoRoom.getKurento();
    $scope.chatMessages = serviceChatMessage.getChatMessages();
    
    $scope.leaveRoom = function () {

        serviceKurentoRoom.getKurento().close();

        ServiceParticipant.removeParticipants();

        $window.location.href = '#/login';
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
        if (element.classList.contains("md-volume-off")) { //on
            element.classList.remove("md-volume-off");
            element.classList.add("md-volume-up");
            localStream.audioEnabled = true;
        } else { //off
            element.classList.remove("md-volume-up");
            element.classList.add("md-volume-off");
            localStream.audioEnabled = false;

        }
    };

    $scope.onOffVideocam = function () {
        var localStream = serviceKurentoRoom.getLocalStream();
        var element = document.getElementById("buttonVideocam");
        if (element.classList.contains("md-videocam-off")) {//on
            element.classList.remove("md-videocam-off");
            element.classList.add("md-videocam");
            localStream.videoEnabled = true;
        } else {//off
            element.classList.remove("md-videocam");
            element.classList.add("md-videocam-off");
            localStream.videoEnabled = false;
        }
    };

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
    
    $scope.showHat = function () {
    	var targetHat = false;
    	var offImgStyle = "md-mood";
    	var offColorStyle = "btn--deep-purple";
    	var onImgStyle = "md-face-unlock";
    	var onColorStyle = "btn--purple";
    	var element = document.getElementById("hatButton");
        if (element.classList.contains(offImgStyle)) { //off
            element.classList.remove(offImgStyle);
            element.classList.remove(offColorStyle);
            element.classList.add(onImgStyle);
            element.classList.add(onColorStyle);
            targetHat = true;
        } else if (element.classList.contains(onImgStyle)) { //on
            element.classList.remove(onImgStyle);
            element.classList.remove(onColorStyle);
            element.classList.add(offImgStyle);
            element.classList.add(offColorStyle);
            targetHat = false;
        }
    	
        var hatTo = targetHat ? "on" : "off";
    	console.log("Toggle hat to " + hatTo);
    	serviceKurentoRoom.getKurento().sendCustomRequest({hat: targetHat}, function (error, response) {
    		if (error) {
                console.error("Unable to toggle hat " + hatTo, error);
                LxNotificationService.alert('Error!', "Unable to toggle hat " + hatTo, 
                		'Ok', function(answer) {});
        		return false;
            } else {
            	console.debug("Response on hat toggle", response);
            }
    	});
    };
});