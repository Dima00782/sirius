class ClassicRules {
    isAlive(isLiveCell, num_of_live_neighbors) {
        if (isLiveCell) {
            if (num_of_live_neighbors < 2) {
                return false;
            }

            if (num_of_live_neighbors == 2 || num_of_live_neighbors == 3) {
                return true;
            }

            return false;
        } else {
            return num_of_live_neighbors == 3;
        }
    }
}

class GameOfLife {
    constructor(num_of_rows, num_of_columns, rules) {
        this.num_rows = num_of_rows;
        this.num_columns = num_of_columns;
        this.rules = rules;
        this.field = new Array(num_of_rows);
        for (let row_id = 0; row_id < num_of_rows; ++row_id) {
            let row = new Array(num_of_columns);
            row.fill(false);
            this.field[row_id] = row;
        }
    }

    initializeBlinker() {
        this.field[3][4] = true;
        this.field[4][4] = true;
        this.field[5][4] = true;
    }

    initializeGlider() {
        this.field[3][4] = true;
        this.field[4][5] = true;
        this.field[5][3] = true;
        this.field[5][4] = true;
        this.field[5][5] = true;
    }

    doStep() {
        let new_filed = new Array(this.num_rows);
        for (let row_id = 0; row_id < this.num_rows; ++row_id) {
            new_filed[row_id] = new Array(this.num_columns);
            for (let columnd_id = 0; columnd_id < this.num_columns; ++columnd_id) {
                new_filed[row_id][columnd_id] = this.rules.isAlive(
                    this.isAlive(row_id, columnd_id),
                    this.numOfLiveNeighbor(row_id, columnd_id)
                );
            }
        }
        this.field = new_filed;
    }

    isAlive(row_id, column_id) {
        return this.field[row_id][column_id];
    }

    numOfLiveNeighbor(row_id, column_id) {
        let adjust_cells = new Array();
        const offsets = [-1, 0, 1];
        for (let i = 0; i < offsets.length; ++i) {
            for (let j = 0; j < offsets.length; ++j) {
                if (offsets[i] == offsets[j] && offsets[i] == 0) {
                    continue;
                }
                let result_row_id = offsets[i] + row_id;
                let result_columnt_id = offsets[j] + column_id;
                if (result_row_id < 0) {
                    result_row_id += this.num_rows;
                }
                if (result_row_id >= this.num_rows) {
                    result_row_id -= this.num_rows;
                }

                if (result_columnt_id < 0) {
                    result_columnt_id += this.num_columns;
                }
                if (result_columnt_id >= this.num_columns) {
                    result_columnt_id -= this.num_columns;
                }

                adjust_cells.push({row: result_row_id, column : result_columnt_id});
            }
        }

        let num_of_live_neighbor = 0;
        adjust_cells.forEach((cell) => {
            if (this.isAlive(cell.row, cell.column)) {
                ++num_of_live_neighbor;
            }
        });
        return num_of_live_neighbor;
    }
}