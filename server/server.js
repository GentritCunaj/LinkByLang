const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const server = require('http').Server(app);
const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config({path:'../.env'});



// You

// Define an API endpoint for translation


const CREDENTIALS = JSON.parse(process.env.REACT_APP_CREDENTIALS);

const io = require('socket.io')(server,{
    cors:{
        origin: '*',
        methods:["GET","POST"]
    }
})

const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

const socketNamesMap = new Map();

const sectionRooms = {
    "german": {
        free: [],
        private: []
    },
    "english": {
        free: [],
        private: []
    },
    "serbian": {
        free: [],
        private: []
    },
    "albanian": {
        free: [],
        private: []
    },
    "spanish": {
        free: [],
        private: []
    },
    "french": {
        free: [],
        private: []
    },
    "italian": {
        free: [],
        private: []
    }
};

const socketInterests = new Map();


const translateText = async (text, targetLanguage) => {

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

app.post('/api/translate', async (req, res) => {
    const { text, targetLanguage } = req.body;
    try {
        const translatedText = await translateText(text, targetLanguage);
        res.json({ translatedText });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

io.on("connection", (socket) => {
    console.log("connected");

    socket.emit('freeSectionCounts', Object.fromEntries(
        Object.entries(sectionRooms).map(([section, { free }]) => [section, free.length])
    ));

    socket.on("updateName", ({ id, name }) => {
        socketNamesMap.set(id, name);
        console.log(`Name updated for socket ${id}: ${name}`);
    });

    
    socket.on("join-room", (data) => {
        socket.join(data);
        if (!sectionRooms[data].free.includes(socket.id) && !sectionRooms[data].private.includes(socket.id)) {
            sectionRooms[data].free.push(socket.id);
        }
        io.to(data).emit('usersInSection', sectionRooms[data].free);
        console.log("first room")
    });

    socket.on("join-private-room", ({roomId,id}) => {

        socket.join(roomId);
        console.log("okayyy",roomId)
        console.log(sectionRooms[id].free)
        const index = sectionRooms[id].free.indexOf(socket.id);
        if (index !== -1) {
            sectionRooms[id].free.splice(index, 1);
            sectionRooms[id].private.push(socket.id);
        }
        
    });

    socket.on('privateMessage', (roomId) => {
        
        const usersInRoom = sectionRooms[roomId].free;
 
        if (usersInRoom.length < 2) {
            io.emit('privateRoomError', { error: 'Not enough users available for private conversation.' });
            console.log("not enough");
            return;
        }
        const sortedSockets = sortSocketsByMutualInterests(usersInRoom, socketInterests);
        const mutual = sortedSockets[1]
        const [user1, user2] = sortedSockets[0].slice(0, 2);
        console.log(user1,"user1");
        console.log(user2,"user2");
        console.log(socketNamesMap);
        const user1Name = socketNamesMap.get(user1);
        const user2Name = socketNamesMap.get(user2);
    


        // Emit private room ID to both users
        const generated = generatePrivateRoom(user1, user2);
        
        io.to(user1).emit('privateRoom', {generated,mutual,otherId:user2Name});
        io.to(user2).emit('privateRoom', {generated,mutual,otherId:user1Name});
       
    });

    socketInterests.set(socket.id, { interests: [] });

    socket.on("updateInterests", (interests) => {
        socketInterests.get(socket.id).interests = interests;
        console.log(`Interests updated for socket ${socket.id}:`, interests);
    });


    socket.on("send_message", ({message,privateRoom,room}) => {
        const [messageContent, messageTime] = message.split("~");

        function lang(lg){
            switch (lg) {
            case "german":
                return "de"
               
            case "english":
               return "en"

            case "serbian":
                return "hr"

            case "french":
                return "fr"
                
            case "albanian":
                return "al"
                
            case "italian":
                return "it"
                
            case "spanish":
                return "es"    
            default:
                return "en"
                
            }
        }
        const language = lang(room);
       

        let messageUpdated = messageContent;
        translateText(messageUpdated,language).then((res)=>{
            messageUpdated += "~" + res + "~" + messageTime;
            console.log(`Emitting receive_message to room ${privateRoom}:`, messageUpdated);
            socket.to(privateRoom).emit("receive_message", messageUpdated);
            
        })
       
       

    });

    socket.on('disconnect', () => {
        socketInterests.delete(socket.id);

        for (const room in sectionRooms) {
            const indexFree = sectionRooms[room].free.indexOf(socket.id);
            if (indexFree !== -1) {
                sectionRooms[room].free.splice(indexFree, 1);
            }
            const indexPrivate = sectionRooms[room].private.indexOf(socket.id);
            if (indexPrivate !== -1) {
                sectionRooms[room].private.splice(indexPrivate, 1);
            }
            io.to(room).emit('usersInSection', sectionRooms[room].free.concat(sectionRooms[room].private));
        }
    });
});

function generatePrivateRoom(user1, user2) {
    const privateRoomID = user1 + user2;
    return privateRoomID;
}

function sortSocketsByMutualInterests(sockets, socketInterestsMap) {
    // Define the custom sorting criteria
    let mutualInterestsA = null;
    function compareByMutualInterests(socketA, socketB) {
        // Get interests of each socket
        const interestsA = socketInterestsMap.get(socketA).interests;
        const interestsB = socketInterestsMap.get(socketB).interests;
        console.log(interestsA,interestsB);
   

        // Find the mutual interests between the two sockets

        mutualInterestsA = interestsA.filter(interest => interestsB.includes(interest));
        const mutualInterestsB = interestsB.filter(interest => interestsA.includes(interest));
    
        // Sort the sockets based on the number of mutual interests
        // Compare the lengths of mutual interests arrays to determine sorting order
        console.log(mutualInterestsA,"a");
        console.log(mutualInterestsB,"b");
        return [mutualInterestsB.length - mutualInterestsA.length];
    }

    // Sort the sockets array using the custom sorting function
    return [sockets.sort(compareByMutualInterests),mutualInterestsA];
}

module.exports = {
    translateText
};

server.listen(process.env.REACT_APP_PORT || 3001);
