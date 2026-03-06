const SERVICE_UUID = "642f72d2-778b-4f91-bcfa-4c65350c2c07"; // Сервис UART
const UUID_CHAR_TEST = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const UUID_S_CHAR_TEST = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
/**
 * @type {BluetoothDevice}
 */
let _device;
function check_device() {
    const device_select = document.getElementById('device_select');
    if (_device == null) device_select.textContent = `✘ Устройство не выбрано.`
    else device_select.textContent = `✔ Устройство выбрано: ${_device.name}`
}

// Setup function
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем поддержку Web Bluetooth API для браузера
    const support_browser_blueth = document.getElementById('support_browser_blueth');
    if (!navigator.bluetooth) {
        support_browser_blueth.textContent = '✘ Ваш браузер не поддерживает Web Bluetooth API.';
    } else {
        support_browser_blueth.textContent = '✔ Ваш браузер поддерживает Web Bluetooth API.'
    }
    // Проверяем поддержку Web Bluetooth API для устройства
    const support_device_blueth = document.getElementById('support_device_blueth');
    navigator.bluetooth.getAvailability().then((available) => {
        if (available) {
            support_device_blueth.textContent = '✔ Ваше устройство поддерживает Web Bluetooth API.'
        } else {
            support_device_blueth.textContent = '✘ У вашего устройства выключен или отсутствует Bluetooth адаптер';
        }
    });
    check_device();
});

async function scanForBle() {
    if (!navigator.bluetooth) return;

    const output = document.getElementById('output');
    try {
        await navigator.bluetooth.requestDevice({
            // filters: [{
            //     // services: ['battery_service', 'heart_rate'] // стандартизированные службы
            //     // ИЛИ
            //     services: [SERVICE_UUID] // 16‑битный или полный UUID
            // }],
            optionalServices: [SERVICE_UUID, UUID_S_CHAR_TEST],
            acceptAllDevices: true
        })
        .then(async device => {
            console.log('Выбрано устройство:', device);
            _device = device
            check_device();
            let gatt = await _device.gatt.connect();
            console.log(gatt)
            let service = await gatt.getPrimaryService(UUID_S_CHAR_TEST);
            console.log(service)
            let characteristic = await service.getCharacteristic(UUID_CHAR_TEST);
            console.log(characteristic)
            let result = await characteristic.readValue()
            console.log(characteristic.value)
            let textDecoder = new TextDecoder('utf-8')
            output.textContent = `Значение: ${textDecoder.decode(result)}`
        })
        .catch(error => {   
            console.error('Ошибка выбора устройства:', error);
            output.textContent = `Ошибка подключения к устройству: ${error.message}`;
        });
    } catch(error) {
        output.textContent = `Ошибка подключения к устройству: ${error.message}`;
    }
}