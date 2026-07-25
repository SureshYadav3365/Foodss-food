import connectDB from '../backend/config/db.js';
import Category from '../backend/models/Category.js';

async function check() {
  try {
    await connectDB();
    const cats = await Category.find({}, { name: 1, image: 1 });
    console.log(JSON.stringify(cats, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
check();
