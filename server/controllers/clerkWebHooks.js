import User from "../models/User.js";
import { Webhook } from "svix";


const clerkWebHooks = async () => {
    try {
        // create a svix instance with clerk webhook secret 
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // getting headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],

        }

        // verifing headers
        await whook.verify(JSON.stringify(req.body), headers)

        // geting data from req body

        const { data, type } = req.body

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        }

        //switch case for different events
        switch (type) {
            case "user.created": {
                await User.create(userData)
                break;
            }
                
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData)
                break;
            }
                
            case "user.deleted": {
                await User.findByIdAndDelete(data.id)
                break;
            }
                
            default:
                break;
        }

        res.json({ succes: true , message:"webhooks Recieved"})

    } catch (error) {
        console.log(error.message);
        res.json({ succes: false, message:error.message })


    }
}
export default clerkWebHooks