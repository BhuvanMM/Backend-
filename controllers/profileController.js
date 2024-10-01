import prisma from '../Database/dbConfig.js'
import { imageValidator } from '../utils/helper.js'


class ProfileController{
    static async index(req,res){
        try{
            const user = req.user
            return res.status(201).json({user})
        }
        catch(error){
            return res.status(500).json({message:"something went wrong!"})
        }
    }
    
    static async store(){

    }

    static async show(){

    }

    static async update(){
        try{
            const {id} = req.params
            const authUser = req.user

            if(!req.files || Object.keys(req.files).length === 0){
                return res.status(400).json({message:"Profile image is required."})
            }

            const profile = req.files.profile
            const message = imageValidator(profile?.size,profile.mimetype)
            if(message === null){
                return res.status(400).json({
                    errors:{
                        profile:message,
                    }
                })
            }
        }
        catch(error){

        }
    }

    static async destroy(){

    }
}

export default ProfileController;