import express from 'express';
import reportsController from '../controllers/Reports';

const router = express.Router();

/**
 * @swagger
 * /reports:
 *      get:
 *          tags:
 *          - Reports
 *          summary : Returns all reports names
 *          responses:
 *              200:
 *                  description: Success
 *              404:
 *                  description: No reports found
 *              500:
 *                  description: Internal Server Error
 */
router.get('/', reportsController.getAllReportsNames);

/**
 * @swagger
 * /reports/download/{fileName}:
 *      get:
 *          tags:
 *          - Reports
 *          summary : Downloads a report using its file name
 *          parameters:
 *          -   name: fileName
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *          responses:
 *              204:
 *                  description: Successfully downloaded report
 *              404:
 *                  description: Report not found
 *              500:
 *                  description: Internal Server Error
 */
router.get('/download/:fileName', reportsController.downloadReports);
export = router;
