const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  prenom: { type: String, required: false },
  email: { type: String, required: false },
 telephone: { type: String, required: false },

});

module.exports = mongoose.model('Thing', thingSchema);