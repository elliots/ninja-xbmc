var XbmcApi = require('xbmc'),
    util = require('util'),
    stream = require('stream'),
    mdns = require('mdns'),
    http = require('http'),
    https = require('https');

// ES: This code is horrid. Please fix it.

var log = console.log;

util.inherits(driver,stream);
util.inherits(XBMCDevice,stream);

log('XBMC - loading');


function driver(opts, app) {
  this._app = app;
  this._opts = opts;
  this._opts.sockets = opts.sockets || [];

  this._devices = [];

  var self = this;

  app.on('client::up',function(){
      self.scan();
  });

}

driver.prototype.config = function(rpc,cb) {

  var self = this;

  if (!rpc) {
    return cb(null,{"contents":[
      { "type": "submit", "name": "RickRoll All The Things!", "rpc_method": "rick-roll" }
    ]});
  }

  switch (rpc.method) {
    case 'rick-roll':
      self.rickRoll();
      cb(null, {
        "contents": [
          { "type":"paragraph", "text":"<img src='http://www.schwimmerlegal.com/rickroll.jpg'/>"},
          { "type":"close", "text":"Close"}
        ]
      });
      break;
    default:
      console.log('Unknown rpc method', rpc.method, rpc);
  }
};
 

driver.prototype.rickRoll = function() {
  this._devices.forEach(function(device) {
    console.log('rickrolling', device.G);
    device._xbmc.player.openYoutube('y2Y7xqAlUHk');
  });
};


driver.prototype.scan = function () {

  console.log('MDNS: Scanning');
  var self = this;

  var browser = new mdns.Browser(mdns.tcp('xbmc-jsonrpc-h'));
  browser.on('serviceUp', function(service) {
    console.log("MDNS: service up: ", service);

    var parentDevice = new XBMCDevice(service.addresses[0], 9090, service.name, self._app);
    self._devices.push(parentDevice);

    Object.keys(parentDevice.devices).forEach(function(id) {
      console.log('Adding sub-device', id, parentDevice.devices[id].G);
      self.emit('register', parentDevice.devices[id]);
    });
    
  });
  browser.on('serviceDown', function(service) {
    console.log("MDNS: service down: ", service);
  });
  browser.start();

};

module.exports = driver;


function XBMCDevice(host, port, name, app) {

  this.host = host;
  this.port = port;
  this.name = name;
  this.app = app;

  console.log("GOT APP", app);

  this._connection = new XbmcApi.TCPConnection({
    host: host,
    port: port,
    verbose: false
  });

  this._xbmc = new XbmcApi.XbmcApi({silent:true});

  this._xbmc.setConnection(this._connection);

  var self = this;
  this._xbmc.on('connection:open', function() {
    self.devices.hid.emit('data', 'connected');
    self.devices.camera.emit('data', 1);
    self.devices.displayText.emit('data', 1);
    //self._xbmc.message('Online.', 'NinjaBlocks', 1000);// 'http://www.sydneyangels.net.au/wp-content/uploads/2012/09/ninjablocks_logo.png');
  });

  'play,pause,add,update.clear,scanstarted,scanfinished,screensaveractivated,screensaverdeactivated'
    .split(',').forEach(  function listenToNotification(name) {
      
      self._xbmc.on('notification:'+name, function(e) {
        self.devices.hid.emit('data', name);
      });
    });

  self._xbmc.on('connection:data', function(e) {
    console.log('onData', e);
  });

  function hid() {
    this.readable = true;
    this.writeable = false;
    this.V = 0;
    this.D = 14;
    this.G = self.host.replace(/[^a-zA-Z0-9]/g, '') + self.port;
  }

  util.inherits(hid, stream);

  function displayText() {
    this.readable = true;
    this.writeable = true;
    this.V = 0;
    this.D = 240;
    this.G = self.host.replace(/[^a-zA-Z0-9]/g, '') + self.port;
  }

  util.inherits(displayText, stream);


  displayText.prototype.write = function(data) {
    console.log('XBMC - received text to display', data);
    self._xbmc.message(data);
    return true;
  };

  function camera() {
    this.writeable = true;
    this.readable = true;
    this.V = 0;
    this.D = 1004;
    this.G = self.host.replace(/[^a-zA-Z0-9]/g, '') + self.port;
    this._guid = [self.app.id,this.G,this.V,this.D].join('_');

    console.log("Camera guid", this._guid);
    
  }
  
  util.inherits(camera, stream);

  camera.prototype.write = function(data) {

    var postOptions = {
      host:self.app.opts.streamHost,
      port:self.app.opts.streamPort,
      path:'/rest/v0/camera/'+this._guid+'/snapshot',
      method:'POST'
    };

    var proto = (self.app.opts.streamPort==443) ? https:http;

    console.log('Requesting current playing');
    self._xbmc.media.api.send('Player.GetActivePlayers').then(function(data) {
      if (data.result) {
        self._xbmc.media.api.send('Player.GetItem', {
          playerid: data.result[0].playerid,
          properties: ['thumbnail']
        }).then(function(data) {
          var thumbnail = "http://" + self.host + '/image/' + encodeURIComponent(data.result.item.thumbnail);
          
          console.log(thumbnail);
          var getReq = http.get(thumbnail,function(getRes) {

            postOptions.headers = getRes.headers;
            postOptions.headers['X-Ninja-Token'] = self.app.token;
            console.log('token', self.app.token);

            var postReq = proto.request(postOptions,function(postRes) {

              postRes.on('end',function() {
                console.log('Stream Server ended');
              });
              postRes.resume();
            });

            postReq.on('error',function(err) {
              console.log('Error sending picture: ');
              console.log(err);
            });

            var lenWrote=0;
            getRes.on('data',function(data) {
              postReq.write(data,'binary');
              lenWrote+=data.length;
            });

            getRes.on('end',function() {
              postReq.end();
              console.log("Image sent %s",lenWrote);
            });
            getRes.resume();
          });
          getReq.on('error',function(error) {
            console.log(error);
          });
          getReq.end();

        });
      } else {
        console.log("Nothing is currently playing");
      }
    });
    
    return true;
  };
  
  this.devices = {
    hid: new hid(),
    camera: new camera(),
    displayText: new displayText()
  };

}


XBMCDevice.prototype.end = function() {};
XBMCDevice.prototype.close = function() {};
/*

var dumpEvent = function(event) {
  if (event && event.method)
    console.log(event.method, event);
};

xbmcApi.on('connection:data', function(e) {
  console.log('onData', e);
});

xbmcApi.on('notification', function() {
  console.log(111);
});

xbmcApi.on('connection:open', dumpEvent);

xbmcApi.on('connection:close', dumpEvent);

xbmcApi.on('connection:error', dumpEvent);

xbmcApi.on('api:movie', dumpEvent);

xbmcApi.on('api:episode', dumpEvent);

xbmcApi.on('api:playerStopped', dumpEvent);

xbmcApi.on('api:video', dumpEvent);

xbmcApi.on('notification:play', dumpEvent);

xbmcApi.on('notification:pause', dumpEvent);

xbmcApi.on('notification:add', dumpEvent);

xbmcApi.on('notification:update', dumpEvent);

xbmcApi.on('notification:clear', dumpEvent);

xbmcApi.on('notification:scanstarted', dumpEvent);

xbmcApi.on('notification:scanfinished', dumpEvent);

xbmcApi.on('notification:screensaveractivated', dumpEvent);

xbmcApi.on('notification:screensaverdeactivated', dumpEvent);

console.log('done');*/


