// Warte, bis das DOM vollständig geladen ist, bevor der Code ausgeführt wird
document.addEventListener('DOMContentLoaded', () => {
    //Elemente aus dem DOM abrufen
    const todoForm = document.getElementById('todo-form'); // Das Formular für neue Aufgaben
    const todoInput = document.getElementById('todo-input'); // Eingabefeld für neue Aufgaben
    const todoList = document.getElementById('todo-list'); // Die Liste, in der Aufgaben angezeigt werden
    const searchInput = document.getElementById('search-input'); // Suchfeld
    const clearSearchButton = document.getElementById('clear-search');
    const categorySelect = document.getElementById('category-select');
    const categoryFilter = document.getElementById('category-filter');

    // Ereignis: Suchfled leeren und Liste zurücksetzen
    clearSearchButton.addEventListener('click', () => {
        searchInput.value = ''; // Suchfeld zurücksetzen
        filterTasks(''); // Alle Aufgaben anzeigen
    });

    // Lade gespeicherte Aufgaben aus dem Local Storage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach((task) => addTask(task.text, task.completed));

    // Ereignis: Beim Absenden des Formulars eine neue Aufgabe hinzufügen
    todoForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Verhindert das automatische Neuladen der Seite
        const task = todoInput.value.trim(); // Eingabetext bereinigen
        const category = categorySelect.value;

        if (task) {
            addTask(task, category); // Aufgabe zur Liste hinzufügen
            saveTasks(); // Liste in den Local Storage speichern
            todoInput.value = ''; // Eingabefeld leeren
        }
    });

    // Funktion zum Filtern von Aufgaben
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase(); // Kleinbuchstaben für Vergleich
        filterTasks(searchTerm)
    });

    // Funktion zum Hinzufügen einer neuen Aufgabe
    function addTask(task, category, completed = false) {
        const listItem = document.createElement('li'); // Neues Listenelement erstellen
        listItem.classList.add('todo-item');
        listItem.setAttribute('data-category', category);
        listItem.innerHTML = `
            <span class="${completed ? 'completed' : ''}">${task}</span>
            <em>(${category})</em>
            <button class="delete-button">Löschen</button>
        `;

        // Ereignis: Aufgabe als erledigt/unerledigt markieren
        listItem.querySelector('span').addEventListener('click', () => {
            listItem.querySelector('span').classList.toggle('completed');
            saveTasks(); // Änderungen speichern
        });

        // Ereignis: Aufgabe löschen
        listItem.querySelector('.delete-button').addEventListener('click', () => {
            listItem.remove();
            saveTasks(); // Änderungen speichern
        });

        todoList.appendChild(listItem); // Neues Listenelement zur Liste hinzufügen
    }

    // Funktion zum Speichern der Aufgaben im Local Storage
    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('.todo-item').forEach((item) => {
            tasks.push({
                text: item.querySelector('span').textContent,
                completed: item.querySelector('span').classList.contains('completed'),
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Aufgaben als JSON speichern
    }

    // Filtert die Aufgaben basierend auf einem Suchbegriff und der Kategorie
    function filterTasks() {
        const searchTerm = searchInput.value.toLowerCase(); // Eingabetext aus Suchfeld
        const selectedCategory = categoryFilter.value; // Ausgewählte Kategorie

        const allTasks = todoList.querySelectorAll('.todo-item');
        allTasks.forEach((task) => {
            const taskText = task.querySelector('span').textContent.toLocaleLowerCase();
            const taskCategory = task.getAttribute('data-category');

            // Bedingung: Text-Suche UND Kategorie-Filter
            const matchesSearch = taskText.includes(searchTerm);
            const matchesCategory = selectedCategory === 'Alle' || taskCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                task.style.display = 'flex'; // Aufgaben sichtbar machen
            } else {
                task.style.display = 'none'; // Aufgaben ausblenden
            }
        })
    }

    // Aufgaben nach Kategorie filtern
    categoryFilter.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;

        const tasks = Array.from(todoList.children);
        tasks.forEach((task) => {
            const taskCategory = task.getAttribute('data-category');
            if (selectedCategory === 'Alle' || taskCategory === selectedCategory) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    });
});