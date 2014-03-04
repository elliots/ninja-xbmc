#ninja-xbmc


##Ninja Blocks XBMC Driver

###Overview
Presents any XBMC instances on your network as a collection of NinjaBlocks devices (hid, text_display, temperature, camera)

###Features
1. Displays a thumbnail of the currently playing video on your Dashboard.
2. Presents XBMC events as sensors on your Dashboard.  For example, 'connected', 'play', 'pause', etc.
3. You can send events back to XBMC... the list of possible actions is below.
3. Allows you to send a text message to an XBMC.  For example 'Watching time's over!'  (Works for kids too.)

###Wiki Entry
http://wiki.ninjablocks.com/drivers/516f3062c7afb5cd20000001

###Forum Post
http://forums.ninjablocks.com/index.php?p=/discussion/comment/4337

###Installation

Install this Driver with:

ninja_install -g git@github.com:elliots/ninja-xbmc.git (Requires ninja toolbelt)

####Manual Installation

1. cd into your drivers directory (/opt/ninja/drivers on your Ninja Block)
2. git clone git://github.com/elliots/ninja-xbmc.git
3. cd ninja-xbmc && npm install

####On Linux

For MDNS (auto-discovery) you'll need to do `apt-get install libavahi-compat-libdnssd-dev`

####On Mac

Should "Just work".

####On Windows

See: https://github.com/agnat/node_mdns/blob/master/README.textile

###History

v0.0.8

A small bug in the scanning logic. :/

v0.0.7

Allow extra properties to be set on notifications ('time', 'image' and 'title')

v0.0.6

Add missing 'stop' event (and 'sleep', 'wake')

v0.0.5

Round the CPU temperature to one decimal place.

v0.0.4

The driver will never create more than one device for the same xbmc instance now. :/

v0.0.3

Manually added instances are now saved between restarts.
Automatically reconnects if the connection goes down.

v0.0.2

The HID device now sends events back to XBMC. "play", "pause", "stop", "mute" etc.

and cheers to @justy for writing a readme!

v0.0.1

The MDNS (ZeroConf) dependency is now optional (hooray for the probably one Windows user!) and you can now add XBMC instances manually by IP (and give them a nickname, which should help if you have more than one).

https://dl.dropboxusercontent.com/u/428557/Screen%20Shot%202013-05-19%20at%2010.52.05.png

Drivers cannot (yet) set the device name when registering, so the nickname is only used in the guid. @dan has promised to see if he can make it happen "soon" though =)

Give it a go, tell me if works for you and I'll get onto writing an actual readme.

v0.0.0

It's only been tested on the latest Openelec, but uses the JSON-RPC interface so should be happy talking to other distributions.

It uses zeroconf/mdns to discover XBMC instances (so you'll need to enable that) and obviously the JSON-RPC service too. Have a look at https://github.com/agnat/node_mdns for help on building the mdns dependency.

At the moment it passes through events like play/pause/stop as a HID device, the thumbnail of the currently playing file as a webcam, the CPU temperature, and there is a button to rickroll every XBMC it finds.

Very happy to accept patches/forks/complete rewrites.


###List of Actions
"left", "right", "up", "down", "pageup", "pagedown", "select", "highlight", "parentdir", "parentfolder", "back", "previousmenu", "info", "pause", "stop", "skipnext", "skipprevious", "fullscreen", "aspectratio", "stepforward", "stepback", "bigstepforward", "bigstepback", "osd", "showsubtitles", "nextsubtitle", "codecinfo", "nextpicture", "previouspicture", "zoomout", "zoomin", "playlist", "queue", "zoomnormal", "zoomlevel1", "zoomlevel2", "zoomlevel3", "zoomlevel4", "zoomlevel5", "zoomlevel6", "zoomlevel7", "zoomlevel8", "zoomlevel9", "nextcalibration", "resetcalibration", "analogmove", "rotate", "rotateccw", "close", "subtitledelayminus", "subtitledelay", "subtitledelayplus", "audiodelayminus", "audiodelay", "audiodelayplus", "subtitleshiftup", "subtitleshiftdown", "subtitlealign", "audionextlanguage", "verticalshiftup", "verticalshiftdown", "nextresolution", "audiotoggledigital", "number0", "number1", "number2", "number3", "number4", "number5", "number6", "number7", "number8", "number9", "osdleft", "osdright", "osdup", "osddown", "osdselect", "osdvalueplus", "osdvalueminus", "smallstepback", "fastforward", "rewind", "play", "playpause", "delete", "copy", "move", "mplayerosd", "hidesubmenu", "screenshot", "rename", "togglewatched", "scanitem", "reloadkeymaps", "volumeup", "volumedown", "mute", "backspace", "scrollup", "scrolldown", "analogfastforward", "analogrewind", "moveitemup", "moveitemdown", "contextmenu", "shift", "symbols", "cursorleft", "cursorright", "showtime", "analogseekforward", "analogseekback", "showpreset", "presetlist", "nextpreset", "previouspreset", "lockpreset", "randompreset", "increasevisrating", "decreasevisrating", "showvideomenu", "enter", "increaserating", "decreaserating", "togglefullscreen", "nextscene", "previousscene", "nextletter", "prevletter", "jumpsms2", "jumpsms3", "jumpsms4", "jumpsms5", "jumpsms6", "jumpsms7", "jumpsms8", "jumpsms9", "filter", "filterclear", "filtersms2", "filtersms3", "filtersms4", "filtersms5", "filtersms6", "filtersms7", "filtersms8", "filtersms9", "firstpage", "lastpage", "guiprofile", "red", "green", "yellow", "blue", "increasepar", "decreasepar", "volampup", "volampdown", "channelup", "channeldown", "previouschannelgroup", "nextchannelgroup", "leftclick", "rightclick", "middleclick", "doubleclick", "wheelup", "wheeldown", "mousedrag", "mousemove", "noop"
