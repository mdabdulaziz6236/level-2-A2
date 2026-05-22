import { Router } from "express";
import { issueController } from "./issue.controller";

const router = Router();

router.get('/:id', issueController.getSingleIssue)
router.post('/', issueController.createIssue)
router.delete('/:id', issueController.deleteIssue)



export const issueRoute = router;