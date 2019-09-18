'use strict';

const KeywordExtraction = require("./keyword-extraction.js"),
    express = require('express'),
    multer = require('multer'),
    upload = multer({storage: multer.memoryStorage()}),
    app = express();

const PORT = 8080;
const TIMEOUT = 10 * 60 * 1000;

let chunkUpload = upload.single('chunk');
let server = app.listen( PORT );
server.setTimeout( TIMEOUT );

let timingStart = 1 * new Date;

function timing( startTime ) { return (1 * new Date) - startTime; }

// READY WEBHOOK
app.get('/readyz', (req, res) => {
    res.status(200).send('OK');
});

// PROCESS WEBHOOK
app.post('/process', chunkUpload, async (req, res)=>{

    try {
        let buffer = req.file.buffer.toString();
        console.log("\n ---------->  buffer was " + buffer);
        console.log("\nBody was: \n" + JSON.stringify(req.body,null,4));

        timingStart = 1 * new Date;
        let output = KeywordExtraction.getOutput( buffer, null );
        let elapsed = timing(timingStart);
        var totalwords = buffer.split(" ").length;
        var rate = (totalwords/elapsed).toPrecision(4);
        console.log( "Processing rate was " + rate  + " words per ms, with a sample of N=" + totalwords + " words." );
console.log("Elapsed time: " + elapsed + " ms");

        res.header("Content-Type", "application/json");
        return res.status(200).send( output );
    } catch (error) {
        return res.status(500).send(error);
    }
});
