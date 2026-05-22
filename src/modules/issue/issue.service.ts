import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { TIssue, TIssueQuery } from "./issue.interface"
import config from '../../config'
import { pool } from '../../db'
import { USER_ROLE } from '../../types'


const issueCreateIntoDB = async (payload: TIssue, req: any) => {

    const { description, title, type } = payload
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("Unauthorized")
    }
    let decoded: JwtPayload
    try {
        decoded = jwt.verify(token, config.secret as string) as JwtPayload
    } catch (err) {
        throw new Error("Invalid or expired token")
    }
    req.user = decoded
    const userData = await pool.query(` 
        SELECT * FROM users WHERE email=$1
        `, [req.user.email])
    if (userData.rowCount === 0) {
        throw new Error("User Not Found")
    }
    const result = await pool.query(` 
        INSERT INTO issues(description, title, type, reporter_id) VALUES($1,$2,$3,$4)
        RETURNING * `, [description, title, type, req.user.id])

    return result.rows[0]
}

const issueDeleteFromDB = async (id: string, req: any) => {
    const token = req.headers.authorization
    if (!token) {
        throw new Error("Unauthorized")
    }
    let decoded: JwtPayload
    try {
        decoded = jwt.verify(
            token,
            config.secret as string
        ) as JwtPayload
    } catch {
        throw new Error("Invalid or expired token")
    }
    req.user = decoded
    // role check
    if (req.user.role !== USER_ROLE.maintainer) {
        throw new Error("Forbidden")
    }
    const result = await pool.query(
        `DELETE FROM issues WHERE id=$1`,
        [id]
    )
    if (result.rowCount === 0) {
        throw new Error("Issue Not Found")
    }
    return result.rows[0]
}

const getSingleIssueFromDB = async (id: string) => {

    const result = await pool.query(
        `SELECT * FROM issues WHERE id=$1`,
        [id]
    )
    if (result.rowCount === 0) {
        throw new Error("Issue Not Found")
    }
    const issue = result.rows[0]
    const reporterResult = await pool.query(` 
        SELECT id,name,role FROM users WHERE id=$1
        `, [issue.reporter_id])
    const reporter = reporterResult.rows[0]

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporter,
        created_at: issue.created_at,
        updated_at: issue.updated_at
    }
}

const getAllIssuesFromDB = async (query: TIssueQuery) => {

    const { sort = "newest", type, status } = query

    let sql = `
        SELECT * FROM issues
        WHERE 1=1
    `

    const values: any[] = []

    // filter by type
    if (type) {
        values.push(type)
        sql += ` AND type = $${values.length}`
    }

    // filter by status
    if (status) {
        values.push(status)
        sql += ` AND status = $${values.length}`
    }

    // sorting
    if (sort === "oldest") {
        sql += ` ORDER BY created_at ASC`
    } else {
        sql += ` ORDER BY created_at DESC`
    }

    // fetch issues
    const result = await pool.query(sql, values)

    const issues = result.rows
    if (issues.length === 0) {
        throw new Error("No Issues")
    }

    // get reporter ids
    const reporterIds = [
        ...new Set(issues.map(issue => issue.reporter_id))
    ]

    // fetch reporters
    const reportersResult = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = ANY($1)
        `,
        [reporterIds]
    )

    const reporters = reportersResult.rows

    // map reporter data
    const formattedIssues = issues.map(issue => {

        const reporter = reporters.find(
            user => user.id === issue.reporter_id
        )
        return {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,

            reporter: reporter,

            created_at: issue.created_at,
            updated_at: issue.updated_at
        }
    })

    return formattedIssues
}

export const issueService = {
    issueCreateIntoDB,
    issueDeleteFromDB,
    getSingleIssueFromDB,
    getAllIssuesFromDB
}