const connection = require('../config/connection');
const { User, Thought } = require('../models');
const {
  getRandomName,
  getRandomThought,
  getRandomReaction,
} = require('./data');

// Start the seeding runtime timer
console.time('seeding');

// Creates a connection to mongodb
connection.once('open', async () => {
  // Delete the collections if they exist
  let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection('thoughts');
  }

  const users = [];
  const thoughts = [];


  
  for (let i = 0; i < 20; i++) {
    
    const userName = getRandomName();
    const email = `${userName}${Math.floor(Math.random() * (99 - 18 + 1) + 18)} @ xample.com`;
    
    users.push({
      username:userName,
      email,
      friends:[],
    });

    users.forEach(user => {
      const friendCount = Math.floor(Math.random() * 5) + 1; 
      const friends = [];
  
      for (let i = 0; i < friendCount; i++) {
        let friend;
        do {
          friend = users[Math.floor(Math.random() * users.length)].username;
        } while (friend === user.username || friends.includes(friend));
  
        friends.push(friend);
      }
  
      user.friends = friends;
    })
  }

  const userData = await User.collection.insertMany(users);

  const getRandomReactionArr = (int) => {
    const results = [];
    for (let i = 0; i < int; i++) {
      results.push({
        reactionBody: getRandomReaction(),
        username: userData[Math.floor(Math.random() * userData.length)]._id,
      });
    }
    return results;
  };

  for (let i = 0; i < 20; i++) {
    const thoughtText = getRandomThought(10);
    const reactions = [...getRandomReactionArr(10)];
    
    thoughts.push({
      thoughtText,
      username: userData[Math.floor(Math.random() * userData.length)]._id,
      reactions: reactions,
    }); 
  };


  await Thought.collection.insertMany(thoughts);

  // Log out a pretty table for comments and posts
  console.table(users);
  console.table(thoughts);
  console.timeEnd('seeding complete 🌱');
  process.exit(0);
});
