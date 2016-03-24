perseus.factory("serviceNotification", serviceNotification);

serviceNotification.$inject = ["webNotification"];

function serviceNotification(webNotification) {
	
	
	return {
		showNotification : showNotification
	}

	function showNotification(title, text){
		webNotification.showNotification(title, {
            body: text,
            icon: './././img/favicon.ico',
            onClick: function onNotificationClicked() {
                window.alert('Notification clicked.');
            },
            autoClose: 3000 //auto close the notification after 2 seconds (you manually close it via hide function)
        }, function onShow(error, hide) {
            if (error) {
                window.alert('Unable to show notification: ' + error.message);
            } else {
                console.log('Notification Shown.');

                setTimeout(function hideNotification() {
                    console.log('Hiding notification....');
                    hide(); //manually close the notification (or let the autoClose close it)
                }, 3000);
            }
        });
	}
}