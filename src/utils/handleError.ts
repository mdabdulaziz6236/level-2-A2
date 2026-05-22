import type { Response } from "express"
import sendResponse from "./sendResponse"

const handleError = (
    res: Response,
    error?: any
) => {

    const message = error?.message

    let statusCode = 500

    if (
        message === "Unauthorized" ||
        message === "Invalid or expired token"
    ) {
        statusCode = 401
    }

    else if (
        message === "Invalid email" ||
        message === "Invalid password"
    ) {
        statusCode = 401
    }

    else if (message === "Forbidden") {
        statusCode = 403
    }

    else if (
        message === "Issue Not Found" ||
        message === "User Not Found"
    ) {
        statusCode = 404
    }

    else if (message === "User already exists") {
        statusCode = 409
    }

    sendResponse(res, {
        statusCode,
        success: false,
        message,
        error
    })
}

export default handleError