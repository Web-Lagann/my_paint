let canvas = $('#canvas');
let tool;
let color = '#000000';
let isFirstClick = true;
let firstPos;
let stroke = [];
let startdraw = false;
let width_brush = $('#brush_size').val();

$(document).ready(function () {
    $("canvas").attr({"width":"850","height":"400"});

    $('#canvas').on('click', function (e) {
        let canvas = document.getElementById('canvas');
        let pos = getMousePos(canvas, e);
        if (tool === 'draw')
            draw(pos, e, canvas);
        else if (tool === 'line' )
            drawLine(pos, e, canvas);
        else if (tool === 'rect')
            drawRect(pos, e, canvas);
        else if (tool === 'circle')
            drawCircle(pos, e, canvas);
    });

    $('.tool-btn').click(function (e) {
        tool = e.target.value;
    });

    $(this).mouseup(function () {
        startdraw = false;    
    });

    $('#canvas').mousemove(function (event) {
        let posX = event.pageX - this.offsetLeft;
        let posY = event.pageY - this.offsetTop;
        let width_brush = $('#brush_size').val();
        let ctx = this.getContext("2d");
        $('#x').text('x : ' + posX);
        $('#y').text('y : ' + posY);
    });

    $(this).mousedown(function (event) {

    });


    $('#fill').change(function () {
        if ($(this).is(':checked')) {
            fill = true;
        } else {
            fill = false;
        }
    });

    $('#brush_size').on('input', function () {
        $('#brush_info').val(this.value + 'pixels');
    });


    $('#color_picker').on('input', function () {
        color = this.value;
    });

    $('#undo-btn').click(function () {
        stroke.pop();
        redraw();
    });

    $('#clean-btn').click(function () {
        stroke.pop();
        redraw();
    });

    $('#save-btn').click(function () {
        window.open($('#canvas')[0].toDataURL('image/png'));
    });
});

function draw(pos, e, canvas) {
    let posX = e.pageX - this.offsetLeft;
    let posY = e.pageY - this.offsetTop;
    let ctx = canvas.getContext("2d");
    if (!startdraw) {
        firstPos = pos;
        ctx.beginPath();
        ctx.moveTo(firstPos.x,firstPos.y);
        startdraw = true;
    } 
    else {
        ctx.lineTo(firstPos.x,firstPos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width_brush;
        ctx.stroke();
    }
}

function drawLine(pos, e, canvas) {
    if (isFirstClick === true) {
        firstPos = pos;
        isFirstClick = false;
    }
    else {
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(firstPos.x,firstPos.y);
        ctx.lineTo(pos.x,pos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width_brush;
        ctx.stroke();
        isFirstClick = true;
    }
}

function drawRect(pos, e, canvas) {
    if (isFirstClick === true) {
        firstPos = pos;
        isFirstClick = false;
    }
    else {
        let ctx = canvas.getContext("2d");
        if (fill) {
            ctx.fillStyle = color;
            ctx.fillRect(firstPos.x, firstPos.y, pos.x - firstPos.x, pos.y - firstPos.y);
        } 
        else {
        ctx.beginPath();
        ctx.rect(firstPos.x, firstPos.y, pos.x - firstPos.x, pos.y - firstPos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width_brush;
        }
        ctx.stroke();
        isFirstClick = true;
    }
}

function drawCircle(pos, e, canvas) {
    if (isFirstClick === true) {
        firstPos = pos;
        isFirstClick = false;
    }
    else  {
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width_brush;
        ctx.arc(firstPos.x, firstPos.y, Math.sqrt(Math.pow(firstPos.x - pos.x, 2) + Math.pow(firstPos.y - pos.y, 2)), 0, 2 * Math.PI);
        if (fill) {
            ctx.fill();
        }
        ctx.stroke();
        isFirstClick = true;
    } 
}

function redraw () {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0,0,canvas.width(), canvas.height());
    ctx.lineCap = 'round';
    for(var i=0; i < strokes.length; i++)
    {
        var s = strokes[i];
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for(var j=0; j < s.points.length; j++)
        {
            var p = s.points[j];
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}