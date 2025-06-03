const GRIReport = require("../../models/GRI/GRIReportModel");

exports.saveGRIResponses = async (req, res) => {
    try {
      const { userId, responses } = req.body;
  
      if (!userId || !responses) {
        return res.status(400).json({ message: "userId and responses are required." });
      }
  
      let report = await GRIReport.findOne({ userId });
  
      if (report) {
        Object.keys(responses).forEach((section) => {
          const newDisclosures = responses[section];
  
          const existingSection = report.responses.get(section) || new Map();
  
          const merged = new Map();
          Object.entries({ ...Object.fromEntries(existingSection), ...newDisclosures }).forEach(([key, value]) => {
            merged.set(key, value);
          });
  
          report.responses.set(section, merged);
        });
  
        report.markModified("responses");
        report.submittedAt = new Date();
      } else {
        report = new GRIReport({ userId, responses });
      }
  
      await report.save();
      res.status(200).json({ message: "GRI report saved successfully", report });
    } catch (error) {
      console.error("Error saving GRI responses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  exports.getGRIResponses = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const report = await GRIReport.findOne({ userId });
      if (!report) {
        return res.status(404).json({ message: "GRI report not found" });
      }
  
      res.status(200).json(report);
    } catch (error) {
      console.error("Error fetching GRI responses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };