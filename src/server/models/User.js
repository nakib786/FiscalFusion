/**
 * User model for MongoDB database interaction
 */

const mongodb = require('../database/mongodb-config');
const { ObjectId } = require('mongodb');

/**
 * Get user by Auth0 ID
 * @param {string} auth0Id - Auth0 user ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const getByAuth0Id = async (auth0Id) => {
  try {
    const db = await mongodb.getDb();
    const user = await db.collection('users').findOne({ auth0Id });
    return user;
  } catch (error) {
    console.error(`Error retrieving user with Auth0 ID ${auth0Id}:`, error);
    throw error;
  }
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findById = async (id) => {
  try {
    const db = await mongodb.getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    console.error(`Error retrieving user ${id}:`, error);
    throw error;
  }
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findByEmail = async (email) => {
  try {
    const db = await mongodb.getDb();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    return user;
  } catch (error) {
    console.error(`Error retrieving user with email ${email}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
  try {
    const db = await mongodb.getDb();
    
    // Ensure email is lowercase
    userData.email = userData.email.toLowerCase();
    
    // Add timestamps if not already present
    if (!userData.created) {
      userData.created = new Date();
    }
    if (!userData.updated) {
      userData.updated = new Date();
    }
    
    const result = await db.collection('users').insertOne(userData);
    
    if (result.acknowledged) {
      return { _id: result.insertedId, ...userData };
    } else {
      throw new Error('Failed to create user');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param {string} id - User ID 
 * @param {Object} data - User data to update
 * @returns {Promise<Object|null>} Updated user or null if not found
 */
const updateUser = async (id, data) => {
  try {
    const db = await mongodb.getDb();
    
    // Add updated timestamp
    if (!data.updated) {
      data.updated = new Date();
    }
    
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );
    
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Update user's last login time
 * @param {string} auth0Id - Auth0 user ID
 * @returns {Promise<Object|null>} Updated user or null if not found
 */
const updateLastLogin = async (auth0Id) => {
  try {
    const db = await mongodb.getDb();
    
    const result = await db.collection('users').findOneAndUpdate(
      { auth0Id },
      { $set: { last_login: new Date() } },
      { returnDocument: 'after' }
    );
    
    return result.value;
  } catch (error) {
    console.error(`Error updating last login for user with Auth0 ID ${auth0Id}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise<boolean>} True if user was deleted, false if not found
 */
const deleteUser = async (id) => {
  try {
    const db = await mongodb.getDb();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      return true;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = {
  getByAuth0Id,
  findById,
  findByEmail,
  getByEmail: findByEmail, // Alias for backward compatibility
  getById: findById, // Alias for backward compatibility
  createUser,
  updateUser,
  updateLastLogin,
  deleteUser
}; 