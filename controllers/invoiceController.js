const models = require('../models');
const fs = require('fs');
const PDFDocument = require('pdfkit');

exports.createInvoice = async (req, res) => {
  const product = await models.orders.findOne({
    where: {
      invoice_number: req.params.invoiceNumber,
    },
  });
  if (product) {
    let doc = new PDFDocument({ margin: 50 });
    generateHeader(doc);
    generateCustomerInformation(doc, product, req.userName);
    generateInvoiceTable(doc, product);
    generateFooter(doc);

    doc.end();
    doc.pipe(
      fs.createWriteStream(
        `${__basedir}/resources/static/assets/invoices/${req.params.invoiceNumber}.pdf`
      )
    );
    var file = `${__basedir}/resources/static/assets/invoices/${req.params.invoiceNumber}.pdf`;
    res.download(file, function (err) {
      if (err) {
        console.log('Error');
        console.log(err);
      } else {
        console.log('Success');
      }
    });
  }
};

function generateHeader(doc) {
  doc
    // .image("logo.png", 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Ecommerce', 50, 45)
    .fontSize(10)
    .text('123 Main Street', 200, 65, { align: 'right' })
    .text('Lower Parel', 200, 80, { align: 'right' })
    .moveDown();
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      'Payment is due within 15 days. Thank you for your purchase.',
      50,
      750,
      { align: 'center', width: 500 }
    );
}

function generateCustomerInformation(doc, invoiceData, userName) {
  doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;
  let invoice = JSON.parse(JSON.stringify(invoiceData));
  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(invoice.invoice_number, 150, customerInformationTop)
    .font('Helvetica')
    .text('Invoice Date:', 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text('Amount:', 50, customerInformationTop + 30)
    .text(formatCurrency(invoice.total_price), 150, customerInformationTop + 30)

    .font('Helvetica-Bold')
    .text(userName, 300, customerInformationTop)
    .font('Helvetica')
    .text(invoice.address, 300, customerInformationTop + 15)
    .text(
      invoice.city +
        ', ' +
        invoice.state +
        ', ' +
        invoice.country +
        ' - ' +
        invoice.pincode,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoiceData) {
  let i;
  const invoiceTableTop = 330;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Sr. No.',
    'Description',
    'Unit Cost',
    'Quantity',
    'Total'
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  let subTotal = 0;

  let invoice = JSON.parse(JSON.stringify(invoiceData));

  for (i = 0; i < invoice.products.length; i++) {
    const item = invoice.products[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      i + 1,
      item.product.name,
      formatCurrency(item.product.price),
      item.qty,
      formatCurrency(item.product.price * item.qty)
    );
    subTotal = subTotal + item.product.price * item.qty;
    generateHr(doc, position + 20);
  }
  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Subtotal',
    '',
    formatCurrency(parseInt(subTotal))
  );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(rupees) {
  return 'INR ' + rupees.toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return day + '/' + month + '/' + year;
}
