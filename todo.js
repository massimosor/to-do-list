 // Aktiviere Dark Mode
 function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    // Speichere Präferenz in localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
}

// Gespeicherte Präferenz anwenden
window.addEventListener('DOMContentLoaded', () => {
    const darkModePreference = localStorage.getItem('dark-mode');
    if (darkModePreference === 'enabled'){
        document.body.classList.add('dark-mode');
    };
})

// Warte, bis das DOM vollständig geladen ist, bevor der Code ausgeführt wird
document.addEventListener('DOMContentLoaded', () => {
    //Elemente aus dem DOM abrufen
    const todoForm = document.getElementById('todo-form'); // Das Formular für neue Aufgaben
    const todoInput = document.getElementById('todo-input'); // Eingabefeld für neue 
    const deadlineInput = document.getElementById('deadline-input') // Eingabefeld für Deadline
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
    savedTasks.forEach((task) => addTask(task.text, task.category, task.deadline, task.completed));

    // Ereignis: Beim Absenden des Formulars eine neue Aufgabe hinzufügen
    todoForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Verhindert das automatische Neuladen der Seite

        const task = todoInput.value.trim(); // Eingabetext bereinigen
        const deadline = deadlineInput.value; // Deadline auslesen
        const category = categorySelect.value; // Kategorie auslesen

        // Überprüfen, ob die Aufgabe nicht leer ist
        if (task) {
            // Aufgabe zur Liste hinzufügen
            addTask(task, category, deadline);
            saveTasks(); // Liste in den Local Storage speichern
            todoInput.value = ''; // Eingabefeld leeren
            deadlineInput.value = ''; // Deadline leeren
            categorySelect.value = 'Keine Kategorie'; // Kategorie-Dropdown zurücksetzen, falls gewünscht
        }
    });

    // Funktion zum Hinzufügen einer neuen Aufgabe
    function addTask(task, category, deadline, completed = false) {
        const listItem = document.createElement('li'); // Neues Listenelement erstellen
        listItem.classList.add('todo-item');
        listItem.setAttribute('data-category', category);

        // Überprüfen, ob ein Datum vorhanden ist und ob es gültig ist
        const now = new Date();
        const deadlineDate = deadline ? new Date(deadline) : null;
        const isOverdue = deadlineDate && !isNaN(deadlineDate) && deadlineDate < now;

        // Erstellen der inneren HTML-Struktur
        listItem.innerHTML = `
            <span class="${completed ? 'completed' : ''}">${task}</span>
            <div class="task-details">
                <div class="category-details">
                    ${category || 'Keine Kategorie'}
                </div>    
                <div class="deadline-details">
                    ${deadlineDate && !isNaN(deadlineDate) ? `<time class="${isOverdue ? 'overdue' : 'time'}" data-deadline="${deadlineDate.toISOString()}">Fällig: ${deadlineDate.toLocaleDateString()}</time>` : 'Fällig: Kein Datum'}
                </div>
            </div>
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
                category: item.getAttribute('data-category') || 'Keine Kategorie', // Kategorie wird hier gespeichert
                deadline: item.querySelector('time')?.dataset.deadline || null, 
                completed: item.querySelector('span').classList.contains('completed') 
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Aufgaben als JSON speichern
    }

    // Filtert die Aufgaben basierend auf einem Suchbegriff und der Kategorie
    function filterTasks() {
        const searchTerm = searchInput.value.toLowerCase(); // Eingabetext aus Suchfeld
        const selectedCategory = categoryFilter.value; // Ausgewählte Kategorie

        // Alle Aufgaben abrufen
        const allTasks = todoList.querySelectorAll('.todo-item');
        allTasks.forEach((task) => {
            const taskText = task.querySelector('span').textContent.toLocaleLowerCase(); // Aufgaben Text
            const taskCategory = task.getAttribute('data-category'); // Kategorie auslesen

            // Bedingung: Text-Suche oder Kategorie-Filter, je nach Input
            const matchesSearch = !searchTerm || taskText.includes(searchTerm); // Keine Suche = passt
            const matchesCategory = selectedCategory === 'Alle' || taskCategory === selectedCategory; // "Alle" = passt

            // Anzeigen steuern basierend auf Bedingungen
            if (matchesSearch && matchesCategory) {
                task.style.display = 'flex'; // Aufgaben sichtbar machen
            } else {
                task.style.display = 'none'; // Aufgaben ausblenden
            }
        });
    }

    searchInput.addEventListener('input', filterTasks); // Filter bei Texteingabe
    categoryFilter.addEventListener('change', filterTasks); // Filter bei Kategorieänderung
    
});