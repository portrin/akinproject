'use strict';

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];


let AWS = require('aws-sdk');
// AWS.config.loadFromPath('./creds.json');
let Stream = require('stream');
let volume = require("pcm-volume");
let uuidV4 = require('uuid/v4');

let polly = new AWS.Polly();
let s3 = new AWS.S3();
let v = new volume();

let s3Bucket = "intern-temp-mp3";
let s3KeyPrefix = "polly/";




exports.handler = (event, context, callback) => {

    console.log(event);
    console.log(event.query);
    console.log(event.query.text);
    let synthCB = function(err, data){
        if (err){
            console.log(err);
            callback(err);
        } else {
            console.log(data);

            // if (data.AudioStream instanceof Buffer) {
            //  // Initiate the source
            //  var bufferStream = new Stream.PassThrough()
            //  // convert AudioStream into a readable stream
            //  bufferStream.end(data.AudioStream)
            //  // Pipe into Player
            //  v.pipe(Player);
            //  bufferStream.pipe(v);
            // }
            
            callback(null, data);
        } 
    }

    let params = {
        "OutputFormat": "mp3",
        "SampleRate": "16000",
        "Text": "Hello Hello Hello", // event.data.text
        "VoiceId": "Brian"
    };

    // polly.synthesizeSpeech(params, synthCB);
    polly.synthesizeSpeech(params, function (err, data) {
        if (err) callback(err);
        else {

            const mp3Key = s3KeyPrefix + uuidV4() + ".mp3";

            var s3Params = {
                Bucket: s3Bucket,
                Key: mp3Key,
                ACL: "public-read",
                Body: data.AudioStream,
                ContentType: "audio/mpeg"
            };

            s3.putObject(s3Params, function (err) {
                if (err) callback(err);
                else {
                    var twilioInstruction = "https://s3.amazonaws.com/" + s3Bucket + "/" + mp3Key;
                    callback(null, { "response": twilioInstruction });
                }
            });
        }
    });
}








