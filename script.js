document.addEventListener('DOMContentLoaded', function() {
    const scanBtn = document.getElementById('scanBtn');
    const devicesList = document.getElementById('devicesList');

    // Обработчик нажатия кнопки поиска
    scanBtn.addEventListener('click', async function() {
        devicesList.innerHTML = '<p class="loading">Поиск устройств...</p>';
        try {
            // Запрос разрешения на доступ к BLE‑устройствам
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['generic_access'] }], // Можно указать конкретные сервисы
                optionalServices: ['battery_service'] // Дополнительные сервисы для запроса
            });

            // Добавляем найденное устройство в список
            addDeviceToList(device);

            // Продолжаем поиск других устройств
            startContinuousScan();
        } catch (error) {
            devicesList.innerHTML = `<p style="color: red;">Ошибка: ${error.message}</p>`;
        }
    });

    // Функция для непрерывного поиска устройств
    async function startContinuousScan() {
        try {
            while (true) {
                const device = await navigator.bluetooth.requestDevice({
                    filters: [{ services: ['generic_access'] }],
                    optionalServices: ['battery_service'],
                    acceptAllDevices: true // Разрешить все устройства (менее безопасно)
                });

                // Проверяем, не добавлено ли уже это устройство
                if (!document.querySelector(`[data-device-id="${device.id}"]`)) {
                    addDeviceToList(device);
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Ошибка непрерывного сканирования:', error);
            }
        }
    }

    // Функция добавления устройства в список на странице
    function addDeviceToList(device) {
        const deviceElement = document.createElement('div');
        deviceElement.className = 'device';
        deviceElement.setAttribute('data-device-id', device.id);

        deviceElement.innerHTML = `
            <h3>${device.name || 'Без названия'}</h3>
            <p><strong>ID:</strong> ${device.id}</p>
            <p><strong>Адрес:</strong> ${device.address || 'Не указан'}</p>
            <p><strong>Класс:</strong> ${device.deviceClass || 'Не указан'}</p>
            <p><strong>Подключено:</strong> ${device.gatt?.connected ? 'Да' : 'Нет'}</p>
        `;

        devicesList.appendChild(deviceElement);
    }
});
