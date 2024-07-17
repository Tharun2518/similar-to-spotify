//To play only one audio at a time i will change src on click event
let playedAudio = new Audio();

// Variable to keep track of the current playing index
let currentIndex = 0;
let currFolder;
const songBar =document.querySelector('.addSong');
const cards =document.querySelectorAll('.card');
const prev = document.querySelector('#prev');
const next=document.querySelector('#next');
const seekbar=document.querySelector('.seekbar');
let songs = [];
let songNames=[];

//getting a folder where songs are present
getSongsFolder =async(folder)=>{
    currFolder=folder;
    let data = await fetch(`https://github.com/Tharun2518/similar-to-spotify/songs/${folder}/song.html`);
    let response = await data.text();
    let songs_cont =document.createElement("div");
    songs_cont.innerHTML=response;
    return songs_cont;
}

//getting songs link
const getSongs=async()=>{
    const songs_cont = await getSongsFolder(currFolder);
    const song_links =songs_cont.querySelectorAll("a");
    songs=[];
    for(let i=0;i<song_links.length;i++){
        const element = song_links[i];
        if(element.href.endsWith(".mp3")){
                songs.push(element.href);
        }
    }
    
}

//getting song name
const getSongName =async()=>{
    const songs_cont = await getSongsFolder(currFolder);
    const songLinks= songs_cont.querySelectorAll('a');
    songNames=[];
    for(let i=0;i<songLinks.length;i++){
        songNames.push(songLinks[i].innerHTML);
    }

}

//To correct the song link
function insertString(originalString, stringToInsert, index) {
    let array = originalString.split(''); // Convert string to array
    array.splice(index, 0, stringToInsert); // Use splice to insert the string
    return array.join(''); // Convert array back to string
}
//defining play song function
const playSong = (link,Name)=>{
    playedAudio.src=insertString(link,`songs/${currFolder}/`,22);
    playedAudio.play();
    play.src="Images/play.svg";
    document.querySelector('.info').innerHTML=Name;
}

//Formatting the time
function formatTime(seconds) {
    // Calculate whole minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.round(seconds % 60); // Round to nearest whole second

    // Ensure minutes and seconds are always two digits (e.g., 05 instead of 5)
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return formatted time string
    return `${formattedMinutes}:${formattedSeconds}`;
}



//Implementing main function
const main =async()=>{
    //getting songs an dits name
     await getSongs();
    await getSongName();

    //Clearing the existing playlists
    songBar.innerHTML = '';
   
    let index;
    //getting songs in playlists
    for(index=0;index<songNames.length;index++){
        const songName =songNames[index];
        const songLink = songs[index];
        songBar.innerHTML =songBar.innerHTML+`<li>${songName} <img src="Images/pause.svg" alt="play"></li>`;
    }

    //getting all songs in playlists
    
    const songItems = document.querySelectorAll('.addSong li');
    // Adding click event listeners to each song item
    songItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            playSongByIndex(index);
        });
    });
    
}

// Function to play a song by index
const playSongByIndex = (index) => {
    if (index >= 0 && index < songs.length) {
        currentIndex = index;
        const songLink = songs[currentIndex];
        const songName = songNames[currentIndex];
        playSong(songLink, songName);
    }
};


    playedAudio.pause();
    //Adding click event to pause,next,play button
    play.addEventListener('click', () => {
        if (playedAudio.paused) {
            playedAudio.play();
            play.src="Images/play.svg";
        
        } else {
            playedAudio.pause();
            play.src="Images/pause.svg";
        }
    });

    prev.addEventListener('click',()=>{
        currentIndex = (currentIndex - 1+songs.length) % songs.length;
        playSongByIndex(currentIndex);
    })

    next.addEventListener('click',()=>{
        currentIndex = (currentIndex + 1) % songs.length;
        playSongByIndex(currentIndex);
    })

    //Updating the time
    playedAudio.addEventListener('timeupdate',()=>{
        document.querySelector('.duration').innerHTML=`${formatTime(playedAudio.currentTime)}/${formatTime(playedAudio.duration)}`;
        document.querySelector('.circle').style.left=(playedAudio.currentTime/playedAudio.duration)*100 +'%';   

        const seekbar = document.querySelector('.seekbar');
        seekbar.style.background = `linear-gradient(to right, green ${(playedAudio.currentTime/playedAudio.duration)*100}%, #fff ${(playedAudio.currentTime/playedAudio.duration)*100}% 100%)`;
    })

    //Adding event listener to seek bar.
    
    seekbar.addEventListener('click',(e)=>{
        let value =(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector('.circle').style.left=value+'%';
        playedAudio.currentTime= (value*playedAudio.duration)/100;
    });


    //Adding Volume 
    document.querySelector('#volume').addEventListener('change',(e)=>{
        const value = e.target.value;
        // Convert linear scale (0-100) to logarithmic scale
        const volume = Math.log10((value / 100) * 9 + 1);
        playedAudio.volume = volume;
    })   

//Load the palaylist whenever the cards are clicked

const returnFolder = () => {
    cards.forEach(card => {
        card.addEventListener('click',async (event) => {
            currFolder = event.currentTarget.getAttribute('data-folder');
           await main(); // Reinitialize the player after selecting folder
        });
    });
};

returnFolder();

