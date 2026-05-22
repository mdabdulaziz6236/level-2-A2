import type { Request, Response, NextFunction } from "express"

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const message = err?.message

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

    res.status(statusCode).json({
        success: false,
        message: message || "Something went wrong"
    })
}

export default globalErrorHandler