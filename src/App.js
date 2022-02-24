import "./index.css";
import playIcon from "./static/method-draw-image.svg";
import pauseIcon from "./static/method-draw-image-1.svg";
import reloadIcon from './static/reload.svg'
import Filter from './Filter.js'
import useVideoPlayer from "./hoks/useVideoPlayer";

import { useEffect, useState, useRef } from "react";


export default function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReload, setIsReload] = useState(false)

  const [videoLength, setVideoLength] = useState(0)
  const [video, setVideo] = useState('')
  const [begun, setBegun] = useState('')
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false)
  const videoElement = useRef(null);

  let a;
  let w = 0;

  const {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
  } = useVideoPlayer(videoElement);

 /* const play = () => {
    if (videoLength === 0){
        setVideoLength(video.duration)
    }
      begun.style.animationPlayState = 'running'
      begun.classList.add('animation');
      let root = document.documentElement;
      //void begun.offsetWidth;
      const vLength = (isReload || !videoLength) ? video.duration : videoLength;
      setIsPlaying(true);
      setIsReload(false);
      root.style.setProperty('--begunok-duration', `${vLength}s`);
      //setIsPlaying(true)
      video.play();//.then(() => {
      //  playVideoCallback();
    //  });

  };
*/
 /* const reload = () => {
    console.log(video.duration)
    setVideoLength(video.duration)
    let root = document.documentElement;
    root.style.setProperty('--from-width', `1px`);
    begun.classList.add('stop-video');
    void begun.offsetWidth;
    begun.classList.remove("stop-video");
    play()
  }

  const pause = () => {
    new Promise((resolve, reject) => {
      begun.style.animationPlayState = 'paused';
      resolve()
    }).then(() =>  video.pause());
     setIsReload(false);
     setIsPlaying(false)
  }*/

  /*function scrollVideo(e) {
    if (video.ended){
      play();
    }
    let root = document.documentElement;
    const coords = e.clientX - e.target.getBoundingClientRect().left;
    let time = (coords / 454) * video.duration;
    video.currentTime = time;
    w = coords;
    begun.classList.add('stop-video');
    begun.style.width = coords + "px";
    void begun.offsetWidth;
    begun.classList.remove('stop-video');
    root.style.setProperty('--from-width', coords + "px");
    const newDuration = (video.duration - video.currentTime);
    root.style.setProperty('--begunok-duration', `${newDuration}s`);
    setVideoLength(newDuration);
  }
*/
  useEffect(() => {
    setVideo(document.getElementById("my-video"));
    setBegun( document.getElementById("begunok"))
  }, [start]);
 
  const onEndedVideoHandler = () => {
  //  setIsPlaying(false);
    setIsReload(true);
  }

  const VideoControll = () => {
    return (
          <div className="video-controll">
              <div>
            {playerState.isPlaying ? (
                <img
                src={pauseIcon}
              alt="pause"
              className="pause-video"
              onClick={togglePlay}
              />
            ) : isReload ? (
            <img
            src={reloadIcon}
            alt="reload"
            className="reload-video"
            onClick={() => {setIsReload(false); togglePlay()}}
            />) :
            <img
            src={playIcon}
            alt="play"
            className="start-video"
            onClick={togglePlay}
            />
            }
            </div>
            <input style={{width: "100%"}}
                  type="range"
                  min="0"
                  max="100"
                  value={playerState.progress}
                  onChange={(e) => handleVideoProgress(e)}
              />

              <select
                  value={playerState.speed}
                  onChange={(e) => handleVideoSpeed(e)}>
                  <option value="0.50">0.50x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="2">2x</option>
          </select>
        </div>
    )
  }



  return (
    <div className="back">
      <video id="my-video" width="480" height="270" crossOrigin="anonymous" 
      ref={videoElement}
      onTimeUpdate={handleOnTimeUpdate}
      onEnded={onEndedVideoHandler}>
        <source
          src="http://jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm"
          type="video/webm"
        />
      </video>
      {
        <div className='display'>
              <Filter video={video} fps={41} isPlaying={playerState.isPlaying}></Filter>
              <div className="video-controll">
                <div>
              {playerState.isPlaying ? (
                  <img
                  src={pauseIcon}
                alt="pause"
                className="pause-video"
                onClick={togglePlay}
                />
              ) : isReload ? (
              <img
              src={reloadIcon}
              alt="reload"
              className="reload-video"
              onClick={() => {setIsReload(false); togglePlay()}}
              />) :
              <img
              src={playIcon}
              alt="play"
              className="start-video"
              onClick={togglePlay}
              />
              }
              </div>
              <input style={{width: "100%"}}
                    type="range"
                    min="0"
                    max="100"
                    value={playerState.progress}
                    onChange={(e) => handleVideoProgress(e)}
                />

                <select
                    value={playerState.speed}
                    onChange={(e) => handleVideoSpeed(e)}>
                    <option value="0.50">0.50x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="2">2x</option>
            </select>
          </div>
        </div>        
      }

    </div>
  );
}


/*
<div className="box" onClick={scrollVideo}>
          <div id="begunok" ></div>
        </div>
 */



