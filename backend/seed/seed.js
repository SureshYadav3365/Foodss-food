import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Category from '../models/Category.js';
import Food from '../models/Food.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

const categories = [
  { name: 'Pizza', slug: 'pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', description: 'Cheesy delights' },
  { name: 'Burger', slug: 'burger', image: 'https://images.unsplash.com/photo-1568901347635-c4af756d99a8?w=400', description: 'Juicy burgers' },
  { name: 'Biryani', slug: 'biryani', image: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=400', description: 'Aromatic rice dishes' },
  { name: 'Chinese', slug: 'chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', description: 'Indo-Chinese favorites' },
  { name: 'Desserts', slug: 'desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', description: 'Sweet treats' },
  { name: 'South Indian', slug: 'south-indian', image: 'https://images.unsplash.com/photo-1630384060421-cb20d1e0649d?w=400', description: 'Dosas & idlis' },
  { name: 'North Indian', slug: 'north-indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008296fbe?w=400', description: 'Rich curries & breads' },
  { name: 'Healthy', slug: 'healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', description: 'Nutritious meals' },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Restaurant.deleteMany(),
      Category.deleteMany(),
      Food.deleteMany(),
      Coupon.deleteMany(),
    ]);

    console.log('Creating users...');
    const admin = await User.create({ name: 'Admin User', email: 'admin@fooddelivery.com', password: 'admin123', role: 'admin' });
    const restaurantOwner = await User.create({ name: 'Raj Restaurant', email: 'restaurant@fooddelivery.com', password: 'restaurant123', role: 'restaurant' });
    const user = await User.create({
      name: 'John Doe',
      email: 'user@fooddelivery.com',
      password: 'user123',
      role: 'user',
      phone: '9876543210',
      addresses: [{
        label: 'Home',
        street: '123 Main Street, Apt 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: true,
      }],
    });

    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categories);

    console.log('Creating restaurants...');
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Pizza Palace',
        description: 'Authentic Italian pizzas with fresh ingredients and wood-fired ovens.',
        cuisine: ['Italian', 'Pizza', 'Fast Food'],
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
        rating: 4.5,
        reviewCount: 128,
        deliveryTime: '25-35 mins',
        deliveryFee: 30,
        minOrder: 149,
        address: 'Bandra West, Mumbai',
        city: 'Mumbai',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Burger Barn',
        description: 'Gourmet burgers made with premium Angus beef and artisan buns.',
        cuisine: ['American', 'Burger', 'Fast Food'],
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
        coverImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457a00?w=1200',
        rating: 4.3,
        reviewCount: 95,
        deliveryTime: '20-30 mins',
        deliveryFee: 25,
        minOrder: 99,
        address: 'Andheri East, Mumbai',
        city: 'Mumbai',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Spice Garden',
        description: 'Traditional Indian cuisine with a modern twist. Home-style cooking.',
        cuisine: ['Indian', 'North Indian', 'Biryani'],
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
        rating: 4.7,
        reviewCount: 210,
        deliveryTime: '35-45 mins',
        deliveryFee: 40,
        minOrder: 199,
        address: 'Powai, Mumbai',
        city: 'Mumbai',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Dragon Wok',
        description: 'Authentic Chinese and Indo-Chinese dishes with bold flavors.',
        cuisine: ['Chinese', 'Indo-Chinese', 'Asian'],
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        coverImage: 'https://images.unsplash.com/photo-1525753152873-4647859a0856?w=1200',
        rating: 4.2,
        reviewCount: 76,
        deliveryTime: '30-40 mins',
        deliveryFee: 35,
        minOrder: 149,
        address: 'Malad West, Mumbai',
        city: 'Mumbai',
        isFeatured: false,
        owner: restaurantOwner._id,
      },
      {
        name: 'Sweet Tooth',
        description: 'Decadent desserts, cakes, and ice creams for every craving.',
        cuisine: ['Desserts', 'Bakery', 'Sweets'],
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
        coverImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200',
        rating: 4.6,
        reviewCount: 156,
        deliveryTime: '20-30 mins',
        deliveryFee: 20,
        minOrder: 79,
        address: 'Juhu, Mumbai',
        city: 'Mumbai',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Dosa Corner',
        description: 'Crispy dosas, fluffy idlis, and authentic South Indian breakfast.',
        cuisine: ['South Indian', 'Breakfast', 'Vegetarian'],
        image: 'https://images.unsplash.com/photo-1630384060421-cb20d1e0649d?w=800',
        coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93a0b?w=1200',
        rating: 4.4,
        reviewCount: 89,
        deliveryTime: '25-35 mins',
        deliveryFee: 25,
        minOrder: 99,
        address: 'Chembur, Mumbai',
        city: 'Mumbai',
        isFeatured: false,
        owner: restaurantOwner._id,
      },
    ]);

    const catMap = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

    console.log('Creating food items...');
    await Food.insertMany([
      { name: 'Margherita Pizza', description: 'Classic tomato sauce, mozzarella, and fresh basil', price: 299, discountPrice: 249, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', category: catMap.pizza, restaurant: restaurants[0]._id, isVeg: true, rating: 4.5, tags: ['bestseller'] },
      { name: 'Pepperoni Feast', description: 'Loaded with pepperoni and extra cheese', price: 449, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category: catMap.pizza, restaurant: restaurants[0]._id, isVeg: false, rating: 4.7, tags: ['popular'] },
      { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce with grilled chicken', price: 499, discountPrice: 399, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', category: catMap.pizza, restaurant: restaurants[0]._id, isVeg: false, rating: 4.6 },
      { name: 'Classic Cheese Burger', description: 'Angus beef patty with cheddar and special sauce', price: 199, image: 'https://images.unsplash.com/photo-1568901347635-c4af756d99a8?w=400', category: catMap.burger, restaurant: restaurants[1]._id, isVeg: false, rating: 4.4, tags: ['bestseller'] },
      { name: 'Veggie Supreme Burger', description: 'Grilled veggie patty with avocado and sprouts', price: 179, image: 'https://images.unsplash.com/photo-1520072959219-cbf634916c6a?w=400', category: catMap.burger, restaurant: restaurants[1]._id, isVeg: true, rating: 4.2 },
      { name: 'Double Smash Burger', description: 'Two smashed patties, double cheese, caramelized onions', price: 349, discountPrice: 299, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', category: catMap.burger, restaurant: restaurants[1]._id, isVeg: false, rating: 4.8, tags: ['popular'] },
      { name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken pieces', price: 349, image: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=400', category: catMap.biryani, restaurant: restaurants[2]._id, isVeg: false, rating: 4.8, tags: ['bestseller'] },
      { name: 'Paneer Butter Masala', description: 'Creamy tomato gravy with soft paneer cubes', price: 279, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: catMap['north-indian'], restaurant: restaurants[2]._id, isVeg: true, rating: 4.5 },
      { name: 'Dal Makhani with Naan', description: 'Slow-cooked black lentils with butter naan', price: 249, discountPrice: 199, image: 'https://images.unsplash.com/photo-1585937421612-70a008296fbe?w=400', category: catMap['north-indian'], restaurant: restaurants[2]._id, isVeg: true, rating: 4.6 },
      { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables and soy sauce', price: 199, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', category: catMap.chinese, restaurant: restaurants[3]._id, isVeg: true, rating: 4.3 },
      { name: 'Chilli Chicken', description: 'Crispy chicken in spicy Indo-Chinese sauce', price: 299, image: 'https://images.unsplash.com/photo-1527477396000-e27163a481e2?w=400', category: catMap.chinese, restaurant: restaurants[3]._id, isVeg: false, rating: 4.5, tags: ['spicy'] },
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 149, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', category: catMap.desserts, restaurant: restaurants[4]._id, isVeg: true, rating: 4.9, tags: ['bestseller'] },
      { name: 'Red Velvet Cupcake', description: 'Moist red velvet with cream cheese frosting', price: 99, image: 'https://images.unsplash.com/photo-1616545883642-927487a326bf?w=400', category: catMap.desserts, restaurant: restaurants[4]._id, isVeg: true, rating: 4.4 },
      { name: 'Masala Dosa', description: 'Crispy crepe filled with spiced potato masala', price: 120, image: 'https://images.unsplash.com/photo-1630384060421-cb20d1e0649d?w=400', category: catMap['south-indian'], restaurant: restaurants[5]._id, isVeg: true, rating: 4.6, tags: ['bestseller'] },
      { name: 'Idli Sambar (2 pcs)', description: 'Steamed rice cakes with lentil soup', price: 80, image: 'https://images.unsplash.com/photo-1589302168068-964664d93a0b?w=400', category: catMap['south-indian'], restaurant: restaurants[5]._id, isVeg: true, rating: 4.3 },
    ]);

    console.log('Creating coupons...');
    await Coupon.insertMany([
      { code: 'WELCOME50', description: '50% off on first order', discountType: 'percentage', discountValue: 50, minOrder: 199, maxDiscount: 150, expiryDate: new Date('2027-12-31'), usageLimit: 1000 },
      { code: 'FLAT100', description: 'Flat ₹100 off', discountType: 'flat', discountValue: 100, minOrder: 399, expiryDate: new Date('2027-06-30'), usageLimit: 500 },
      { code: 'FOODIE20', description: '20% off on orders above ₹299', discountType: 'percentage', discountValue: 20, minOrder: 299, maxDiscount: 80, expiryDate: new Date('2027-12-31'), usageLimit: 2000 },
    ]);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Demo Accounts:');
    console.log('  Admin:      admin@fooddelivery.com / admin123');
    console.log('  Restaurant: restaurant@fooddelivery.com / restaurant123');
    console.log('  User:       user@fooddelivery.com / user123');
    console.log('\nCoupons: WELCOME50, FLAT100, FOODIE20\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
