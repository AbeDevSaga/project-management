const Manual = require("../models/manual");
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");

// Ensure the uploads directory exists
const manualsDir = path.join(__dirname, "..", "Uploads", "Manuals");
if (!fs.existsSync(manualsDir)) {
  fs.mkdirSync(manualsDir, { recursive: true });
}

const createManual = async (req, res) => {
  console.log("createManual");
  try {
    const { title, description, type, department } = req.body;
    console.log(title, description, type, department)
    const createdBy = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Ensure the uploads directory exists
    const manualsDir = path.join(__dirname, '../Uploads/Manuals');
    if (!fs.existsSync(manualsDir)) {
      fs.mkdirSync(manualsDir, { recursive: true });
    }

    // Use the original filename to preserve extension
    const originalFilename = req.file.originalname;
    const filePath = path.join('Manuals', originalFilename);
    const fullPath = path.join(manualsDir, originalFilename);

    // Move the file from temp location to permanent storage
    fs.renameSync(req.file.path, fullPath);
    
    const manual = new Manual({
      title,
      description,
      type,
      department,
      file: filePath,
      createdBy,
    });

    await manual.save();
    res.status(201).json({ 
      message: "Manual created successfully",
      manual: {
        id: manual._id,
        title: manual.title,
        file: manual.file
      }
    });
  } catch (error) {
    // Clean up uploaded file if manual creation fails
    if (req.file && req.file.path) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    res.status(400).json({ 
      error: "Manual creation failed", 
      details: error.message 
    });
  }
};

const updateManual = async (req, res) => {
  console.log("updateManual");
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;
    const updates = { title, description, type };

    // Handle file update if new file is provided
    if (req.file) {
      const manual = await Manual.findById(id);
      if (!manual) {
        return res.status(404).json({ message: "Manual not found" });
      }

      // Delete old file
      if (manual.file) {
        const oldFilePath = path.join(__dirname, "..", "Uploads", manual.file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Add new file path to updates
      updates.file = path.join("Manuals", req.file.filename);
    }

    const updatedManual = await Manual.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedManual) {
      return res.status(404).json({ message: "Manual not found" });
    }

    res.status(200).json({
      message: "Manual updated successfully",
      manual: updatedManual,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update manual", error });
  }
};

const deleteManual = async (req, res) => {
  console.log("deleteManual");
  try {
    const { id } = req.params;
    const manual = await Manual.findById(id);

    if (!manual) {
      return res.status(404).json({ message: "Manual not found" });
    }

    // Delete the associated file
    if (manual.file) {
      const filePath = path.join(__dirname, "..", "Uploads", manual.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Manual.findByIdAndDelete(id);
    res.status(200).json({ message: "Manual deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete manual", error });
  }
};

const getAllManuals = async (req, res) => {
  console.log("getAllManuals");
  try {
    const manuals = await Manual.find().sort({ createdAt: -1 });
    res.status(200).json(manuals);
  } catch (error) {
    res.status(500).json({ message: "Failed to get manuals", error });
  }
};

const getManualsByDepartment = async (req, res) => {
  console.log("getManualsByDepartment");
  try {
    const { id } = req.params;
    console.log("id: ", id)
    const manuals = await Manual.find({ department: id }).sort({ createdAt: -1 });
    res.status(200).json(manuals);
  } catch (error) {
    res.status(500).json({ message: "Failed to get manuals", error });
  }
};

const getManualById = async (req, res) => {
  console.log("getManualById");
  try {
    const { id } = req.params;
    const manual = await Manual.findById(id);
    if (!manual) return res.status(404).json({ message: "Manual not found" });
    res.status(200).json(manual);
  } catch (error) {
    res.status(500).json({ message: "Failed to get manual", error });
  }
};


const downloadManual = async (req, res) => {
  console.log("downloadManual");
  try {
    const { id } = req.params;
    const manual = await Manual.findById(id);

    if (!manual || !manual.file) {
      return res.status(404).json({ message: "Manual not found" });
    }

    const filePath = path.join(__dirname, '../Uploads', manual.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Get the original filename
    const filename = path.basename(manual.file);
    
    // Set proper headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf'); // Set to actual file type
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error streaming file" });
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: "Download failed" });
  }
};

const getManualsByType = async (req, res) => {
  console.log("getManualsByType");
  try {
    const { type } = req.params;
    const manuals = await Manual.find({ type }).sort({ createdAt: -1 });
    if (!manuals || manuals.length === 0) {
      return res.status(404).json({ message: "No manuals found for this type" });
    }
    res.status(200).json(manuals);
  } catch (error) {
    res.status(500).json({ message: "Failed to get manuals by type", error });
  }
};

const getRecentManuals = async (req, res) => {
  console.log("getRecentManuals");
  try {
    const { limit = 5 } = req.query;
    const manuals = await Manual.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.status(200).json(manuals);
  } catch (error) {
    res.status(500).json({ message: "Failed to get recent manuals", error });
  }
};

module.exports = {
  createManual,
  updateManual,
  deleteManual,
  getAllManuals,
  getManualById,
  getManualsByDepartment,
  downloadManual,
  getManualsByType,
  getRecentManuals
};