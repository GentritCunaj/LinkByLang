import io from 'socket.io-client';

const socket = io.connect("https://langsocket.onrender.com/");

export default socket;