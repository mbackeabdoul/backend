const mongoose = require('mongoose');
const thingSchema = mongoose.Schema({
    nomFormation: { type: String, required: true },
    dateFormation: { type: Date, required: true},
    maxParticipants: { type: Number, required: true},
    thematique: { type: String, required: true},
    prix: { type: Number, required: true},
    dateAjout: { type: Date, default: Date.now },
    dateModification: { type: Date, default: Date.now },
    // description : {type: String, reqéuired : true}
}, { timestamps: true }); 
 
module.exports = mongoose.model('Thing', thingSchema);