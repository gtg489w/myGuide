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

var soundAlert = function() {
    navigator.notification.vibrate(100);
};

var currentState = 'off';
var interval;
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

    var newState = 'off';
    if(data.feet < 5) {
        newState = Math.floor(data.inches / 5) * 50;
    }

    if(newState != currentState) {
        clearInterval(interval);
        if(newState != 'off') {
            interval = setInterval(soundAlert, newState);
            soundAlert();
        } else {
            // let's store distance data
            var attData = '{"value":"'+data.inches+'"}';
             $.ajax({
                type: "PUT",
                dataType: 'json',
                url: 'https://api-m2x.att.com/v1/feeds/e7e3b4bd94e77fbc616ad36a71b829ba/streams/myguide',
                headers: {
                    'X-M2X-KEY': 'ea34732eb1975f579eef1dc567a0eb1f',
                    'Content-Type': 'application/json'
                },
                data: attData,
                success: function(data) {
                    //log('data logged');
                },
                error: function(xhr, status, err) {
                    log('data log fail');
                }
            });
        }
        currentState = newState;
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
        });
    }
};
