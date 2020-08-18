'use strict';
const express = require('express');
const config = require('./config');
const artists = require('./artists');
const lyricsUtil = require('./utils/lyrics.util');
const fs = require('fs');
const Twit = require('twit');
const app = express();
var params = { Bucket: 'lyricsooc', Key: 'tweets.data' }
const AWS = require('aws-sdk');
const router = express.Router();

const s3 = new AWS.S3({
    accessKeyId: config.AWS_KEYS.access_key_id,
    secretAccessKey: config.AWS_KEYS.secret_access_key
});


router.get('/', function (req, res) {
    res.status(200).send('hola mundo')
});
app.use('/', router);
app.listen((process.env.PORT || 8080), () => {
    console.log(`Servidor iniciado en https://lyrics-ooc.herokuapp.com:${(process.env.PORT || 8080)}`)
});


const twit = new Twit({
    consumer_key: config.twitter_API.api_key,
    consumer_secret: config.twitter_API.api_key_secret,
    access_token: config.twitter_API.access_token,
    access_token_secret: config.twitter_API.access_token_secret
});

const getFile = async () => {

}

const getPostedTweets = () => {
    return (fs.readFileSync("tweets.data").toString('utf-8')).split(',').filter(el => el != '');
};

const writeIdTweet = async id => {
    const append = `,${id}`
    await fs.writeFile('tweets.data', append, err => {
        if (err) throw err;
    });
};

const uploadFile = async id => {
    await s3.getObject(params, async (err, data) => {
        let ids = data.Body.toString('utf-8');
        ids += `,${id}`;
        const file = Buffer.from(ids);
        // Setting up S3 upload parameters
        const params = {
            Bucket: config.AWS_KEYS.bucket,
            Key: 'tweets.data', // File name you want to save as in S3
            Body: file
        };

        // Uploading files to the bucket
        await writeIdTweet(ids);
        await s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });
    });
};
uploadFile('');

const fetchTweet = () => {
    twit.get('search/tweets', { q: '@LyricsOOCbot -from:@LyricsOOCbot -RT', count: 5, result_type: 'recent' }, async function (err, data, response) {
        if (data && !err && data.statuses) {
            console.log(data.statuses.length);
            for (let el of data.statuses) {
                if (!getPostedTweets().includes(el.id_str)) {
                    await uploadFile(el.id_str);
                    console.log('Got tweet: ' + el.text)
                    if (el.user.id != config.twitter_API.userId) {
                        const text = el.text
                            .replace(/@LyricsOOCbot/g, '')
                            .replace(/(@\S+)/gi,'')
                            .replace(/ +(?= )/g,'');
                        await createMedia(text, { tweetId: el.id, user: `@${el.user.screen_name}`, tweetIdStr: el.id_str });
                    }
                } else {
                    console.log('invalid tweet: [' + el.id_str + '] [' + el.text + ']');
                }
            }
        } else {
            if (data) console.log(data);
            if (err) console.log(err);
            console.error('err: data invalid')
        }
    });
};

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
}

const postMedia = (filename, name, artists, reply) => {
    twit.postMediaChunked({ file_path: filename }, function (err, data, response) {
        if (data) {
            console.log('Media uploaded')
        }
        const mediaIdStr = data.media_id_string
        const meta_params = { media_id: mediaIdStr }
        twit.post('media/metadata/create', meta_params, function (err, data, response) {
            fs.unlinkSync(filename);
            if (!err) {
                let params = { status: `${name} by ${artists}`, media_ids: [mediaIdStr] };
                if (reply != undefined) {
                    params = { ...params, in_reply_to_status_id: reply.tweetIdStr,  in_reply_to_status_id_str: reply.tweetIdStr };
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



setTimeout(() => {
    fetchTweet();
    postRandom();
}, 2000);

setInterval(() => {
    fetchTweet();
}, 30000);

setInterval(() => {
    console.log('Posting random');
    postRandom();
}, 2700000);

