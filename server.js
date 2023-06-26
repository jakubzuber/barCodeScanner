const express = require('express');
const dbOperation = require('./dbFIles/dbOperations');
const cors = require('cors');

const API_PORT = process.env.PORT || 4999
const app = express();

let client;
let sesion;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/valideLogIn', async(req,res) => {
    const result = await dbOperation.validateLogIn(req.body.USERNAME);
    res.send(result.recordset)
});

app.post('/valideLogIn/newPasswrod', async(req,res) => {
    dbOperation.setNewPasswrod(req.body)
    res.status(200).json({ success: true })
});

app.get('/apiFetchNewOrders', async(req, res) => {
    const result = await dbOperation.getNewOrdersData(req.body);
    res.send(result.recordset)
});

app.post('/apiFetchNewOrdersDetails', async(req, res) => {
    const result = await dbOperation.getNewOrdersDetailsData(req.body);
    res.send(result.recordset)
});

app.post('/palletCheck', async(req, res) => {
    const result = await dbOperation.checkIfPallet(req.body);
    res.send(result.recordset)
});

app.post('/addScan', async(req, res) => {
    await dbOperation.addScan(req.body);
    res.status(200).json({ success: true })
});

app.post('/deduct', async(req, res) => {
    await dbOperation.deduct(req.body);
    res.status(200).json({ success: true })
});

app.post('/addToWh', async(req, res) => {
    await dbOperation.addToWh(req.body);
    res.status(200).json({ success: true })
});

app.post('/deleteFromWh', async(req, res) => {
    await dbOperation.deleteFromWh(req.body);
    res.status(200).json({ success: true })
});

app.post('/closeOrder', async(req, res) => {
    await dbOperation.closeOrder(req.body);
    res.status(200).json({ success: true })
});



app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));