const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');

const options = {
  formate: 'A3',
  orientation: 'portrait',
  border: '2mm',
  header: {
    height: '15mm',
    contents: '<h4 style=" color: red;font-size:20;font-weight:800;text-align:center;">CUSTOMER INVOICE</h4>',
  },
  footer: {
    height: '20mm',
    contents: {
      first: 'Cover page',
      2: 'Second page',
      default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
      last: 'Last Page',
    },
  },
};

const data = [
  {
    name: 'Product 1',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ullam repudiandae provident, deleniti ratione ipsum sunt porro deserunt',
    unit: 'pack',
    quantity: 2,
    price: 20,
    imgurl:
      'https://micro-cdn.sumo.com/image-resize/sumo-convert?uri=https://media.sumo.com/storyimages/ef624259-6815-44e2-b905-580f927bd608&hash=aa79d9187ddde664f8b3060254f1a5d57655a3340145e011b5b5ad697addb9c0&format=webp',
  },
  {
    name: 'Product 2',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ullam repudiandae provident, deleniti ratione ipsum sunt porro deserunt',
    unit: 'pack',
    quantity: 4,
    price: 80,
    imgurl:
      'https://micro-cdn.sumo.com/image-resize/sumo-convert?uri=https://media.sumo.com/storyimages/ef624259-6815-44e2-b905-580f927bd608&hash=aa79d9187ddde664f8b3060254f1a5d57655a3340145e011b5b5ad697addb9c0&format=webp',
  },
  {
    name: 'Product 3',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ullam repudiandae provident, deleniti ratione ipsum sunt porro deserunt',
    unit: 'pack',
    quantity: 3,
    price: 60,
    imgurl:
      'https://micro-cdn.sumo.com/image-resize/sumo-convert?uri=https://media.sumo.com/storyimages/ef624259-6815-44e2-b905-580f927bd608&hash=aa79d9187ddde664f8b3060254f1a5d57655a3340145e011b5b5ad697addb9c0&format=webp',
  },
];

const generatePdf = async (_req, res) => {
  const html = fs.readFileSync(path.join(__dirname, './template.html'), 'utf-8');
  // eslint-disable-next-line no-useless-concat
  const filename = `${Math.random()}_doc` + `.pdf`;
  const array = [];
  data.forEach((d) => {
    const prod = {
      name: d.name,
      description: d.description,
      unit: d.unit,
      quantity: d.quantity,
      price: d.price,
      total: d.quantity * d.price,
      imgurl: d.imgurl,
    };
    array.push(prod);
  });

  let subtotal = 0;
  array.forEach((i) => {
    subtotal += i.total;
  });
  const tax = (subtotal * 20) / 100;
  const grandtotal = subtotal - tax;
  const obj = {
    prodlist: array,
    subtotal,
    tax,
    gtotal: grandtotal,
  };
  const document = {
    html,
    data: {
      products: obj,
    },
    path: `./docs/${filename}`,
  };
  pdf
    .create(document, options)
    .then(() => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  const filepath = `${process.env.EXPORTURL}${filename}`;

  return res.send({
    path: filepath,
  });
};

module.exports = {
  generatePdf,
};
