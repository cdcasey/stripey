const theCanvas = document.getElementById('the-canvas');
context = theCanvas.getContext("2d");

// let clickX = [];
// let clickY = [];
// let clickDrag = [];
let paint = false;
const paintObj = {
    local: {
        clickX: [],
        clickY: [],
        clickDrag: []
    }
};

theCanvas.addEventListener('mousedown', (event) => {
    let mouseX = event.pageX - theCanvas.offsetLeft;
    let mouseY = event.pageY - theCanvas.offsetTop;

    paint = true;
    addClick(event.pageX - theCanvas.offsetLeft, event.pageY - theCanvas.offsetTop, false);
    // redraw('local');
    redraw();
});

theCanvas.addEventListener('mousemove', (event) => {
    if (paint) {
        addClick(event.pageX - theCanvas.offsetLeft, event.pageY - theCanvas.offsetTop, true);
        // redraw('local');
        redraw();
    }
});

theCanvas.addEventListener('mouseup', (event) => {
    paint = false;
});

function addClick(x, y, dragging) {
    paintObj.local.clickX.push(x);
    paintObj.local.clickY.push(y);
    paintObj.local.clickDrag.push(dragging);

    socket.emit('paint', [x, y, dragging])
}

function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (const paintKey in paintObj) {
        if (paintObj.hasOwnProperty(paintKey)) {
            const element = paintObj[paintKey];
            console.log("REDRAW", paintKey, element);

            for (let i = 0; i < element.clickX.length; i++) {
                context.beginPath();
                if (element.clickDrag[i] && i) {
                    context.moveTo(element.clickX[i - 1], element.clickY[i - 1]);
                } else {
                    context.moveTo(element.clickX[i] - 1, element.clickY[i]);
                }
                context.lineTo(element.clickX[i], element.clickY[i]);
                context.closePath();
                context.stroke();
            }

        }
    }
}

let socket = io.connect('http://localhost:8000');
socket.on('paint', (data) => {
    if (paintObj.hasOwnProperty(socket.id)) {
        // console.log("HERE", paintObj[socket.id]);

        paintObj[socket.id].clickX.push(data[0]);
        paintObj[socket.id].clickY.push(data[1]);
        paintObj[socket.id].clickDrag.push(data[2]);
    } else {
        paintObj[socket.id] = {
            clickX: [data[0]],
            clickY: [data[1]],
            clickDrag: [data[2]]
        }
    }
    // redraw(socket.id);
    redraw();
})