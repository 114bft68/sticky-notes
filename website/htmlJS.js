let x = y = 0;
let notes = Array.from(document.querySelectorAll('.note'));
let del = Array.from(document.querySelectorAll('.delete'));
let currentElement = undefined;

function addListeners(parameter0, parameter1) {
    notes[parameter0].addEventListener('mousedown', (e) => {
        x = e.clientX;
        y = e.clientY;
        e.target.dataset.moveable = true;
        currentElement = e.target;
    });

    del[parameter1].addEventListener('click', (e) => {
        e.target.parentElement.parentElement.remove();
        del.splice(del.indexOf(e.target), 1);
    });
}

document.getElementById('add').addEventListener('click', () => {
    let c = document.createElement('div');
    document.body.insertBefore(c, document.getElementById('ok'));
    c.outerHTML = `
        <div class="note" data-moveable="false">
            <div class="text" name="textarea" contenteditable="true" spellcheck="false"></div>
            <p style="margin-left: 10px; margin-top: 5px; pointer-events: none;">created on: ${new Date().toISOString().split('T')[0]}</p><br>
            <button class="delete"><img src="delete.svg"></button>
        </div> 
    `;
    notes = Array.from(document.querySelectorAll('.note'));
    del = Array.from(document.querySelectorAll('.delete'));

    addListeners(notes.length - 1, del.length - 1);
});

for (let i = 0; i < notes.length; i++) {
    addListeners(i, i);
}

document.addEventListener('mouseup', () => {
    if (currentElement) {
        currentElement.dataset.moveable = false;
        currentElement = undefined;
    }
});

document.addEventListener('mousemove', (e) => {
    if (currentElement !== undefined) {
        let deltaX = e.clientX - x;
        let deltaY = e.clientY - y;

        let left = Math.min(Math.max(currentElement.offsetLeft + deltaX, 0), window.innerWidth - 350);
        let top = Math.min(Math.max(currentElement.offsetTop + deltaY, 0), window.innerHeight - 350);
        currentElement.style.left = `${left}px`;
        currentElement.style.top = `${top}px`;
        x = e.clientX;
        y = e.clientY;
    }
});

document.getElementById('ok').addEventListener('click', () => {
    fetch('http://localhost:1234/data', {
        headers: {
            'Content-Type': 'text/html'
        },
        method: 'post',
        body: document.documentElement.outerHTML
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data.message);
            document.getElementById('ok').style.background = (data.success ? '#66ff66' : '#ff5050'); // green : red
            setTimeout(() => {
                document.getElementById('ok').style.background = '#f0f0f0';
            }, 500);
        })
        .catch((error) => {
            console.log(error);
        });
});