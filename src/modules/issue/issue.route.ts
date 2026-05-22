import { Router } from "express";
import { issueController } from "./issue.controller";

const router = Router();

router.get('/:id', issueController.getSingleIssue)
router.get('/', issueController.getAllIssues)
router.post('/', issueController.createIssue)
router.delete('/:id', issueController.deleteIssue)
router.patch('/:id', issueController.updateIssue)



export const issueRoute = router;