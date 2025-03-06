import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService"
import { log } from "console";
export class GameService {
    private games: Game[];

    private static instance: GameService;
    private constructor() {
        this.games = [];
    };

    static getInstance(): GameService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameService();
        return this.instance;
    }

    public buildPlayer(socket: Socket): Player {
        return {
            id: socket,
            _id_: socket.id,
            x: 0,
            y: 0,
            state: PlayerStates.Idle,
            direction: Directions.Up,
            visibility: true
        }
    }

    public addPlayer(player: Player): boolean {

        const room: Room = RoomService.getInstance().addPlayer(player);
        const board = new BoardBuilder().getBoard();

        var size = board.size;
        const players = room.players;

        const positions = [
            { x: 0, y: 0 },
            { x: 0, y: size - 1 },
            { x: size - 1, y: 0 },
            { x: size - 1, y: size - 1 }
        ];

        const index = players.findIndex(p => p._id_ === player._id_);


        console.log("player index: " + index);

        if (index < positions.length) {
            player.x = positions[index].x;
            player.y = positions[index].y;
        }
        const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


        const game: Game = {
            id: "game" + genRanHex(128),
            state: GameStates.WAITING,
            room: room,
            board: board
        }
        room.game = game;
        this.games.push(game);


        if (room.occupied) {
            if (room.game) {
                room.game.state = GameStates.PLAYING;
                if (ServerService.getInstance().isActive()) {
                    ServerService.getInstance().gameStartMessage(room.name);
                    ServerService.getInstance().sendMessage(room.name, Messages.BOARD, room.game.board);
                    ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, this.serializePlayers(players));

                }
            }
            return true;
        }

        return false;
    }

/**
 * 
 * @param data {direction,playerID}
 * @returns 
 */
    public movePlayer(data: any) {

        const room = RoomService.getInstance().getRoomByPlayerId(data.playerID);

        if (!room || !room.game) return;
        const boardSize = room.game.board.size;
        console.log(boardSize);
        const player = room.players.find((p) => p._id_ === data.playerID);
        if (!player) return;

        let x = player.x;
        let y = player.y;
        console.log("old X: " + x + " Y: " + y + " Player direction: " + player.direction);
        player.direction = data.direction; //actualiza la dirección
      
            // Calcular la nueva posición según la dirección actual
            switch (player.direction) {
                case Directions.Up:
                    x = player.x - 1;
                    break;
                case Directions.Right:
                    y = player.y + 1;
                    break;
                case Directions.Down:
                    x = player.x + 1;
                    break;
                case Directions.Left:
                    y = player.y - 1;
                    break;


            }
            console.log("new X: " + x + " Y: " + y);
            // Validamos los límites del tablero
            if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
                return; 
            }

            // Comprobamos si la casilla destino esta ocupada
            const occupied = room.players.some(p => p._id_ !== data.playerID && p.x === x && p.y === y);
            if (occupied) {
                return; // No se mueve si la casilla está ocupada
            }
            // Actualizar posición 
            player.x = x;
            player.y = y;       

        // Verificar si quedo un único jugador 
        if (this.checkGameOver(room)) {
           
            ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
            console.log("El juego ha terminado.");
        } else {
            ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
        }

    }

   

  
    /**
     * 
     * @param data {playerID}
     * @returns 
     */
    public shootPlayer(data: any) {
        const room = RoomService.getInstance().getRoomByPlayerId(data.playerID);
        if (!room || !room.game) return;

        const boardSize = room.game.board.size;
        const shooter = room.players.find(p => p._id_ === data.playerID);
        if (!shooter) return;

        // Calcular la casilla objetivo en base a la dirección del jugador
        let x = shooter.x;
        let y = shooter.y;
        switch (shooter.direction) {
            case Directions.Up:
                x = shooter.x - 1;
                break;
            case Directions.Down:
                x = shooter.x + 1;
                break;
            case Directions.Right:
                y = shooter.y + 1;
                break;
            case Directions.Left:
                y = shooter.y - 1;
                break;
        }

        // Validar que el objetivo esté dentro del mapa
        if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
            return;
        }

        // Buscar si hay algún jugador en la casilla objetivo
        const targetPlayer = room.players.find(p => p.x === x && p.y === y);
        if (targetPlayer) {
            // Si se detecta un jugador, se lo "mata" actualizando su estado
            targetPlayer.state = PlayerStates.Dead;
            console.log(`Player ${targetPlayer.id.id} was eliminated by player ${shooter._id_}`);
        }

        if (this.checkGameOver(room)) {
            ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
        } else {
            ServerService.getInstance().sendMessageToRoom(room.name, this.serializeGame(room.game));
        }
    }



    private checkGameOver(room: Room): boolean {
        console.log("=================ChecK room============= ")
        const alivePlayers = room.players.filter(p => p.state !== PlayerStates.Dead);

        if (alivePlayers.length <= 1) {
            // Actualizamos el estado del juego a finalizado
            if (room.game)
                room.game.state = GameStates.ENDED;
            return true;
        }
        return false;
    }


    private serializePlayers(players: Player[]): any {
        return players.map(({ _id_, x, y, state, direction, visibility }) => ({
            _id_,
            x,
            y,
            state,
            direction,
            visibility
        }));

    }
    private serializeRoom(room: Room): any {
        return {
            name: room.name,
            occupied: room.occupied,
            players: this.serializePlayers(room.players),

        };
    }


    public serializeGame(game: Game): any {
        return {
            type: "game",
            content: {
                id: game.id,
                state: game.state,
                room: this.serializeRoom(game.room),
                board: {
                    size: game.board.size,
                    elements: game.board.elements
                }
            }

        };
    }


}
