const SERVICE_UUID = "642f72d2-778b-4f91-bcfa-4c65350c2c07"; // Сервис UART

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем поддержку Web Bluetooth API для браузера
    const support_browser_bluetooth = document.getElementById('support_browser_bluetooth');
    if (!navigator.bluetooth) {
        support_browser_bluetooth.textContent = '✘ Ваш браузер не поддерживает Web Bluetooth API.';
    } else {
        support_browser_bluetooth.textContent = '✔ Ваш браузер поддерживает Web Bluetooth API.'
    }
    // Проверяем поддержку Web Bluetooth API для устройства
    const support_device_bluetooth = document.getElementById('support_device_bluetooth');
    navigator.bluetooth.getAvailability().then((available) => {
        if (available) {
            support_device_bluetooth.textContent = '✔ Ваше устройство поддерживает Web Bluetooth API.'
        } else {
            support_device_bluetooth.textContent = '✘ У вашего устройства выключен или отсутствует Bluetooth адаптер';
        }
        });
});
async function scanForBle() {
    if (!navigator.bluetooth) return;

    const output = document.getElementById('output');
    try {
        // Запрашиваем разрешение на доступ к устройствам BLE внутри обработчика события
        // await navigator.bluetooth.requestDevice({
        //     filters: [{services: ['generic_access']}],
        //     optionalServices: [],
        // });
        let device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID]//Сервис UART
        });
        let service = await server.getPrimaryService(SERVICE_UUID);
        console.log(`device:`,device);
        console.log(`service:`,service);
        // Далее идет остальной ваш код обработки найденных устройств...
    } catch(error) {
        output.textContent = `Ошибка подключения к устройству: ${error.message}`;
    }
}