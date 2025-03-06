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

## Galeria 
![Vista previa del juego](images/1.png)  
![Movimiento del Tamagotchi](images/2.png)  
![Interacción en tiempo real](images/3.png)  
