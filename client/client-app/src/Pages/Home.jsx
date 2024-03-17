import { useEffect, useState } from "react";
import socket from "./socket";
import {useNavigate} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
function Home() {
    const navigate = useNavigate();
    const [interests, setInterests] = useState([]);
    const [usersInSection, setUsersInSection] = useState([]);
	const [name, setName] = useState("");
	const flags = ['german','english','albanian','french','serbian','italian','spanish']
   
    const joinRoom = (nr) => {
		socket.emit("updateName", { id: socket.id, name });
        socket.emit('join-room', nr);
        navigate(`/chat/${nr}`)
       
    }

	const handleNameChange = (e) => {
        setName(e.target.value);
    }


	const handleInterestChange = (e) => {
		const selectedInterests = Array.from(
		  document.querySelectorAll('input[type="checkbox"]:checked'),
		  checkbox => checkbox.value
		);
		setInterests(selectedInterests);
		socket.emit("updateInterests", selectedInterests);
	  };



    useEffect(() => {
        const handleUsersInSection = (users) => {
            setUsersInSection(users);
            console.log(users);
        };

        socket.on('freeSectionCounts', handleUsersInSection);
        
		console.log(usersInSection);
        return () => {
            socket.off('freeSectionCounts', handleUsersInSection);
        };
    }, [socket]);

    

    return (
        <>
	 
		<div class="logoNavbar">
  <div class="logo">
	<img src={require("../Images/logo-no-background.png")} />
  </div>

  <div class="field">
  <input  value={name} onChange={handleNameChange} class="nameInput" type="text" placeholder="What's your name?"/>
  <div class="line"></div>
</div>

</div>


           <fieldset class="checkbox-group">
	<legend class="checkbox-group-legend">Choose your favorite interests</legend>

	<div class="checkbox">
		<label class="checkbox-wrapper">
			<input type="checkbox" class="checkbox-input"  id="sports" value="sports" onChange={handleInterestChange}/>
			
			<span class="checkbox-tile">
				<span class="checkbox-icon">
				<svg width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
				<title>sports-soccer</title>
  <g id="Layer_2" data-name="Layer 2">
    <g id="invisible_box" data-name="invisible box">
      <rect width="48" height="48" fill="none"/>
    </g>
    <g id="Q3_icons" data-name="Q3 icons">
      <g>
        <polygon points="17.5 21.6 20 29 28 29 30.5 21.6 24 17 17.5 21.6"/>
        <path d="M45.5,19.1A22.1,22.1,0,0,0,24,2a21.2,21.2,0,0,0-4.9.6A22,22,0,0,0,24,46a28.1,28.1,0,0,0,4.9-.5A22.1,22.1,0,0,0,45.5,19.1Zm-7,15.6-1.1-3.3H29.5l-2.6,7.6,2.8,2-1.7.5a18.1,18.1,0,0,1-4,.4,17.9,17.9,0,0,1-5.7-.9l2.8-2-2.6-7.6H10.6L9.5,34.7a17,17,0,0,1-3-6.7A14.8,14.8,0,0,1,6,23.9l2.8,2,6.3-4.8-2.3-7.6H9.4a18.3,18.3,0,0,1,9.2-6.6l-1.1,3.2L24,14.7l6.5-4.6L29.4,6.8a18.6,18.6,0,0,1,9.3,6.7H35.2l-2.3,7.6,6.3,4.8L42,23.8A18.9,18.9,0,0,1,38.5,34.7Z"/>
      </g>
    </g>
  </g>
					</svg>
				</span>
				<span class="checkbox-label">Sports</span>
			</span>
		</label>
	</div>
	<div class="checkbox">
		<label class="checkbox-wrapper">
			<input type="checkbox" class="checkbox-input"  id="music" value="music" onChange={handleInterestChange} />
			<span class="checkbox-tile">
				<span class="checkbox-icon">
				<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 19C9 20.1046 7.65685 21 6 21C4.34315 21 3 20.1046 3 19C3 17.8954 4.34315 17 6 17C7.65685 17 9 17.8954 9 19ZM9 19V5L21 3V17M21 17C21 18.1046 19.6569 19 18 19C16.3431 19 15 18.1046 15 17C15 15.8954 16.3431 15 18 15C19.6569 15 21 15.8954 21 17ZM9 9L21 7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
				</span>
				<span class="checkbox-label">Music</span>
			</span>
		</label>
	</div>
	<div class="checkbox">
		<label class="checkbox-wrapper">
			<input type="checkbox" class="checkbox-input" id="technology" value="technology" onChange={handleInterestChange}/>
			<span class="checkbox-tile">
				<span class="checkbox-icon">
				<svg fill="#000000" width="800px" height="800px" viewBox="-4 0 19 19" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><path d="M10.114 2.69v13.76a1.123 1.123 0 0 1-1.12 1.12H2.102a1.123 1.123 0 0 1-1.12-1.12V2.69a1.123 1.123 0 0 1 1.12-1.12h6.892a1.123 1.123 0 0 1 1.12 1.12zm-1.12 1.844H2.102V14.78h6.892zm-5.31-1.418a.56.56 0 0 0 .56.56h2.61a.56.56 0 0 0 0-1.12h-2.61a.56.56 0 0 0-.56.56zm2.423 13.059a.558.558 0 1 0-.559.558.558.558 0 0 0 .559-.558z"/></svg>
				</span>
				<span class="checkbox-label">Technology</span>
			</span>
		</label>
	</div>
	<div class="checkbox">
		<label class="checkbox-wrapper">
			<input type="checkbox" class="checkbox-input" id="movies" value="movies" onChange={handleInterestChange}/>
			<span class="checkbox-tile">
				<span class="checkbox-icon">
				<svg width="800px" height="800px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">

    <title>ic_fluent_movies_and_tv_24_regular</title>
    <desc>Created with Sketch.</desc>
    <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="ic_fluent_movies_and_tv_24_regular" fill="#212121" fill-rule="nonzero">
            <path d="M19.7286477,3.91709009 L19.7796475,4.07673953 L20.3309222,5.99926292 C20.4355805,6.36424991 20.2508505,6.74366136 19.9126449,6.89230405 L19.8167039,6.92693721 L9.08979429,10.0020329 L20.2488588,10.0029698 C20.6285546,10.0029698 20.9423498,10.2851237 20.9920122,10.6511993 L20.9988588,10.7529698 L20.9988588,19.2509821 C20.9988588,20.713514 19.8571542,21.9093864 18.4163811,21.9959633 L18.2488588,22.0009821 L5.75,22.0009821 C4.28746816,22.0009821 3.09159572,20.8592775 3.00501879,19.4185045 L3,19.2509821 L2.99979429,10.8590329 L2.47803395,9.03789737 C2.07490554,7.63202154 2.84275532,6.16777873 4.20385145,5.68742476 L4.36350088,5.63642498 L16.3781751,2.19127259 C17.7840509,1.78814418 19.2482937,2.55599396 19.7286477,3.91709009 Z M19.498,11.502 L4.5,11.502 L4.5,19.2509821 C4.5,19.8550436 4.92847749,20.3590287 5.4980814,20.4755866 L5.62219476,20.4945285 L5.75,20.5009821 L18.2488588,20.5009821 C18.8960675,20.5009821 19.4283927,20.0091075 19.4924052,19.3787874 L19.4988588,19.2509821 L19.498,11.502 Z M6.27268011,6.6494258 L4.77695691,7.07831752 C4.15481999,7.25671241 3.7786565,7.8762725 3.89085867,8.49982068 L3.91988247,8.62445396 L4.26421826,9.82529556 L4.55930489,9.74043653 L6.27268011,6.6494258 Z M11.029003,5.28557216 L8.31151617,6.06479896 L6.59814094,9.15580969 L9.31562776,8.37658289 L11.029003,5.28557216 Z M15.7862871,3.92144289 L13.0688003,4.70066969 L11.3554251,7.79168042 L14.0719506,7.01272925 L15.7862871,3.92144289 Z M17.6334765,3.68788446 L16.1127092,6.42755115 L18.6812212,5.6912865 L18.3377549,4.49019556 C18.2305941,4.11648136 17.96425,3.83153666 17.6334765,3.68788446 Z" id="🎨-Color">

</path>
        </g>
    </g>
</svg>
				</span>
				<span class="checkbox-label">Movies</span>
			</span>
		</label>
	</div>
	<div class="checkbox">
		<label class="checkbox-wrapper">
			<input type="checkbox" class="checkbox-input" id="books" value="books" onChange={handleInterestChange}/>
			<span class="checkbox-tile">
				<span class="checkbox-icon">
				<svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
<title>books</title>
<path d="M30.639 26.361l-6.211-23.183c-0.384-1.398-1.644-2.408-3.139-2.408-0.299 0-0.589 0.040-0.864 0.116l0.023-0.005-2.896 0.776c-0.23 0.065-0.429 0.145-0.618 0.243l0.018-0.008c-0.594-0.698-1.472-1.14-2.453-1.143h-2.999c-0.76 0.003-1.457 0.27-2.006 0.713l0.006-0.005c-0.543-0.438-1.24-0.705-1.999-0.708h-3.001c-1.794 0.002-3.248 1.456-3.25 3.25v24c0.002 1.794 1.456 3.248 3.25 3.25h3c0.76-0.003 1.457-0.269 2.006-0.712l-0.006 0.005c0.543 0.438 1.24 0.704 1.999 0.708h2.999c1.794-0.002 3.248-1.456 3.25-3.25v-13.053l3.717 13.873c0.382 1.398 1.641 2.408 3.136 2.408 0.3 0 0.59-0.041 0.866-0.117l-0.023 0.005 2.898-0.775c1.398-0.386 2.407-1.646 2.407-3.141 0-0.298-0.040-0.587-0.115-0.862l0.005 0.023zM19.026 10.061l4.346-1.165 3.494 13.042-4.345 1.164zM18.199 4.072l2.895-0.775c0.056-0.015 0.121-0.023 0.188-0.023 0.346 0 0.639 0.231 0.731 0.547l0.001 0.005 0.712 2.656-4.346 1.165-0.632-2.357v-0.848c0.094-0.179 0.254-0.312 0.446-0.37l0.005-0.001zM11.5 3.25h2.998c0.412 0.006 0.744 0.338 0.75 0.749v2.75l-4.498 0.001v-2.75c0.006-0.412 0.338-0.744 0.749-0.75h0.001zM8.25 22.75h-4.5v-13.5l4.5-0.001zM10.75 9.25l4.498-0.001v13.501h-4.498zM4.5 3.25h3c0.412 0.006 0.744 0.338 0.75 0.749v2.75l-4.5 0.001v-2.75c0.006-0.412 0.338-0.744 0.749-0.75h0.001zM7.5 28.75h-3c-0.412-0.006-0.744-0.338-0.75-0.749v-2.751h4.5v2.75c-0.006 0.412-0.338 0.744-0.749 0.75h-0.001zM14.498 28.75h-2.998c-0.412-0.006-0.744-0.338-0.75-0.749v-2.751h4.498v2.75c-0.006 0.412-0.338 0.744-0.749 0.75h-0.001zM27.693 27.928l-2.896 0.775c-0.057 0.015-0.122 0.024-0.189 0.024-0.139 0-0.269-0.037-0.381-0.102l0.004 0.002c-0.171-0.099-0.298-0.259-0.35-0.45l-0.001-0.005-0.711-2.655 4.345-1.164 0.712 2.657c0.015 0.056 0.023 0.12 0.023 0.186 0 0.347-0.232 0.639-0.549 0.73l-0.005 0.001z"></path>
</svg>
				</span>
				<span class="checkbox-label">Books</span>
			</span>
		</label>
	</div>
	<div class="checkbox">
		<label class="checkbox-wrapper">
			<input type="checkbox" class="checkbox-input" id="travel" value="travel" onChange={handleInterestChange}/>
			<span class="checkbox-tile">
				<span class="checkbox-icon">
				<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V20H8V6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="3" y="8" width="18" height="12" rx="2" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
				</span>
				<span class="checkbox-label">Travel</span>
			</span>
		</label>
	</div>
	<div class="checkbox">
		<label class="checkbox-wrapper">
			<input type="checkbox" class="checkbox-input" id="food" value="food" onChange={handleInterestChange}/>
			<span class="checkbox-tile">
				<span class="checkbox-icon">
				<svg fill="#000000" width="800px" height="800px" viewBox="0 -3.84 122.88 122.88" version="1.1" id="Layer_1"  style={{enableBackground:"new 0 0 122.88 115.21"}} >

<g>

<path d="M29.03,100.46l20.79-25.21l9.51,12.13L41,110.69C33.98,119.61,20.99,110.21,29.03,100.46L29.03,100.46z M53.31,43.05 c1.98-6.46,1.07-11.98-6.37-20.18L28.76,1c-2.58-3.03-8.66,1.42-6.12,5.09L37.18,24c2.75,3.34-2.36,7.76-5.2,4.32L16.94,9.8 c-2.8-3.21-8.59,1.03-5.66,4.7c4.24,5.1,10.8,13.43,15.04,18.53c2.94,2.99-1.53,7.42-4.43,3.69L6.96,18.32 c-2.19-2.38-5.77-0.9-6.72,1.88c-1.02,2.97,1.49,5.14,3.2,7.34L20.1,49.06c5.17,5.99,10.95,9.54,17.67,7.53 c1.03-0.31,2.29-0.94,3.64-1.77l44.76,57.78c2.41,3.11,7.06,3.44,10.08,0.93l0.69-0.57c3.4-2.83,3.95-8,1.04-11.34L50.58,47.16 C51.96,45.62,52.97,44.16,53.31,43.05L53.31,43.05z M65.98,55.65l7.37-8.94C63.87,23.21,99-8.11,116.03,6.29 C136.72,23.8,105.97,66,84.36,55.57l-8.73,11.09L65.98,55.65L65.98,55.65z"/>

</g>

</svg>
				</span>
				<span class="checkbox-label">Food</span>
			</span>
		</label>
	</div>
	
</fieldset>
            <div className="flags">
				{flags.map((flag) => {
					return (
						<Card className="flag" id={flag} xmlnsSvgjs>
						<div className="circle">{usersInSection[flag]}</div>
						<img src={require(`../Images/${flag}.png`)} alt={flag}/>
				  
						<Button size="sm" className="flagButton" onClick={() => joinRoom(flag)} variant="outline-dark">Chat in {flag}</Button>

						</Card>
				
					)
				})}
           
               
            </div>

          
        </>
    )
}

export default Home;