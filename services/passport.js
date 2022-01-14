const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy

const { User } = require('../Models/User')


passport.serializeUser(function(user, done) {
    console.log("Serialize User..", user);
    done(null, user.id);
  });
  
passport.deserializeUser(async function(id, done) {
  console.log("Deserailize User..", "ID++>",id);
  const user = await User.findByPk(id);
  console.log("Deserailize User..", user);
  done(null, user );
});

function validatePassword(user, password) {
  if(user.password === password) {
    return true;
  } 
  return false
}

console.log("PASSPORT SERVICE++++++++++++++++++++++++++++++");
passport.use(new LocalStrategy(async function (username, password, done) {
        console.log("Username =>")
        try{
          const user = await User.findOne({ where: { username: username } });
          console.log("####3",user.username,"$$$$");

          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!validatePassword(user, password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          if(validatePassword(user, password)) {
            return done(null, user);
          }

        } catch (error) {
          console.log("Hey buddy, we got a error");
          return done(err);
        
        }

        // User.findOne({username: username}, function(err, user) {
        //     if(err) {
        //         return done(err);
        //     }
        //     if(!user) {
        //         return done(null,false)
        //     }
        //    console.log("From passport srategy", user);
        //    return done(null, user);
        // })
      }))