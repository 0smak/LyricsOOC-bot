<p align="center">
  <img src="https://i.imgur.com/7TB7mA8.jpg" width="125px"/>
</p>

# LyricsOOC Bot



* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Set up the artists](#set-up-the-artists)
* [Customize the image](#customize-the-image)

## About The Project

<p align="center">
  <a href="https://twitter.com/LyricsOOCbot/status/1295130336343601158">
    <img src="https://i.imgur.com/sWKYD0o.png" width="40%"/>
  </a>
  <a>
    <img width="55%" src="https://pbs.twimg.com/media/Efk6K3eXkAAh36t?format=jpg&name=medium"/>
  </a>
</p>

LyricsOOC Bot is a Twitter bot that post generated images with a random lyric from a random song and artist each 45 minutes.
Also you can mention [the bot](https://twitter.com/LyricsOOCBot) with the name of a song and if it's posible the artists and the bot will reply you with an image with the song you mentioned and a lyric 


### Built With

The project is built mainly with node.js, also I use the Genius API to get the songs with the help of Axios, Lyricist to fetch the lyrics of the song, Puppeteer that let me create an image from a screenshot of an html and css template I made, Twit that is a library to use the Twitter API and some extra libraries to use S3.

The bot is deployed on Heroku and S3 from Amazon Web Services 

* [NodeJS](https://nodejs.org/en/)
* [Puppeteer](https://github.com/puppeteer/puppeteer)
* [Genius API](https://genius.com/developers)
* [Axios](https://github.com/axios/axios)
* [Twit](https://github.com/ttezel/twit)
* [Lyricist](https://github.com/scf4/lyricist)
* [AWS SDK](https://aws.amazon.com/es/sdk-for-node-js/)

## Getting Started

### Prerequisites

To install this bot you need Genius, Twitter and AWS credentials and a bucket in S3

#### Genius Credentials

You need an id, a secret key and a token to consume Genius API, you can get it [here](http://genius.com/api-clients)

#### Twitter Credentials

You also need Twitter credentials, in this case you have to fill a form and twitter have to approve your app, in [this page](https://developer.twitter.com/en) you can register your app and get access to the API

#### AWS

Create a S3 in Amazon Web Service, a bucket and get the credentials and setup in the config file.

---

Then you have to setup all of the keys in the config file in `src/config.js`

```javascript
const genius_API = {
  id: 'aaa',
  secret: 'bbb',
  token: 'ccc'
}
const twitter_API = {
  userId: 'id',
  api_key: 'aaa',
  api_key_secret: 'bbb',
  bearer_token: 'ccc',
  access_token: 'ddd',
  access_token_secret: 'eee'
}

const AWS_KEYS = {
  access_key_id: 'aaa',
  secret_access_key: 'bbb',
  bucket: 'your-bucket-name'
};
```

### Installation

_LyricsOOC-Bot requires NodeJS_

Clone the repository, install the dependencies and devDependencies from package.json and start the server

```bash
git clone https://github.com/0smak/LyricsOOC-bot # clone the repository
npm install # install the dependencies and devDependencies
npm start # start the server
```

## Usage

* To start the server just type in your terminal `npm start`
* The bot will post images each 45 minutes
* You can mention the bot (in this case you have to configure your username in `src/server.js` from fetchTweet() function) and it will reply you with a lyric image

<p align="center"><img src="https://i.imgur.com/3mDkKof.png" width="50%"/><p>

## Set up the artists

If you want to customize the artists list you have to add the artist id in the array in `src/artists.js`. You can get the id making a search petition in the Genius API with a song from the artist, and in the response you will get the id

The artist list that is configured is the next one:

```javascript
const id = [
    213513, // Yung Beef
    2109193, // Young Palmera
    572681, // GOA
    589212, // Kaydy Cain
    1006913, // Khaled
    1584157, // Albany
    1034789, // La Zowi
    540389, // Takers
    1761506, // Louis9k
    1450842, // Bea Pelea
    626432, // La Goony Chonga
    463998, // Dellafuente
    1442194, // Papi Trujillo
    1338048, // MC Buzzz
    615608, // Israel B
    585297, // Cecilio G
    680563, // Soto Asa
    1091094, // Space Surimi
    1106559, // Pedro Ladroga
    222327, // Trapani
    52857, // Erik Urano
    1650033, // hwoarang
    1194, // Soulja Boy
    16808, // Chief Keef
    48746, // Viper
    259178, // El mini
    673865, // Bad Gyal
    56991, // C. Tangana
    624481, // Anuel AA
    690350, // Bad Bunny
    223925, // J Balvin
    582612, // Cruz Cafuné
    207701, // Myke Towers
    452856, // El Alfa
    166709, // Quimico Ultra Mega
    1554904, // El Virtual
    654902, // LMDA
    247015, // Sticky MA
    1851263, // L'haine
    1835333, // Chico Blanco
    269600, // Darell
    1202698, // Sech
];
```

## Customize the image

You can edit the html/css template to generate a different image with differents styles, in `src/templates/imageTemplate.js` you can access to html and css styles that is returned from a function that have the song info as parameters of the function 

```javascript
const html = (img, name, artists, lyric) => `
    <!-- your custom html, remove the lines below or edit it -->
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
    `;
const css = img => {
  return {
    content: `
            /* Font from Google fonts, you can change it if you want */
            @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');
            * {
              font-family: 'Source Sans Pro', sans-serif;
            }
            
            /** Your custom css **/
        `
  }
}
```
