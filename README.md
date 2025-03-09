# Tamagotchi con WebSockets

Este proyecto es un Tamagotchi interactivo que se mueve dentro de una cuadrícula y guarda su posición en tiempo real utilizando WebSockets.  
Permite la sincronización entre múltiples clientes para que cada jugador vea los cambios en la posición del Tamagotchi.

## Tecnologías utilizadas

- **JavaScript y TypeScript**: Para la lógica del juego y la interacción del usuario.  
- **Socket.io**: Para la comunicación en tiempo real entre clientes y servidor.  

## Pasos de instalación

### Clona este repositorio:
```bash
git clone https://github.com/Jenny-Vasquez/Tamagochi.git
```

### Instala las dependencias:
```bash
npm install
```

### Ejecuta el servidor de WebSockets:
```bash
npm run dev
```

### Abre el proyecto en el navegador:
Accede a [http://127.0.0.1:3000](http://127.0.0.1:3000) en tu navegador para interactuar con el Tamagotchi.

## Funcionamiento

- El Tamagotchi puede moverse en cuatro direcciones: **arriba, abajo, izquierda y derecha**.  
- Se almacena y sincroniza su posición en tiempo real utilizando **Socket.io**.  
- Múltiples usuarios pueden interactuar con el Tamagotchi al mismo tiempo y ver los cambios reflejados en sus pantallas.  
- **El tablero no se dibujará hasta que los jugadores estén en el juego.** Actualmente, está configurado para **dos jugadores**, aunque podría ampliarse para más.  
- El jugador se esconde al entrar en un arbusto, lo que permite moverse sin ser visto y sorprender al resto de jugadores.

## Funcionalidades Técnicas
  # Flujo Inicial: Desde que el Cliente accdede hasta que se dibuja el tablero
  - Cuando el Cliente accede a la pagina del juego (index.html) se inicia el proceso de conexión y configuración del juego.
  - El cliente se conecta al Servidor, se crea una instancia en **Game controller** para inicializar el juego.
  - **GameController establece una conexión con el servidor usando **ConnectionHandler** que se encarga de  establecer la conexión con WebSockets, cuando la coneccion es correcta el servido envia un mensaje de confirmación con el ID del jugador.
  Desde el servidor
  - **ServerService** asigna al jugador a una sala usando **RoomSertvice**, de esta forma **GameService** genera el tablero donde tendra en cuenta las posiciones del jugador y lo enviara al cliente.
- El servidor generara el tablero y los arbustos con **BoardBuilder** este enviara la información del tablero al cliente a través de WebSockets.

  Representación del Tablero
El cliente recibe el **tablero** y lo dibuja mediante do_newBoard() en **GameService** y drawBoard() en **UIv1** dibuja el tablero en pantalla.
  Representación de los jugadores
  Representación de los Jugadores
El cliente recibe a los **Jugadores** y los dibuja mediante do_newPlayer() en **GameService** actualiza las posiciones de los jugadores y drawPlayers() en **UIv1** coloca a los jugadores en el tablero.





## Galeria 
![Vista previa del juego](images/1.png)  
![Movimiento del Tamagotchi](images/2.png)  
![Interacción en tiempo real](images/3.png)  
