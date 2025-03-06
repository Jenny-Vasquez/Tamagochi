import { ConnectionHandler } from "./services/ConnectionHandler.js";
import { GameService } from "./services/GameService.js";

export class GameController {
    #states = {
        RIGHT : 0,
        BAD : 1,
       
    };



    #state = null;
    #gameService = null;

    constructor(url, ui) {
        ui.initUI();
        this.#gameService = new GameService(ui);
        ConnectionHandler.init(url, this, () => {
            this.#state = this.#states.RIGHT;
        }, () => {
            this.#state = this.#states.BAD;
        });
    }

    actionController(payload) {
        console.log("payload");
        console.log(payload);
        if (this.#state === this.#states.RIGHT)
            this.#gameService.do(payload);
    }
     set_Player(payload){
        console.log("set_player");
        console.log(payload);
        this.#gameService.setPlayer(payload);
    }
  
}
