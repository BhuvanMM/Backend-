import {Queue,Worker} from 'bullmq';
import { defaultQueueConfig, redisConnect } from '../config/queue.js';

export const emailQueueName = "email-queue"

export const emailQueue= new Queue(emailQueueName,{
    connection:redisConnect,
    defaultJobOptions: defaultQueueConfig
})

export const handler = new Worker(emailQueueName,async(job)=>{
    console.log("Worker data")
},
{
    connection:redisConnect,

})

handler.on("completed",(job) =>{
    console.log(`The job ${job.id} is completed`)
})

handler.on("failed",(job) =>{
    console.log(`The job ${job.id} is failed`)
})