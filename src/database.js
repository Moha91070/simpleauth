const mongoose = require('mongoose')

mongoose
    .connect(`mongodb+srv://EliotAlderson:TestBH-91@cluster0.gbvxg.mongodb.net/cyberProject`)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log("Failed to connect MongoDB", error))


/* mongoose
  .connect( "mongodb://localhost:27017/cyberProject")
  .then(() => console.log("Db Connection Successfull!"))
  .catch((e) => {
    console.log(e);
  });
 */
