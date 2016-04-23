'use strict';

var QNotify = {
  config:{
    STORAGE: sessionStorage,
    subscribeTTL: 24
  },
  init: function(){
    var storage = this.getStorage();
    this.purgeStorage();
    this.registerServiceWorker();
    if(localStorage.getItem("isPushEnabled") === null) {
        this.subscribe();
    }
  },
  purgeStorage: function(){
    var storage = this.getStorage();
    var ttl = storage.getItem('cachettl');
    if (ttl && ttl < +new Date()){
      storage.removeItem('isPushEnabled');
      storage.removeItem('cachettl');
      ttl = 0;
    }
    // store timestamp
    if (!ttl){
      storage.setItem('cachettl', +new Date() + 1000 * 60 * 60 * this.config.subscribeTTL);
    }
  },
  registerServiceWorker: function(){
    var _this = this;
    // Check that service workers are supported, if so, progressively
    // enhance and add push messaging support, otherwise continue without it.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(_this.initialiseState());
    } else {
    }
  },
  getStorage: function () {
    var storage = this.config.STORAGE;
    if (storage === true) return window.storage;
    if (typeof storage === "object" && 'getItem' in storage &&
      'removeItem' in storage && 'setItem' in storage) {
      return storage;
    }
    throw new TypeError("localCache must either be a boolean value, " +
      "or an object which implements the Storage interface.");
  },
  sendSubscriptionToServer: function (subscription) {
    var storage = this.getStorage();
    storage.subscriptionId = subscription.endpoint;
    var subscriptionIdArray = storage.subscriptionId.split('/')
    var subscriptionId = subscriptionIdArray[subscriptionIdArray.length-1]
    if(storage.isPushEnabled == undefined) {
      $.ajax({
        type: "POST",
        url: URLS.qnotify + "subscriptions",
        data:JSON.stringify({user_id:storage.login_user_id,subscription_id:subscriptionId}),
        contentType: "application/json",
        dataType: 'json',
        success: function(res) {
          storage.subscription = JSON.stringify(res);
          storage.isPushEnabled = true;
        },
        error: function(err){
          if(err.status == 409) {
            storage.subscription = err.responseText;
            storage.isPushEnabled = true;
            return
          }
          throw err
        }
      });
    }

  },
  showCurlCommand:function (subscription) {
    // The curl command to trigger a push message straight from GCM
    var subscriptionId = subscription.subscriptionId;
    var endpoint = subscription.endpoint;
  },
  unsubscribe:function () {
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // To unsubscribe from push messaging, you need get the
      // subcription object, which you can call unsubscribe() on.
      serviceWorkerRegistration.pushManager.getSubscription().then(
        function(pushSubscription) {
          // Check we have a subscription to unsubscribe
          if (!pushSubscription) {
            // No subscription object, so set the state
            // to allow the user to subscribe to push
            storage.isPushEnabled = false;

            return;
          }

          var subscriptionId = pushSubscription.subscriptionId;
          // TODO: Make a request to your server to remove
          // the subscriptionId from your data store so you
          // don't attempt to send them push messages anymore

          // We have a subcription, so call unsubscribe on it
          pushSubscription.unsubscribe().then(function(successful) {

            storage.isPushEnabled = false;
          }).catch(function(e) {
            // We failed to unsubscribe, this can lead to
            // an unusual state, so may be best to remove
            // the subscription id from your data store and
            // inform the user that you disabled push


          });
        }).catch(function(e) {
      });
    });
  },
  subscribe:function () {
    var storage = this.getStorage();
    var _this = this;
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
        .then(function(subscription) {
          // TODO: Send the subscription.subscriptionId and
          // subscription.endpoint to your server
          // and save it to send a push message at a later date
          return _this.sendSubscriptionToServer(subscription);
        })
        .catch(function(err) {
          console.log("QNotify: serviceWorkerRegistration.pushManager.subscribe.catch():",err)
          if (Notification.permission === 'denied') {
            // The user denied the notification permission which
            // means we failed to subscribe and the user will need
            // to manually change the notification permission to
            // subscribe to push messages
            console.log("QNotify: User denied:")

          } else {
            // A problem occurred with the subscription, this can
            // often be down to an issue or lack of the gcm_sender_id
            // and / or gcm_user_visible_only
            console.log("QNotify: Error might be with gcm_sender_id or  gcm_user_visible_only")

          }
        });
    }).catch(function(err){
      console.log("QNotify: navigator.serviceWorker.ready.catch()",err);
    });
  },
  // Once the service worker is registered set the initial state
  initialiseState:function () {
    var _this = this;
    var storage = this.getStorage();
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      return;
    }

    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
      return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
      return;
    }

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // Do we already have a push message subscription?
      serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          // Enable any UI which subscribes / unsubscribes from
          // push messages.
          if (!subscription) {
            // We aren’t subscribed to push, so set UI
            // to allow the user to enable push
            return;
          }

          // Keep your server in sync with the latest subscriptionId
          _this.sendSubscriptionToServer(subscription);

          // Set your UI to show they have subscribed for
          // push messages
          //pushButton.textContent = 'Disable';
          storage.isPushEnabled = true;
        })
        .catch(function(err) {
          console.log("QNotify: Error in initialiseState",err)
        });
    });
    return "";
  }
}
QNotify.init()

















