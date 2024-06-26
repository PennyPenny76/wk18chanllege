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
    const email = `${userName}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}@example.com`;
    
    users.push({
      username:userName,
      email,
      thoughts: [],
      friends:[],
    });
  }

  const userData = await User.collection.insertMany(users);
  const insertedUsers = userData.ops || Object.values(userData.insertedIds);

  insertedUsers.forEach(user => {
    const friendCount = Math.floor(Math.random() * 5) + 1; 
    let friends = [];

    for (let i = 0; i < friendCount; i++) {
      
      let friend;
      let attempts = 0; 
      do {
        // Shuffle the users array to improve randomness
        const shuffledUsers = users.sort(() => Math.random() - 0.5);
        friend = shuffledUsers[Math.floor(Math.random() * shuffledUsers.length)]._id;
        attempts++;
        // Limit the number of attempts to prevent infinite loop
      } while ((friend.equals(user._id) || friends.includes(friend)) && attempts < 10);

      if (attempts < 10) {
        friends.push(friend);
      } else {
        console.warn(`Could not find a suitable friend for user ${user._id}`);
        break; // Exit loop if unable to find a suitable friend after 10 attempts
      }
    }

    user.friends = friends;
  })
  
  for (let user of insertedUsers) {
    await User.updateOne({ _id: user._id }, { $set: { friends: user.friends } });
  }

  console.log('userData:', userData);

  const getRandomReactionArr = (int, users) => {
    const results = [];
    for (let i = 0; i < int; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      // console.log('randomUser:', randomUser);
      results.push({
        reactionBody: getRandomReaction(),
        username: randomUser.username,
        userID: randomUser._id,
      });
    }
    return results;
  };

  for (let i = 0; i < 20; i++) {
    const thoughtText = getRandomThought(10);
    let reactions = getRandomReactionArr(10, users);

    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    const thought = new Thought({
      thoughtText,
      username: randomUser.username,
      userID: randomUser._id,
      reactions: reactions,
    }); 
    thoughts.push(thought);
    console.log('Created thought:', thought);
    
    await thought.save();

    await User.updateOne(
      { _id: randomUser._id },
      { $push: { thoughts: thought._id } }
    );
  };


  await Thought.collection.insertMany(thoughts);

  // Log out a pretty table for comments and posts
  console.table(users);
  console.table(thoughts);
  console.timeEnd('seeding complete 🌱');
  process.exit(0);
});
