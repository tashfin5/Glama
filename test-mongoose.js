const mongoose = require('mongoose');

const schema1 = new mongoose.Schema({
  types: {
    type: [String],
    enum: ['A', 'B']
  }
});

const schema2 = new mongoose.Schema({
  types: [{
    type: String,
    enum: ['A', 'B']
  }]
});

const Model1 = mongoose.model('Model1', schema1);
const Model2 = mongoose.model('Model2', schema2);

const doc1 = new Model1({ types: ['A', 'B'] });
const doc2 = new Model2({ types: ['A', 'B'] });

let err1 = doc1.validateSync();
console.log('Model1 errors:', err1 ? err1.message : 'None');

let err2 = doc2.validateSync();
console.log('Model2 errors:', err2 ? err2.message : 'None');
