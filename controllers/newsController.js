import prisma from "../Database/dbConfig.js";
import vine,{errors} from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController{
    static async index(req,res){

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 1

        if(page <= 0){
            page = 1
        }
        if(limit <= 0 || limit>=100){
            limit = 1
        }
        const skip = (page - 1)*limit

        const news = await prisma.news.findMany({
            take:limit,
            skip:skip,
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        profile:true
                    }
                }
            }
        })
        const newsTransform = news?.map((item)=> NewsApiTransform.transform(item))
        const totalNews = await prisma.news.count()
        const totalPages = Math.ceil(totalNews/limit)


        return res.json({status:200,news:newsTransform,metaData:{
            totalPages,
            currentPage:page,
            currentLimit:limit
        }})
    }
    static async store(req,res){
        try{
            const user = req.user
            const body = req.body
            const validator = vine.compile(newsSchema)
            const payload = await validator.validate(body)
            payload.image = ""
            payload.user_id = user.id

            const news = await prisma.news.create({
                data:payload
            })


            return res.status(201).json({message:"News created successfully!",news})
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
    static async show(req,res){
        const {id} = req.params 
        const news = await prisma.news.findUnique({
            where:{
                id:Number(id)
            },
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                    }
                }
            }
        })
        const transformNews = news ? NewsApiTransform.transform(news) : null
        return res.status(201).json({status:201,news:transformNews})

    }
    static async update(req,res){
        const {id} = req.params
        const user = req.user
        const body = req.body

        const news = await prisma.news.findUnique({
            where:{
                id:Number(id)
            }
        })
        if(user.id !== news.user_id){
            return res.status(400).json({message:"unauthorized"})
        }
        const validator = vine.compile(newsSchema)
        const payload = await validator.validate(body)

        await prisma.news.update({
            data:payload,
            where:{
                id:Number(id)
            }
        })
    }
    static async destory(req,res){
        const {id} = req.params
        const user = req.user

        const news = await prisma.news.findUnique({
            where:{
                id:Number(id)
            }
        })

        await prisma.news.delete({
            where:{
                id:Number(id)
            }
        })

        return res.json({message:"Deleted successfully!"})

    }
}

export default NewsController 