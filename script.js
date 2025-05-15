document.addEventListener('DOMContentLoaded', () => {
    const kitchenBgImg = document.getElementById('kitchen-bg-img');
    const dropzoneContainer = document.getElementById('dropzone-container');

    function updateDropzoneContainerPosition() {
        const imgRect = kitchenBgImg.getBoundingClientRect(); // Розміри <img> елемента у вікні
        const naturalWidth = kitchenBgImg.naturalWidth;     // Природна ширина зображення
        const naturalHeight = kitchenBgImg.naturalHeight;   // Природна висота зображення

        let visibleImageWidth, visibleImageHeight;
        let visibleImageLeftOffset, visibleImageTopOffset;

        const scaleX = imgRect.width / naturalWidth;
        const scaleY = imgRect.height / naturalHeight;

        // Для 'object-fit: cover' використовується БІЛЬШИЙ коефіцієнт масштабування
        const scaleFactor = Math.max(scaleX, scaleY);

        visibleImageWidth = naturalWidth * scaleFactor;
        visibleImageHeight = naturalHeight * scaleFactor;

        // Розраховуємо зміщення для центрування (або обрізання)
        visibleImageLeftOffset = (imgRect.width - visibleImageWidth) / 2;
        visibleImageTopOffset = (imgRect.height - visibleImageHeight) / 2;

        // Застосовуємо розраховані розміри та позицію до dropzoneContainer
        // Використовуємо Math.round() для уникнення проблем з суб-пікселями
        dropzoneContainer.style.width = `${Math.round(visibleImageWidth)}px`;
        dropzoneContainer.style.height = `${Math.round(visibleImageHeight)}px`;
        dropzoneContainer.style.left = `${Math.round(imgRect.left + visibleImageLeftOffset)}px`;
        dropzoneContainer.style.top = `${Math.round(imgRect.top + visibleImageTopOffset)}px`;
        dropzoneContainer.style.display = 'block'; // Переконаємось, що контейнер видимий
    }

    // Оновлюємо позицію при завантаженні зображення
    kitchenBgImg.addEventListener('load', updateDropzoneContainerPosition);
    // Оновлюємо позицію при зміні розміру вікна
    window.addEventListener('resize', updateDropzoneContainerPosition);
    // Викликаємо функцію один раз на випадок, якщо зображення вже в кеші або DOM вже завантажений
    updateDropzoneContainerPosition();

    // Логіка Drag & Drop для дроп-зон
    const dropZones = document.querySelectorAll('.dropzone');

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
            zone.classList.add('hovered');
        });

        zone.addEventListener('dragleave', (event) => {
            zone.classList.remove('hovered');
        });

        zone.addEventListener('drop', (event) => {
            event.preventDefault();
            zone.classList.remove('hovered');

            const data = event.dataTransfer.getData('text/plain');
            console.log(`Об'єкт скинуто в зону: ${zone.id}. Дані: ${data}`);
        });
    });
});