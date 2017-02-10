/* global $, forge */

forge.logging.info("Hello, Cognician!");

function log(msg) {
    $("#console").append(msg + "\n");
    forge.logging.debug(msg);
}
function error(where) {
    return function (e) {
        var msg = "[ERROR] " + where + ": " + JSON.stringify(e);
        $("#console").append(msg + "\n");
        forge.logging.error(msg);
    };
}

/* - push demo ---------------------------------------------------------- */

// sends a push notification via the Parse REST API
function test_push() {
    $.ajax({
        url: 'http://docker.trigger.io:1337/parse/push',
        headers: {
            "X-Parse-Application-Id": "45732VjSzMiN8HN90ztWcSeEl05T92XUrE70MJgI",
            "X-Parse-MASTER-Key": "MASTER_KEY"
        },
        contentType: "application/json",
        type: 'POST',
        data: JSON.stringify({
            channels: [ "test" ],
            data: { "alert": "†és† push " + ((new Date()).toString()) }
        }),
        success: function () {
            log("successfully sent REST push request");
        },
        error: error("test_push")
    });
}

// register for notifications, subscribe to a channel and add a receive listener
forge.parse.registerForNotifications(function () {
    forge.parse.push.subscribe("test", function () {
        log("successfully subscribed to channel: test");
    });
    forge.event.messagePushed.addListener(function (msg) {
        log("received notification: " + JSON.stringify(msg));
    });
}, error("forge.parse.registerForNotifications"));
