const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    title: String,
    description: String,
    name:String,
    creator: String,
    imageFile: String,
    createdAt: {
        type: Date,
        default:new Date()
    },
    likeCount: {
        type: Number,
        default: 0
    }
})

// const TourModel = mongoose.model('Tour', tourSchema);
// export default TourModel;

module.exports = mongoose.model("Tour", tourSchema);