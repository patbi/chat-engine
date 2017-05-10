(function() {

    const namespace = 'notifications';

    // request permission on page load
    document.addEventListener('DOMContentLoaded', function () {
      if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); 
        return;
      }

      if (Notification.permission !== "granted")
        Notification.requestPermission();
    });

    function notifyMe(title, icon, body) {
      if (Notification.permission !== "granted")
        Notification.requestPermission();
      else {
        var notification = new Notification(title || 'Notification title', {
          icon: icon || 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
          body: body || "Hey there! You've been notified!",
        });

        notification.onclick = function () {
          window.open("http://stackoverflow.com/a/13328397/1269037");      
        };

      }

    }

    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange; 
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    let defaultTitle = (event) => {
        return 'New Message In ' + event.chat.channel;
    };
    
    let defaultIcon = (event) => {
        return false
    };

    let defaultMessage = (event) => {
        return JSON.stringify(event.data);
    };

    const plugin = (config) => {

        config.title = config.title || defaultTitle;
        config.icon = config.icon || defaultIcon;
        config.message = config.message || defaultMessage;

        let isVisible = true;

        function handleVisibilityChange() {
          if (document[hidden]) {
            isVisible = false;
          } else {
            isVisible = true;
          }
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
          console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
        } else {
          // Handle page visibility change   
          document.addEventListener(visibilityChange, handleVisibilityChange, false);
        }

        class extension {

            construct() {

                this.parent.on('message', (event) => {

                    if(!isVisible) {
                        notifyMe(config.title(event), config.icon(event), config.message(event));   
                    }

                });

            }

        };

        // attach methods to Chat
        return {
            namespace,
            extends: {
                Chat: extension
            }
        }

    }


    if(typeof module !== "undefined") {
        module.exports = plugin;
    } else {
        window.OpenChatFramework.plugin[namespace] = plugin;
    }

})();