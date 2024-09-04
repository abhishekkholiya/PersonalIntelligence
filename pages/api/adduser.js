import User from "@/models/User"
import connectDb from "@/middleware/mongoose";
const handler = async (req,res)=>{
    await connectDb();
    // const session = await getSession({ req });
    // if (!session) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }
    if(req.method === "POST"){
        try{
            console.log(req.body);
            let p = new User({
                userUID:req.body.userUID,
                username:req.body.username,
                avatar:req.body.avatar,
                email:req.bodyemail,
                gender:req.body.gender,
               
                date_of_birth:req.body.date,
                usernumber:0,
                
                latitude:req.body.Latitude,
                longitude:req.body.Longitude,
                location:req.body.location,
                spotify_access:" "
            });
            const savedUser = await p.save();
            res.status(201).json(savedUser);
        }catch (error){
            console.error('Error adding user:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }else{
        res.status(400).json({error:"This method is not allowed"});
    }
}
export default connectDb(handler);