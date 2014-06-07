/* Application Functions */
var log = function(html) {
    $('#status').html(html);
};

/* Bluetooth Functions */
var listBluetoothDevices = function() {
    log('Searching bluetooth devices');
    bluetoothSerial.list(function(devices) {
        log('Found '+devices.length+' bluetooth(s) devices');
        devices.forEach(function(device) {
            connectBluetooth(device.address);
            $('#bluetooth_list').append('<div class="device" rel="'+device.address+'">'+device.name+'</div>');
        });
    }, function() {
        log('Unable to find any bluetooth devices');
    });
};

var connectBluetooth = function(address) {
    bluetoothSerial.connect(address, function() {
        log('Connected');
        bluetoothSerial.subscribe('\n', bluetoothDataCallback);
    }, function() {
        log('Unable to connect to device');
    });
};

var bluetoothDataCallback = function(data) {
    try {
        var jso = JSON.parse(data);
        handleData(jso);
    } catch (e) {
    }
};

handleInvalidData = function() {
    $('#data_feet').html('');
    $('#data_inches').html('');
};

var handleData = function(data) {
    var feet = ' feet';
    var inches = ' inches';
    if(data.feet == 1) {
        feet = ' foot';
    }
    if(data.inches == 1) {
        inches = ' inch';
    }
    $('#data_feet').html(data.feet + feet);
    $('#data_inches').html(data.inches + inches);

    if(data.feet < 6) {
        navigator.notification.vibrateWithPattern([0, 100, 100, 200, 100, 400, 100, 800]);
        //navigator.notification.vibrate(10000);
        //navigator.notification.cancelVibration()
    } else {
        //navigator.notification.cancelVibration();
    }
};

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        $(function() {
            listBluetoothDevices();
            //navigator.notification.vibrate(10000);
            //navigator.notification.cancelVibration()

        });
    }
};
