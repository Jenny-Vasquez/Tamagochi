import { Board } from "../entities/Board.js";
import { Queue } from "../Queue.js";
export class GameService {
    #states = {
        WAITING: 0,
        PLAYING: 1,
        ENDED: 2
    };
    current_player = null;
    #ui = null;
    #players = [];
    #board = null;
    #queue = null;
    #state = null;
    #parallel = null;
    #gameOverShown = false; 

    #actionsList = {
        "NEW_PLAYER": this.do_newPlayer.bind(this),
        "BOARD": this.do_newBoard.bind(this),
        "game": (content) => this.do_gameStart(content),
    };

    constructor(ui) {
        this.#state = this.#states.WAITING;
        this.#board = new Board();
        this.#queue = new Queue();
        this.#parallel = null;
        this.checkScheduler();
        this.#ui = ui;
    }
    setPlayer(player) {
        this.current_player = player;        
    }

    checkScheduler() {
        if (!this.#queue.isEmpty()) {
            if (this.#parallel == null) {
                this.#parallel = setInterval(
                    async () => {
                        const action = this.#queue.getMessage();
                        if (action != undefined) {
                            await this.#actionsList[action.type](action.content);
                        } else {
                            this.stopScheduler();
                        }
                    }
                );
            }
        }
    }

    stopScheduler() {
        clearInterval(this.#parallel);
        this.#parallel = null;
    }

    do(data) {
        this.#queue.addMessage(data);
        this.checkScheduler();
    };

    async do_newPlayer(payload) {
        console.log("ha llegado un jugador nuevo " + JSON.stringify(payload));
        
        this.#players=payload;
        const board_size = this.#board.map.length;
        this.#ui.drawPlayers(this.#players, board_size);

    };

    async do_newBoard(payload) {

        this.#board.build(payload);
        this.#ui.drawBoard(this.#board.map, this.current_player);

    }

     do_gameStart(content) {
         console.log("Iniciando juego con estado:", content);
         const boardInstance = new Board();
         boardInstance.build(content.board);
        // //  const ui = new Ui(content.board, content.room.players, this.current_player);
    this.#ui.drawBoard(this.#board.map, this.current_player);
         // Filtrar jugadores vivos (asumiendo que 4 representa Dead)
         const alivePlayers = content.room.players.filter(player => player.state !== 4);
         this.#players = alivePlayers;
    
    //     // Comprobar si el jugador actual está vivo
         let controlsEnabled = true;
         const currentAlive = alivePlayers.find(p => p.socketId === this.current_player);
         if (!currentAlive) {
            controlsEnabled = false;
             if (!this.#gameOverShown) {
                // //  Ui.showGameOver();
                 this.#gameOverShown = true;
             }
         } else {
             // Reiniciar la bandera si el jugador está vivo
             this.#gameOverShown = false;
         }
    
         // Si el estado del juego es ENDED, mostrar botón de reinicio
         if (content.state === 2) { // 2 representa ENDED
            this.#state = this.#states.ENDED;
             Ui.showRestartButton();
         }
         const board_size = this.#board.map.length;
         this.#ui.drawPlayers(this.#players, board_size);       
     }


}
