const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require("body-parser")

const app = express();
const port = 8080; // or any other available port

// Define mongoose schema
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String,
});

// Create mongoose model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

// CONNECTING TO MONGODB
mongoose.connect('mongodb://localhost/contactDance', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

// EXPRESS SPECIFIC STUFF
app.use(express.static('static'))
app.use(express.urlencoded({ extended: true })); 

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') 
app.set('views', path.join(__dirname, 'views')) 

// ENDPOINTS
app.get('/', (req, res) => {
    const params = { }
    res.status(200).render('home.pug', params);
})

app.get('/contact', (req, res) => {
    const params = { }
    res.status(200).render('contact.pug', params);
})

app.post('/contact', (req, res) => {
    const myData = new Contact(req.body);
    myData.save()
        .then(() => {
            console.log("Item saved successfully to the database");
            res.send("This item has been saved to the database");
        })
        .catch(error => {
            console.error("Error saving to the database:", error);
            res.status(400).send("Item was not saved to the database");
        });
});

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
