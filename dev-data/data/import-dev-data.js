const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
).replace('USERNAME', process.env.DB_USERNAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB connection established`));

//   Read file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//  import data
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
// Delete all data from COLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('DB droped');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
