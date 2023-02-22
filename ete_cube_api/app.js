const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const cors = require('cors');
app.use(cors());
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET =
  'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtCI6MTY3NzAwNMzM2fQ.u7-qGWT1gIm9HBHFIgBtAuPeowqu0auTY-QJoUw6SlQ';
const mongoUrl =
  'mongodb+srv://doguskahyaoglu:doguskahyaoglu@doguskahyaoglu.awkdcji.mongodb.net/?retryWrites=true&w=majority';
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to database');
  })
  .catch((e) => console.log(e));

app.listen(5000, () => {
  console.log('Server Started');
});

require('./userInfo');

const User = mongoose.model('UserInfo');

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const encrypPass = await bcrypt.hash(password, 10);
  try {
    const alreadyUser = await User.findOne({ username });
    if (alreadyUser) {
      return res.send({ error: 'This Username Already Exist!' });
    }
    await User.create({
      username,
      password: encrypPass,
    });
    res.send({ alert: 'Account Created' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ error: 'User Not Found' });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({}, JWT_SECRET);
    if (res.status(201)) {
      return res.json({ status: 'ok', data: token });
    } else {
      return res.json({ status: 'error' });
    }
  }
  res.json({ status: 'error', error: 'Invalid Password' });
});

require('./CompanyInfo');

const Company = mongoose.model('CompanyInfo');

app.post('/addCompany', async (req, res) => {
  const { companyName, companyLegalNum, incorpCountry, webSite } = req.body;
  const date = new Date();
  try {
    const alreadyComp = await Company.findOne({ companyName });
    if (alreadyComp) {
      return res.send({ error: 'This Company Already Exist!' });
    }
    await Company.create({
      companyName,
      companyLegalNum,
      incorpCountry,
      webSite,
      date,
    });
    res.send({ status: 'ok' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

app.get('/getCompanies', async (req, res) => {
  try {
    const allComps = await Company.find({});
    res.send({ status: 'ok', data: allComps });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

app.post('/deleteCompany', async (req, res) => {
  const { compId } = req.body;
  try {
    Company.deleteOne({ _id: compId }, function (err, res) {
      console.log(err);
    });
    res.send({ status: 'ok', data: 'Deleted' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

app.post('/updateCompany', async (req, res) => {
  const { _id, companyName, companyLegalNum, incorpCountry, webSite } =
    req.body;
  const date = new Date();
  try {
    await Company.updateOne(
      { _id: _id },
      {
        companyName: companyName,
        companyLegalNum: companyLegalNum,
        incorpCountry: incorpCountry,
        webSite: webSite,
        date: date,
      },
      function (err, res) {
        console.log(err);
      }
    );
    res.send({ status: 'ok', data: 'Deleted' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

require('./ProductInfo');

const Product = mongoose.model('ProductInfo');

app.post('/addProduct', async (req, res) => {
  const { productName, productCategory, productAmount, amountUnit, company } =
    req.body;
  const date = new Date();
  try {
    await Product.create({
      productName,
      productCategory,
      productAmount,
      amountUnit,
      company,
      date,
    });
    res.send({ status: 'ok' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

app.get('/getProducts', async (req, res) => {
  try {
    const allProds = await Product.find({});
    res.send({ status: 'ok', data: allProds });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

app.post('/deleteProduct', async (req, res) => {
  const { prodId } = req.body;
  try {
    Product.deleteOne({ _id: prodId }, function (err, res) {
      console.log(err);
    });
    res.send({ status: 'ok', data: 'Deleted' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

app.post('/updateProduct', async (req, res) => {
  const { _id ,productName, productCategory, productAmount, amountUnit, company } =
    req.body;
  const date = new Date();
  try {
    await Product.updateOne(
      { _id: _id },
      {
        productName: productName,
        productCategory: productCategory,
        productAmount: productAmount,
        amountUnit: amountUnit,
        company: company,
        date: date,
      },
      function (err, res) {
        console.log(err);
      }
    );
    res.send({ status: 'ok', data: 'Deleted' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});
