/*Home page JS*/


/*To do list page*/
const openButton = document.getElementById('openTaskForm');
const taskDialog = document.getElementById('taskDialog');
const cancelButton = document.getElementById('cancelTask');

const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');

const taskTitle = document.getElementById('taskTitle');
const taskFolder = document.getElementById('taskFolder');
const taskDate = document.getElementById('taskDate');
const taskPriority = document.getElementById('taskPriority');
const taskTime = document.getElementById('taskTime');
const taskNotes = document.getElementById('taskNotes');


let tasks = JSON.parse(localStorage.getItem('tasks'))  ||  [];
let folders = JSON.parse(localStorage.getItem('folders'))  ||  [];
let editingTaskId = null;

function displayFolders() {
    const folderOptions = document.getElementById('folderOptions');
    folderOptions.innerHTML = '';
    folders.forEach(function(folder) {
        const option = document.createElement('option');
        option.value = folder;

        folderOptions.appendChild(option);
    });
}

openButton.addEventListener('click', function() {
    editingTaskId = null;
    taskForm.reset();
    taskDialog.showModal();
});

cancelButton.addEventListener('click', function() {
    taskDialog.close();
});

taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const task = {
        id: Date.now(),
        title: taskTitle.value.trim(),
        folder: taskFolder.value.trim(),
        dueDate: taskDate.value,
        priority: taskPriority.value,
        time: taskTime.value,
        notes: taskNotes.value.trim(),
        completed: false
    };

    if (!task.title) {
        alert('Please enter a title');
        return;
    }

    if(task.folder && !folders.includes(task.folder)) {
        folders.push(task.folder);

        localStorage.setItem('folders', JSON.stringify(folders));
        displayFolders();
    }

    if(editingTaskId !== null) {
        tasks = tasks.map(function(item) {
            if (item.id === editingTaskId) {
                return { ...task, id: editingTaskId };
            }

            return item;
        });
    }
    else {
        tasks.push(task);
    }

    saveTasks();
    displayTasks();

    editingTaskId = null;
    taskForm.reset();
    taskDialog.close();
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = '';

    tasks.forEach(function(task) {
        const listItem = document.createElement('li');

        const title = document.createElement('h3');
        title.textContent = task.title;
        listItem.appendChild(title);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed || false;
        
        checkbox.addEventListener('change', function() {
            task.completed = checkbox.checked;
            saveTasks;
        });
        listItem.appendChild(checkbox);

        if(task.folder) {
            const folder = document.createElement('p');
            folder.textContent = 'Folder: ' + task.folder;
            listItem.appendChild(folder);
        }

        if(task.dueDate) {
            const date = document.createElement('p');
            date.textContent = 'Due: ' + task.dueDate;
            listItem.appendChild(date);
        }

       const priority = document.createElement('p');
       priority.textContent = 'Priority: ' + task.priority;
       listItem.appendChild(priority);

        if(task.time) {
            const time = document.createElement('p');
            time.textContent = 'When: ' + task.time;
            listItem.appendChild(time);
        }

        if(task.notes) {
            const notes = document.createElement('p');
            notes.textContent = task.notes;
            listItem.appendChild(notes);
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', function(){
            tasks = tasks.filter(function(item){
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';

        editButton.addEventListener('click', function (){
            editingTaskId = task.id;

            taskTitle.value = task.title;
            taskFolder.value = task.folder;
            taskDate.value = task.dueDate;
            taskPriority.value = task.priority;
            taskTime.value = task.time;
            taskNotes.values = task.notes;

            taskDialog.showModal();
            
        })

        listItem.appendChild(editButton);
    });
}

displayTasks();
displayFolders();