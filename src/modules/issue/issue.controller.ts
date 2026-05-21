import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.issueCreateIntoDB(req.body, req)
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result
        })
    } catch (error: any) {
        const message = error?.message
        let statusCode = 500
        if (message === "Unauthorized") statusCode = 401
        else if (message === "User Not Found") statusCode = 404
        sendResponse(res, {
            statusCode,
            success: false,
            message: message,
            error: error
        })
    }
}
export const issueController = {
    createIssue
}