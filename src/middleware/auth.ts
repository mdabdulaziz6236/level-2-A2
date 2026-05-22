import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"

import config from "../config"
import sendResponse from "../utils/sendResponse"
import { pool } from "../db"

const auth = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization
    if (!token) {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(
            token,
            config.secret as string
        ) as JwtPayload

        const userData = await pool.query(
            `
            SELECT * FROM users WHERE email=$1
            `,
            [decoded.email]
        )
        if (userData.rowCount === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not found!"
            })
        }
        req.user = userData.rows[0]
        next()
    } catch {

        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: "Invalid or expired token"
        })
    }
}

export default auth