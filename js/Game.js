/**
 * Объект с дефолтными настройками игры
 * @type {{difficulty: number, size: number, colors: string[]}}
 */

let defaultSettings = {
    /**
     * цветовая палитра
     */
    "colors": [
        "black", "gray", "silver", "fuchsia",
        "purple", "red", "maroon", "yellow",
        "olive", "lime", "green", "aqua",
        "teal", "blue", "navy", "RosyBrown",
        "SandyBrown", "Goldenrod", "DarkGoldenRod", "Peru",
        "Chocolate", "SaddleBrown", "Sienna", "Brown",
        "MediumOrchid", "MediumPurple", "BlueViolet", "DarkViolet",
        "DarkOrchid", "DarkMagenta", "Purple", "Indigo",
        "SlateBlue", "DarkSlateBlue",

    ],
    /**
     * ширина/высота игрового поля
     */
    size: 4,
    /**
     * сложность игры, чем меньше, тем сложнее - быстрее будут пропадать цвета после неправильного выбора
     */
    difficulty: 4,
};

class Game {
    /**
     *функция конструктор, параметры - три объекта, настройки, объект- который рисует поле игры, и объект секундомер,
     *
     * @param settings {Object}
     * @param mapMaker {Map}
     * @param stopwatch {Stopwatch}
     */
    constructor(settings = defaultSettings,
                mapMaker = new Map(settings.size),
                stopwatch = new Stopwatch($("#stopwatch"))) {
        this.rootElement = $("#root");
        this.stopwatch = stopwatch;
        this.settings = settings;
        this.mapMaker = mapMaker;
        this.modalElement = $(".modal");
        this.resultElement = $("#result");
        this.cellsClassName = 'column';
        this.positions = null;
        this.coloredFields = null;
        this.firstPickedElement = null;
        this.secondPickedElement = null;
        this.movesCount = null;
        this.timeoutId = null;
    }

    /**
     * валидация настроек игры
     * @returns {boolean}
     */
    validateSettings() {
        let size = this.settings.size;
        let difficulty = this.settings.difficulty;
        let colors = this.settings.colors;
        if (size % 2 !== 0) {
            alert('Размер карты, а соответственно и кол-во ячеек, должно быть четным!');
            return false;
        }
        if (!difficulty.isNumber && difficulty <= 0) {
            alert('Установите сложность игры!');
            return false;
        }
        if (colors.length < (Math.pow(size, 2) / 2)) {
            alert('Для начала игры не хватает цветов!');
            return false;
        }
        return true;
    }

    /**
     * метод старта игры
     */
    init() {
        if (this.validateSettings()) {
            this.positions = this.getAllPositions();
            this.movesCount = this.positions.length / 2;
            this.coloredFields = this.randomColoring();
            this.mapMaker.renderMap(this.rootElement);
            this.stopwatch.start();
            this.setEventsOnGameField();
        }
    }

    /**
     * метод, задача которого навесить клик-события на игровое поле и сама логика игры
     */
    setEventsOnGameField() {
        $(`.${this.cellsClassName}`).on("click", event => {
            event.preventDefault();
            event.stopPropagation();
            let element = $(event.target);
            let position = this.getPosition(element);
            let color = this.findCellColor(position);
            element.css("background-color", color);
            if (this.firstPickedElement === null || this.firstPickedElement.get(0) === $(event.target).get(0)) {
                this.firstPickedElement = $(event.target);
            } else {
                this.secondPickedElement = $(event.target);
                if (this.isGuessed() === false) {
                    this.setWhiteColor();
                    this.firstPickedElement = null;
                    this.secondPickedElement = null;
                } else {
                    this.firstPickedElement.off('click');
                    this.firstPickedElement = null;
                    this.secondPickedElement.off('click');
                    this.secondPickedElement = null;
                    this.movesCount--;
                }
            }
            if (this.movesCount === 0) {
                this.showResult();
                this.stop();
            }

        });
    }

    /**
     * метод, задача которго вернуть ячейкам белый цвет при неправильном выборе второй ячейки
     * скорость смены цвета на белый отпределяется заданной в настройках сложностью
     */
    setWhiteColor() {
        let difficulty = this.settings.difficulty * 100;
        let firstElement = this.firstPickedElement;
        let secondElement = this.secondPickedElement;
        this.timeoutId = setTimeout(function () {
            firstElement.css('background-color', 'white');
            secondElement.css('background-color', 'white');
        }, difficulty);
    }

    /**
     * проверяем одинакового ли цвета открытые ячейки
     * @returns {boolean}
     */
    isGuessed() {
        console.log(this.firstPickedElement);
        console.log(this.secondPickedElement);
        if (this.firstPickedElement === this.secondPickedElement) {
            return false;
        }

        return this.firstPickedElement.css('background-color') === this.secondPickedElement.css('background-color');
    }

    /**
     * метод для возврата наименования цвета для ячейки с указанной позицией
     * @param position
     * @returns {string}
     */
    findCellColor(position) {
        let color = null;
        this.coloredFields.forEach((elem) => {
            if (elem.element == position.toString()) {
                color = elem.color;
            }
        });
        return color;
    }

    /**
     * Метод возвращает массив с позициями всех ячеек на поле, позиции определяются data-id строк и стлолбцов
     * @returns {Array}
     */
    getAllPositions() {
        let size = this.settings.size;
        let rowIterator = 1;
        let positions = [];
        while (rowIterator <= size) {
            let colIterator = 1;
            while (colIterator <= size) {
                positions.push(rowIterator.toString() + colIterator.toString());
                colIterator++;
            }
            rowIterator++;
        }
        return positions;
    }

    /**
     * метод случайно выбирает индекс массива
     * @param array
     * @returns {number}
     */
    getIdxRandomly(array) {
        let length = array.length;
        if (length > 0) {
            return Math.floor(Math.random() * length);
        }
    }

    /**
     * возвращает массив оббъектов с указание позиции ячейки и определенного для нее цвета,
     * цвет для ячейки определяется случайным порядком
     * @returns {Array}
     */
    randomColoring() {
        let positions = Object.assign([], this.positions);
        let colors = Object.assign([], this.settings.colors);
        let coloredField = [];
        while (positions.length > 0) {
            let colorIdx = this.getIdxRandomly(colors);
            let color = colors[colorIdx];
            let positionIdx = this.getIdxRandomly(positions);
            coloredField.push({element: positions[positionIdx], color: color});
            positions.splice(positionIdx, 1);
            positionIdx = this.getIdxRandomly(positions);
            coloredField.push({element: positions[positionIdx], color: color});
            positions.splice(positionIdx, 1);
            colors.splice(colorIdx, 1);
        }
        return coloredField;
    }

    /**
     *для ячейки игрового поля ( jQuery ) определяем еге позицию на поле
     * @param jqueryElement
     * @returns {string}
     */
    getPosition(jqueryElement) {
        let row = jqueryElement.parent().data("id");
        let col = jqueryElement.data("id");
        return row.toString() + col.toString();
    }

    /**
     * метод показывает результат игры,время за которое игра пройдена
     */
    showResult() {
        let time = this.stopwatch.renderTimeView();
        let message = 'Вы окончили игру с результатом: ' + time;
        this.resultElement.text(message);
        this.modalElement.modal();
    }

    /**
     * останавливаем игру, возвращаем в первоначальный вид
     */
    stop() {
        this.stopwatch.stop();
        this.stopwatch.backToStart();
        this.rootElement.children().first().remove();

    }
}