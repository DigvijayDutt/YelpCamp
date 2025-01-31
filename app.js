const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))

app.listen(3000, ()=>{
    console.log("listening on 3k");
})

app.get('/', (req, res)=>{
    res.render('home');
})

app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds',async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id', async (req, res)=>{
    const k = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{k});
})