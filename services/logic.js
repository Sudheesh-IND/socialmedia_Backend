const { response } = require('express')
const db=require('./db')
const jwt=require('jsonwebtoken')

//register the user
const registerUser=(Name,Email,Password)=>{
    return db.User.findOne({Email}).then((response)=>{
        if(response){
            return{
                statuscode:401,
                message:'Email already present'
            }
        }else{
          
           const newUser=db.User({
            Name,
            Email,
            Password,
            Followers:[],
            Following:[],
            profilepic:[{path:"images/file_1695290185515.jpg"}]
           })
           newUser.save()
           return{
            statuscode:200,
            message:'Successfully registered'
           }
        }
    })
        
}

//logging in the user
const login=(Email,Password)=>{
    return db.User.findOne({Email,Password}).then((response)=>{
        if(response){

            const token=jwt.sign({
                loginEmail:Email
            },'shots_key_2023')

            return{
                statuscode:200,
                message:'Successfully loggined',
                InstaFlixId:response._id,
                token
            }
        }else{
            return{
                statuscode:400,
                message:'Invalid request' 
            }
        }
    })
}


//post sorting
const getDetails=(_id)=>{
    return db.User.findOne({_id}).then((response)=>{
        if(response){
            console.log(response)
            return{
                statuscode:200,
                message:'person found',
                details:response
            }
        }else{
           return{
            statuscode:400,
            message:'not found'
           }
        }
    })
}

//get all users
const getAllUsers=()=>{
    return db.User.find({}).then((response)=>{
        if(response){
            return{
                statuscode:200,
                Message:'Items found',
                Details:response
            }
        }else{
            return{
                statuscode:400,
                message:'Not found'
            }
        }
    })
}

//view a specific user
const viewSuggestion=(_id)=>{
    return db.User.findOne({_id}).then((response)=>{
        if(response){
            console.log(response)
            return{
                statuscode:200,
                message:'person found',
                details:response
            }
        }else{
           return{
            statuscode:400,
            message:'not found'
           }
        }
    })
}

//updating followers
const followUser=(_id,followId)=>{
    console.log(followId)
        return db.User.findOne({_id}).then((details)=>{
          let detailsArr=details.Followers
          
          if(_id==followId){
                return{
                    statuscode:400,
                    message:'cannot follow your own account'
                }
          }else{
            for(let i=0;i<detailsArr.length;i++){
                if(followId==detailsArr[i].followId){
                    
                    return{
                        statuscode:400,
                        message:'Already following this account'
                    }
                }
              }
          }
               
                    console.log(details.Followers)
                    const body={
                       followId
                    }
                    detailsArr.push(body)
                    details.save()
                    updateFollower(_id,followId)
                    return{
                        statuscode:200,
                        message:'Following'
                    }
                
            
           
           })  
          
      
}

//add follower to the the people who you followed
const updateFollower=(_id,followId)=>{
    console.log(followId)
        return db.User.findOne({_id:followId}).then((details)=>{
          let detailsArr=details.Following
          
         
          
            for(let i=0;i<detailsArr.length;i++){
                if(_id==detailsArr[i].followerId){
                    
                    return{
                        statuscode:400,
                        message:'Already following this account'
                    }
                }
              }
        
               
                    console.log(details.Following)
                    const body={
                        followerId:_id
                    }
                    detailsArr.push(body)
                    details.save()
                    return{
                        statuscode:200,
                        message:'Following'
                    }
                
            
           
           })  
      
}

const uploadDetails=(_id,destination,filename,path,date)=>{
      return db.User.findOne({_id}).then((details)=>{
        if(details){
            const body={
                destination,
                filename,
                path,
                date
            }
            details.posts.push(body)
            details.save()
            return{
                statuscode:200,
                message:'sucess'
            }
        }else{
             return{
                statuscode:400,
                message:'coudnt upload the file'
             }
        }
        
      })
}

//uploading profile pic
const uploadProfilePic=(_id,destination,filename,path,date)=>{
    return db.User.findOne({_id}).then((details)=>{
        if(details){
            details.profilepic=[]
            const body={
                destination,
                filename,
                path,
                date
            }
            details.profilepic.push(body)
            details.save()
            return{
                statuscode:200,
                message:'sucess'
            }
           
        }else{
             return{
                statuscode:400,
                message:'coudnt upload the file'
             }
        }
        
      })
}

