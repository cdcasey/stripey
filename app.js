const theCanvas = document.getElementById('the-canvas');
context = theCanvas.getContext("2d");

let clickX = [];
let clickY = [];
let clickDrag = [];
let paint = false;

theCanvas.addEventListener('mousedown', (event) => {
    let mouseX = event.pageX - theCanvas.offsetLeft;
    let mouseY = event.pageY - theCanvas.offsetTop;

    paint = true;
    addClick(event.pageX - theCanvas.offsetLeft, event.pageY - theCanvas.offsetTop, false);
    redraw();
});

theCanvas.addEventListener('mousemove', (event) => {
    if (paint) {
        addClick(event.pageX - theCanvas.offsetLeft, event.pageY - theCanvas.offsetTop, true);
        redraw();
    }
});

theCanvas.addEventListener('mouseup', (event) => {
    paint = false;
});

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (let i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}
