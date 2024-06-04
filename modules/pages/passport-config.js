const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const model = require("./user");
function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await model.checklogin(email); // Retrieve user by email
          if (!user) {
            // User not found
            return done(null, false, { message: "No user with that email" });
          }
          // Compare password provided by user with hashed password stored in the database
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            // Passwords match, authentication successful
            return done(null, user);
          } else {
            // Passwords don't match
            return done(null, false, { message: "Password incorrect" });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id); // Serialize user ID into the session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await model.checkloginById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = init;
