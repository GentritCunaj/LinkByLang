import io from 'socket.io-client';
const ORIGIN = 'https://linkbylang.netlify.app';
const socket = io.connect(ORIGIN);

export default socket;