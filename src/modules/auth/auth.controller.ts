import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const signupUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.signupUserIntoDB(req.body)
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: error.message === "User already exists" ? 409 : 500,
            success: false,
            message: error.message,
            error
        })
    }
}

export const authController = {
    signupUser
}