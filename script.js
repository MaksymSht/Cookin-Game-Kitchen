document.addEventListener('DOMContentLoaded', () => {
    const kitchenBgImg = document.getElementById('kitchen-bg-img');
    const dropzoneContainer = document.getElementById('dropzone-container');
    const potDropzone = document.getElementById('pot'); // Важливий елемент для позиціонування

    const ingredientsContainer = document.getElementById('ingredients-slots');
    const ingredientModal = document.getElementById('ingredient-modal');
    const modalImage = ingredientModal.querySelector('.modal-image');
    const modalTitle = ingredientModal.querySelector('.modal-title');
    const modalCloseButton = ingredientModal.querySelector('.close-button');
    const playSoundButton = ingredientModal.querySelector('.play-sound-button');
    const levelCompleteScreen = document.getElementById('level-complete-screen');
    const feedbackMessageDiv = document.getElementById('feedback-message');
    // scoreFeedbackDiv більше не використовується для динамічних плаваючих повідомлень,
    // тому що ми створюємо новий елемент для кожного повідомлення, яким керує CSS.
    // const scoreFeedbackDiv = document.getElementById('score-feedback'); 

    // Елементи бічної панелі
    const toggleTaskPanelButton = document.getElementById('toggle-task-panel');
    const taskPanel = document.getElementById('task-panel');
    const closeTaskPanelButton = document.getElementById('close-task-panel');

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
    const correctIngredientsAdded = new Set();
    let incorrectIngredientsDroppedCount = 0; // Лічильник неправильних інгредієнтів

    // --- Дані для рівня "Creamy Vegetables Soup" ---
    const levelData = {
        name: "Creamy Vegetables Soup",
        maxScore: 30,
        scorePerCorrect: 3,
        penaltyPerIncorrect: -2,
        correctIngredients: ['mushrooms', 'potato', 'carrot', 'heavy-cream', 'garlic', 'corn', 'peas', 'onion', 'tomato'],
        incorrectIngredients: ['pomegranate', 'melon', 'coconut'],
        allIngredients: [
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
        ingredientDiv.addEventListener('dragend', (event) => {
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

    // Створюємо всі інгредієнти на початку
    levelData.allIngredients.forEach(ing => createIngredientElement(ing));

    // --- Логіка Drag & Drop для дроп-зон ---
    const activeDropZones = document.querySelectorAll('.dropzone.active-dropzone');

    activeDropZones.forEach(zone => {
        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
            zone.classList.add('hovered');
            event.dataTransfer.dropEffect = 'move';
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

            if (zone.id === 'pot') {
                if (levelData.correctIngredients.includes(ingredientId)) {
                    if (!correctIngredientsAdded.has(ingredientId)) {
                        currentScore += levelData.scorePerCorrect;
                        correctIngredientsAdded.add(ingredientId);
                        draggedIngredientEl.remove();
                        console.log(`Правильний інгредієнт: ${ingredientData.name}. Поточні бали: ${currentScore}`);
                        const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
                        showScoreFeedback(levelData.scorePerCorrect, randomMessage, potDropzone); // Передаємо potDropzone
                        checkLevelCompletion();
                    } else {
                        console.log(`Інгредієнт ${ingredientData.name} вже додано. Бали не змінено.`);
                        showFeedbackMessage(`${ingredientData.name} is already in the soup!`);
                    }
                } else {
                    currentScore += levelData.penaltyPerIncorrect;
                    incorrectIngredientsDroppedCount++;
                    console.log(`Неправильний інгредієнт: ${ingredientData.name}. Поточні бали: ${currentScore}`);
                    showFeedbackMessage(`Oh no... You don’t use ${ingredientData.name} for this dish 😟. Try again! 😊`);
                    showScoreFeedback(levelData.penaltyPerIncorrect, "", potDropzone); // Передаємо potDropzone
                }
            } else {
                console.log(`Скидання ${ingredientData.name} в ${zone.id} не підтримується для цього рівня.`);
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
        feedbackEl.classList.add('score-feedback-message'); // Основний клас для стилізації
        document.body.appendChild(feedbackEl); // Додаємо до body

        if (scoreChange > 0) {
            feedbackEl.textContent = `+${scoreChange} ${message}`;
            feedbackEl.classList.add('positive'); // Клас для позитивних балів
        } else {
            feedbackEl.textContent = `${scoreChange}`;
            feedbackEl.classList.add('negative'); // Клас для негативних балів
        }

        // Отримуємо позицію цільового елемента (горщика)
        const rect = targetElement.getBoundingClientRect();
        
        // Встановлюємо початкову позицію елемента повідомлення.
        // CSS потім візьметься за його анімацію звідси.
        // Залишаємо його в JS, оскільки позиція залежить від горщика,
        // а горщик може зміщуватися при зміні розміру вікна.
        feedbackEl.style.left = `${rect.left + rect.width / 2}px`;
        feedbackEl.style.top = `${rect.top + rect.height / 2}px`;
        
        // CSS візьметься за transform і opacity для анімації!
        // Додаємо клас, який запустить анімацію в CSS
        // Використовуємо setTimeout, щоб браузер встиг "побачити" початкові стилі перед застосуванням класу анімації
        setTimeout(() => {
            feedbackEl.classList.add('active'); // Цей клас запустить CSS-анімацію
        }, 10);

        // Видаляємо елемент після завершення анімації (тривалість має відповідати CSS)
        // Припускаємо, що анімація триватиме 2 секунди
        setTimeout(() => {
            feedbackEl.remove();
        }, 2000); // Час має відповідати тривалості CSS-анімації
    }

    // --- Функція для перевірки завершення рівня ---
    function checkLevelCompletion() {
        if (correctIngredientsAdded.size === levelData.correctIngredients.length) {
            console.log('Рівень завершено! Всі правильні інгредієнти додані.');

            if (incorrectIngredientsDroppedCount === 0) {
                currentScore += 3;
                console.log(`Бонус! +3 бали за проходження без помилок. Поточні бали: ${currentScore}`);
            }

            playStarsAnimation();

            setTimeout(() => {
                showLevelCompleteScreen();
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
        if (ingredientsContainer) ingredientsContainer.style.display = 'none';
        if (dropzoneContainer) dropzoneContainer.style.display = 'none';
        if (toggleTaskPanelButton) toggleTaskPanelButton.style.display = 'none';
        if (taskPanel) taskPanel.classList.remove('active');

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
        levelCompleteScreen.style.display = 'flex';

        levelCompleteScreen.querySelectorAll('.ingredient-display-item').forEach(item => {
            item.addEventListener('click', () => {
                const ingredientId = item.dataset.id;
                const ingredient = levelData.allIngredients.find(i => i.id === ingredientId);
                if (ingredient) {
                    showIngredientModal(ingredient);
                }
            });
        });

        document.getElementById('next-level-button').addEventListener('click', () => {
            alert('Перехід до наступного рівня! (Тут можна додати логіку переходу)');
            location.reload();
        });
    }

    // --- Ініціалізація ---
    kitchenBgImg.addEventListener('load', updateDropzoneContainerPosition);
    window.addEventListener('resize', updateDropzoneContainerPosition);
    updateDropzoneContainerPosition();
});