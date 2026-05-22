import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";
import handleError from "../../utils/handleError";

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
        handleError(res, error)
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
        handleError(res, error)
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
        handleError(res, error)
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

        handleError(res, error)
    }
}

const updateIssue = async (req: Request, res: Response) => {

    const id = req.params.id

    try {

        const result = await issueService.updateIssueIntoDB(
            id as string,
            req.body,
            req as any
        )

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result
        })

    } catch (error: any) {

        handleError(res, error)
    }
}
export const issueController = {
    createIssue,
    deleteIssue,
    getSingleIssue,
    getAllIssues,
    updateIssue
}