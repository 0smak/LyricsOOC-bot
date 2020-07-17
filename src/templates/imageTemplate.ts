export const template = {
    html: (img: string, name: string, artists: string, lyric: string) => `
    <div class="container">
        <div class="bg"></div>
        <div class="left">
          <div class="img">
            <img src="${img}" alt="">
          </div>
        </div>
        <div class="right">
            <div class="credits">
              <div class="name">
                ${name}
              </div>
              <div class="artists">${artists}</div>
            </div>
            <div class="lyrics"><p>${lyric}</p></div>
        </div>
    </div>
    `,
    css: (img: string) => {
        return {
            content: `
            @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');

            * {
            font-family: 'Source Sans Pro', sans-serif;
            }
            body {
            margin: 0;
            }
            
            .container {
            width: 1200px;
            height: 625px;
            position: relative;
            overflow: hidden;
            display: grid;
            grid-template-columns: 50% 50%;
            }
            
            .bg {
            background: url(${img});
            background-size: cover;
            background-position: center center;
            filter: blur(5px);
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            transform: scale(1.02);
            }
            
            .right {
            height: 100%;
            width: 100%;
            background: #000000dd;
            z-index: 2;
            color: white;
            display: flex;
            flex-direction: column;
            align-items:center;
            justify-content: center;
            position: relative;
            }
            
            .left {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #00000040;
            z-index: 2;
            }
            
            .img > img {
            width: 250px;
            height: 250px;
            border-radius:100%;
            border: 2px solid white;
            object-fit: cover;
            object-position: center center;
            }
            
            .name {
            font-size: 36px;
            font-weight: bold;
            }
            .artists {
            font-size: 24px;
            opacity: .75;
            }
            
            p {
            margin: 0 !important;
            padding: 0 !important;
            margin-right: 0 !important;
            display: flex;
            font-size: 36px;
            font-weight: 400;
            font-style: italic;
            }
            
            .lyrics {
            display: flex;
            justify-content: center;
            max-width: 75%;
            }
            
            .credits {
            position: absolute;
            left: 20px;
            bottom: 20px;
            display: flex;
            flex-direction: column-reverse;
            }      
        ` 
 
        }
    }
}