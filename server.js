const express = require('express');
const logResponse = require('./log.js');
const mongoose = require('mongoose')
const Medicine = require('./schema.js');

const uri = "mongodb+srv://max0man0:Bvf3i4AIUr3Bal12@medicine-inventory-mana.xxgzvp5.mongodb.net/?retryWrites=true&w=majority&appName=Medicine-Inventory-Manager";

const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
    // connect to the database using mongoose
    mongoose.connect(uri)
    .then(() => {
        console.log('Connected to the database');
        next();
    })
});

app.post('/', async (req, res, next) => {
    // Get the details of the medicine
    const name = req.body.name;
    const description = req.body.description;
    const productionDate = req.body.productionDate;
    const expiryDate = req.body.expiryDate;

    const riyadhTime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Riyadh'});
    const storedAtTimestamp = new Date(riyadhTime).toISOString();

    // Find the last id in the database
    lastId = await Medicine.find().sort({ _id: -1 }).limit(1).then((result) => {
        // check if the result is empt
        if (result.length === 0) {
            return 0;
        }
        return result[0]._id;
    });

    const id = lastId + 1;

    // Create a new medicine
    const medicine = new Medicine({
        _id: id,
        name: name,
        description: description,
        productionDate: productionDate,
        expiryDate: expiryDate,
        storedAtTimestamp: storedAtTimestamp,
        lastUpdatedAtTimestamp: storedAtTimestamp
    });

    console.log(medicine)

    // Save the medicine
    medicine.save()
    .then(() => {
        console.log('Medicine saved');
    });

    // Construct the response
    const response = {
        id: id,
        name: name,
        description: description,
        productionDate: productionDate,
        expiryDate: expiryDate,
        storedAtTimestamp: storedAtTimestamp
    };

      

    // Send the response
    res.json(response);
    next();
});

app.get('/', async (req, res, next) => {
    // Find all the medicines
    const medicines = await Medicine.find();

    // Construct the response
    const response = medicines.map((medicine) => {
        return {
            id: medicine._id,
            name: medicine.name,
            description: medicine.description,
            productionDate: medicine.productionDate,
            expiryDate: medicine.expiryDate,
            storedAtTimestamp: medicine.storedAtTimestamp,
            lastUpdatedAtTimestamp: medicine.lastUpdatedAtTimestamp
        };
    });

    // Send the response
    res.json(response);
    next();
});

app.put('/:id', async (req, res, next) => {
    // Get the id of the medicine
    const id = req.params.id;

    // Get the details of the medicine
    const name = req.body.name;
    const description = req.body.description;
    const productionDate = req.body.productionDate;
    const expiryDate = req.body.expiryDate;

    const riyadhTime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Riyadh'});
    const lastUpdatedAtTimestamp = new Date(riyadhTime).toISOString();

    // Find the medicine
    const medicine = await Medicine.findById(id);

    // Check if the medicine exists
    if (!medicine) {
        res.status(404).send({ detail: 'Medicine not found'});
        next();
        return;
    }

    // Update the medicine
    medicine.name = name;
    medicine.description = description;
    medicine.productionDate = productionDate;
    medicine.expiryDate = expiryDate;
    medicine.lastUpdatedAtTimestamp = lastUpdatedAtTimestamp;

    // Save the medicine
    medicine.save()
    .then(() => {
        console.log('Medicine updated');
    });

    // Construct the response
    const response = {
        id: parseInt(id),
        name: name,
        description: description,
        productionDate: productionDate,
        expiryDate: expiryDate,
        storedAtTimestamp: medicine.storedAtTimestamp,
        lastUpdatedAtTimestamp: lastUpdatedAtTimestamp
    };

    // Send the response
    res.json(response);
    next();
});

app.get('/:id', async (req, res, next) => {
    // Get the id of the medicine
    const id = req.params.id;

    // Find the medicine
    const medicine = await Medicine.findById(id);

    // Check if the medicine exists
    if (!medicine) {
        res.status(404).send({ detail: 'Medicine not found'});
        next();
        return;
    }

    // Construct the response
    const response = {
        id: parseInt(id),
        name: medicine.name,
        description: medicine.description,
        productionDate: medicine.productionDate,
        expiryDate: medicine.expiryDate,
        storedAtTimestamp: medicine.storedAtTimestamp,
        lastUpdatedAtTimestamp: medicine.lastUpdatedAtTimestamp
    };

    // Send the response
    res.json(response);
    next();
});


app.delete('/:id', async (req, res, next) => {
    // Get the id of the medicine
    const id = req.params.id;

    // Check if the medicine exists
    const medicine = await Medicine.findById(id);
    if (!medicine) {
        res.status(404).send({ detail: 'Medicine not found'});
        next();
        return;
    }

    // Delete the medicine by id
    Medicine.deleteOne({ _id: id })
    .then(() => {
        console.log('Medicine deleted');
    });

    // Send the response
    res.status(204).send();
    next();
});

app.use(logResponse);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});