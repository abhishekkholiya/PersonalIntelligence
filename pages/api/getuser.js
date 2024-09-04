import User from '@/models/User.js';
import connectDb from "@/middleware/mongoose";
const handler = async (req,res)=>{
    try{
        // const session = await getSession({ req });
        // if (!session) {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }
        // const sessionUserID = session.session.user.id;
        //const { userUID: paramUserID } = req.query;
    
        // Check if the session user is trying to access their own data
        // if (sessionUserID !== paramUserID) {
        //   return res.status(403).json({ error: 'Forbidden' });
        // }
        const { userUID } = req.query;
        let user = await User.findOne({userUID:userUID});
        if (user) {
            res.status(200).json({ user });
          } else {
            res.status(404).json({ error: 'User not found' });
          }
    }catch (error){
        res.status(500).json({error:error});
       
    }
}
export default connectDb(handler);