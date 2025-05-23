document.addEventListener('DOMContentLoaded', () => {
    const kitchenBgImg = document.getElementById('kitchen-bg-img');
    const dropzoneContainer = document.getElementById('dropzone-container');
    const potDropzone = document.getElementById('pot');
    const ovenDropzone = document.getElementById('oven');
    const fridgeDropzone = document.getElementById('fridge');

    const ingredientsContainer = document.getElementById('ingredients-slots');
    const ingredientModal = document.getElementById('ingredient-modal');
    const modalImage = ingredientModal.querySelector('.modal-image');
    const modalTitle = ingredientModal.querySelector('.modal-title');
    const modalCloseButton = ingredientModal.querySelector('.close-button');
    const playSoundButton = ingredientModal.querySelector('.play-sound-button');
    const levelCompleteScreen = document.getElementById('level-complete-screen');
    const feedbackMessageDiv = document.getElementById('feedback-message');

    // Елементи бічної панелі
    const toggleTaskPanelButton = document.getElementById('toggle-task-panel');
    const taskPanel = document.getElementById('task-panel');
    const closeTaskPanelButton = document.getElementById('close-task-panel');

    // Елементи таск-панелі для динамічного оновлення
    const taskTitleElement = document.getElementById('taskTitle');
    const taskHintElement = document.getElementById('taskHint');
    const taskBonusElement = document.getElementById('taskBonus');


    toggleTaskPanelButton.addEventListener('click', () => {
        taskPanel.classList.toggle('active');
    });

    closeTaskPanelButton.addEventListener('click', () => {
        taskPanel.classList.remove('active');
    });

    // --- МАСИВ З ПОВІДОМЛЕННЯМИ ---
    const correctMessages = [
        "Amazing!",
        "Impressive!",
        "Great!",
        "Fantastic!",
        "Awesome!",
        "Well done!",
        "Keep going!"
    ];

    let currentScore = 0;
    let totalGameScore = 0;
    let correctIngredientsAdded = new Set();
    let incorrectIngredientsDroppedCount = 0;
    let totalIncorrectDropsOverall = 0; // Нова змінна для загальної статистики неправильних дропів
    let currentLevelIndex = 0;

    // --- Дані для ВСІХ рівнів (ОНОВЛЕНО) ---
    const allLevelsData = [
        // Рівень 1: Creamy Vegetables Soup
        {
            id: 'creamy-vegetables-soup',
            name: "Creamy Vegetables Soup",
            taskPanel: {
                title: "Cook Creamy Vegetables Soup",
                hint: "Hint: Use the pot to cook soup. 😉",
                bonus: "**Bonus:** Get an extra 3 points if you add all correct ingredients without any mistakes!"
            },
            correctMultiplier: 3,
            incorrectMultiplier: -2,
            bonusPoints: 3,
            maxScore: 30 + 3, // Загальний максимальний бал з бонусом
            correctIngredients: ['mushrooms', 'potato', 'carrot', 'heavy-cream', 'garlic', 'corn', 'peas', 'onion', 'tomato'],
            incorrectIngredients: ['pomegranate', 'melon', 'coconut'],
            activeZone: 'pot',
            allIngredients: [
                { id: 'mushrooms', name: 'Mushrooms', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-mushroom-40.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/mushrooms.png' },
                { id: 'potato', name: 'Potato', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-potato-40.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/potato.png' },
                { id: 'carrot', name: 'Carrot', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-carrot-50.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/carrot.png' },
                { id: 'heavy-cream', name: 'Heavy Cream', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-heavy-cream-48.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/heavy-cream.png' },
                { id: 'garlic', name: 'Garlic', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-garlic-48.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/garlic.png' },
                { id: 'corn', name: 'Corn', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-corn-48.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/corn.png' },
                { id: 'peas', name: 'Peas', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-peas-48.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/peas.png' },
                { id: 'onion', name: 'Onion', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-onion-48.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/onion.png' },
                { id: 'tomato', name: 'Tomato', thumbImg: 'img/Creamy Vegetables Soup/Correct ingridients/icons/icons8-tomato-48.png', modalImg: 'img/Creamy Vegetables Soup/Correct ingridients/modal/tomato.png' },
                { id: 'pomegranate', name: 'Pomegranate', thumbImg: 'img/Creamy Vegetables Soup/Incorrect ingridients/icons/icons8-pomegranate-48.png', modalImg: 'img/Creamy Vegetables Soup/Incorrect ingridients/modal/pomegranate.png' },
                { id: 'melon', name: 'Melon', thumbImg: 'img/Creamy Vegetables Soup/Incorrect ingridients/icons/icons8-melon-48.png', modalImg: 'img/Creamy Vegetables Soup/Incorrect ingridients/modal/melon.png' },
                { id: 'coconut', name: 'Coconut', thumbImg: 'img/Creamy Vegetables Soup/Incorrect ingridients/icons/icons8-coconut-48.png', modalImg: 'img/Creamy Vegetables Soup/Incorrect ingridients/modal/coconut.png' },
            ]
        },
        // Рівень 2: Baked Vegetables with Sour Cream and Cheese (НОВИЙ)
        {
            id: 'baked-vegetables-with-sour-cream-and-cheese',
            name: "Baked Vegetables with Sour Cream and Cheese",
            taskPanel: {
                title: "Cook Baked Vegetables with Sour Cream and Cheese",
                hint: "Hint: Use the oven to cook baked vegetables. 😉",
                bonus: "**Bonus:** Get an extra 1 points if you add all correct ingredients without any mistakes!"
            },
            correctMultiplier: 4,
            incorrectMultiplier: -2,
            bonusPoints: 1,
            maxScore: 24 + 1,
            correctIngredients: ['broccoli', 'bell-pepper', 'eggplant', 'cabbage', 'cheese', 'sour-cream'],
            incorrectIngredients: ['yogurt', 'dry-milk', 'watermelon', 'pineapple', 'grapes', 'lemon'],
            activeZone: 'oven',
            allIngredients: [
                { id: 'broccoli', name: 'Broccoli', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/icons/icons8-broccoli-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/modal/broccoli.png' },
                { id: 'bell-pepper', name: 'Bell pepper', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/icons/icons8-bell-pepper-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/modal/bell-pepper.png' },
                { id: 'eggplant', name: 'Eggplant', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/icons/icons8-eggplant-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/modal/eggplant.png' },
                { id: 'cabbage', name: 'Cabbage', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/icons/icons8-cabbage-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/modal/cabbage.png' },
                { id: 'cheese', name: 'Cheese', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/icons/icons8-cheese-40.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/modal/cheese.png' },
                { id: 'sour-cream', name: 'Sour cream', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/icons/icons8-sour-cream-58.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Correct ingridients/modal/sour-cream.png' },
                { id: 'yogurt', name: 'Yogurt', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/icons/icons8-yogurt-58.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/modal/yogurt.png' },
                { id: 'dry-milk', name: 'Dry milk', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/icons/icons8-milk-powder-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/modal/milk-powder.png' },
                { id: 'watermelon', name: 'Watermelon', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/icons/icons8-watermelon-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/modal/watermelon.png' },
                { id: 'pineapple', name: 'Pineapple', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/icons/icons8-pineapple-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/modal/pineapple.png' },
                { id: 'grapes', name: 'Grapes', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/icons/icons8-grapes-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/modal/grape.png' },
                { id: 'lemon', name: 'Lemon', thumbImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/icons/icons8-lemon-48.png', modalImg: 'img/Baked Vegetables with Sour Cream and Cheese/Incorrect ingridients/modal/lemon.png' },
            ]
        },
        // Рівень 3: Fruit Salad (НОВИЙ)
        {
            id: 'fruit-salad',
            name: "Fruit Salad",
            taskPanel: {
                title: "Cook Fruit Salad",
                hint: "Hint: Use the fridge to keep the salad. 😉",
                bonus: "**Bonus:** Get an extra 4 points if you add all correct ingredients without any mistakes!"
            },
            correctMultiplier: 3,
            incorrectMultiplier: -2,
            bonusPoints: 4,
            maxScore: 21 + 4,
            correctIngredients: ['apple', 'orange', 'kiwi', 'pear', 'peach', 'mango', 'plum'],
            incorrectIngredients: ['whey', 'pumpkin', 'cream', 'condensed-milk', 'avocado'],
            activeZone: 'fridge',
            allIngredients: [
                { id: 'apple', name: 'Apple', thumbImg: 'img/Fruit Salad/Correct ingridients/icons/icons8-green-apple-48.png', modalImg: 'img/Fruit Salad/Correct ingridients/modal/apple.png' },
                { id: 'orange', name: 'Orange', thumbImg: 'img/Fruit Salad/Correct ingridients/icons/icons8-orange-48.png', modalImg: 'img/Fruit Salad/Correct ingridients/modal/orange.png' },
                { id: 'kiwi', name: 'Kiwi', thumbImg: 'img/Fruit Salad/Correct ingridients/icons/icons8-kiwi-48.png', modalImg: 'img/Fruit Salad/Correct ingridients/modal/kiwi.png' },
                { id: 'pear', name: 'Pear', thumbImg: 'img/Fruit Salad/Correct ingridients/icons/icons8-pear-48.png', modalImg: 'img/Fruit Salad/Correct ingridients/modal/pear.png' },
                { id: 'peach', name: 'Peach', thumbImg: 'img/Fruit Salad/Correct ingridients/icons/icons8-peach-48.png', modalImg: 'img/Fruit Salad/Correct ingridients/modal/peach.png' },
                { id: 'mango', name: 'Mango', thumbImg: 'img/Fruit Salad/Correct ingridients/icons/icons8-mango-48.png', modalImg: 'img/Fruit Salad/Correct ingridients/modal/mango.png' },
                { id: 'plum', name: 'Plum', thumbImg: 'img/Fruit Salad/Correct ingridients/icons/icons8-plum-48.png', modalImg: 'img/Fruit Salad/Correct ingridients/modal/plum.png' },
                { id: 'whey', name: 'Whey', thumbImg: 'img/Fruit Salad/Incorrect ingridients/icons/icons8-whey-64.png', modalImg: 'img/Fruit Salad/Incorrect ingridients/modal/whey.png' },
                { id: 'pumpkin', name: 'Pumpkin', thumbImg: 'img/Fruit Salad/Incorrect ingridients/icons/icons8-pumpkin-48.png', modalImg: 'img/Fruit Salad/Incorrect ingridients/modal/pumpkin.png' },
                { id: 'cream', name: 'Cream', thumbImg: 'img/Fruit Salad/Incorrect ingridients/icons/icons8-cream-48.png', modalImg: 'img/Fruit Salad/Incorrect ingridients/modal/cream.png' },
                { id: 'condensed-milk', name: 'Condensed milk', thumbImg: 'img/Fruit Salad/Incorrect ingridients/icons/icons8-condensed-milk-48.png', modalImg: 'img/Fruit Salad/Incorrect ingridients/modal/condensed-milk.png' },
                { id: 'avocado', name: 'Avocado', thumbImg: 'img/Fruit Salad/Incorrect ingridients/icons/icons8-avocado-48.png', modalImg: 'img/Fruit Salad/Incorrect ingridients/modal/avocado.png' },
            ]
        },
        // Рівень 4: Milk Shake (НОВИЙ)
        {
            id: 'milk-shake',
            name: "Milk Shake",
            taskPanel: {
                title: "Cook Milk Shake",
                hint: "Hint: Use the fridge to keep milk shake. 😉",
                bonus: "**Bonus:** Get an extra 4 points if you add all correct ingredients without any mistakes!"
            },
            correctMultiplier: 2,
            incorrectMultiplier: -2,
            bonusPoints: 4,
            maxScore: 16 + 4,
            correctIngredients: ['milk', 'ice-cream', 'banana', 'strawberry', 'blueberry', 'raspberry', 'blackberry', 'cherry'],
            incorrectIngredients: ['butter', 'cucumber', 'ginger', 'radish'],
            activeZone: 'fridge',
            allIngredients: [
                { id: 'milk', name: 'Milk', thumbImg: 'img/Milk Shake/Correct ingridients/icons/icons8-milk-48.png', modalImg: 'img/Milk Shake/Correct ingridients/modal/milk.png' },
                { id: 'ice-cream', name: 'Ice cream', thumbImg: 'img/Milk Shake/Correct ingridients/icons/icons8-ice-cream-48.png', modalImg: 'img/Milk Shake/Correct ingridients/modal/ice-cream.png' },
                { id: 'banana', name: 'Banana', thumbImg: 'img/Milk Shake/Correct ingridients/icons/icons8-banana-48.png', modalImg: 'img/Milk Shake/Correct ingridients/modal/banana.png' },
                { id: 'strawberry', name: 'Strawberry', thumbImg: 'img/Milk Shake/Correct ingridients/icons/icons8-strawberry-48.png', modalImg: 'img/Milk Shake/Correct ingridients/modal/strawberry.png' },
                { id: 'blueberry', name: 'Blueberry', thumbImg: 'img/Milk Shake/Correct ingridients/icons/icons8-blueberry-48.png', modalImg: 'img/Milk Shake/Correct ingridients/modal/blueberry.png' },
                { id: 'raspberry', name: 'Raspberry', thumbImg: 'img/Milk Shake/Correct ingridients/icons/icons8-raspberry-48.png', modalImg: 'img/Milk Shake/Correct ingridients/modal/raspberry.png' },
                { id: 'blackberry', name: 'Blackberry', thumbImg: 'img/Milk Shake/Correct ingridients/icons/icons8-black-berry-48.png', modalImg: 'img/Milk Shake/Correct ingridients/modal/blackberry.png' },
                { id: 'cherry', name: 'Cherry', thumbImg: 'img/Milk Shake/Correct ingridients/icons/icons8-cherry-48.png', modalImg: 'img/Milk Shake/Correct ingridients/modal/cherry.png' },
                { id: 'butter', name: 'Butter', thumbImg: 'img/Milk Shake/Incorrect ingridients/icons/icons8-butter-48.png', modalImg: 'img/Milk Shake/Incorrect ingridients/modal/butter.png' },
                { id: 'cucumber', name: 'Cucumber', thumbImg: 'img/Milk Shake/Incorrect ingridients/icons/icons8-cucumber-48.png', modalImg: 'img/Milk Shake/Incorrect ingridients/modal/cucumber.png' },
                { id: 'ginger', name: 'Ginger', thumbImg: 'img/Milk Shake/Incorrect ingridients/icons/icons8-ginger-48.png', modalImg: 'img/Milk Shake/Incorrect ingridients/modal/ginger.png' },
                { id: 'radish', name: 'Radish', thumbImg: 'img/Milk Shake/Incorrect ingridients/icons/icons8-radish-48.png', modalImg: 'img/Milk Shake/Incorrect ingridients/modal/radish.png' },
            ]
        }
    ];

    let currentLevelData; // Змінна для зберігання даних поточного рівня

    // --- Функція для оновлення позиції контейнера дроп-зон ---
    function updateDropzoneContainerPosition() {
        const imgRect = kitchenBgImg.getBoundingClientRect();
        const naturalWidth = kitchenBgImg.naturalWidth;
        const naturalHeight = kitchenBgImg.naturalHeight;

        const scaleX = imgRect.width / naturalWidth;
        const scaleY = imgRect.height / naturalHeight;
        const scaleFactor = Math.min(scaleX, scaleY); // Використовуємо Math.min для "contain" ефекту

        const visibleImageWidth = naturalWidth * scaleFactor;
        const visibleImageHeight = naturalHeight * scaleFactor;

        // Центрування зображення
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
        img.src = ingredient.thumbImg;
        img.alt = ingredient.name;
        ingredientDiv.draggable = true;

        ingredientDiv.appendChild(img);
        ingredientsContainer.appendChild(ingredientDiv);

        ingredientDiv.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', ingredient.id);
            ingredientDiv.classList.add('dragging');
            event.dataTransfer.dropEffect = 'move';
        });
        ingredientDiv.addEventListener('dragend', () => {
            ingredientDiv.classList.remove('dragging');
        });

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

        ingredientDiv.addEventListener('click', () => {
            showIngredientModal(ingredient);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Обмін елементів
        }
        return array;
    }

    // --- Логіка Drag & Drop для дроп-зон ---
    const allDropzones = document.querySelectorAll('.dropzone');

    allDropzones.forEach(zone => {
        zone.addEventListener('dragover', (event) => {
            if (currentLevelData && zone.id === currentLevelData.activeZone) { // Перевірка на currentLevelData
                event.preventDefault();
                zone.classList.add('hovered');
                event.dataTransfer.dropEffect = 'move';
            }
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('hovered');
        });

        zone.addEventListener('drop', (event) => {
            event.preventDefault();
            zone.classList.remove('hovered');

            const ingredientId = event.dataTransfer.getData('text/plain');
            const draggedIngredientEl = document.querySelector(`.ingredient-item[data-id="${ingredientId}"]`);
            const ingredientData = currentLevelData.allIngredients.find(ing => ing.id === ingredientId);

            if (!ingredientData) {
                console.error('Ingredient data not found for ID:', ingredientId);
                return;
            }

            if (zone.id === currentLevelData.activeZone) {
                if (currentLevelData.correctIngredients.includes(ingredientId)) {
                    if (!correctIngredientsAdded.has(ingredientId)) {
                        currentScore += currentLevelData.correctMultiplier;
                        correctIngredientsAdded.add(ingredientId);
                        draggedIngredientEl.remove();
                        console.log(`Правильний інгредієнт: ${ingredientData.name}. Поточні бали: ${currentScore}`);
                        const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
                        showScoreFeedback(currentLevelData.correctMultiplier, randomMessage, zone);
                        checkLevelCompletion();
                    } else {
                        console.log(`Інгредієнт ${ingredientData.name} вже додано. Бали не змінено.`);
                        showFeedbackMessage(`${ingredientData.name} is already in the dish!`);
                    }
                } else {
                    currentScore += currentLevelData.incorrectMultiplier;
                    incorrectIngredientsDroppedCount++;
                    totalIncorrectDropsOverall++; // Збільшуємо загальний лічильник неправильних дропів
                    console.log(`Неправильний інгредієнт: ${ingredientData.name}. Поточні бали: ${currentScore}`);
                    showFeedbackMessage(`Oh no... You don’t use ${ingredientData.name} for this dish 😟. Try again! 😊`);
                    showScoreFeedback(currentLevelData.incorrectMultiplier, "", zone);
                }
            } else {
                console.log(`Скидання ${ingredientData.name} в ${zone.id} не підтримується для цього рівня. Активна зона: ${currentLevelData.activeZone}`);
                showFeedbackMessage(`Wrong place for ${ingredientData.name}! Use the ${currentLevelData.activeZone.charAt(0).toUpperCase() + currentLevelData.activeZone.slice(1)}.`);
            }
        });
    });

    // --- Функція для відображення загальних повідомлень ---
    function showFeedbackMessage(message) {
        feedbackMessageDiv.textContent = message;
        feedbackMessageDiv.style.display = 'block';
        feedbackMessageDiv.style.opacity = '1';

        setTimeout(() => {
            feedbackMessageDiv.style.opacity = '0';
            setTimeout(() => {
                feedbackMessageDiv.style.display = 'none';
            }, 500);
        }, 7000);
    }

    // --- Функція для динамічного відображення балів та повідомлення (Готує для CSS) ---
    function showScoreFeedback(scoreChange, message, targetElement) {
        const feedbackEl = document.createElement('div');
        feedbackEl.classList.add('score-feedback-message');
        document.body.appendChild(feedbackEl);

        if (scoreChange > 0) {
            feedbackEl.textContent = `+${scoreChange} ${message}`;
            feedbackEl.classList.add('positive');
        } else {
            feedbackEl.textContent = `${scoreChange}`;
            feedbackEl.classList.add('negative');
        }

        const rect = targetElement.getBoundingClientRect();

        feedbackEl.style.left = `${rect.left + rect.width / 2}px`;
        feedbackEl.style.top = `${rect.top + rect.height / 2}px`;

        setTimeout(() => {
            feedbackEl.classList.add('active');
        }, 10);

        setTimeout(() => {
            feedbackEl.remove();
        }, 2000);
    }

    // --- Функція для перевірки завершення рівня ---
    function checkLevelCompletion() {
        if (correctIngredientsAdded.size === currentLevelData.correctIngredients.length) {
            console.log('Рівень завершено! Всі правильні інгредієнти додані.');

            if (incorrectIngredientsDroppedCount === 0) {
                currentScore += currentLevelData.bonusPoints; // Бонус за проходження без помилок
                console.log(`Бонус! +${currentLevelData.bonusPoints} балів за проходження без помилок. Поточні бали: ${currentScore}`);
            }

            totalGameScore += currentScore; // Додаємо бали поточного рівня до загального рахунку

            playStarsAnimation();

            setTimeout(() => {
                showLevelCompleteScreen(); // Завжди викликаємо екран завершення поточного рівня
            }, 2500);
        }
    }

    // --- Функція для анімації зірочок ---
    function playStarsAnimation() {
        const starContainer = document.createElement('div');
        starContainer.classList.add('star-container');
        document.body.appendChild(starContainer);

        for (let i = 0; i < 10; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 20 + 40}%`;
            star.style.top = `${Math.random() * 20 + 40}%`;

            const endX = Math.random() * 600 - 300;
            const endY = Math.random() * 600 - 300;
            star.style.setProperty('--end-x', `${endX}px`);
            star.style.setProperty('--end-y', `${endY}px`);

            star.style.animationDelay = `${i * 0.1}s`;
            star.style.animationDuration = `${2 + Math.random() * 1}s`;

            starContainer.appendChild(star);
        }

        starContainer.addEventListener('animationend', (event) => {
            // Перевіряємо, чи всі зірки завершили анімацію
            if (event.target.classList.contains('star') && !starContainer.querySelector('.star')) {
                starContainer.remove();
            }
        });
    }

    // --- Функція для закриття модального вікна ---
    function closeModal() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        ingredientModal.classList.remove('active');
    }

    // --- Призначення обробників подій для модального вікна ---
    modalCloseButton.addEventListener('click', closeModal);
    ingredientModal.addEventListener('click', (e) => {
        if (e.target === ingredientModal) {
            closeModal();
        }
    });

    playSoundButton.addEventListener('click', () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        const textToSpeak = modalTitle.textContent;
        if (textToSpeak) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    });

    // --- Оновлена функція showIngredientModal ---
    function showIngredientModal(ingredient) {
        modalImage.src = ingredient.modalImg;
        modalImage.alt = ingredient.name;
        modalTitle.textContent = ingredient.name;
        ingredientModal.classList.add('active');
    }

    // --- Функція для показу екрану завершення рівня ---
    function showLevelCompleteScreen() {
        // Приховуємо ігрові елементи
        if (ingredientsContainer) ingredientsContainer.style.display = 'none';
        if (dropzoneContainer) dropzoneContainer.style.display = 'none';
        if (toggleTaskPanelButton) toggleTaskPanelButton.style.display = 'none'; // Виправлено typo
        if (taskPanel) taskPanel.classList.remove('active');

        const correctIngsHtml = currentLevelData.correctIngredients.map(id => {
            const ing = currentLevelData.allIngredients.find(i => i.id === id);
            return `<div class="ingredient-display-item correct" data-id="${ing.id}">
                                <img src="${ing.thumbImg}" alt="${ing.name}">
                                <span>${ing.name}</span>
                            </div>`;
        }).join('');

        const incorrectIngsHtml = currentLevelData.incorrectIngredients.filter(id => !currentLevelData.correctIngredients.includes(id)).map(id => { // Фільтруємо, щоб показувати лише "неправильні" інгредієнти для цього рівня, які не є правильними.
            const ing = currentLevelData.allIngredients.find(i => i.id === id);
            return `<div class="ingredient-display-item incorrect" data-id="${ing.id}">
                                <img src="${ing.thumbImg}" alt="${ing.name}">
                                <span>${ing.name}</span>
                            </div>`;
        }).join('');

        levelCompleteScreen.innerHTML = `
                <h1>🥳 Yay! Well done!</h1>
                <p>You made a perfect ${currentLevelData.name}! Your score: ${currentScore} points! 🎯😊</p>
                <div class="ingredient-columns-container">
                    <div class="ingredient-column">
                        <h2>Correct Ingredients</h2>
                        <div class="ingredient-list">
                            ${correctIngsHtml}
                        </div>
                    </div>
                    <div class="ingredient-column">
                        <h2>Incorrect Ingredients (for this dish)</h2>
                        <div class="ingredient-list">
                            ${incorrectIngsHtml}
                        </div>
                    </div>
                </div>
                <button id="next-level-button">Next Level</button> `;
        levelCompleteScreen.style.display = 'flex';

        const nextLevelButton = document.getElementById('next-level-button');
        if (currentLevelIndex === 3) { // currentLevelIndex 3 відповідає 4-му рівню (0-індексація)
            nextLevelButton.textContent = 'Next'; // Змінюємо текст на "Далі"
        } else {
            nextLevelButton.textContent = 'Next level'; // Для інших рівнів залишаємо "Наступний рівень"
        }
        nextLevelButton.addEventListener('click', () => {
            if (currentLevelIndex === allLevelsData.length - 1) {
                // Це був останній рівень, тому після "Next Level" показуємо фінальний екран
                levelCompleteScreen.style.display = 'none'; // Приховуємо поточний екран
                showFinalGameScreen(); // Показуємо загальну статистику
            } else {
                // Це не останній рівень, переходимо до наступного
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
                levelCompleteScreen.style.display = 'none';
                if (ingredientsContainer) ingredientsContainer.style.display = 'flex';
                if (dropzoneContainer) dropzoneContainer.style.display = 'block';
                if (toggleTaskPanelButton) toggleTaskPanelButton.style.display = 'block';
            }
        });

        levelCompleteScreen.querySelectorAll('.ingredient-display-item').forEach(item => {
            item.addEventListener('click', () => {
                const ingredientId = item.dataset.id;
                const ingredient = currentLevelData.allIngredients.find(i => i.id === ingredientId);
                if (ingredient) {
                    showIngredientModal(ingredient);
                }
            });
        });
    }

    // --- Функція для відображення фінального екрану з загальною статистикою ---
    function showFinalGameScreen() {
        // Приховуємо всі ігрові елементи, якщо вони ще видимі
        if (ingredientsContainer) ingredientsContainer.style.display = 'none';
        if (dropzoneContainer) dropzoneContainer.style.display = 'none';
        if (toggleTaskPanelButton) toggleTaskPanelButton.style.display = 'none';
        if (taskPanel) taskPanel.classList.remove('active');

        // Розрахунок максимального можливого рахунку за всю гру
        const maxPossibleTotalScore = allLevelsData.reduce((sum, level) => {
            return sum + (level.correctIngredients.length * level.correctMultiplier) + level.bonusPoints;
        }, 0);

        levelCompleteScreen.innerHTML = `
            <h1 class="final-title">🎉 Congratulations! You completed all levels! 🎉</h1>
            <p class="final-summary">You are a true master chef!</p>
            <p class="final-score">Your total score: <strong>${totalGameScore}</strong> out of <strong>${maxPossibleTotalScore}</strong> points! 🎯</p>
            
            <div class="game-stats">
                <h3>Game Summary:</h3>
                <p>Levels completed: <strong>${allLevelsData.length}</strong> / <strong>${allLevelsData.length}</strong></p>
                <p>Total incorrect drops: <strong>${totalIncorrectDropsOverall}</strong></p>
                <p>Average score per level: <strong>${Math.round(totalGameScore / allLevelsData.length)}</strong> points</p>
            </div>

            <button id="restart-game-button">Play Again</button>
        `;
        levelCompleteScreen.style.display = 'flex';
        levelCompleteScreen.classList.add('final-game-screen'); // Додаємо клас для CSS стилізації фінального екрану

        document.getElementById('restart-game-button').addEventListener('click', () => {
            currentLevelIndex = 0;
            totalGameScore = 0;
            totalIncorrectDropsOverall = 0; // Обнуляємо загальну статистику при рестарті
            loadLevel(currentLevelIndex);
            levelCompleteScreen.style.display = 'none';
            levelCompleteScreen.classList.remove('final-game-screen'); // Видаляємо клас, щоб не конфліктував з CSS
            if (ingredientsContainer) ingredientsContainer.style.display = 'flex';
            if (dropzoneContainer) dropzoneContainer.style.display = 'block';
            if (toggleTaskPanelButton) toggleTaskPanelButton.style.display = 'block';
        });
    }

    // --- Оновлена функція updateTaskPanel (використовує id) ---
    function updateTaskPanel(levelId) {
        const level = allLevelsData.find(l => l.id === levelId); // Знаходимо рівень за id
        if (!level || !level.taskPanel) {
            console.error(`Дані для рівня ${levelId} або його таск-панелі не знайдені.`);
            return;
        }

        if (taskTitleElement) {
            taskTitleElement.textContent = level.taskPanel.title;
        }
        if (taskHintElement) {
            taskHintElement.textContent = level.taskPanel.hint;
        }
        if (taskBonusElement) {
            taskBonusElement.textContent = level.taskPanel.bonus;
        }
    }


    // --- Функція для завантаження нового рівня ---
    function loadLevel(levelIndex) {
        if (levelIndex >= allLevelsData.length) {
            console.warn('Attempted to load a level that does not exist:', levelIndex);
            levelCompleteScreen.style.display = 'none';
            return;
        }

        currentLevelData = allLevelsData[levelIndex]; // Встановлюємо дані поточного рівня

        // Оновлюємо таск-панель відповідно до поточного рівня
        updateTaskPanel(currentLevelData.id);

        // Скидаємо стан для нового рівня
        currentScore = 0;
        correctIngredientsAdded.clear();
        incorrectIngredientsDroppedCount = 0;

        // Очищаємо контейнер інгредієнтів
        ingredientsContainer.innerHTML = '';

        // Перемішуємо і створюємо інгредієнти для нового рівня
        const shuffledIngredients = shuffleArray([...currentLevelData.allIngredients]);
        shuffledIngredients.forEach(ing => createIngredientElement(ing));

        // Оновлюємо активні дроп-зони та фонове зображення кухні
        allDropzones.forEach(zone => {
            zone.classList.remove('active-dropzone');
        });
        const activeZoneElement = document.getElementById(currentLevelData.activeZone);
        if (activeZoneElement) {
            activeZoneElement.classList.add('active-dropzone');
        }

        console.log(`Завантажено рівень: ${currentLevelData.name}`);
        updateDropzoneContainerPosition(); // Перерахувати позицію дропзон після зміни фону
    }


    // --- Ініціалізація ---
    kitchenBgImg.addEventListener('load', updateDropzoneContainerPosition);
    window.addEventListener('resize', updateDropzoneContainerPosition);
    updateDropzoneContainerPosition(); // Викликаємо при першому завантаженні
    loadLevel(currentLevelIndex); // Завантажуємо перший рівень при старті гри
});