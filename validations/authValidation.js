import vine from "@vinejs/vine";
import { customErrorReporter } from "./customErrorReporter.js";

vine.errorReporter = () => new customErrorReporter()

export const registerSchema = vine.object({
    name:vine.string().minLength(2).maxLength(150),
    email:vine.string().email(),
    password:vine.string().minLength(6).maxLength(20).confirmed()
})

export const loginSchema = vine.object({
    email:vine.string().email(),
    password:vine.string().minLength(6).maxLength(7)
})
