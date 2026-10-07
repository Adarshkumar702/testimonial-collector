const fs = require('fs');
const path = require('path');

class UploadService {
  getFileUrl(req, filename) {
    if (!filename) return null;
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}/uploads/${filename}`;
  }

  deleteFile(filename) {
    if (!filename) return;
    try {
      const filePath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Failed to delete uploaded file: ${filename}`, error);
    }
  }
}

module.exports = new UploadService();
