// Definir los elementos del tablero
export const ELEMENTS = {
    bush: 5,  // Definir el arbusto
};

export class Board {
    #map = null;
    #states = {
        NO_BUILD: 0,
        BUILD: 1
    };
    #state = null;

    constructor() {
        this.#state = this.#states.NO_BUILD;
    }
   

    // Construir el tablero con las posiciones de los arbustos
    build(payload) {
        console.log("build");
        console.log(payload);
        const { size, elements } = payload;
        this.#map = new Array(size).fill().map(() => new Array(size).fill(0));

        elements.forEach(element => {
            this.#map[element.x][element.y] = ELEMENTS.bush;
        });

        this.#state = this.#states.BUILD;
    }
/**
 * Obtener las posiciones de los arbustos
 * @returns array
//  */
    getBushPositions() {
        const positions = [];
        if (this.#state === this.#states.BUILD) {
            for (let i = 0; i < this.#map.length; i++) {
                for (let j = 0; j < this.#map[i].length; j++) {
                    if (this.#map[i][j] === ELEMENTS.bush) {
                        positions.push({ x: i, y: j });
                    }
                }
            }
        }
        return positions;
    }

    /**
     *  Método para obtener el mapa
     */ 
    get map() {
        if (this.#state === this.#states.BUILD) {
            return this.#map;
        }
        return undefined;
    }
}
