import fs from 'fs';
import path from 'path';

// Function to delete files older than 10 days
export const deleteOldFiles = (directoryPath) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        const now = Date.now();
        const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }

                const fileAge = now - stats.mtimeMs; // File modification time
                if (fileAge > tenDaysInMillis) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log(`Deleted old file: ${file}`);
                        }
                    });
                }
            });
        });
    });
};
