
import { useEffect } from "react"
import socket from "./socket";
import { useState,useRef } from "react";
import { useParams } from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import icebreakersData from '../icebreakers.json';
export default function Chat(){
    const [privateRoom, setPrivateRoom] = useState(null);

    const [message,setMessage] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [randomIcebreaker, setRandomIcebreaker] = useState('');
    const [mutual,setMutual] = useState([]);
    const [room, setRoom] = useState(null);
    const [messageReceived,setMessageReceived] = useState([]);
    const [messagesSent,setMessagesSent] = useState([]);
    const [showTranslated, setShowTranslated] = useState([]);
    const [allMessagesReceived, setAllMessagesReceived] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [other,setOther] = useState(null);
    
    const { id } = useParams();


    useEffect(() => {
        
        setRoom(id);
    }, [room]);

    
  const selectRandomIcebreaker = () => {
    const randomIndex = Math.floor(Math.random() * icebreakersData.length);
    setRandomIcebreaker(icebreakersData[randomIndex]);
  };

    useEffect(() => {
        const chatPage = document.querySelector(".chats");
        if (chatPage) {
            setTimeout(() => {
                chatPage.scrollTop = chatPage.scrollHeight;
            }, 250); // Adjust the delay as needed
        }
    }, [allMessagesReceived, messagesSent]);

    const toggleTranslated = (index) => {
        const newShowTranslated = [...showTranslated];
        newShowTranslated[index] = !newShowTranslated[index];
        setShowTranslated(newShowTranslated);
        
    };
    
    async function translateText(textToTranslate, targetLanguage) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToTranslate, targetLanguage }),
        };
    
        try {
            const response = await fetch('https://langsocket.onrender.com/api/translate', requestOptions);
            if (!response.ok) {
                throw new Error('Failed to fetch translation');
            }
            const data = await response.json();
           
            return data;
        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        }
    }
    
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
    

    useEffect(() => {

        const timer = setTimeout(() => {
            // Emit privateMessage event after 5 seconds
            socket.emit('privateMessage', id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [socket]);

    
    useEffect(() => {
        const joinPrivateRoom = ({generated,mutual,otherId}) => {
          
    
            socket.emit('join-private-room', {roomId:generated,id});
          
       
          
            setMutual(mutual);
            setPrivateRoom(generated); 
            setOther(otherId);
            setIsLoading(false);
        };
    
        socket.on('privateRoom', joinPrivateRoom);
    
        return () => {
            socket.off('privateRoom', joinPrivateRoom);
        };
    }, []);
 
    const sendMessage = () => {

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const currentTime = `${hours}:${minutes} ${ampm}`;
        const messageWithTime = `${message}~${currentTime}`;
        const splitted = messageWithTime.split("~");
        const targetLanguage = lang(room);

        translateText(splitted[0], targetLanguage)
            .then(res => {
             
                const sentMessage = { content: [...splitted,res.translatedText], time: now, type: "sent" };
      
                socket.emit("send_message",{message:messageWithTime,privateRoom,room})
               setMessagesSent([...messagesSent,sentMessage]);
            })
            .catch(error => {
               console.log(error)
            });

       
       setMessage('');
     
    }


    useEffect(()=>{
       
        const receiveMessageHandler = (data) => {
            const [messageContent, translatedMessageContent, messageTime] = data.split("~");
        
            const receivedMessage = { content: [messageContent, translatedMessageContent,messageTime], time: new Date(), type: "received" };

            setMessageReceived(receivedMessage);
           
            setAllMessagesReceived(prevMessages => [...prevMessages, receivedMessage]);

           
        };
    
        // Add event listener
        socket.on("receive_message", receiveMessageHandler);
    
        // Cleanup function to remove event listener when component unmounts or when socket changes
        return () => {
            socket.off("receive_message", receiveMessageHandler);
        };
    },[socket])

    const sortedMessages = [...allMessagesReceived, ...messagesSent].sort((a, b) => a.time - b.time);

    return (
        <>

        
<div class="mainDiv" >
		<div class="logoNavbar">
     
  <div class="logo">
	<img src={require("../Images/logo-no-background.png")} />
  </div>
</div>

<div class="banners">
<ul class="interestsul">
    {mutual.length !== 0 && (
        <h4><span  class="interestsspan">Things you like in common :)</span></h4>
    )}    
            {mutual.length !== 0 && mutual.map((m)=>{
              
                return (
                    
                    <li><span class="interestsspan">{m}</span></li>
                )
            })}
	   

        
        </ul>
        <div class="iceDiv">
          
      <button class="iceButton" onClick={selectRandomIcebreaker}>Get Random Icebreaker</button>
      {randomIcebreaker && (
        <div class="iceBackground">
         {randomIcebreaker.split(' ').map((m)=>{
            return (
                <p class="iceP">{m}</p>
            )
         })}
        </div>
        
      )}</div>
</div>
        {isLoading ? (
            <>
                <div className="loader"></div>
                
                </>
            ) : (
                <>
                

<div class="chatcontainer">
   
      <div class="msg-header">
        {other && (
             <div class="container1">
            <p class="userP">{other}</p>
          
        </div>
        )}

        
          
      </div>
     
      <div class="chat-page">
        <div  class="msg-inbox">
          <div class="chats">
           
            <div    class="msg-page">
             
             
            <AnimatePresence>
            {sortedMessages.map((message, index) => (
    <motion.div key={index} initial={{opacity:0,height:0}} transition={{opacity:0.15}} animate={{opacity:1,height:"auto"}} className={message.type === "sent" ? "outgoing-chats" : "received-chats"}>
        <div className={message.type === "sent" ? "outgoing-msg" : "received-msg"}>
            {message.type === "sent" ? (
                <div className="outgoing-chats-msg">
                    <div onClick={() => toggleTranslated(index)} className="circle1">
                        <img src={require("../Images/translate.png")} alt="Translate" />
                    </div>
                    <p className="multi-msg">{showTranslated[index] ? message.content[0] : message.content[2]}</p>
                    <span className="time">{message.content[1]}</span>
                </div>
            ) : (
                <div className="received-msg-inbox">
                    <div onClick={() => toggleTranslated(index)} className="circle1">
                        <img src={require("../Images/translate.png")} alt="Translate" />
                    </div>
                    <p>{showTranslated[index] ? message.content[0] : message.content[1]}</p>
                    <span className="time">{message.content[2]}</span>
                </div>
            )}
        </div>
    </motion.div>
))}
                </AnimatePresence>


             
            </div >
          </div>

         
         
            <div class="input-group">
              <input
                type="text"
                id="messageInput"
                class="form-control"
                placeholder="Send message..."
               value = {message}
                onChange={(e)=> setMessage(e.target.value)}
              />

              <span id="sendSpan" onClick={sendMessage} class="input-group-text send-icon">
              <svg style={{ 
    width: '80%',
    position: 'relative',
    left: '-20px',
    height:'auto'}} fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.009,10.845a1,1,0,0,0,.849.859l8.258,1.18,1.18,8.258a1,1,0,0,0,1.909.252l7.714-18a1,1,0,0,0-1.313-1.313L2.606,9.8A1,1,0,0,0,2.009,10.845Zm11.762,6.483-.711-4.974,4.976-4.976Zm2.85-11.363-4.974,4.974-4.976-.71Z"/></svg>
              </span>
            </div>
         
        </div>
      </div>
    </div>
    </>
    )}
    </div>
        </>
    )
}