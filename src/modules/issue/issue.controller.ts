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

const deleteIssue = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const result = await issueService.issueDeleteFromDB(id as string, req)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully",
            data: result
        })
    } catch (error: any) {
        const message = error?.message
        let statusCode = 500
        if (message === "Unauthorized") {
            statusCode = 401
        }
        else if (message === "Forbidden") {
            statusCode = 403
        }
        else if (message === "Issue Not Found") {
            statusCode = 404
        }
        sendResponse(res, {
            statusCode,
            success: false,
            message,
            error: error
        })
    }
}

const getSingleIssue = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const result = await issueService.getSingleIssueFromDB(id as string)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: result
        })
    } catch (error: any) {
        const message = error?.message
        let statusCode = 500
        if (message === "Issue Not Found") {
            statusCode = 404
        }
        sendResponse(res, {
            statusCode,
            success: false,
            message,
            error: error
        })
    }
}
const getAllIssues = async (req: Request, res: Response) => {

    try {

        const result = await issueService.getAllIssuesFromDB(req.query)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: result
        })

    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error?.message,
            error: error
        })
    }
}
export const issueController = {
    createIssue,
    deleteIssue,
    getSingleIssue,
    getAllIssues
}