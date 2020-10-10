'use strict';
const config = require('./config');
const artists = require('./artists');
const lyricsUtil = require('./utils/lyrics.util');
const fs = require('fs');
const Twit = require('twit');
var params = { Bucket: 'lyricsooc', Key: 'tweets.data' };
const paramsIMG = { Bucket: 'lyricsooc', Key: 'generated.png' };
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: config.AWS_KEYS.access_key_id,
    secretAccessKey: config.AWS_KEYS.secret_access_key
});

const twit = new Twit({
    consumer_key: config.twitter_API.api_key,
    consumer_secret: config.twitter_API.api_key_secret,
    access_token: config.twitter_API.access_token,
    access_token_secret: config.twitter_API.access_token_secret
});

async function getPostedTweets() {
    const data = await s3.getObject(params).promise();
    return (data.Body.toString('utf-8')).split(',').filter(el => el != '');
};



async function uploadFile(id) {
    await s3.getObject(params, async function (err, data) {
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
        await s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            return;
        });
    });
};

async function fetchTweet() {
    await twit.get('search/tweets', { q: '@LyricsOOCbot -from:@LyricsOOCbot -RT', count: 5, result_type: 'recent' }, async function (err, data, response) {
        if (data && !err && data.statuses) {
            console.log(data.statuses.length);
            for (let el of data.statuses) {
                const posted = await getPostedTweets();
                if (!posted.includes(el.id_str)) {
                    await uploadFile(el.id_str);
                    console.log('Got tweet: ' + el.text)
                    if (el.user.id != config.twitter_API.userId) {
                        const text = el.text
                            .replace(/@LyricsOOCbot/g, '')
                            .replace(/(@\S+)/gi, '')
                            .replace(/ +(?= )/g, '');
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
        await postMedia(imageData.filename, imageData.name, imageData.artists, reply);
    }
}


const postRandom = async () => {
    const imageData = await lyricsUtil.createImage(undefined, artists.getRandomArtist());
    console.log('[imageData@postRandom()]: ' + JSON.stringify(imageData))
    if (imageData != null) {
        return await postMedia(imageData.filename, imageData.name, imageData.artists);
    }
}

async function postTweet(params) {
    return new Promise(async resolve => {
        return await twit.post('statuses/update', params, function (err, data, response) {
            console.log('tweet posted!');
            resolve(data);
        })
    });
}

async function createMetadata(filename, name, artists, reply, meta_params) {
    return new Promise(async resolve => {
        return await twit.post('media/metadata/create', meta_params, async (err, data, response) => {
            fs.unlinkSync(filename);
            if (!err) {
                let params = { status: `${name} by ${artists}`, media_ids: [meta_params.media_id] };
                if (reply != undefined) {
                    params = { ...params, in_reply_to_status_id: reply.tweetIdStr, in_reply_to_status_id_str: reply.tweetIdStr };
                    params.status = `${reply.user} ${params.status}`
                }
                resolve(params);
            }
        });
    });
}

async function uploadMedia(filename) {
    return new Promise(async resolve => {
        return await twit.postMediaChunked({ file_path: filename }, async (err, data, response) => {

            if (data) {
                console.log('Media uploaded');
            } else {
                console.log('error');
                console.err(err);
            }
            const mediaIdStr = data.media_id_string;
            const meta_params = { media_id: mediaIdStr };
            resolve(meta_params);
        })
    });
}

async function postMedia(filename, name, artists, reply) {
    const meta_params = await uploadMedia(filename);
    console.log(`meta_params: ${JSON.stringify(meta_params)}`)
    const _params = await createMetadata(filename, name, artists, reply, meta_params);
    console.log(`_params: ${JSON.stringify(_params)}`)
    const post = await postTweet(_params);
    console.log(`post: ${JSON.stringify(post)}`);
    return post;

}




module.exports = {
    fetchTweet,
    postRandom,
    postMedia
}