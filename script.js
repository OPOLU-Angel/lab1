const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const centerX = 200;
const centerY = 144;
const scale = 40;
const form = document.getElementById("point-form");
const allowedX = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const allowedR = [1, 1.5, 2, 2.5, 3];

//Выбранный R
const initialRInput = document.querySelector('input[name="r"]:checked');
let currentR = initialRInput ? Number(initialRInput.value) : 1;

//Рисовалка осей
function drawGraph(r) {
    //Размер области в зависимости от R
    const rPixels = r * scale;
    const halfRPixels = rPixels / 2;

    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    //Рисовалка стрелочек на концах осей
    ctx.beginPath();
    ctx.moveTo(canvas.width, centerY);
    ctx.lineTo(canvas.width - 10, centerY - 5);
    ctx.moveTo(canvas.width, centerY);
    ctx.lineTo(canvas.width - 10, centerY + 5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX - 5, 10);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.stroke();

    //Вставка x и y
    ctx.font = "16px sans-serif";
    ctx.fillText("x", canvas.width - 10, centerY - 10);
    ctx.fillText("y", centerX + 10, 15);

    //Вставка значений на осях
    ctx.beginPath();
    ctx.moveTo(centerX + halfRPixels, centerY - 5);
    ctx.lineTo(centerX + halfRPixels, centerY + 5);
    ctx.stroke();
    ctx.fillText("R/2", centerX + halfRPixels - 12, centerY - 10);

    ctx.beginPath();
    ctx.moveTo(centerX + rPixels, centerY - 5);
    ctx.lineTo(centerX + rPixels, centerY + 5);
    ctx.stroke();
    ctx.fillText("R", centerX + rPixels - 4, centerY - 10);

    ctx.beginPath();
    ctx.moveTo(centerX - halfRPixels, centerY + 5);
    ctx.lineTo(centerX - halfRPixels, centerY - 5);
    ctx.stroke();
    ctx.fillText("-R/2", centerX - halfRPixels - 16, centerY - 10);

    ctx.beginPath();
    ctx.moveTo(centerX - rPixels, centerY - 5);
    ctx.lineTo(centerX - rPixels, centerY + 5);
    ctx.stroke();
    ctx.fillText("-R", centerX - rPixels - 8, centerY - 10);

    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY - halfRPixels);
    ctx.lineTo(centerX + 5, centerY - halfRPixels);
    ctx.stroke();
    ctx.fillText("R/2", centerX + 10, centerY - halfRPixels + 5);

    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY - rPixels);
    ctx.lineTo(centerX + 5, centerY - rPixels);
    ctx.stroke();
    ctx.fillText("R", centerX + 10, centerY - rPixels + 5);

    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY + halfRPixels);
    ctx.lineTo(centerX + 5, centerY + halfRPixels);
    ctx.stroke();
    ctx.fillText("-R/2", centerX + 12, centerY + halfRPixels + 5);

    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY + rPixels);
    ctx.lineTo(centerX + 5, centerY + rPixels);
    ctx.stroke();
    ctx.fillText("-R", centerX + 12, centerY + rPixels + 5);

    //Цвет
    ctx.fillStyle = "rgba(0,0,255,0.5)";

    //Прямоугольник
    ctx.fillRect(centerX, centerY - rPixels, halfRPixels, rPixels);

    //Треугольник
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - halfRPixels, centerY);
    ctx.lineTo(centerX, centerY - rPixels);
    ctx.closePath();
    ctx.fill();

    //Круг
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - halfRPixels, centerY);
    ctx.arc(centerX, centerY, halfRPixels, Math.PI, Math.PI / 2, true);
    ctx.closePath();
    ctx.fill();
}

//Загрузка истории из LocalStorage
const saveResults = localStorage.getItem("results");
let results = saveResults ? JSON.parse(saveResults) : [];
results = results.slice(-10);
localStorage.setItem("results", JSON.stringify(results));

