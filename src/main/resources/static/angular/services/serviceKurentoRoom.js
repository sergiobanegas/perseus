/*
 * @author Raquel Díaz González
 */

perseus.service('serviceKurentoRoom', function () {

    var kurento;
    var team;
    var roomName;
    var roomId;
    var creator;
    var userName;
    var localStream;

    this.getKurento = function () {
        return kurento;
    };
    
    this.getTeam = function () {
    	return team;
    };

    this.getRoomName = function () {
        return roomName;
    };
    
    this.getRoomId = function () {
        return roomId;
    };
    
    this.getCreator = function () {
        return creator;
    };

    this.setKurento = function (value) {
        kurento = value;
    };
    
    this.setTeam = function (value) {
    	team = value;
    };

    this.setRoomName = function (value) {
        roomName = value;
    };
    
    this.setRoomId = function (value) {
        roomId = value;
    };

    this.getLocalStream = function () {
        return localStream;
    };

    this.setLocalStream = function (value) {
        localStream = value;
    };

    this.getUserName = function () {
        return userName;
    };

    this.setUserName = function (value) {
        userName = value;
    };
    
    this.setCreator = function (value) {
        creator = value;
    };
});
