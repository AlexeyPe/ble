## Запуск

⚠️ Для работы блютуз важен https, без этого никак.

1. Скачать [mkcert](https://github.com/FiloSottile/mkcert/releases) (для https)

1. `"path_mkcert.exe" -install` (для https, что бы создать key.pem)

1. `"path_mkcert.exe" example.com "*.example.com" example.test localhost 127.0.0.1 ::1` (для https, создаст 2 файла .pem можно их сократить до key.pem и cert.pem)

1. `npx http-server . -S -C cert.pem` (Запустит сервер https)

* `npx http-server .` создаст сервер в этой директории.
* `-S -C cert.pem` Включите защищенную передачу запросов с помощью TLS/SSL (HTTPS).
* https будет работать по адресу `https://127.0.0.1:8080` или `https://localhost:8080`
* Если надо что бы работало к примеру на `192.168.0.200:8080`(мне это надо что бы работало с телефона), то надо создать .pem файлы через `mkcert example.com "*.example.com" example.test localhost 192.168.0.200 ::1`