//Создание строки таблицы
function addResultToTable(result) {
    const resultsBody = document.getElementById("results-body");
    const row = document.createElement("tr");
    const xCell = document.createElement("td");
    const yCell = document.createElement("td");
    const rCell = document.createElement("td");
    const resultCell = document.createElement("td");
    const dateCell = document.createElement("td");

    xCell.textContent = result.x;
    yCell.textContent = result.y;
    rCell.textContent = result.r;
    resultCell.textContent = result.hit ? "Попал" : "Не попал";
    dateCell.textContent = new Date(result.timestamp).toLocaleString("ru-RU");

    row.appendChild(xCell);
    row.appendChild(yCell);
    row.appendChild(rCell);
    row.appendChild(resultCell);
    row.appendChild(dateCell);

    resultsBody.appendChild(row);
}

//Рисовалка точки
function drawPoint(result) {
    const pointX = centerX + Number(result.x) * scale;
    const pointY = centerY - Number(result.y) * scale;

    ctx.beginPath();
    ctx.arc(pointX, pointY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = result.hit ? "green" : "red";
    ctx.fill();
}

//Перерисовка графика и точек
function redrawCanvas(r) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGraph(r);

    results.forEach(function(result) {
        drawPoint(result);
    });
}

//Проверка Y на число
function isNumericText(value) {
    return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value);
}

//Проверка диапазона Y без округления
function isYInRange(value) {
    let text = value;
    let negative = false;

    if (text[0] === "+" || text[0] === "-") {
        negative = text[0] === "-";
        text = text.slice(1);
    }

    let integerPart = text.split(".")[0];

    if (integerPart === "") {
        integerPart = "0";
    }

    integerPart = integerPart.replace(/^0+/, "") || "0";

    if (integerPart.length > 1) {
        return false;
    }

    const integerValue = Number(integerPart);

    if (negative) {
        return integerValue < 5;
    }

    return integerValue < 3;
}

//Восстановление истории в таблице
results.forEach(function(result) {
    addResultToTable(result);
});

//Изменение графика при выборе R
document.querySelectorAll('input[name="r"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
        const newR = Number(radio.value);

        if (allowedR.includes(newR)) {
            currentR = newR;
            redrawCanvas(currentR);
        }
    });
});

redrawCanvas(currentR);

//Проверка
form.addEventListener("submit", function(event) {
    //Отменить стандартное поведение формы
    event.preventDefault();

    const x = Number(document.getElementById("x").value);
    const yText = document.getElementById("y").value.trim();
    const rInput = document.querySelector('input[name="r"]:checked');
    const timestamp = Date.now();

    //Проверка X
    if (!allowedX.includes(x)) {
        alert("Недопустимое значение X");
        return;
    }

    if (rInput === null) {
        alert("R не выбран");
        return;
    }

    const r = Number(rInput.value);

    //Проверка R
    if (!allowedR.includes(r)) {
        alert("Недопустимое значение R");
        return;
    }

    //пустое поле
    if (yText === "") {
        alert("Введите Y");
        return;
    }

    //Введены нечисловые данные
    if (!isNumericText(yText)) {
        alert("Y должен быть числом");
        return;
    }

    //Y вне деапазона
    if (!isYInRange(yText)) {
        alert("Y должен быть -5<Y<3");
        return;
    }

    const y = Number(yText);

    //Попадание в прямоугольник
    const inRectangle = x >= 0 && x <= r / 2 && y >= 0 && y <= r;
    //Попадание в треугольник
    const inTriangle = x <= 0 && x >= -r / 2 && y >= 0 && y <= 2 * x + r;
    //Попадание в круг
    const inCircle = x <= 0 && y <= 0 && x * x + y * y <= (r / 2) * (r / 2);
    //Попадение!!!
    const hit = inRectangle || inTriangle || inCircle;

    //Результат проверки
    const result = {
        x: x,
        y: yText,
        r: r,
        hit: hit,
        timestamp: timestamp
    };

    //LocalStorage
    results.push(result);

    //Только последние 10 результатов
    if (results.length > 10) {
        results.shift();
        const resultsBody = document.getElementById("results-body");

        if (resultsBody.firstElementChild) {
            resultsBody.firstElementChild.remove();
        }
    }

    localStorage.setItem("results", JSON.stringify(results));
    addResultToTable(result);

    //Перерисовка области после проверки
    currentR = r;
    redrawCanvas(currentR);

    console.log(x, y, r);
    console.log("Попадение:", hit);
});