//adding comments
const addComments=(filename,from_id,to_id,comment,date)=>{
      const body={
        filename,
        from_id,
        to_id,
        comment,
        date
      }
      return db.Comment.insertMany(body).then((response)=>{
        return{
            statuscode:200,
            message:'uploaded successfully'
        }
      },(response)=>{
        return{
            statuscode:400,
            message:'failed'
        }
      })
}

//getting comments of a particular post

const readComments=(filename)=>{
    return db.Comment.find({filename}).then((details)=>{
        console.log(details)
        
        return{
            statuscode:200,
            message:'present',
            details
            
        }
    },(details)=>{
        return{
            statuscode:400,
            message:'failed'
        }
    })
}

//unfollowing a user
const unFollow=(_id,followId)=>{
    return db.User.updateOne({_id},{
        $pull:{'Followers':{followId:followId}}
    }).then((response)=>{
        removeFollowing(_id,followId)
        return{
            statuscode:200,
            message:'Unfollowed',
            reap:response
        }
    },(response)=>{
        return{
            statuscode:400,
            message:'Cannot unfollow'
        }
    })
}

//delete folllowing
const removeFollowing=(_id,followId)=>{
    return db.User.updateOne({_id:followId},{
        $pull:{'Following':{followerId:_id}}
    }).then((response)=>{
        return{
            statuscode:200,
            message:'Unfollowed',
            reap:response
        }
    },(response)=>{
        return{
            statuscode:400,
            message:'Cannot unfollow'
        }
    })
}

//from an Id
const startMessage=(person1,person2)=>{
    return db.Message.findOne({person1,person2}).then((response)=>{
        if(response){
            return{
                statuscode:400,
                message:'already found'
            } 
        }else{
             const newMessage=db.Message({
                person1,
                person2,
                fromPerson1:[],
                fromPerson2:[]
             })
             newMessage.save()


             return{
                statuscode:200,
                mesage:'Message started successfully',
            
               }

        }
    })
}
//setting up outgoing
const outGoing=(person1,person2)=>{
    return db.User.findOne({_id:person1}).then((response)=>{
        if(response){
            for(let i=0;i<response.outgoing.length;i++){
               if(person2==response.outgoing[i]){
                return{
                    statuscode:400,
                    message:'already present'
                }
               }
            }
            response.outgoing.push(person2)

            response.save()

            return{
                statuscode:200,
                mesage:'Message started successfully',
            }
        }
    })
}
//setting up incomming message
const inComming=(person1,person2)=>{
    return db.User.findOne({_id:person2}).then((response)=>{
        if(response){
            for(let i=0;i<response.outgoing.length;i++){
                if(person2==response.incomming[i]){
                 return{
                     statuscode:400,
                     message:'already present'
                 }
                }
             }
            response.incomming.push(person1)

            response.save()

            return{
                statuscode:200,
                mesage:'Message started successfully',
            }
        }
    })
}
//finding if chatbox prsent
const findChats=(person1,person2)=>{
    return db.Message.findOne({person1,person2}).then((response)=>{
        return{
            statuscode:200,
            message:'found',
            details:response
        }
    },(response)=>{
        return{
            statuscode:400,
            message:'coudnt find'
        }
    })
}

//message from person1
const messsagePerson1=(person1,person2,message,date,from_id)=>{
    return db.Message.findOne({person1,person2}).then((details)=>{
        if(details){
            const body={
                message:message,
                date:date,
                messageId:from_id
            }
           details.fromPerson1.push(body)

           details.save()
           return{
            statuscode:200,
            mesage:'Message sent successfully'
           }
           
        }else{
            return{
                statuscode:400,
                mesage:'message not sent'
               }
        }
    },(details)=>{
        return{
            statuscode:400,
            mesage:'message not sent'
           }
    })
}

//message from person 2
const messsagePerson2=(person1,person2,message,date,from_id)=>{
    return db.Message.findOne({person1,person2}).then((details)=>{
        if(details){
            const body={
                message:message,
                date:date,
                messageId:from_id
            }
           details.fromPerson2.push(body)

           details.save()
           return{
            statuscode:200,
            mesage:'Message sent successfully'
           }
           
        }else{
            return{
                statuscode:400,
                mesage:'message not sent'
               }
        }
    },(details)=>{
        return{
            statuscode:400,
            mesage:'message not sent'
           }
    })
}

