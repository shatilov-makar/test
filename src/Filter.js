
import { useEffect, useState } from "react";
import "./index.css";


export default function Filter(props) {

    const { video, fps, isPlaying } = props;

    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [gamma, setGamma] = useState(100);
    const brightnessSelector = document.getElementById('rangeBrightness');
    const contrastSelector = document.getElementById('rangeContrast');
    const gammaSelector = document.getElementById('rangeGamma');

    let pow = createGammaMatrix();

    function createGammaMatrix() {
        let arr = [];
        let level =  1.0 / (gamma / 100.0);
        for (let i = 0; i < 256; i++) {
            let value = (255 * Math.pow(i / 255.0, level) + 0.5);
            if (value > 255) value = 255;
            else if (value < 0) value = 0;
            else value = Math.floor(value);
            arr.push(value);
          }

        return arr;
    }


    useEffect(() => {
      if (isPlaying){
        playVideoCallback(true);
      }}
    , [isPlaying])

    useEffect(() => {
        if (video){
        pow = createGammaMatrix();
        playVideoCallback(true);
        }
    }, [gamma, brightness, contrast])

    const playVideoCallback = (isFirstCall) => {
        if ((brightnessSelector.value != brightness)
            || (contrastSelector.value != contrast) 
            || (gammaSelector.value != gamma)) {
            return;
        }
        computeFrame(brightness, contrast, gamma);
        if (isFirstCall || !video.paused)
            setTimeout(function () {
            playVideoCallback(false);
            }, fps);
    }
    const width = video.width;
    const height = video.height;
    const canvas = document.getElementById("my-canvas");

    function computeFrame(brightness, contrast, gamma) {
        const ctx1 = canvas.getContext("2d");
        ctx1.drawImage(video, 0, 0, width, height);
        

        const outImg = ctx1.createImageData(width, height);
        const dst = new Uint32Array(outImg.data.buffer);

        let frame = ctx1.getImageData(0, 0, width, height);
        const src = new Uint32Array(frame.data.buffer);

      
            TransformImage(brightness, contrast / 255, (gamma / 100).toFixed(2), src, dst);
        ctx1.putImageData(outImg, 0, 0);
        return;
    }


    //let brightnessMatrix = [];
  /*  const fillBrightnessMatrix = (value) => {
    
    }*/

  
 
    const TransformImage = (brightness, contrast, gamma, frame, dst) => {
        let avgGray;
        if (contrast)
            avgGray = getAvgGray();

        for (let i = 0; i < dst.length; i++) {
            let r = frame[i] & 0xFF;
            let g = (frame[i] >> 8) & 0xFF;
            let b = (frame[i] >> 16) & 0xFF;
           
            r = pow[r];
            g = pow[g];
            b = pow[b];
           
            r += brightness;
            g += brightness;
            b += brightness;

            if (avgGray){
                let gray = avgGray;
                r += (r - gray) * contrast;
                g += (g - gray) * contrast;
                b += (b - gray) * contrast;
            }
            if (r > 255) r = 255;
            else if (r < 0) r = 0;
            if (g > 255) g = 255;
            else if (g < 0) g = 0;
            if (b > 255) b = 255;
            else if (b < 0) b = 0;
            
            /*frame.data[i] = (frame.data[i] & 0xFF000000) | (b << 16) | (g << 8) | r;
            */
            dst[i] = (frame[i] & 0xFF000000) | (b << 16) | (g << 8) | r; 
          }

        function getAvgGray() {
            let avgGray = 0;
            for (let i = 0; i < dst.length; i++) {
                let r = frame[i] & 0xFF;
                let g = (frame[i] >> 8) & 0xFF;
                let b = (frame[i] >> 16) & 0xFF;
                avgGray += (r * 0.2126 + g * 0.7152 + b * 0.0722);
            }
            avgGray /= dst.length;
            return avgGray;
        }
    }

      
    return (
        <div>
            <canvas id="my-canvas" width="480" height="270"></canvas>
            <div className="video-params">
                <div>
                    <div>Яркость</div>
                    <input id="rangeBrightness" type="range" min="-255" max="255" value={brightness} 
                    onChange= {e => { setBrightness(parseInt(e.target.value))}} />
                    <span id="valueBrightness">{brightness}</span>
                </div>
                <div>
                    <div>Контрастность</div>
                    <input id="rangeContrast" type="range" min="-255" max="255" value={contrast}
                    onChange={e => setContrast(e.target.value)} />
                    <span id="valueContrast">{contrast}</span>
                </div>
                <div>
                    <div>Гамма</div>
                    <input id="rangeGamma" type="range" min="1" max="600" value={gamma} 
                    onChange={e => setGamma(e.target.value)}/>
                    <span id="valueGamma">{ (gamma / 100).toFixed(2)}</span>
                </div>
            </div>
            
        </div>
    )
}