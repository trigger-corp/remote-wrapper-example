# Hello, Cognician!

This is a simple Trigger.io app that shows how you'd go about building
a mobile wrapper for a remotely hosted web app with Parse push
notifications.

## App structure

To give you an idea of how everything hangs together you can check out the following files:

### local_config.json

Configuration file for the local tooling. Specifies certificates used
for packaging, device/simulator selection for running etc.

### src/config.json

Defines and uniquely identifies the binary build for the app.

This is the only file that gets sent to our build infrastructure where
it is transformed into a binary build for iOS, Android or Crosswalk.

Noteworthy fields:

* `core.general.trusted_urls` - a URL matching pattern for any content
  that requires access to the `forge.*` API's on mobile. By default we
  block the mobile device from using our native API's on HTTP(S)
  hosted content unless it's explicitly allowed.

* `modules.httpd.config` - this module does two things: 1) It spools
  up a tiny httpd on the mobile device that can serve any js/html/css
  files included with the app. `port` refers to the port the local
  httpd will run on. 2) It allows you to specify a base URL for your
  app content. In this case you'd set the url to the address of the
  remote website hosting your app.

* `parse.config` - this is the configuration for the parse server
  you're using for notifications. Pretty self-explanatory. The
  `server` field is the address of the Parse server, you can specify
  custom icons for push notifications etc. etc. (Btw, the other push
  solution we offer is: http://trigger.io/modules/pushwoosh)


### src/index.html

This probably wouldn't exist in your app as you're pulling the content
directly from a remote server. (Although, now I think of it, it might
be nice to add a feature to the `httpd` module that will load the
local `index.html` if the remote server is not reachable :-D)

If you look at it you'll see there are two JS includes you'll need to
add to any of your remote content if you want to be able to make forge
API calls from within that content.

They're basically just two wrappers around:

1. the app configuration
2. the API's for the forge modules you included in the config.json
file.

These two files are included in the mobile build and are served by the `httpd` module mentioned above.


### src/js/main.js

A short demo showing how you'd use the parse API's.

In real life you'd be running something like the `test_push()`
function on the server side, although it is fun being able to trigger
push notifications from the device itself :-)

Right at the bottom you can see the code you'd run during app startup
to register for and handle notification.


## CircleCI Integration

You know, I keep forgetting it exists, but we also have a very useful
standalone build API.

If you really don't feel like messing with any kind of local tooling
at all you can just do a POST of your app directory to our endpoint
and get a built package back. This would probably be the easiest way
to do CI.

More info: https://trigger.io/docs/current/tools/standalone.html
