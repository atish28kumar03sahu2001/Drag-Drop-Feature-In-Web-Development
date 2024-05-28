const form = document.querySelector('.FRM');
const input = document.querySelector('#todo');
const toDoList = document.querySelectorAll('.ONE')[0];
const notStartedList = document.querySelectorAll('.ONE')[1];
const inProgressList = document.querySelectorAll('.ONE')[2];
const completedList = document.querySelectorAll('.ONE')[3];

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value.trim() === "") {
        alert("Add The Todo Data.");
    } else {
        const p = document.createElement('p');
        p.textContent = input.value;
        p.style.backgroundColor = 'lightblue';
        p.style.margin = '5px';
        p.style.padding = '5px';
        p.style.borderRadius = '20px';
        p.draggable = true;
        p.addEventListener('dragstart', dragStart);
        p.addEventListener('dragend', dragEnd);
        toDoList.appendChild(p);
        input.value = '';
    }
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.outerHTML);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.target.closest('.ONE'), e.clientY);
    const container = e.target.closest('.ONE');
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        container.appendChild(dragging);
    } else {
        container.insertBefore(dragging, afterElement);
    }
}

function dragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('ONE')) {
        e.target.style.border = '2px dashed #ccc';
    }
}

function dragLeave(e) {
    if (e.target.classList.contains('ONE')) {
        e.target.style.border = '2px solid black';
    }
}

function drop(e) {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const dropTarget = e.target.closest('.ONE');
    dropTarget.style.border = '2px solid black';
    dragging.style.display = 'block';
    if (dropTarget === notStartedList) {
        dragging.style.backgroundColor = 'orange';
    } else if (dropTarget === inProgressList) {
        dragging.style.backgroundColor = 'yellow';
    } else if (dropTarget === completedList) {
        dragging.style.backgroundColor = 'lightgreen';
    } else {
        dragging.style.backgroundColor = 'lightblue';
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('p:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

[toDoList, notStartedList, inProgressList, completedList].forEach(list => {
    list.addEventListener('dragover', dragOver);
    list.addEventListener('dragenter', dragEnter);
    list.addEventListener('dragleave', dragLeave);
    list.addEventListener('drop', drop);
});