import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get('/:id', issueController.getSingleIssue)
router.get('/', issueController.getAllIssues)
router.post('/', auth, issueController.createIssue)
router.delete('/:id', auth, issueController.deleteIssue)
router.patch('/:id', auth, issueController.updateIssue)



export const issueRoute = router;