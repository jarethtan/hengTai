const mongoose =  require('mongoose')
const Property = require('../models/property')
const hengThai = require('./htList')

mongoose.connect('mongodb://localhost:27017/hengtai').
    catch(error => handleError(error))

const db = mongoose.connection
db.on('error', err => {
    logError(err);
    })
db.once('open', ()=>{
    console.log('Database Connected')
})

const seedDB = async () => {
    await Property.deleteMany({})
    for(let i = 0; i < hengThai.propertyInfo.length; i++) {
        const prop = new Property({
            name: hengThai.propertyInfo[i].name,
            status: hengThai.propertyInfo[i].status,
            year: hengThai.propertyInfo[i].year,
            location: hengThai.propertyInfo[i].location,
            description: `${hengThai.propertyInfo[i].projCode}: ${hengThai.propertyInfo[i].description}`,
            propertyType: hengThai.propertyInfo[i].propertyType,
            units: hengThai.propertyInfo[i].units,
            bedroom: hengThai.propertyInfo[i].bedroom,
            bathroom: hengThai.propertyInfo[i].bathroom,     
            images: [{
                url: hengThai.propertyInfo[i].images.url,
                filename: hengThai.propertyInfo[i].images.filename,
            }],
            geometry: {
                type: 'Point',
                coordinates: [hengThai.propertyInfo[i].geometry.lng,hengThai.propertyInfo[i].geometry.lat]
            },
            user: hengThai.propertyInfo[i].user,
        })
    await prop.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})