const html = (img, name, artists, lyric) => `
    <div class="container">
      <div class="bg"></div>
      <div class="img">
        <img
          src="${img}"
          alt=""
        />
      </div>
      <div class="text">
        <div class="credits">
          <div class="name">${name}</div>
          <div class="artists">${artists}</div>
        </div>
        <div class="lyrics">
          <p>${lyric}</p>
        </div>
      </div>
      <div class="copy">@LyricsOOCBot</div>
    </div>
    `;
const css = img => {
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
      height: 1024px;
      width: 512px;
      position: relative;
      overflow: hidden;
      grid-gap: 50px;
      padding-top: 100px;
    }
    
    .container,
    .text {
      display: grid;
      grid-template-columns: 512px;
      grid-template-rows: min-content 1fr;
      justify-items: center;
    }
    
    .text {
      border-radius: 25px 25px 0 0;
      z-index: 2;
      background: linear-gradient(45deg, #6b00ff99, #62116220),
        linear-gradient(-45deg, #081f9187, #8c86ff40);
      padding: 40px 0;
      width: 100%;
    }
    
    .bg {
      background: url(${img});
      background-size: cover;
      background-position: center center;
      filter: blur(30px);
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      transform: scale(1.2);
    }
    
    .credits,
    .lyrics,
    .img {
      z-index: 2;
    }
    
    .credits,
    .lyrics {
      color: white;
    }
    
    .img {
      width: calc(512px - 75px);
      height: calc(512px - 75px);
    }
    
    .img > img {
      width: 100%;
      height: 100%;
      border-radius: 15px;
      object-fit: cover;
      object-position: center center;
      box-shadow: 0 25px 25px #00000060, 0 -25px 35px #ffffff20;
    }
    
    .name {
      font-size: 36px;
      font-weight: bold;
      text-shadow: 0 5px 12px #00000040;
    }
    .artists {
      font-size: 24px;
      opacity: 0.75;
      text-shadow: 0 5px 12px #00000040;
    }
    
    p {
      margin: 0 !important;
      padding: 0 !important;
      margin-right: 0 !important;
      display: flex;
      font-size: 36px;
      font-weight: 400;
      text-shadow: 0 5px 10px #00000070;
      font-style: italic;
    }
    
    .lyrics {
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: calc(512px - 90px);
    }
    
    .credits {
      color: #fff;
      display: flex;
      flex-direction: column;
      width: calc(512px - 90px);
      padding: 0 45px;
      height: min-content;
      margin-bottom: 50px;
    }
    
    .copy {
      position: absolute;
      bottom: 20px;
      left: 20px;
      color: white;
      opacity: 0.25;
      font-size: 18px;
      z-index: 3;
    }    
        `

  }
}
module.exports = {
  html,
  css
};