#ninja-xbmc


##Ninja Blocks XBMC Driver

###Overview
This driver presents a representation of your XBMC's currently playing video (its thumbnail) on your Dashboard.

###Features
1. Displays a thumbnail of the currently playing video on your Dashboard.
2. Presents XBMC events as sensors on your Dashboard.  For example, 'connected', 'play', 'pause', etc.
3. Allows you to send a text message to an XBMC.  For example 'Watching time's over!'  (Works for kids too.)

###Wiki Entry
http://wiki.ninjablocks.com/drivers/516f3062c7afb5cd20000001

###Installation

Install this Driver with:

ninja_install -g git@github.com:elliots/ninja-xbmc.git (Requires ninja toolbelt)

Manual Installation

1. cd into your drivers directory (/opt/ninja/drivers on your Ninja Block)
2. git clone git://github.com/elliots/ninja-xbmc.git
3. cd ninja-xbmc && npm install

###History

v0.0.1

The MDNS (ZeroConf) dependency is now optional (hooray for the probably one Windows user!) and you can now add XBMC instances manually by IP (and give them a nickname, which should help if you have more than one). 

https://dl.dropboxusercontent.com/u/428557/Screen Shot 2013-05-19 at 10.52.05.png

Drivers cannot (yet) set the device name when registering, so the nickname is only used in the guid. @dan has promised to see if he can make it happen "soon" though =)

Give it a go, tell me if works for you and I'll get onto writing an actual readme.

v0.0.0

It's only been tested on the latest Openelec, but uses the JSON-RPC interface so should be happy talking to other distributions.

It uses zeroconf/mdns to discover XBMC instances (so you'll need to enable that) and obviously the JSON-RPC service too. Have a look at https://github.com/agnat/node_mdns for help on building the mdns dependency.

At the moment it passes through events like play/pause/stop as a HID device, the thumbnail of the currently playing file as a webcam, the CPU temperature, and there is a button to rickroll every XBMC it finds.

Very happy to accept patches/forks/complete rewrites.