//startlikes
const startLikes=(filename)=>{
    
    return db.Heart.insertMany({filename}).then((response)=>{
        return{
            statuscode:200,
            message:'Successfully started'
        }
    })
}

//likes for a picture
const likes=(filename,likeId)=>{
    return db.Heart.findOne({filename}).then((response)=>{
        if(response){
            for(let i=0;i<response.likes.length;i++){
                if(response.likes[i]==likeId){
                    response.likes.pull(likeId)
                    response.save()
    
                    return{
                        statuscode:200,
                        message:'un liked'
                    }
                }
            }
            
                response.likes.push(likeId)
                response.save()
                return{
                    statuscode:200,
                    message:'liked'
                }
          
        }
    },(response)=>{
        return{
            statuscode:400,
            message:'error'
        }
    })
}

//get likes
const getLikes=(filename)=>{
    return db.Heart.findOne({filename}).then((response)=>{
      if(response){
        return{
            statuscode:200,
            mesage:"found",
            response
        }
      }else{
        return{
            statuscode:400,
            mesage:"not found"
        }
      }
    },(response)=>{
        return{
            statuscode:400,
            mesage:"not found",
            response
        }
    })
}

//unLike
const unLike=(filename,likeId)=>{
    return db.Heart.updateOne({filename},{
        $pull:{'likes':{
            likeId
        }}
        
    }).then((response)=>{
        return{
            statuscode:200,
            Message:'Successful'
        }
    })
}

//deleting a post
const deletePost=(_id,filename)=>{
    
    return db.User.updateOne({_id},{
        $pull:{'posts':{
            filename:filename
        }}
    }).then((response)=>{
        return{
            statuscode:200,
            message:'Deleted'
        }
    },(response)=>{
        return{
            statuscode:400,
            message:'connot be Deleted'
        }
    })
}

//editing the profile
const editProfile=(_id,editingDetails)=>{
     return db.User.findOne({_id}).then((response)=>{
        response.Name=editingDetails.Name
        response.Email=editingDetails.Email
        
        response.save()
        return{
            statuscode:200,
            message:'Successfully updated'
        }
     })
}

//change password
const changePassword=(Email,Password)=>{
    return db.User.findOne({Email}).then((response)=>{
        response.Password=Password
        response.save()
        return{
            statuscode:200,
            messaage:'Password changed successfully'
        }
    },(response)=>{
        return{
            statuscode:200,
            messaage:'Account not found for this Email'
        }
    })
}

//change passfrom inside from the profile
const changePasswordFromProfile=(_id,Password)=>{
    return db.User.findOne({_id}).then((response)=>{
        response.Password=Password
        response.save()
        return{
            statuscode:200,
            messaage:'Password changed successfully'
        }
    },(response)=>{
        return{
            statuscode:200,
            messaage:'Account not found for this Email'
        }
    })
}

//deleting account from mongodb
const deleteAccount=(_id)=>{
    return db.User.deleteOne({_id}).then((response)=>{
        deleteComments(_id)
        return{

            statuscode:200,
            message:'Account deleted successfully'
        }
    })
    
}

//delete comments while deleting an account
const deleteComments=(from_id)=>{
    return db.Comment.deleteOne({from_id}).then((response)=>{
        return{
            statuscode:200,
            message:'Account deleted successfully'
        }
    })
}

// remove follower from profile
const removePeopleWhoFollow=(_id,followerId)=>{
    return db.User.updateOne({_id},{
        $pull:{'Following':{
            followerId:followerId
        }}
    }).then((response)=>{
         remove_idFromFollower(_id,followerId)
        return{
            statuscode:200,
            message:'successfully Deleted'
        }
    })
}

//remover from followId
const remove_idFromFollower=(_id,followId)=>{
    return db.User.updateOne({_id:followId},{
        $pull:{'Followers':{
            followId:_id
        }}
    }).then((response)=>{

        return{
            statuscode:200,
            message:'successfully Deleted'
        }
    })
}
module.exports={
    registerUser,
    login,
    uploadDetails,
    getDetails,
    getAllUsers,
    viewSuggestion,
    followUser,
    uploadProfilePic,
    addComments,
    readComments,
    unFollow,
    startMessage,
    findChats,
    messsagePerson1,
    messsagePerson2,
    outGoing,
    inComming,
    startLikes,getLikes,unLike,likes,
    deletePost,
    editProfile,
    changePassword,
    changePasswordFromProfile,deleteAccount,
    removePeopleWhoFollow
}