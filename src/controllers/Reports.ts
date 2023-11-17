import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Receipt from '../models/Receipt';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { reportsDirectory } from '../constants';

const downloadReports = async (req: Request, res: Response, next: NextFunction) => {
    const reportName = req.params.fileName;
    try {
        const zip = new AdmZip();

        // if (uploadDir.length === 0) {
        //     res.status(404).json({ message: 'No files to download' });
        //     return;
        // }

        // for (let i = 0; i < uploadDir.length; i++) {
        //     zip.addLocalFile(`${reportsDirectory}/` + uploadDir[i]);
        // }

        if (!fs.existsSync(`${reportsDirectory}/${reportName}`)) {
            console.log('Requested file does not exist');
            return res.status(404).json({ message: `${reportName} does not exist. Please check the name again` });
        }
        zip.addLocalFile(`${reportsDirectory}/` + reportName);
        const downloadName = `reports.zip`;

        const data = zip.toBuffer();

        // try {
        //     fs.rmSync('./reports', { recursive: true });
        // } catch (error) {
        //     console.log('error occurred in deleting directory', error);
        // }
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${downloadName}`);
        res.set('Content-Length', String(data.length));
        res.status(200).send(data);
    } catch (error) {
        console.error('Failed to download reports', error);

        res.status(500).json({ message: 'Failed to download reports' });
    }

    // res.sendStatus(200);
};

const getAllReportsNames = async (req: Request, res: Response, next: NextFunction) => {
    if (!fs.existsSync(reportsDirectory)) {
        fs.mkdirSync(reportsDirectory);
        console.log('Folder Created Successfully.');
        return res.status(404).json({ message: 'No Reports' });
    }
    try {
        const fileNames = fs.readdirSync(reportsDirectory, { withFileTypes: true }).map((item, index) => {
            // console.log(`File ${index} in the directory`, item);
            return item.name;
        });

        return res.status(200).json(fileNames);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get files in the directory' });
    }
};
export default { downloadReports, getAllReportsNames };
