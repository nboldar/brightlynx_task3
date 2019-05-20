/**
 * объект секундомера
 */
class Stopwatch {
    /**
     *
     * @param jQueryElement
     */
    constructor(jQueryElement) {
        this.jQueryElement = jQueryElement;//элемент куда отрисовываем секундомер
        this.h = 0;// часы
        this.m = 0;//минуты
        this.s = 0;//секунды
        this.ms = 0;//милисекунды
        this.timeout = null;
    }

    /**
     *метод добавляет ведущий ноль вэлементах времени
     * @param num
     * @returns {string}
     */
    makeTimeFormat(num) {
        return num < 10 ? '0' + num : num.toString();
    }

    /**
     *отрисовка текущего момента времени
     * @returns {string}
     */
    renderTimeView() {
        let h, m, s, ms;
        ms = this.ms < 10 ? '0' + this.ms + '0' : this.ms + '0';
        s = this.makeTimeFormat(this.s);
        m = this.makeTimeFormat(this.m);
        h = this.makeTimeFormat(this.h);
        let text=`${h}` + ':' + `${m}` + ':' + `${s}` + '.' + `${ms}`;
        this.jQueryElement.text(text);
        return text;
    }

    /**
     *метод который реазизовывает поведение времени при увеличении какого -то элемента времени
     */
    updateTime() {
        if (this.ms === 100) {
            this.ms = 0;
            this.s++;
        }
        if (this.s === 60) {
            this.s = 0;
            this.m++;
        }
        if (this.m === 60) {
            this.m = 0;
            this.h++;
        }
        if (this.h === 24) {
            this.setToZero();
        }
    }

    /**
     *запуск интервального изменения текущего времени, интервал выбран оптимальный 10мс
     */
    start() {
        let self = this;
        self.setToZero();
        self.timeout = setInterval(() => {
            self.tick();
        }, 10);
    }

    /**
     *метод единичного  изменения времени
     */
    tick() {
        this.ms++;
        this.updateTime();
        this.renderTimeView();

    }

    /**
     * метод остановки интервального изменения
     */
    stop() {
        let self = this;
        window.clearInterval(self.timeout);
    }

    /**
     * метод который обнуляет значения времени
     */
    setToZero() {
        this.h = this.m = this.s = this.ms = 0;
    }

    /**
     * метод отрисовки начального значения времени
     */
    backToStart() {
        this.setToZero();
        this.renderTimeView();
    }
}