
const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/SocialMedia')

const User=mongoose.model('User',{
    Name:String,
    Email:String,
    Password:String,
    posts:[],
    profilepic:[],
    Following:[],
    Followers:[],
    outgoing:[],
    incomming:[]
})
const Comment=mongoose.model('Comment',{
    filename:String,
    from_id:String,
    to_id:String,
    comment:String,
    date:String
})
const Message=mongoose.model('Message',{
    person1:String,
    person2:String,
    fromPerson1:[],
    fromPerson2:[]

})

const Heart=mongoose.model('Heart',{
    filename:String,
    likes:[]
})


module.exports={
    User,
    Comment,
    Message,
    Heart
   
}