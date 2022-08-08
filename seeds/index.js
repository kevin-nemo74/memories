let mongoose = require('mongoose');
let Post = require('../models/posts');
let { places, descriptors } = require('./seedH');



mongoose.connect('mongodb://localhost:27017/thoughtsCamp', { useNewUrlParser: true })
    .then(() => {
        console.log('database connected!! ');
    })
    .catch((err) => {
        console.log('oh noo error');
        console.log(err);
    });


const sample = array => array[Math.floor(Math.random() * array.length)];



const seedb = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);

        const post = new Post({
            title: `${sample(descriptors)} ${sample(places)}`,
            body: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum omnis ut doloremque ad dignissimos rem reprehenderit distinctio expedita fugit illum, consequatur ab facilis iste dolorem doloribus cupiditate, libero maiores repellendus!',
            author: '62f1295913d22ef2f8da5381'
        });
        await post.save();
    }
}

seedb().then(() => {
    mongoose.connection.close();
});