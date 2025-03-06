import { UI_BUILDER } from "./Ui.js";
import { ConnectionHandler } from "../src/services/ConnectionHandler.js";

export const UIv1 = UI_BUILDER.init();

// Inicializamos la interfaz
UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
    const control = document.getElementById(UIv1.uiElements.control);
    control.classList.add("controls");
}

// Función que nos permite dibujar en el tablero
UIv1.drawBoard = (board, player) => {
    console.log("============= board Draw")
    console.log(board);
    console.log(player);
    if (board !== undefined) {
        UIv1.drawControls(player);
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 50px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 50px)`;

        // Iteramos sobre cada celda del tablero
        board.forEach(row => {
            var cont = 0;
            row.forEach(cell => {

                const tile = document.createElement("div");
                tile.classList.add("tile");
                // Verificamos si la celda contiene un arbusto (asumimos que se indica con un valor específico,
                // en nuestro caso un 5 )
                if (cell === 5) { // Si el valor de la celda es 5, significa que hay un arbusto
                    tile.style.backgroundImage = "url('assets/images/arbusto.jpg')"; // Colocamos la imagen del arbusto
                    tile.style.backgroundSize = 'cover';
                    tile.style.backgroundPosition = 'center';
                    tile.style.backgroundRepeat = 'no-repeat';
                    tile.setAttribute('id', "tree_" + cont);
                }
                base.appendChild(tile);
                anime({
                    targets: tile,
                    duration: (Math.random() * 8000) + 1000,
                });
                cont++;
            });            
        });
    }
},
    /**Dibujamos el jugador */
    UIv1.drawPlayers = (players, boardSize) => {
        console.log("================== Players draw ================");
        console.log(players);
        const base = document.getElementById(UIv1.uiElements.board);
        players.forEach(elm => {
            const index = elm.x * boardSize + elm.y;
            const tile = base.children[index];
            var id = (tile.getAttribute("id") !== null) ? tile.getAttribute("id").split("_")[0] : "";
            if (tile) {
                if (id !== "tree") {//compruebar si hay un arbol
                    tile.style.backgroundImage = "url('assets/images/player.png')";
                    tile.style.backgroundSize = 'cover';
                }
                tile.classList.add("player");
            }
        });
    },

    UIv1.drawControls = (player) => {

        const control = document.getElementById(UIv1.uiElements.control);
        control.className = 'controls';

        control.innerHTML = `
            <button id="up">Up</button>
            <button id="left">Left</button>
            <button id="right">Right</button>
            <button id="down">Down</button>              
            <button id="shoot">Shoot</button>
         `;

        document.getElementById('up').addEventListener('click', () => {
            console.log("Player " + player + " move on");
            ConnectionHandler.socket.emit("movePlayer", { direction: "up", playerID: player });
        });
        document.getElementById('down').addEventListener('click', () => {
            console.log("Player " + player + " down");
            ConnectionHandler.socket.emit("movePlayer", { direction: "down", playerID: player });
        });

        document.getElementById('right').addEventListener('click', () => {
            console.log("Player " + player + "  right");
            ConnectionHandler.socket.emit("movePlayer", { direction: "right", playerID: player });
        });

        document.getElementById('left').addEventListener('click', () => {
            console.log("Player " + player + "  left");
            ConnectionHandler.socket.emit("movePlayer", { direction: "left", playerID: player });
        });

        document.getElementById('shoot').addEventListener('click', () => {
            console.log("Player " + player + " shoots");
            ConnectionHandler.socket.emit("shootPlayer", { playerID: player });
        });

        /**Implementar con teclado?? */



    }



