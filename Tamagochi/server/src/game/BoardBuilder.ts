import { Board } from "./entities/Board";

export class BoardBuilder {
    private board: Board;

    constructor() {
        this.board = {
            size: 10,
            elements: []
        }
        const map: Array<number[]> = [];

        // Contamos cuántos arbustos hay en el tablero
        let bushCount = 0;
        map.forEach(row => bushCount += row.filter(cell => cell === 5).length);
        console.log("bush: " + bushCount);


        this.board.elements = this.generateElements();

    }

    generateElements() {
        var elm = [];
        var size = this.board.size;
        const bushProbability = 0.2;
        // Almaceamos las posiciones únicas de los arbustos
        const positions = new Set<string>();

        // Quiero que el jugador aparezca en la esquina del tablero para ello
        // con esta funcion verificamos las  posiciones
        const Posicion = (x: number, y: number): boolean =>
            (x === 0 && y === 0) ||
            (x === 0 && y === this.board.size - 1) ||
            (x === this.board.size - 1 && y === 0) ||
            (x === this.board.size - 1 && y === this.board.size - 1);


        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                 // Excluir las esquinas del tablero
                 if (Posicion(i, j)) continue;              
                

                // Verificar que no exista ya un arbusto en las celdas adyacentes (incluyendo la actual)
                let canPlace = true;
                for (const bush of elm) {
                    if (Math.abs(bush.x - i) <= 1 && Math.abs(bush.y - j) <= 1) {
                        canPlace = false;
                        break;
                    }
                }

                // Si se puede colocar y se supera la probabilidad, agregar el arbusto
                if (canPlace && Math.random() < bushProbability) {
                    elm.push({ x: i, y: j });
                }
            }
        }
        return elm;

    }

    public getBoard(): Board {
        return this.board;
    }
}