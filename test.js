var opts = {
    xbmc: {
 
    }
};

var d = new (require('./index'))(opts, {
    on : function(x,cb){
        setTimeout(cb, 100);
    },
    log: {
        debug: console.log,
        info: console.log,
        warn: console.log,
        error: console.log
    }
});

d.emit = function(channel, value) {
    console.log('Driver.emit', channel, value);
    if (channel == 'register') {
        value.emit = function(channel, value) {
            console.log('Device.emit', channel, value);
        };

        if (value.D == 240) {

            setTimeout(function() {
                value.write({"message":"Hello from ninjablocks!", "title": "Test message!"});
            }, 2000);
        }
    }
};

d.save = function() {
    console.log('Saved opts', opts);
};
