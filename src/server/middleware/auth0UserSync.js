/**
 * Auth0 User Synchronization Middleware
 * This middleware ensures user data from Auth0 is synchronized with our MongoDB database
 */

const User = require('../models/User');

/**
 * Middleware to synchronize Auth0 user profile with our database
 */
const syncUserProfile = async (req, res, next) => {
  // Skip if not authenticated
  if (!req.oidc.isAuthenticated()) {
    return next();
  }

  try {
    // Get Auth0 user profile
    const auth0User = req.oidc.user;
    
    // Check if user already exists in our database
    let user = await User.getByAuth0Id(auth0User.sub);
    
    if (user) {
      // User exists, update last login time
      await User.updateLastLogin(auth0User.sub);
    } else {
      // New user, create in our database
      user = await User.createUser(auth0User);
      console.log(`New user created: ${user.email}`);
    }
    
    // Attach user to request object for use in subsequent middleware/routes
    req.dbUser = user;
    
    next();
  } catch (error) {
    console.error('Error synchronizing user profile:', error);
    next(error);
  }
};

module.exports = syncUserProfile; 