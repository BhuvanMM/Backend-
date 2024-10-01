import prisma from "../Database/dbConfig.js";
import vine,{errors} from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../config/mailer.js";
import { emailQueue, emailQueueName } from "../jobs/sendEmailJob.js";

class AuthController{
    static async register(req,res){
        try{
            const body = req.body
            const validator = vine.compile(registerSchema)
            const payload = await validator.validate(body)

            const findUser = await prisma.users.findUnique({
                where:{
                    email:payload.email
                }
            })
            if(findUser){
                return res.status(400).json({message:"user already exists"})
            }

            const salt = bcrypt.genSaltSync(10)
            payload.password = bcrypt.hashSync(payload.password,salt)

            const user = await prisma.users.create({
                data:payload
            })

            return res.status(201).json({message:"user created successfully" ,user})
        }
        catch(error){
            if (error instanceof errors.E_VALIDATION_ERROR) {
                    return res.status(400).json({errors:error.messages})
              }
              else{
                return res.status(500).json({
                    message:"something went wrong.please try again later."})
              }
        }
    }

    static async login(req,res){
        try{
            const body = req.body
            const validator = vine.compile(loginSchema)
            const payload = await validator.validate(body)

            const user = await prisma.users.findUnique({
                where:{
                    email:payload.email
                }
            })
            if(!user){
                return res.status(400).json({message:"user not found!"})
            }
            const isPassword = bcrypt.compareSync(payload.password,user.password)
            if(!isPassword){
                return res.status(400).json({message:"Invalid credentials"})
            }

            const payloadData = {
                id:user.id,
                name:user.name,
                email:user.email,
                profile:user.profile
            }

            const token = jwt.sign(payloadData,process.env.JWT_SECRET,
                {expiresIn:"365d"})
            return res.status(201).json({message:"Login successful!",
            access_token:`Bearer ${token}`})
        }
        catch(error){
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages)
              }
            else{
                return res.status(500).json({
                    message:"something went wrong.please try again later!"})
            }
        }
    }

    static async sendTestEmail(req,res){
        try{

            const {email} = req.query

            const payload = {
                toEmail:email,
                subject:'Testing Email',
                body:'<h1>Test Email</h1>'
            }

            //await sendEmail(payload.toEmail,payload.subject,payload.body);
            //return res.json({message:"Email success!"})

            await emailQueue.add(emailQueueName,payload)
            return res.json({message:"Job success!"})
        }
        catch(error){
            return res.json({message:"Email error!"})
        }
    }
}

export default AuthController;