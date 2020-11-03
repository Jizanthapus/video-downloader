'use strict'

const Fs = require('fs')  
const Path = require('path')  
const Axios = require('axios').default
const ProgressBar = require('progress')
const Url = require('url');
var csv = require('csv');

// get args
var myArgs = process.argv.slice(2);
if (myArgs.length < 2) {
  throw 'NotEnoughArgs'
}

// setup csv parser
var parser = csv.parse({columns: true}, function (err, records) {
	console.log(records);
});

// pipe file into csv parser
Fs.createReadStream(__dirname+'/MSG Downloads.csv').pipe(parser);

async function downloadImage () {  
  const url = new URL('https://cdn7.cloud9xx.com/user1342/ffac3a84fe7ad0e83052eb9724d0328f/EP.1.720p.mp4?token=n0Pp6FKUkhzNxV7u_0yp-w&expires=1604395489&id=78966');
  // TODO check to see if link is expired before downloading

  console.log('Connecting …')
  const { data, headers } = await Axios({
    url: url.toString(),
    method: 'GET',
    responseType: 'stream'
  })
  const totalLength = headers['content-length']

  console.log('Starting download')
  const sizeInMB = sizeInMB/Math.pow(10, 6)
  const sizeString = parseFloat(sizeInMB.toFixed(2), 10)
  console.log(`Content length: ${sizeString} MB`)
  const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(totalLength)
  })

  const writer = Fs.createWriteStream(
    Path.resolve(__dirname, 'downloads', 'Mobile Suit Gundam', 'Mobile Suit Gundam s01ep01.mp4')
  )

  data.on('data', (chunk) => progressBar.tick(chunk.length))
  data.pipe(writer)
}

// downloadImage()

