import { io } from "../../node_modules/socket.io-client/dist/socket.io.esm.min.js";
import { GameService } from "./GameService.js";

export const ConnectionHandler = {
    connected: false,
    socket: null,
    url: null,
    controller:null,
    init: (url, controller, onConnectedCallBack, onDisconnectedCallBack) => {
        ConnectionHandler.controller = controller;
        // let { socket } = ConnectionHandler; 
        ConnectionHandler.socket = io(url);     
        // socket.onAny((message, payload) => {
        //     console.log("Esta llegando: ");
        //     console.log(payload);
        //     console.log(payload.type);
        //     console.log(payload.content);

        //   });

        ConnectionHandler.socket.on("connect", (data) => {
            
            ConnectionHandler.socket.on("connectionStatus", (data) => {
                ConnectionHandler.connected = true;             
                onConnectedCallBack();
                ConnectionHandler.controller.set_Player(data.message.ID)
            });
            ConnectionHandler.socket.on("message", (payload) => {
                ConnectionHandler.controller.actionController(payload);
                ConnectionHandler.socket.emit("message",{ type: "HELLO", content: "Hello world!"});
            });
            ConnectionHandler.socket.on("gameStart", (data) => {
                console.log(data);
                GameService.action({ action: "start" });
            });

            


            ConnectionHandler.socket.on("disconnect", () => {
                ConnectionHandler.connected = false;
                onDisconnectedCallBack();
            });
        })
    }
}