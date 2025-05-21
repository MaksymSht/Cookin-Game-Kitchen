document.addEventListener('DOMContentLoaded', () => {
    const kitchenBgImg = document.getElementById('kitchen-bg-img');
    const dropzoneContainer = document.getElementById('dropzone-container');
    const potDropzone = document.getElementById('pot');

    const ingredientsContainer = document.getElementById('ingredients-slots');
    const ingredientModal = document.getElementById('ingredient-modal');
    const modalImage = ingredientModal.querySelector('.modal-image');
    const modalTitle = ingredientModal.querySelector('.modal-title');
    const modalCloseButton = ingredientModal.querySelector('.close-button');
    const playSoundButton = ingredientModal.querySelector('.play-sound-button');
    const levelCompleteScreen = document.getElementById('level-complete-screen');
    const feedbackMessageDiv = document.getElementById('feedback-message');
    const scoreFeedbackDiv = document.getElementById('score-feedback'); // Новий елемент для балів

    // Елементи бічної панелі
    const toggleTaskPanelButton = document.getElementById('toggle-task-panel');
    const taskPanel = document.getElementById('task-panel');
    const closeTaskPanelButton = document.getElementById('close-task-panel');


    let currentScore = 0;
    const correctIngredientsAdded = new Set();
    let incorrectIngredientsDroppedCount = 0; // Лічильник неправильних інгредієнтів

    // --- Дані для рівня "Creamy Vegetables Soup" ---
    const levelData = {
        name: "Creamy Vegetables Soup",
        // Макс. бали: 9 правильних * 3 бали = 27 + 3 бонусні бали = 30
        maxScore: 30,
        scorePerCorrect: 3,
        penaltyPerIncorrect: -2,
        correctIngredients: ['mushrooms', 'potato', 'carrot', 'heavy-cream', 'garlic', 'corn', 'peas', 'onion', 'tomato'],
        incorrectIngredients: ['pomegranate', 'melon', 'coconut'],
        allIngredients: [
            // Властивості thumbImg та modalImg для різних розмірів зображень
            { id: 'mushrooms', name: 'Mushrooms', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'potato', name: 'Potato', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'carrot', name: 'Carrot', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'heavy-cream', name: 'Heavy Cream', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'garlic', name: 'Garlic', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'corn', name: 'Corn', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'peas', name: 'Peas', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'onion', name: 'Onion', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'tomato', name: 'Tomato', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'pomegranate', name: 'Pomegranate', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'melon', name: 'Melon', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
            { id: 'coconut', name: 'Coconut', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-30.png', 
                modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
        ]
    };

    // --- Функція для оновлення позиції контейнера дроп-зон ---
    function updateDropzoneContainerPosition() {
        const imgRect = kitchenBgImg.getBoundingClientRect();
        const naturalWidth = kitchenBgImg.naturalWidth;
        const naturalHeight = kitchenBgImg.naturalHeight;

        const scaleX = imgRect.width / naturalWidth;
        const scaleY = imgRect.height / naturalHeight;
        const scaleFactor = Math.max(scaleX, scaleY);

        const visibleImageWidth = naturalWidth * scaleFactor;
        const visibleImageHeight = naturalHeight * scaleFactor;

        const visibleImageLeftOffset = (imgRect.width - visibleImageWidth) / 2;
        const visibleImageTopOffset = (imgRect.height - visibleImageHeight) / 2;

        dropzoneContainer.style.width = `${Math.round(visibleImageWidth)}px`;
        dropzoneContainer.style.height = `${Math.round(visibleImageHeight)}px`;
        dropzoneContainer.style.left = `${Math.round(imgRect.left + visibleImageLeftOffset)}px`;
        dropzoneContainer.style.top = `${Math.round(imgRect.top + visibleImageTopOffset)}px`;
        dropzoneContainer.style.display = 'block';
    }

    // --- Створення інгредієнтів ---
    function createIngredientElement(ingredient) {
        const ingredientDiv = document.createElement('div');
        ingredientDiv.classList.add('ingredient-item');
        ingredientDiv.dataset.id = ingredient.id;

        const img = document.createElement('img');
        img.src = ingredient.thumbImg; // Використовуємо thumbImg для іконки
        img.alt = ingredient.name;
        ingredientDiv.draggable = true; // draggable на div, pointer-events: none на img

        ingredientDiv.appendChild(img);
        ingredientsContainer.appendChild(ingredientDiv);

        // --- Drag Events для інгредієнтів ---
        ingredientDiv.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', ingredient.id);
            ingredientDiv.classList.add('dragging');
            // Встановлюємо dropEffect для відображення курсора
            event.dataTransfer.dropEffect = 'move';
        });
        ingredientDiv.addEventListener('dragend', (event) => {
            ingredientDiv.classList.remove('dragging');
        });

        // --- Hover (наведення) на інгредієнті для показу назви ---
        ingredientDiv.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('span');
            tooltip.classList.add('ingredient-tooltip');
            tooltip.textContent = ingredient.name;
            ingredientDiv.appendChild(tooltip);
        });

        ingredientDiv.addEventListener('mouseleave', () => {
            const tooltip = ingredientDiv.querySelector('.ingredient-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });

        // --- Click (клік) на інгредієнті для модального вікна ---
        ingredientDiv.addEventListener('click', () => {
            showIngredientModal(ingredient);
        });
    }

    // Створюємо всі інгредієнти на початку
    levelData.allIngredients.forEach(ing => createIngredientElement(ing));

    // --- Логіка Drag & Drop для дроп-зон ---
    // Обираємо тільки активні дроп-зони
    const activeDropZones = document.querySelectorAll('.dropzone.active-dropzone');

    activeDropZones.forEach(zone => {
        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
            zone.classList.add('hovered');
            event.dataTransfer.dropEffect = 'move'; // Вказуємо, що переміщення дозволено
        });

        zone.addEventListener('dragleave', (event) => {
            zone.classList.remove('hovered');
        });

        zone.addEventListener('drop', (event) => {
            event.preventDefault();
            zone.classList.remove('hovered');

            const ingredientId = event.dataTransfer.getData('text/plain');
            const draggedIngredientEl = document.querySelector(`.ingredient-item[data-id="${ingredientId}"]`);
            const ingredientData = levelData.allIngredients.find(ing => ing.id === ingredientId);

            if (!ingredientData) {
                console.error('Ingredient data not found for ID:', ingredientId);
                return;
            }

            // Перевіряємо, чи скинули в горщик (pot)
            if (zone.id === 'pot') {
                if (levelData.correctIngredients.includes(ingredientId)) {
                    // Правильний інгредієнт для супу
                    if (!correctIngredientsAdded.has(ingredientId)) {
                        currentScore += levelData.scorePerCorrect;
                        correctIngredientsAdded.add(ingredientId);
                        draggedIngredientEl.remove();
                        console.log(`Правильний інгредієнт: ${ingredientData.name}. Поточні бали: ${currentScore}`);
                        showScoreFeedback(levelData.scorePerCorrect, 'Молодець! Так тримати! 🎉');
                        checkLevelCompletion();
                    } else {
                        console.log(`Інгредієнт ${ingredientData.name} вже додано. Бали не змінено.`);
                        showFeedbackMessage(`${ingredientData.name} is already in the soup!`);
                    }
                } else {
                    // Неправильний інгредієнт для супу
                    currentScore += levelData.penaltyPerIncorrect;
                    incorrectIngredientsDroppedCount++; // Збільшуємо лічильник неправильних
                    showFeedbackMessage(`Oh no... You don’t use ${ingredientData.name} for this dish 😟. Try again! 😊`);
                    showScoreFeedback(levelData.penaltyPerIncorrect, 'О ні! Спробуй ще раз! 🤦‍♂️');
                    console.log(`Неправильний інгредієнт: ${ingredientData.name}. Поточні бали: ${currentScore}`);
                }
            } else {
                // Цей блок не повинен викликатися, якщо неактивні зони приховані,
                // але залишаємо для безпеки.
                console.log(`Скидання ${ingredientData.name} в ${zone.id} не підтримується для цього рівня.`);
                // showFeedbackMessage(`This dish doesn't need ${ingredientData.name} in the ${zone.id}!`);
            }
        });
    });

    // --- Функція для відображення повідомлень (наприклад, про неправильний інгредієнт) ---
    function showFeedbackMessage(message) {
        feedbackMessageDiv.textContent = message;
        feedbackMessageDiv.style.display = 'block';
        feedbackMessageDiv.style.opacity = '1';

        setTimeout(() => {
            feedbackMessageDiv.style.opacity = '0';
            setTimeout(() => {
                feedbackMessageDiv.style.display = 'none';
            }, 500); // Час має відповідати transition в CSS
        }, 7000); // Повідомлення висить 7 секунд
    }

    // --- Функція для динамічного відображення балів ---
    function showScoreFeedback(scoreChange, message) {
        scoreFeedbackDiv.textContent = `${scoreChange > 0 ? '+' : ''}${scoreChange} ${message}`;
        scoreFeedbackDiv.classList.remove('positive', 'negative'); // Скидаємо попередні класи
        scoreFeedbackDiv.classList.add(scoreChange > 0 ? 'positive' : 'negative');
        scoreFeedbackDiv.style.display = 'block';
        scoreFeedbackDiv.style.opacity = '1';

        setTimeout(() => {
            scoreFeedbackDiv.style.opacity = '0';
            scoreFeedbackDiv.style.transform = 'translate(-50%, -50%)'; // Скидаємо трансформацію
            setTimeout(() => {
                scoreFeedbackDiv.style.display = 'none';
            }, 300); // Має відповідати transition в CSS
        }, 1500); // Повідомлення висить 1.5 секунди
    }


    // --- Функція для перевірки завершення рівня ---
    function checkLevelCompletion() {
        if (correctIngredientsAdded.size === levelData.correctIngredients.length) {
            console.log('Рівень завершено! Всі правильні інгредієнти додані.');

            // Логіка для бонусних балів
            if (incorrectIngredientsDroppedCount === 0) {
                currentScore += 3; // Додаємо бонусні бали
                console.log(`Бонус! +3 бали за проходження без помилок. Поточні бали: ${currentScore}`);
            }

            playStarsAnimation(); // Анімація зірочок

            setTimeout(() => {
                showLevelCompleteScreen();
            }, 2500); // Затримка перед показом екрану завершення, щоб побачити зірочки
        }
    }

    // --- Функція для анімації зірочок ---
    function playStarsAnimation() {
        const starContainer = document.createElement('div');
        starContainer.classList.add('star-container');
        document.body.appendChild(starContainer);

        // Створюємо та анімуємо кілька зірочок
        for (let i = 0; i < 10; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            // Генеруємо випадкові початкові позиції навколо центру екрана
            star.style.left = `${Math.random() * 20 + 40}%`; // 40-60% ширини екрану
            star.style.top = `${Math.random() * 20 + 40}%`; // 40-60% висоти екрану

            // Випадкові кінцеві позиції для розльоту
            const endX = Math.random() * 600 - 300; // -300 to 300px
            const endY = Math.random() * 600 - 300; // -300 to 300px
            star.style.setProperty('--end-x', `${endX}px`);
            star.style.setProperty('--end-y', `${endY}px`);

            star.style.animationDelay = `${i * 0.1}s`; // Різні затримки
            star.style.animationDuration = `${2 + Math.random() * 1}s`; // Різна тривалість

            starContainer.appendChild(star);
        }

        starContainer.addEventListener('animationend', (event) => {
            // Видаляємо контейнер зірочок після завершення анімації останньої зірки
            if (event.target.classList.contains('star') && !starContainer.querySelector('.star')) {
                starContainer.remove();
            }
        });
    }

    // --- Функція для закриття модального вікна (винесена для перевикористання) ---
    function closeModal() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        // Видаляємо клас 'active' для анімованого закриття
        ingredientModal.classList.remove('active');
    }

    // --- Призначення обробників подій для модального вікна (виконується ОДИН РАЗ) ---
    // Ці обробники призначаються тут, всередині DOMContentLoaded, що є правильним місцем.
    modalCloseButton.addEventListener('click', closeModal);

    // Закриття модалки при кліку на оверлей (фон поза контентом)
    ingredientModal.addEventListener('click', (e) => {
        if (e.target === ingredientModal) { // Перевіряємо, чи клік був саме по оверлею, а не по контенту
            closeModal();
        }
    });

    // Обробник для кнопки "Play Sound"
    playSoundButton.addEventListener('click', () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        const textToSpeak = modalTitle.textContent; // Беремо текст з заголовка модалки
        if (textToSpeak) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'en-US'; // Можете змінити на 'uk-UA' для української, якщо доступно
            utterance.rate = 0.8; // Уповільнюємо швидкість вимови
            speechSynthesis.speak(utterance);
        }
    });


    // --- Оновлена функція showIngredientModal ---
    // Ця функція тепер просто оновлює вміст модалки та додає клас 'active'.
    // Вона викликається, коли користувач клікає на інгредієнт.
    function showIngredientModal(ingredient) {
        modalImage.src = ingredient.modalImg; // Використовуємо modalImg для великого зображення
        modalImage.alt = ingredient.name;
        modalTitle.textContent = ingredient.name;

        // Додаємо клас 'active' для відображення модалки з анімацією
        ingredientModal.classList.add('active'); 
    }

    // --- Функція для показу екрану завершення рівня ---
    function showLevelCompleteScreen() {
        // Ховаємо елементи ігрового поля
        if (ingredientsContainer) ingredientsContainer.style.display = 'none';
        if (dropzoneContainer) dropzoneContainer.style.display = 'none';
        if (toggleTaskPanelButton) toggleTaskPanelButton.style.display = 'none';
        if (taskPanel) taskPanel.classList.remove('active'); // Закриваємо бічну панель


        // Генеруємо HTML для правильних і неправильних інгредієнтів
        const correctIngsHtml = levelData.correctIngredients.map(id => {
            const ing = levelData.allIngredients.find(i => i.id === id);
            return `<div class="ingredient-display-item correct" data-id="${ing.id}">
                        <img src="${ing.thumbImg}" alt="${ing.name}">
                        <span>${ing.name}</span>
                    </div>`;
        }).join('');

        const incorrectIngsHtml = levelData.incorrectIngredients.map(id => {
            const ing = levelData.allIngredients.find(i => i.id === id);
            return `<div class="ingredient-display-item incorrect" data-id="${ing.id}">
                        <img src="${ing.thumbImg}" alt="${ing.name}">
                        <span>${ing.name}</span>
                    </div>`;
        }).join('');

        levelCompleteScreen.innerHTML = `
            <h1>🥳 Yay! Well done!</h1>
            <p>You made a perfect ${levelData.name} 🥣 and earned ${currentScore} points! 🎯😊</p>
            <div class="ingredient-columns-container">
                <div class="ingredient-column">
                    <h2>Correct Ingredients</h2>
                    <div class="ingredient-list">
                        ${correctIngsHtml}
                    </div>
                </div>
                <div class="ingredient-column">
                    <h2>Incorrect Ingredients</h2>
                    <div class="ingredient-list">
                        ${incorrectIngsHtml}
                    </div>
                </div>
            </div>
            <button id="next-level-button">Next Level</button>
        `;
        levelCompleteScreen.style.display = 'flex'; // Показуємо екран завершення

        // Додаємо обробники подій для кліку на інгредієнти на екрані завершення (без hover)
        levelCompleteScreen.querySelectorAll('.ingredient-display-item').forEach(item => {
            item.addEventListener('click', () => {
                const ingredientId = item.dataset.id;
                const ingredient = levelData.allIngredients.find(ing => ing.id === ingredientId);
                if (ingredient) {
                    showIngredientModal(ingredient);
                }
            });
            // Видалено обробники mouseenter та mouseleave
        });

        // Обробник кліку для кнопки "Next Level"
        document.getElementById('next-level-button').addEventListener('click', () => {
            alert('Перехід до наступного рівня! (Тут можна додати логіку переходу)');
            location.reload(); // Для простоти, просто перезавантажуємо сторінку
        });
    }

    // --- Логіка бічної панелі ---
    toggleTaskPanelButton.addEventListener('click', () => {
        taskPanel.classList.toggle('active');
    });

    closeTaskPanelButton.addEventListener('click', () => {
        taskPanel.classList.remove('active');
    });

    // --- Ініціалізація: викликаємо updateDropzoneContainerPosition після завантаження зображення та при зміні розміру вікна ---
    kitchenBgImg.addEventListener('load', updateDropzoneContainerPosition);
    window.addEventListener('resize', updateDropzoneContainerPosition);
    updateDropzoneContainerPosition(); // Викликаємо один раз, якщо зображення вже в кеші
});