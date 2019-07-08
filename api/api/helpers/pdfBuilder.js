import PdfPrinter from 'pdfmake';
import dataObjects from '../assets/pdf/dataObjects'


class Pdf {
  constructor(metadata,qrCode){

    this.metadata=metadata;
    this.fonts={
      Roboto: {
        normal:'./api/assets/pdf/fonts/roboto/Roboto-Regular.ttf',
        bold:'./api/assets/pdf/fonts/roboto/Roboto-Medium.ttf',
        italics:'./api/assets/pdf/fonts/roboto/Roboto-Italic.ttf',
        bolditalics:'./api/assets/pdf/fonts/roboto/Roboto-MediumItalic.ttf',
      },
      Ancizar:{
        normal:'./api/assets/pdf/fonts/ancizar/ancizar_serif-regular-webfont.ttf',
        bold:'./api/assets/pdf/fonts/ancizar/ancizar_serif-semibold-webfont.ttf',
        italics:'./api/assets/pdf/fonts/ancizar/ancizarserif_italic-webfont.ttf',
      },
    };
    this.qrCode=qrCode;
    this.printer = new PdfPrinter(this.fonts);
    this.docDefinition = {
      content:[],
      pageMargins: [ 68.88189, 40, 68.88189, 72 ],
      pageSize:'LETTER',
    };
    this.eventualPdfBuffer = this.toEventualBuffer();
    this.chunks=new Array();
  }
  get [Symbol.toStringTag]() {
    return 'Pdf';
  }
  static create (user,qrCode = null) {
    return new Pdf(user,qrCode);
  }
  toEventualBuffer() {
    return new Promise((resolve, reject) =>{
      this.docDefinition.content = dataObjects.buildMetadata(this.metadata);
      if(this.qrCode!=null)
         this.docDefinition.content.push({image:this.qrCode,fit:[150,150],absolutePosition:{x:400,y:550}});
      let pdfDoc = this.printer.createPdfKitDocument(this.docDefinition);
      pdfDoc.on('data',(chunk)=>{
        this.chunks.push(chunk)
      });

      pdfDoc.on('end',()=>{
        resolve(Buffer.concat(this.chunks));
        this.docDefinition.content.length=0;
      });

      pdfDoc.on('error',(e)=>{
        reject(e);
      });

      pdfDoc.end();

    });
  }
}
module.exports = Pdf;

