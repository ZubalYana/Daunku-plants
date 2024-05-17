const express = require('express')
const app = express();
const path = require('path')
const PORT = 3000;
const mongoose = require('mongoose')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
mongoose.connect(`mongodb+srv://root:py6czQnOyXhFPkng@cluster0.ybpep9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log(`Connected to mongo DB`)
})

const Plants = mongoose.model('Plants', {title: String, price: Number, image: String, rating: Number})
const Contacts = mongoose.model('Contacts', { address: String, phone: String, email: String });

app.post('/add-plants', async (req, res) => {
    console.log(req.body)
    try {
        const { title, price, image, rating } = req.body;
        const plants = new Plants({ title, price, image, rating });
        await plants.save();
        console.log(`Plants created`);
        res.status(201).json(plants);
    } catch (err) {
        res.status(500).json({ message: err })
    }
})
app.post('/contacts', async (req, res)=>{
    console.log(req.body)
    try {
        const { phone } = req.body;
        const { address } = req.body;
        const { email } = req.body;
        const contacts = new Contacts({address, phone, email})
        await contacts.save();
        console.log('Contacts were changed');
        res.status(201).json(contacts);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})
app.get('/getContacts', async (req, res)=>{
    try {
        const contacts = await Contacts.find();
        res.json(contacts)
    } catch (err) {
        res.status(500).json({ message: err })
    }
})
app.get('/plants', async (req, res)=>{
    try {
        const plants = await Plants.find();
        res.json(plants)
    } catch (err) {
        res.status(500).json({ message: err })
    }
})
app.delete('/plant/:id', async ( req, res )=>{
    try {
        const id = req.params.id;
        console.log(id);
        await Plants.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})
app.put('/edit-plant/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const plant = await Plants.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(plant);
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})
app.get('/', (req, res)=>{
    res.sendFile('public', 'index.html')
})
app.get('/admin', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public'))
})
app.listen(PORT, ()=>{
    console.log(`Server work on PORT: ${PORT}`)
})