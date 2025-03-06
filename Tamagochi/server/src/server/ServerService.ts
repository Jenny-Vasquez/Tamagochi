import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import { GameService } from '../game/GameService';
import { BoardBuilder } from '../game/BoardBuilder';
import { AnyTxtRecord } from 'dns';

export class ServerService {
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
    private active: boolean;
    static messages = {
    }

    public inputMessage = [
       
    ];

    private static instance: ServerService;
    private constructor() {
        this.io = null;
        this.active = false;
    };

    static getInstance(): ServerService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ServerService();
        return this.instance;
    }

    public init(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.active = true;

        this.io.on('connection', (socket) => {
            socket.emit("connectionStatus",
                {
                    status: true,
                    message: {
                        conexion: "Conexión establecida",
                        ID: socket.id
                    }
                }
            );
            GameService.getInstance().addPlayer(GameService.getInstance().buildPlayer(socket));

            // socket.on("message", (data) => {
            //     const doType = this.inputMessage.find(item => item.type == data.type);
            //     if (doType !== undefined) {
            //         doType.do(data);
            //     }
            // })

           

            socket.on("movePlayer", (data) => {
                console.log("Move player", data);
                GameService.getInstance().movePlayer(data);
            });
            socket.on("shootPlayer", (data) => {
                console.log("shoot Player", data);
                GameService.getInstance().shootPlayer(data);
            });

            // 




            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado:', socket.id);
            });

        });
    }
  

    public addPlayerToRoom(player: Socket, room: String) {
        player.join(room.toString());
    }



    public sendMessage(room: String | null, type: String, content: any) {
        
        if (this.active && this.io != null) {
            if (room != null) {
                this.io?.to(room.toString()).emit("message", {
                    type, content
                })
            }
        }
    }

    public gameStartMessage(room: String) {
        const board = new BoardBuilder().getBoard();
      
        this.io?.to(room.toString()).emit('board', board);
    }

    public sendMessageToRoom(room: String, message: String) {
        this.io?.to(room.toString()).emit('message', message);
    }

    public isActive() {
        return this.active;
    }

   
}