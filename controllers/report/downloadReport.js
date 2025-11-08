
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const BRSRSectionA = require("../../models/report/BRSRSectionA");
const BRSRSectionC = require("../../models/report/BRSRSectionC");
const SectionCSubmission = require("../../models/report/sectionCsubmission");
const SectionBSubmission = require("../../models/report/sectionBsubmission");
const Submission = require("../../models/Submission");
const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");
const Form = require("../../models/Form");
const generalGuidanceHTML = require("../../utils/report/generalGuidance");
const { generateSectionAHTML } = require("../../utils/report/generateSectionAHTML");
const { generateSectionBHTML } = require("../../utils/report/generateSectionBHTML");
const { generateSectionCHTML } = require("../../utils/report/generateSectionCHTML");

exports.downloadReport = async (req, res) => {
  try {
    const { userId } = req.params;

    const questionsMap = req.body?.questionsMap || JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../data/questions.json"), "utf-8")
    );

    const submission = await Submission.findOne({ userId });
    const monthlySubmission = await MonthlySubmission.findOne({ userId }).sort({
      submittedAt: -1,
    });
    const formData = await Form.findOne({ userId });
    const sectionA = await BRSRSectionA.findOne({ userId });
    const sectionB = await require("../../models/report/BRSRSectionB").findOne({ userId });
    const sectionC = await BRSRSectionC.findOne({ userId });
    const sectionCData = await SectionCSubmission.findOne({ userId });
    console.log("sectionA:", sectionA);
    console.log("sectionB:", sectionB);
    console.log("sectionC:", sectionC);
    console.log("sectionCData:", sectionCData);

    // Build Section A data even if BRSRSectionA doc is missing/empty
    const sectionAData = sectionA?.data || [];



    const sectionBResponsesDoc = await SectionBSubmission.findOne({ userId });

    const responses = submission?.responses || null;
    const Monthlyresponses = monthlySubmission?.responses || null;

    const sectionBResponses = sectionBResponsesDoc ? sectionBResponsesDoc.toObject() : {};

    const sectionAHTML = generateSectionAHTML(sectionAData, responses, Monthlyresponses, formData, questionsMap);
    // const sectionBHTML = sectionB?.data?.length ? generateSectionBHTML(sectionB.data, sectionBResponses) : "";
    const sectionBData = sectionB?.data || [];

    const sectionBHTML = generateSectionBHTML(sectionBData, sectionBResponses);
    // const sectionCHTML = sectionC?.data ? generateSectionCHTML(sectionC.data, sectionCData?.disclosures || []) : "";
    const sectionCHTML = generateSectionCHTML(
      sectionC?.data || {},
      sectionCData?.disclosures || []
    );


    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 20mm 10mm;
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
          }
          h3 {
            text-align: left;
            text-decoration: underline;
            margin-bottom: 20px;
          }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          th, td {
            border: 0.5px solid black;
            padding: 8px;
            text-align: left;
          }
          .mainhead {
            background-color: #f2f2f2;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <h1>Business Responsibility and Sustainability Report</h1>
        ${generalGuidanceHTML}
        ${sectionAHTML}
        ${sectionBHTML}
        ${sectionCHTML}
      </body>
      </html>
    `;

    const reportsDir = path.join(__dirname, "../../reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const htmlPath = path.join(reportsDir, `BRSR_Report_${userId}.html`);
    fs.writeFileSync(htmlPath, htmlContent, "utf-8");

    // const browser = await puppeteer.launch({ headless: "new" });  //works in localhost
    const browser = await puppeteer.launch({  //works in production
      headless: "new",
      executablePath: "/snap/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "load" });

    const pdfPath = path.join(reportsDir, `BRSR_Report_${userId}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px" }
    });

    await browser.close();

    res.download(pdfPath, (err) => {
      if (err) console.error("❌ Error sending PDF:", err);
      fs.unlink(pdfPath, (err) => err && console.error("❌ Error deleting PDF:", err));
      fs.unlink(htmlPath, (err) => err && console.error("❌ Error deleting HTML:", err));
    });

  } catch (error) {
    console.error("❌ Error generating BRSR PDF:", error);
    res.status(500).json({ error: "Failed to generate BRSR PDF" });
  }
};
