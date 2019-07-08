import PDFDocument from 'pdfkit2';
import sections from '../assets/pdf/sections'
import types from '../assets/pdf/types'
import streams from 'memory-streams';

class Pdf {
  /**
   * Creates a new instance of this class.
   * @param metadata <Object> Data to be rendered into the pdf.
   * @param qrcode <Buffer> RGB PNG eventualPdfBuffer.
   */
  constructor(metadata, qrcode) {
    this.params = metadata;
    this.qrcode = qrcode;
    this.document = new PDFDocument({
      size: 'letter',
      layout: 'portrait',
      margins: sections.margins,
      compress: false
    });
    /**
     * {Promise<Buffer|Error>} Eventual PDF buffer.
     */
    this.eventualPdfBuffer = this.toEventualBuffer();
  }

  /**
   * Creates a new instance of the Pdf class.
   * @param metadata <Object> Data to be rendered into the pdf.
   * @param metadata.studentId <String> Student ID.
   * @param metadata.studentName <String> Student name.
   * @param metadata.courseName <String> Course name.
   * @param metadata.courseIntensity <String> Course intensity.
   * @param metadata.courseStartDate <String> Course starting date.
   * @param metadata.courseFinishDate <String> Course finishing date.
   * @param qrcode <Buffer> RGB PNG Buffer.
   * @returns {Pdf|Error}
   */
  static create(metadata, qrcode = null) {
    if (Object.keys(metadata).length !== 6)
      return new Error('Wrong parameters');
    return new Pdf(metadata, qrcode);
  }

  get [Symbol.toStringTag]() {
    return 'Pdf';
  }

  /**
   * Gets an eventual buffer of this Pdf.
   * @returns {Promise<Buffer|Error>}
   */
  toEventualBuffer() {
    return new Promise((resolve, reject) => {
      let writer = new streams.WritableStream();
      writer.on('finish', () => {
        resolve(writer.toBuffer());
      });
      writer.on('error', (e) => {
        reject(new Error(e));
      });
      this.document.pipe(writer);
      if (this.qrcode)
        renderImage(this.document, {img: this.qrcode, x: 20, y: 20, width: 100, height: 100});
      sections.set(this.params);
      types.standard.images.forEach((image) => {
        renderImage(this.document, image)
      });
      types.standard.text.forEach((section) => {
        renderSection(this.document, section)
      });
      types.standard.lines.forEach((line) => {
        renderLine(this.document, line);
      });
      this.document.end();
    });
  }
}

/**
 * Adds images to the PDF instance.
 * @param document <PDFDocument> PDFDocument instance.
 * @param image <Object> image to be rendered into the pdf buffer.
 * @param image.img <Buffer|String> Render a buffer of the image directly into the pdf buffer. If it's a string, opens it through file system utilities.
 * @param image.x <Number> A float number indicating the X position. If missing, PDFKit will place it where it fits better.
 * @param image.y <Number> A float number indicating the Y position. If missing, PDFKit will place it where it fits better.
 * @param image.width <Number> A float number indicating the image width. If missing, original width will be used.
 * @param image.height <Number> A float number indicating the height. If missing, original height will be used.
 */
const renderImage = (document, image) => {
  const {img, x, y, width, height} = image;
  document.image(img, {x, y, width, height});
};

/**
 * Adds text to the PDF instance.
 * @param document <PDFDocument> PDFDocument instance.
 * @param section <Object> Section to be rendered into the pdf buffer.
 * @param section.size <Number> An integer telling the font size.
 * @param section.font <String> Font's name.
 * @param section.str <String> Section text.
 * @param section.x <Number> A float number indicating the X position of the text within the pdf.
 * @param section.y <Number> A float number indicating the Y position of the text within the pdf.
 * @param section.characterSpacing <Number> If present tells how much space there is between letters
 * @param section.width <Number> If present tells how much width should be applied.
 */
const renderSection = (document, section) => {
  const {size, font, str, x, y, characterSpacing, width} = section;
  document.fontSize(size);
  document.font(font);
  document.text(str, x, y, {characterSpacing, width});
};

/**
 * Adds lines to the PDF instance.
 * @param document <PDFDocument> PDFDocument instance.
 * @param line <Object> Line to be rendered into the pdf buffer.
 * @param line.x1 <Number> A float number indicating the starting X component of the starting point.
 * @param line.y1 <Number> A float number indicating the starting Y component of the starting point.
 * @param line.x2 <Number> A float number indicating the starting X component of the finishing point.
 * @param line.y2 <Number> A float number indicating the starting Y component of the finishing point.
 */
const renderLine = (document, line) => {
  const {x1, x2, y1, y2} = line;
  document.moveTo(x1, y1);
  document.lineTo(x2, y2);
  document.stroke();
};

module.exports = Pdf;
