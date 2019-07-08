import qrcode from 'qrcode';
import streams from 'memory-streams';
import stream from 'stream';

const PNG = require('pngjs').PNG;

/**
 * QR encoder for a given text
 * @param text string
 * @returns {Promise<Buffer|Error>}
 */
const encode = text => new Promise((resolve, reject) => {
  qrcode.toBuffer(
    text,
    {
      errorCorrectionLevel: 'H',
      scale: 10,
    }
  ).then(buffer => {
    let writer = new streams.WritableStream();
    writer.on('finish', () => {
      resolve(writer.toBuffer());
    });
    writer.on('error', (error) => {
      reject(new Error(error));
    });

    let bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    let template = new PNG({colorType: 2});

    bufferStream.pipe(template)
      .on('parsed', () => {
        template.pack().pipe(writer);
      })
      .on('error', (e) => {
        console.error(e);
      });
  })
});

export default {
  encode,
}
