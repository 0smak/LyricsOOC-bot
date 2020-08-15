const config = require('../config');
const artists = require('../artists');
const lyricsUtil = require('../utils/lyrics.util');
const GeniusService = require('../services/genius.service');
const fs = require('fs');
const Twit = require('twit');

let twit;

const start = async () => {
    twit = await new Twit({
        consumer_key: config.twitter_API.api_key,
        consumer_secret: config.twitter_API.api_key_secret,
        access_token: config.twitter_API.access_token,
        access_token_secret: config.twitter_API.access_token_secret
    });
    console.log(twit)
    mentionsStream();
    postRandom();
}

const mentionsStream = () => {
    console.log('[mentionStream] started');
    
    const stream = twit.stream('statuses/filter', { track: ['@LyricsOOCbot', 'LyricsOOCbot'] })
    stream.on('tweet', function (tweet) {
        console.log('Got tweet: ' + tweet.text)
        console.log(tweet);
        if(tweet.user.id != config.twitter_API.userId) {
            const text = tweet.text.replace(/@LyricsOOCbot/g, '');
            createMedia(text, {tweetId: tweet.id_str, user: `@${tweet.user.screen_name}`});
        }
    });
}

const createMedia = async (text, reply = undefined) => {
    console.log('[createMedia] ' + text)
    const imageData = await lyricsUtil.createImage(text);
    if (imageData != null) {
        postMedia(imageData.filename, imageData.name, imageData.artists, reply);
    }
}


const postRandom = async () => {
    const imageData = await lyricsUtil.createImage(undefined, artists.getRandomArtist());
    if (imageData != null) {
        postMedia(imageData.filename, imageData.name, imageData.artists);
    }
    await delay(1800000);
    postRandom();
}

const delay = ms => new Promise(r => setTimeout(r, ms));


const postMedia = (filename, name, artists, reply) => {
    twit.postMediaChunked({ file_path: filename }, function (err, data, response) {
        if (data) {
            console.log('Media uploaded')
        }
        const mediaIdStr = data.media_id_string
        const meta_params = { media_id: mediaIdStr }
        twit.post('media/metadata/create', meta_params, function (err, data, response) {
            fs.unlinkSync(filename);
            if (data) {
                console.log('set metadata');
                console.log('data: ')
            }
            if (!err) {
                let params = { status: `${name} by ${artists}`, media_ids: [mediaIdStr]};
                if (reply != undefined) {
                    params = {...params,  in_reply_to_status_id: reply.tweetId};
                    params.status = `${reply.user} ${params.status}`  
                }
                console.log(params)
                twit.post('statuses/update', params, function (err, data, response) {
                    console.log('tweet posted!');
                })
            }
        })
    })


}

module.exports = {
    start,
}