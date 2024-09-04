import User from '@/models/User';
import connectDb from "@/middleware/mongoose";
const handler = async (req,res)=>{
    try{
       
    
    
            if(req.method === "POST"){
                const {userUID,newData} = req.body;
               // if(sessionID){
                   
                    let updatedUser = await User.findOneAndUpdate({userUID},{$set:newData},{new:true});
                    if(!updatedUser){
                        res.status(404).json({message:"User not found"});
                    }
                    
                    res.status(200).json({ success: "success", user: updatedUser });
                // }else{
                //     res.status(401).json({error:"Unauthorized"});
                // }
            }else{
                res.status(400).json({error:"This method is not allowed"});
            }
    }catch(err){
        console.log(err);
    }
    
}
export default connectDb(handler);