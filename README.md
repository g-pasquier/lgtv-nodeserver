# GFI Update (2/04/2019 - Guillaume Pasquier)
This is a fork from https://github.com/Danovadia/lgtv-http-server

## install & run

npm install
npm start

## Docker install & run

sudo docker build -t lgtv-node-server .
sudo docker run -d lgtv-node-server


# Description
Easy way to control your LG webOS 3 TV.
After installing run `npm start` and check out `http://localhost:3000` for examples, or check the docs for HTTP requests.
Can easily serve as a service for any kind of home automation (host on a Rasberry Pi).

Forked from msloth's project.

# LGTV

## Installation

`npm install lgtv` and set up the TV per below.

## Prerequisites

First, the device (eg your computer) must be on the same network as the TV. Second, you should enable the TV to broadcast itself as `lgsmarttv.lan` in the local network. This setting is under `Network/LG Connect Apps`. This is necessary in order for this module to find the TV on the network and allow apps to connect. You also need to be on the same network as the TV.

## Quick start

The first time you run it against the TV, you need to give the program access to the TV by answering `yes` to the prompt on the TV. From then on, the received client key is used so you don't have to perform this step again.

Then, follow some of the examples to begin with, eg `examples/show-float.js` to show a float pop up on the screen:

```js
lgtv = require("lgtv");

var tv_ip_address = "192.168.1.214";
lgtv.connect(tv_ip_address, function(err, response){
  if (!err) {
    lgtv.show_float("It works!", function(err, response){
      if (!err) {
        lgtv.disconnect();
      }
    }); // show float
  }
}); // connect
```

Now that you can do this, we also can change input source to eg TV/HDMI/whatever, list and open apps, open browser, open Youtube app, change channel/volume, turn off the TV etc. Basically the only thing that doesn't work right now is a) turning on the TV, which doesn't seem possible this way, and b) opening Youtube at an URL (coming soon).

### Using a hostname or IP-address of the TV

The above uses a default hostname, `lgsmarttv.lan`. Your TV may not follow that, or you may have more than one TV. Then you can specify the hostname like below. The hostname can be eg `kitchen-tv.lan`, `192.168.1.214` or similar.

```js
lgtv = require("lgtv");

lgtv.connect("192.168.1.214", function(err, response){
  if (!err) {
    lgtv.show_float("It works!", function(err, response){
      if (!err) {
        lgtv.disconnect();
      }
    }); // show float
  }
}); // connect
```

### Auto-detecting the TV on the network

If you don't know the IP of the TV, or the hostname, you can scan for it using the `discover_ip()` function like below. Beware that this takes 3-4 seconds for the round-trip times (the TV is slow to respond to the SSDP discover probe).

```js
lgtv = require("lgtv");

var retry_timeout = 10; // seconds
lgtv.discover_ip(retry_timeout, function(err, ipaddr) {
  if (err) {
    console.log("Failed to find TV IP address on the LAN. Verify that TV is on, and that you are on the same LAN/Wifi.");
  } else {
    console.log("TV ip addr is: " + ipaddr);
  }
});
```

If you want to autodiscover each time, this would work,

```js
lgtv = require("lgtv");

var retry_timeout = 10; // seconds
lgtv.discover_ip(retry_timeout, function(err, ipaddr) {
  if (err) {
    console.log("Failed to find TV IP address on the LAN. Verify that TV is on, and that you are on the same LAN/Wifi.");

  } else {
    lgtv.connect(ipaddr, function(err, response){
      if (!err) {
        lgtv.show_float("Found you!", function(err, response){
          if (!err) {
            lgtv.disconnect();
          }
        }); // show float
      }
    }); // connect
  }
});
```

## Introduction

This module is targeting the LG Smart TVs running WebOS, ie later 2014 or 2015 models.
Previous models used another OS and other protocols and won't work with this.

* Controlling the TV means
  * (finding the TV on your local network)
  * establishing a connection, ie successful handshake
  * controlling input source, volume, etc

There is some useful information out there already:

* LG TV:
  * LG remote app on android store
    - you could sniff traffic on network as it interacts with TV
    - you could reverse engineer by downloading .apk, run dex2jar etc etc
  * LG remote app by third-party developers
      - https://github.com/CODeRUS/harbour-lgremote-webos
        -seems like it is written with deep knowledge of WebOS internals
  * look through the open source SDK's and API's published by LG
      - https://github.com/ConnectSDK/Connect-SDK-Android-Core

## Motivation

There is an LG remote control app for Android, but it is horribly slow. Also, it is very generic and mirrors the physical remote control. With this module I can chain a set of commands such as change input to HDMI_1 and set volume 10 and make them happen programmatically instead of finding the right buttons in the app. I also combine this with a corresponding module for controlling a Kodi media player.
