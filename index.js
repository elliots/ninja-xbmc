var XbmcApi = require('xbmc'),
    util = require('util'),
    stream = require('stream'),
    mdns = require('mdns');

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

    var device = new XBMCDevice(service.addresses[0], 9090, service.name);
    self._devices.push(device);

    self.emit('register', device);

  });
  browser.on('serviceDown', function(service) {
    console.log("MDNS: service down: ", service);
  });
  browser.start();

};

module.exports = driver;


function XBMCDevice(host, port, name) {
  this.readable = true;
  this.writeable = true;

  this.V = 0;
  this.D = 14;

  this.G = host + port; // Should use name, but not sure if spaces allowed?

  this._connection = new XbmcApi.TCPConnection({
    host: host,
    port: port,
    verbose: false
  });

  this._xbmc = new XbmcApi.XbmcApi({silent:true});

  this._xbmc.setConnection(this._connection);

  var self = this;
  this._xbmc.on('connection:open', function() {
    self.emit('data', 1); // This is supposed to get the new device created in the system, but it seems
                         // to be failing. So... yeah nothing happening.
    self._xbmc.message('Online.', 'NinjaBlocks', 1000, 'http://www.sydneyangels.net.au/wp-content/uploads/2012/09/ninjablocks_logo.png');

  });

  'play,pause,add,update.clear,scanstarted,scanfinished,screensaveractivated,screensaverdeactivated'
    .split(',').forEach(  function listenToNotification(name) {
      
      self._xbmc.on('notification:'+name, function(e) {
        self.emit('data', name);
      });
    });

  self._xbmc.on('connection:data', function(e) {
    console.log('onData', e);
  });


}


XBMCDevice.prototype.write = function(data) {
  console.log('XBMC - received data', data);
  this._xbmc.message(data);
  return true;
};

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


