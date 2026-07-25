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
  { name: 'Pizza', slug: 'pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', description: 'Cheesy pizza' },
  { name: 'Burger', slug: 'burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', description: 'Juicy burgers' },
  { name: 'Biryani', slug: 'biryani', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400', description: 'Aromatic rice' },
  { name: 'Chinese', slug: 'chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', description: 'Asian noodles & more' },
  { name: 'North Indian', slug: 'north-indian', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400', description: 'Rich curries & breads' },
  { name: 'South Indian', slug: 'south-indian', image: 'https://images.unsplash.com/photo-1630384060421-cb20d1e0649d?w=400', description: 'Dosas & idlis' },
  { name: 'Italian', slug: 'italian', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400', description: 'Pastas & risottos' },
  { name: 'Mexican', slug: 'mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', description: 'Tacos & burritos' },
  { name: 'Sandwich', slug: 'sandwich', image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=400', description: 'Toasted sandwiches' },
  { name: 'Dessert', slug: 'dessert', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', description: 'Sweet treats' },
  { name: 'Ice Cream', slug: 'ice-cream', image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=400', description: 'Chilled scoops' },
  { name: 'Coffee', slug: 'coffee', image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400', description: 'Brewed coffee' },
  { name: 'Drinks', slug: 'drinks', image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400', description: 'Refreshing mocktails' },
  { name: 'Healthy Food', slug: 'healthy-food', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', description: 'Salads & bowls' },
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
        city: 'Nagal Koju',
        state: 'Rajasthan',
        pincode: '303007',
        isDefault: true,
      }],
    });

    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categories);

    console.log('Creating 10 premium restaurants...');
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Pizza Palace',
        description: 'Authentic Italian pizzas with fresh ingredients and wood-fired ovens.',
        cuisine: ['Italian', 'Pizza'],
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200',
        rating: 4.5,
        reviewCount: 128,
        deliveryTime: '25-35 mins',
        deliveryFee: 30,
        minOrder: 149,
        address: 'Bandra West, Nagal Koju',
        openingHours: '11:00 AM - 11:00 PM',
        city: 'Nagal Koju',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Burger Barn',
        description: 'Gourmet burgers made with premium beef and fresh artisan buns.',
        cuisine: ['American', 'Burger'],
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        coverImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457a00?w=1200',
        rating: 4.3,
        reviewCount: 95,
        deliveryTime: '20-30 mins',
        deliveryFee: 25,
        minOrder: 99,
        address: 'Andheri East, Nagal Koju',
        openingHours: '10:00 AM - 10:00 PM',
        city: 'Nagal Koju',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Spice Garden',
        description: 'Traditional North Indian curries and dum-cooked biryanis.',
        cuisine: ['Indian', 'North Indian', 'Biryani'],
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
        coverImage: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=1200',
        rating: 4.7,
        reviewCount: 210,
        deliveryTime: '35-45 mins',
        deliveryFee: 40,
        minOrder: 199,
        address: 'Powai, Nagal Koju',
        openingHours: '12:00 PM - 11:00 PM',
        city: 'Nagal Koju',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Dragon Wok',
        description: 'Authentic Chinese, dim sums, and wok-tossed noodles.',
        cuisine: ['Chinese', 'Asian'],
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
        coverImage: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200',
        rating: 4.2,
        reviewCount: 76,
        deliveryTime: '30-40 mins',
        deliveryFee: 35,
        minOrder: 149,
        address: 'Malad West, Nagal Koju',
        openingHours: '11:30 AM - 10:30 PM',
        city: 'Nagal Koju',
        isFeatured: false,
        owner: restaurantOwner._id,
      },
      {
        name: 'Sweet Tooth',
        description: 'Mouth-watering desserts, cakes, pastries, and loaded waffles.',
        cuisine: ['Dessert', 'Bakery'],
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
        coverImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200',
        rating: 4.6,
        reviewCount: 156,
        deliveryTime: '15-25 mins',
        deliveryFee: 20,
        minOrder: 79,
        address: 'Juhu, Nagal Koju',
        openingHours: '10:00 AM - 12:00 AM',
        city: 'Nagal Koju',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Dosa Corner',
        description: 'Crispy dosas, soft idlis, and traditional filter coffee.',
        cuisine: ['South Indian', 'Vegetarian'],
        image: 'https://images.unsplash.com/photo-1630384060421-cb20d1e0649d?w=400',
        coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93a0b?w=1200',
        rating: 4.4,
        reviewCount: 89,
        deliveryTime: '25-35 mins',
        deliveryFee: 25,
        minOrder: 99,
        address: 'Chembur, Nagal Koju',
        openingHours: '7:00 AM - 10:00 PM',
        city: 'Nagal Koju',
        isFeatured: false,
        owner: restaurantOwner._id,
      },
      {
        name: 'Cafe Coffee Day',
        description: 'Freshly brewed coffees, wraps, and cookies to kickstart your day.',
        cuisine: ['Coffee', 'Drinks', 'Cafe'],
        image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400',
        coverImage: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=1200',
        rating: 4.3,
        reviewCount: 120,
        deliveryTime: '15-25 mins',
        deliveryFee: 20,
        minOrder: 79,
        address: 'Colaba, Nagal Koju',
        openingHours: '8:00 AM - 10:00 PM',
        city: 'Nagal Koju',
        isFeatured: false,
        owner: restaurantOwner._id,
      },
      {
        name: 'Mexican Fiesta',
        description: 'Spicy tacos, cheesy quesadillas, and loaded burritos.',
        cuisine: ['Mexican', 'Tex-Mex'],
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
        coverImage: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=1200',
        rating: 4.4,
        reviewCount: 85,
        deliveryTime: '30-40 mins',
        deliveryFee: 30,
        minOrder: 149,
        address: 'Bandra West, Nagal Koju',
        openingHours: '11:00 AM - 11:00 PM',
        city: 'Nagal Koju',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
      {
        name: 'Subway',
        description: 'Fresh, custom-made sub sandwiches and crisp salads.',
        cuisine: ['Sandwich', 'Healthy Food'],
        image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=400',
        coverImage: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1200',
        rating: 4.2,
        reviewCount: 104,
        deliveryTime: '20-30 mins',
        deliveryFee: 25,
        minOrder: 99,
        address: 'Andheri West, Nagal Koju',
        openingHours: '9:00 AM - 11:00 PM',
        city: 'Nagal Koju',
        isFeatured: false,
        owner: restaurantOwner._id,
      },
      {
        name: 'Healthy Bowls',
        description: 'Fresh organic salads, macro bowls, and cold-pressed juices.',
        cuisine: ['Healthy Food', 'Salads', 'Organic'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
        rating: 4.5,
        reviewCount: 110,
        deliveryTime: '25-35 mins',
        deliveryFee: 30,
        minOrder: 120,
        address: 'Worli, Nagal Koju',
        openingHours: '8:30 AM - 9:30 PM',
        city: 'Nagal Koju',
        isFeatured: true,
        owner: restaurantOwner._id,
      },
    ]);

    const catMap = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

    console.log('Creating 35+ premium food items...');
    await Food.insertMany([
      // Pizza Palace (Pizza / Italian)
      { name: 'Margherita Pizza', description: 'Classic tomato sauce, mozzarella, and fresh basil', price: 299, discountPrice: 249, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', category: catMap.pizza, restaurant: restaurants[0]._id, isVeg: true, rating: 4.5, calories: 750, tags: ['bestseller'] },
      { name: 'Pepperoni Feast', description: 'Loaded with pepperoni and extra mozzarella cheese', price: 449, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category: catMap.pizza, restaurant: restaurants[0]._id, isVeg: false, rating: 4.7, calories: 950, tags: ['popular'] },
      { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce with grilled chicken and onions', price: 499, discountPrice: 399, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', category: catMap.pizza, restaurant: restaurants[0]._id, isVeg: false, rating: 4.6, calories: 890 },
      { name: 'Truffle Mushroom Pasta', description: 'Fettuccine pasta in rich truffle cream sauce with wild mushrooms', price: 399, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', category: catMap.italian, restaurant: restaurants[0]._id, isVeg: true, rating: 4.4, calories: 620 },

      // Burger Barn (Burger / Fast Food)
      { name: 'Classic Cheese Burger', description: 'Premium beef patty with cheddar cheese and house sauce', price: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: catMap.burger, restaurant: restaurants[1]._id, isVeg: false, rating: 4.4, calories: 550, tags: ['bestseller'] },
      { name: 'Veggie Supreme Burger', description: 'Grilled vegetable patty with avocado, lettuce, and sprouts', price: 179, image: 'https://images.unsplash.com/photo-1520072959219-cbf634916c6a?w=400', category: catMap.burger, restaurant: restaurants[1]._id, isVeg: true, rating: 4.2, calories: 420 },
      { name: 'Double Smash Burger', description: 'Two smashed patties, double cheese, and caramelized onions', price: 349, discountPrice: 299, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', category: catMap.burger, restaurant: restaurants[1]._id, isVeg: false, rating: 4.8, calories: 820, tags: ['popular'] },
      { name: 'Peri Peri Fries', description: 'Crispy potato fries tossed in spicy peri peri seasoning', price: 129, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', category: catMap['fast-food'], restaurant: restaurants[1]._id, isVeg: true, rating: 4.4, calories: 310 },

      // Spice Garden (Biryani / North Indian)
      { name: 'Chicken Dum Biryani', description: 'Aromatic basmati rice slow-cooked with tender chicken and spices', price: 349, discountPrice: 299, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400', category: catMap.biryani, restaurant: restaurants[2]._id, isVeg: false, rating: 4.8, calories: 720, tags: ['bestseller'] },
      { name: 'Mutton Dum Biryani', description: 'Aromatic basmati rice slow-cooked with spiced baby goat meat', price: 449, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400', category: catMap.biryani, restaurant: restaurants[2]._id, isVeg: false, rating: 4.9, calories: 850, tags: ['popular'] },
      { name: 'Paneer Biryani', description: 'Fragrant rice layered with spiced paneer cubes and herbs', price: 299, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400', category: catMap.biryani, restaurant: restaurants[2]._id, isVeg: true, rating: 4.4, calories: 650 },
      { name: 'Butter Chicken with Naan', description: 'Rich, creamy tomato gravy with tandoori chicken and butter naan', price: 379, discountPrice: 329, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', category: catMap['north-indian'], restaurant: restaurants[2]._id, isVeg: false, rating: 4.7, calories: 810 },
      { name: 'Paneer Butter Masala', description: 'Creamy tomato-based gravy with soft paneer cottage cheese cubes', price: 279, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: catMap['north-indian'], restaurant: restaurants[2]._id, isVeg: true, rating: 4.5, calories: 480 },
      { name: 'Dal Makhani with Naan', description: 'Creamy slow-cooked black lentils served with garlic butter naan', price: 249, discountPrice: 199, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400', category: catMap['north-indian'], restaurant: restaurants[2]._id, isVeg: true, rating: 4.6, calories: 590 },

      // Dragon Wok (Chinese)
      { name: 'Veg Hakka Noodles', description: 'Wok-tossed noodles with colorful crunch vegetables and soy sauce', price: 199, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', category: catMap.chinese, restaurant: restaurants[3]._id, isVeg: true, rating: 4.3, calories: 380 },
      { name: 'Chilli Chicken Dry', description: 'Crispy chicken cubes tossed with bell peppers and green chillies', price: 299, discountPrice: 249, image: 'https://images.unsplash.com/photo-1527477396000-e27163a481e2?w=400', category: catMap.chinese, restaurant: restaurants[3]._id, isVeg: false, rating: 4.5, calories: 450, tags: ['popular'] },
      { name: 'Schezwan Fried Rice', description: 'Spicy fried rice tossed in signature schezwan paste', price: 219, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', category: catMap.chinese, restaurant: restaurants[3]._id, isVeg: true, rating: 4.2, calories: 410 },

      // Sweet Tooth (Dessert / Ice Cream)
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a delicious molten fudge center', price: 149, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', category: catMap.dessert, restaurant: restaurants[4]._id, isVeg: true, rating: 4.9, calories: 410, tags: ['bestseller'] },
      { name: 'Red Velvet Cupcake', description: 'Delicate red velvet cake topped with cream cheese frosting', price: 99, image: 'https://images.unsplash.com/photo-1616545883642-927487a326bf?w=400', category: catMap.dessert, restaurant: restaurants[4]._id, isVeg: true, rating: 4.4, calories: 280 },
      { name: 'Chocolate Fudge Scoop', description: 'Chilled double chocolate ice cream scoop with hot fudge drizzle', price: 119, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', category: catMap['ice-cream'], restaurant: restaurants[4]._id, isVeg: true, rating: 4.6, calories: 340, tags: ['popular'] },
      { name: 'Vanilla Bean Scoop', description: 'Rich vanilla ice cream made with real Madagascar vanilla bean', price: 99, image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=400', category: catMap['ice-cream'], restaurant: restaurants[4]._id, isVeg: true, rating: 4.3, calories: 150 },

      // Dosa Corner (South Indian / Drinks)
      { name: 'Classic Masala Dosa', description: 'Crispy rice crepe with potato masala stuffing and coconut chutney', price: 120, discountPrice: 99, image: 'https://images.unsplash.com/photo-1630384060421-cb20d1e0649d?w=400', category: catMap['south-indian'], restaurant: restaurants[5]._id, isVeg: true, rating: 4.6, calories: 350, tags: ['bestseller'] },
      { name: 'Steamed Idli Sambar', description: 'Soft fluffy steamed rice cakes served with hot lentil soup', price: 80, image: 'https://images.unsplash.com/photo-1589302168068-964664d93a0b?w=400', category: catMap['south-indian'], restaurant: restaurants[5]._id, isVeg: true, rating: 4.3, calories: 190 },
      { name: 'Filter Coffee', description: 'Traditional South Indian frothy milk coffee brewed in brass filters', price: 69, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', category: catMap.coffee, restaurant: restaurants[5]._id, isVeg: true, rating: 4.7, calories: 120 },

      // Cafe Coffee Day (Coffee / Drinks)
      { name: 'Cappuccino Latte', description: 'Espresso double shot with steamed milk and cocoa dust', price: 149, image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400', category: catMap.coffee, restaurant: restaurants[6]._id, isVeg: true, rating: 4.5, calories: 150 },
      { name: 'Iced Cold Mocha', description: 'Chilled espresso blended with milk and dark chocolate syrup', price: 179, discountPrice: 149, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400', category: catMap.coffee, restaurant: restaurants[6]._id, isVeg: true, rating: 4.6, calories: 280, tags: ['bestseller'] },
      { name: 'Virgin Mojito', description: 'Refreshing sparkling water with muddled mint leaves and lime', price: 129, image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400', category: catMap.drinks, restaurant: restaurants[6]._id, isVeg: true, rating: 4.4, calories: 95 },

      // Mexican Fiesta (Mexican / Drinks)
      { name: 'Cheesy Chicken Quesadilla', description: 'Grilled tortilla folded with spiced chicken and melted Monterey Jack cheese', price: 299, discountPrice: 249, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', category: catMap.mexican, restaurant: restaurants[7]._id, isVeg: false, rating: 4.5, calories: 590, tags: ['popular'] },
      { name: 'Crispy Veggie Tacos', description: 'Three hard shells filled with black beans, corn, salsa, and sour cream', price: 219, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', category: catMap.mexican, restaurant: restaurants[7]._id, isVeg: true, rating: 4.3, calories: 430 },
      { name: 'Classic Horchata', description: 'Sweet rice-milk beverage flavored with ground cinnamon and vanilla', price: 139, image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400', category: catMap.drinks, restaurant: restaurants[7]._id, isVeg: true, rating: 4.6, calories: 180 },

      // Subway (Sandwich / Healthy Food)
      { name: 'Paneer Tikka Sub (6")', description: 'Fresh bread toasted with paneer tikka cubes, lettuce, olives, and mint mayo', price: 219, image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=400', category: catMap.sandwich, restaurant: restaurants[8]._id, isVeg: true, rating: 4.4, calories: 340, tags: ['bestseller'] },
      { name: 'Smoked Turkey Breast Sub', description: 'Toasted sub with lean turkey slices, crisp vegetables, and sweet onion sauce', price: 269, discountPrice: 219, image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=400', category: catMap.sandwich, restaurant: restaurants[8]._id, isVeg: false, rating: 4.3, calories: 290 },
      { name: 'Crunchy Garden Salad', description: 'Assorted seasonal crisp greens dressed in low-fat Italian vinaigrette', price: 189, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: catMap['healthy-food'], restaurant: restaurants[8]._id, isVeg: true, rating: 4.5, calories: 140 },

      // Healthy Bowls (Healthy Food)
      { name: 'Quinoa Avocado Protein Bowl', description: 'Boiled quinoa with sliced avocado, chickpeas, spinach, and tahini dressing', price: 349, discountPrice: 299, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: catMap['healthy-food'], restaurant: restaurants[9]._id, isVeg: true, rating: 4.6, calories: 380, tags: ['bestseller'] },
      { name: 'Tofu Grilled Veggie Bowl', description: 'Organic tofu grilled with sweet potatoes, broccoli, and lemon vinaigrette', price: 319, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: catMap['healthy-food'], restaurant: restaurants[9]._id, isVeg: true, rating: 4.3, calories: 310 },
      { name: 'Detox Green Smoothie', description: 'Cold-pressed spinach, celery, green apple, cucumber, and ginger juice', price: 149, image: 'https://images.unsplash.com/photo-1610970881699-44a5587caaec?w=400', category: catMap.drinks, restaurant: restaurants[9]._id, isVeg: true, rating: 4.5, calories: 120 },
      { name: 'Mediterranean Falafel Bowl', description: 'Crispy falafels, hummus, tabbouleh, and cucumber salad on brown rice', price: 329, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: catMap['healthy-food'], restaurant: restaurants[9]._id, isVeg: true, rating: 4.4, calories: 420 },
      
      // More items to reach 35+
      { name: 'Gulab Jamun (2 pcs)', description: 'Traditional milk solids dumplings soaked in cardamom sugar syrup', price: 80, image: 'https://images.unsplash.com/photo-1589302168068-964664d93a0b?w=400', category: catMap.dessert, restaurant: restaurants[4]._id, isVeg: true, rating: 4.7, calories: 320 },
      { name: 'Masala Chai', description: 'Traditional Indian tea brewed with aromatic spices and ginger', price: 49, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', category: catMap.drinks, restaurant: restaurants[5]._id, isVeg: true, rating: 4.7, calories: 90 },
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
