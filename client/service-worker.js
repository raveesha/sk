'use strict';

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);
  registration.pushManager.getSubscription().then(function(subscription) {
    var endpointSplit = subscription.endpoint.split('/');
    var endpoint = endpointSplit[endpointSplit.length-1];
    return fetch('/api/notifications/'+endpoint).then(function(res){
      return res.json().then(function(payload){
        payload.title = payload.title || "Quezx";
        payload.body = payload.body || "You have new notifications";
        payload.icon = payload.icon || "https://app.quezx.com/img/quezx-png-logo.png"
        payload.tag = payload.tag || 'default';
        payload.link = payload.link || "/Notifications";
        return event.waitUntil(
          self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon,
            tag: payload.tag,
            data: payload
          })
        );
      }).catch(function(err){
        console.log("Error in notifications ",err)
      })
    })
  });
});


self.addEventListener('notificationclick', function(event) {
  var targetURL = event.notification.data.link || '/';
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: "window"
    }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == targetURL && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow)
        return clients.openWindow(targetURL);
    }).catch(function(err){
        console.log("QNotify: Error onNotificationClick:", err);
    })
  );

});
