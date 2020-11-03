'use strict'

const Fs = require('fs')  
const Path = require('path')  
const Axios = require('axios').default
const ProgressBar = require('progress')
const Url = require('url');
const parse = require('csv-parse/lib/sync');

try {
  main()
} catch (err) {
  console.error(err)
}

async function main() {
  // get args
  var myArgs = process.argv.slice(2);
  if (myArgs.length < 1) {
    throw 'NotEnoughArgs'
  }

  // get time
  const now = Date.now()

  // csv parser
  const linkFile = Fs.readFileSync(__dirname+'/links.csv')
  const episodes = parse(linkFile, {
    columns: true,
    skip_empty_lines: true
  })
  // console.log(episodes)

  for (var ep of episodes) {
    console.log(ep['URL'])
    const epUrl = new URL(ep['URL'])

    // make sure link is current
    const expiry = new Date(epUrl.searchParams.get('expires') * 1000)
    console.log(expiry)
    if (now > expiry) throw 'LinkIsOld' // TODO make new csv for files with old links

    // get file name
    var epFile = epUrl.pathname.substring(epUrl.pathname.lastIndexOf('/') + 1)
    console.log(epFile)
    var fileType = epFile.substring(epFile.lastIndexOf('.') + 1)
    console.log(fileType)
    // downloadFile()
  }
}

async function downloadFile () {  
  const url = new URL('https://cdn7.cloud9xx.com/user1342/ffac3a84fe7ad0e83052eb9724d0328f/EP.1.720p.mp4?token=n0Pp6FKUkhzNxV7u_0yp-w&expires=1604395489&id=78966');

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