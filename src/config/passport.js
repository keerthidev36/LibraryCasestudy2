const LocalStrategy  =  require("passport-local").Strategy;
  const   mongoose    =  require("mongoose");
  // mongoose.connect('mongodb://localhost:27017/library');
  mongoose.connect('mongodb+srv://userone:userone@ictakfiles.5ffz0.mongodb.net/library?retryWrites=true&w=majority');
  const bycrypt=require('bcryptjs');
  //load usermodel
  const User=require('../model/User');
  module.exports=function(passport){
      passport.use(
          new LocalStrategy({usernameField:'email'},(email,password,done)=>{
              //match user
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'That email is not registered'})
                }
                //match password
                bycrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message:'Password incorrect'});
                    }

                })
            })
            .catch(err=> console.log(err))
          })
      );
      passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });
  }
