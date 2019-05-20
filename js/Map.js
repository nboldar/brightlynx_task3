
class Map {
    /**
     * принимает параметр размера игрового поля, кол-во ячеек ширина=высота
     * @param size {Number}
     */
    constructor(size) {
        this.size = size;
    }

    /**
     *
     * @param jQueryElement куда отрисовываем карту игрового поля
     */
    renderMap(jQueryElement) {
        let size = this.size;
        let table = $('<table />', {
            class: 'table',
        });
        let tbody = $('<tbody />', {
            id: 'game',
        });
        jQueryElement.append(table);
        table.append(tbody);
        let rowIterator = 1;
        while (rowIterator <= size) {
            let colIterator = 1;
            let row = $("<tr />", {
                class: "tab-row",
                'data-id': rowIterator,
            });
            $(tbody).append(row);
            while (colIterator <= size) {
                let col = $("<td />", {
                    class: "column",
                    'data-id': colIterator,
                });
                row.append(col);
                colIterator++;
            }
            rowIterator++;
        }
    }
}