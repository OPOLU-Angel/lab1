	const canvas = document.getElementById("graph");
	const ctx = canvas.getContext("2d");
	const centerX = 200;
	const centerY = 200;
	const scale = 120;
	const form = document.getElementById("point-form")

	//Рисовалка осей
	function drawGraph(){
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black"
	ctx.beginPath();
	ctx.moveTo(0,centerY);
	ctx.lineTo(400,centerY);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(centerX,0);
	ctx.lineTo(centerX,400);
	ctx.stroke();

	//Рисовалка стрелочек на концах осей
	ctx.beginPath();
	ctx.moveTo(400,centerY);
	ctx.lineTo(390, centerY - 5);
	ctx.moveTo(400,centerY);
	ctx.lineTo(390,centerY + 5);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(centerX,0);
	ctx.lineTo(centerX - 5, 10);
	ctx.moveTo(centerX,0);
	ctx.lineTo(centerX + 5,10);
	ctx.stroke();

	//Вставка x и y
	ctx.font = "16px sans";
	ctx.fillText("x",390,centerY - 10);
	ctx.fillText("y",centerX + 10, 10);

	//Вставка значений на осях
	ctx.beginPath()
	ctx.moveTo(centerX + scale / 2, centerY -5);
	ctx.lineTo(centerX + scale / 2, centerY + 5);
	ctx.stroke();
	ctx.fillText("R/2",centerX + scale / 2 - 12,centerY - 10);

	ctx.beginPath();
	ctx.moveTo(centerX + scale, centerY - 5);
	ctx.lineTo(centerX + scale, centerY + 5);
	ctx.stroke();
	ctx.fillText("R",centerX + scale - 4, centerY - 10);

	ctx.beginPath();
	ctx.moveTo(centerX - scale/2, centerY + 5);
	ctx.lineTo(centerX - scale/2, centerY - 5);
	ctx.stroke();
	ctx.fillText("-R/2",centerX - scale/2 - 16, centerY - 10);

	ctx.beginPath();
	ctx.moveTo(centerX - scale, centerY - 5);
	ctx.lineTo(centerX - scale, centerY + 5);
	ctx.stroke();
	ctx.fillText("-R", centerX - scale - 8, centerY - 10);

	ctx.beginPath();
	ctx.moveTo(centerX - 5, centerY - scale/2);
	ctx.lineTo(centerX + 5, centerY - scale/2);
	ctx.stroke();
	ctx.fillText("R/2",centerX + 10, centerY - scale/2 + 5);

	ctx.beginPath();
	ctx.moveTo(centerX - 5, centerY - scale);
	ctx.lineTo(centerX + 5, centerY - scale);
	ctx.stroke();
	ctx.fillText("R",centerX + 10, centerY - scale + 5);

	ctx.beginPath();
	ctx.moveTo(centerX - 5, centerY + scale/2);
	ctx.lineTo(centerX + 5, centerY + scale/2);
	ctx.stroke();
	ctx.fillText("-R/2",centerX + 12, centerY + scale/2 + 5);

	ctx.beginPath();
	ctx.moveTo(centerX - 5, centerY + scale);
	ctx.lineTo(centerX + 5, centerY + scale);
	ctx.stroke();
	ctx.fillText("-R",centerX + 12, centerY + scale + 5);

	//Цвет
	ctx.fillStyle = "rgba(0,0,255,0.5)";
	//Прямоугольник
	ctx.fillRect(centerX, centerY - scale, scale/2, scale);

	//Треугольник
	ctx.beginPath();
	ctx.moveTo(centerX, centerY);
	ctx.lineTo(centerX - scale/2, centerY);
	ctx.lineTo(centerX, centerY - scale);
	ctx.closePath();
	ctx.fill();

	//Круг
	ctx.beginPath();
	ctx.moveTo(centerX,centerY);
	ctx.lineTo(centerX - scale/2, centerY);
	ctx.arc(centerX, centerY, scale/2, Math.PI, Math.PI/2, true);
	ctx.closePath();
	ctx.fill();
	}

	const saveResults = localStorage.getItem("results")
	let results = saveResults ? JSON.parse(saveResults) : [];
	results = results.slice(-10);
	localStorage.setItem("results",JSON.stringify(results));

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

function drawPoint(result){
	let pointX = centerX + result.x * scale/result.r;
	let pointY = centerY - result.y * scale/result.r;
	pointX = Math.max(5, Math.min(canvas.width - 5, pointX));
	pointY = Math.max(5, Math.min(canvas.height - 5, pointY));
	ctx.beginPath();
	ctx.arc(pointX, pointY, 5, 0, 2 * Math.PI);
	ctx.fillStyle = result.hit ? "green" : "red";
	ctx.fill();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGraph();

    results.forEach(function(result) {
    	drawPoint(result);
    });
}

localStorage.setItem("results",JSON.stringify(results));
results.forEach(function(result){
	addResultToTable(result);	
	})

	redrawCanvas();

	//Проверка
	form.addEventListener("submit", function(event){
		//Отменить стандартное поведение формы
		event.preventDefault();

		const x = Number(document.getElementById("x").value);
	    const yText = document.getElementById("y").value.trim();
		const rInput = document.querySelector('input[name="r"]:checked'); //?
		const timestamp = Date.now();

		if (rInput === null){
			alert("R не выбран");
			return;
		}
		const r= Number(rInput.value);

		if (yText === ""){
			//пустое поле
			alert("Введите Y");
			return;
		}
		
		const y = Number(yText);
		if (!Number.isFinite(y)){
			//Введены нечисловые данные
			alert("Y должен быть числом");
			return;
		}
		if (y <=-5 || y >=3){
			//Y вне деапазона
			alert("Y должен быть -5<Y<3");
			return;
		}
		//Попадание в прямоугольник
		const inRectangle = x >= 0 && x <= r/2 && y >= 0 && y <= r;

		//Попадание в треугольник
		const inTriangle = x <= 0 && x >= -r / 2 && y >= 0 && y <= 2*x + r;

		//Попадание в круг
		const inCircle = x <= 0 && y <= 0 && x * x + y * y <= (r / 2) * (r / 2);

		//Попадение!!!
		const hit = inRectangle || inTriangle || inCircle;


		const result = {
			x: x,
			y: y,
			r: r,
			hit: hit,
			timestamp: timestamp

		};
		//LocalStorage
		results.push(result);

		if (results.length > 10) {
    		results.shift();

    		const resultsBody = document.getElementById("results-body");
    		resultsBody.firstElementChild.remove();
		}

		localStorage.setItem("results", JSON.stringify(results));
		addResultToTable(result);
		redrawCanvas();


		console.log(x,y,r);
		console.log("Попадение:", hit);
	})

	
