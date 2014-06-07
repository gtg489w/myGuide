var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        $(function() {
            var context = new window.webkitAudioContext();

            var osc = context.createOscillator();
            osc.frequency.value = 440;
            osc.connect(context.destination);
            osc.start(0);

            bluetoothSerial.list(function(devices) {
                devices.forEach(function(device) {
                    //console.log(device.id);
                    /*bluetoothSerial.connect(
                        app.macAddress,  // device to connect to
                        app.openPort,    // start listening if you succeed
                        app.showError    // show the error if you fail
                    );*/
                    alert(device.address);
                    bluetoothSerial.connect(device.address, function() {
                        alert('success');
                        bluetoothSerial.subscribe('\n', function (data) {
                            alert('got data');
                        });
                    }, function() {
                        alert('fail');
                    });

                });
            }, function() {
                console.log('fail');
            });
        });
    }
};
