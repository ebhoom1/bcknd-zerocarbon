

//working code localhost
// const path = require("path");
// const fs = require("fs");
// const ExcelJS = require("exceljs");
// const GRIReport = require("../../models/GRI/GRIReportModel");

// exports.exportGRIReport = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const report = await GRIReport.findOne({ userId });
//     if (!report)
//       return res.status(404).json({ message: "GRI Report not found." });

//     // Step 1: Flatten GRI responses
//     const plainResponses = {};
//     for (const sectionKey of report.responses.keys()) {
//       const disclosureMap = report.responses.get(sectionKey);
//       plainResponses[sectionKey] = {};
//       for (const [disclosure, value] of disclosureMap.entries()) {
//         plainResponses[sectionKey][disclosure.trim()] = value;
//       }
//     }

//     // Step 2: Load Excel template
//     const templatePath = path.join(
//       __dirname,
//       "../../assets/templates/gri-template.xlsx"
//     );
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(templatePath);
//     const sheet = workbook.getWorksheet("2. Content index with reference");

//     // Step 3: Remove early merged headers (E1–E4)
//     Object.keys(sheet._merges).forEach((mergeRange) => {
//       if (
//         mergeRange.includes("E1") ||
//         mergeRange.includes("E2") ||
//         mergeRange.includes("E3") ||
//         mergeRange.includes("E4")
//       ) {
//         sheet.unMergeCells(mergeRange);
//       }
//     });

//     // Step 4: Update proper headers (row 5, columns E-G)
//     const headerRow = sheet.getRow(5);
//     const headerStyle = {
//       fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } },
//       font: { bold: true, color: { argb: "FFFFFF" } },
//       alignment: { horizontal: "center", vertical: "middle" }
//     };

//     headerRow.getCell(5).value = "GRI STANDARD";  // Column E
//     headerRow.getCell(6).value = "DISCLOSURE";    // Column F
//     headerRow.getCell(7).value = "LOCATION";      // Column G

//     [5, 6, 7].forEach((col) => {
//       headerRow.getCell(col).style = headerStyle;
//     });
//     headerRow.commit();

//     // Step 5: Fill LOCATION values (Column G = 7) + apply wrapText
//     sheet.eachRow((row, rowNumber) => {
//       if (rowNumber <= 5) return;

//       const disclosure = row.getCell(6).value;
//       if (!disclosure || typeof disclosure !== "string") return;

//       const actualTitle = disclosure.trim().replace(/^\d+[-.]?\d*\s*/, "").trim();

//       for (const section in plainResponses) {
//         if (plainResponses[section]?.[actualTitle]) {
//           const locationCell = row.getCell(7);
//           locationCell.value = plainResponses[section][actualTitle];

//           // 🧾 Wrap long LOCATION text
//           locationCell.alignment = {
//             wrapText: true,
//             vertical: "top"
//           };

//           // Optional: increase row height if you want
//           row.height = 40;
//           break;
//         }
//       }
//     });

//     // Step 6: Set column widths
//     sheet.getColumn(5).width = 30; // GRI STANDARD
//     sheet.getColumn(6).width = 60; // DISCLOSURE
//     sheet.getColumn(7).width = 60; // LOCATION

//     // Step 7: Write file and send
//     const filePath = path.join(__dirname, `GRI_Report_${userId}.xlsx`);
//     await workbook.xlsx.writeFile(filePath);
//     console.log("✅ ExcelJS GRI report written:", filePath);

//     res.setHeader("Content-Disposition", `attachment; filename=GRI_Report_${userId}.xlsx`);
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

//     const fileBuffer = fs.readFileSync(filePath);
//     res.end(fileBuffer);
//   } catch (err) {
//     console.error("❌ Error exporting GRI with ExcelJS:", err);
//     res.status(500).json({ message: "Failed to export GRI report." });
//   }
// };


const path = require("path");
const ExcelJS = require("exceljs");
const GRIReport = require("../../models/GRI/GRIReportModel");

exports.exportGRIReport = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Fetch GRI report for the user
    const report = await GRIReport.findOne({ userId });
    if (!report)
      return res.status(404).json({ message: "GRI Report not found." });

    // Step 2: Flatten GRI responses
    const plainResponses = {};
    for (const sectionKey of report.responses.keys()) {
      const disclosureMap = report.responses.get(sectionKey);
      plainResponses[sectionKey] = {};
      for (const [disclosure, value] of disclosureMap.entries()) {
        plainResponses[sectionKey][disclosure.trim()] = value;
      }
    }

    // Step 3: Load Excel template
    const templatePath = path.join(
      __dirname,
      "../../assets/templates/gri-template.xlsx"
    );
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const sheet = workbook.getWorksheet("2. Content index with reference");

    // Step 4: Clean header merges (optional visual fix)
    Object.keys(sheet._merges).forEach((mergeRange) => {
      if (
        mergeRange.includes("E1") ||
        mergeRange.includes("E2") ||
        mergeRange.includes("E3") ||
        mergeRange.includes("E4")
      ) {
        sheet.unMergeCells(mergeRange);
      }
    });

    // Step 5: Update header row styling
    const headerRow = sheet.getRow(5);
    const headerStyle = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } },
      font: { bold: true, color: { argb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "middle" }
    };

    headerRow.getCell(5).value = "GRI STANDARD";
    headerRow.getCell(6).value = "DISCLOSURE";
    headerRow.getCell(7).value = "LOCATION";

    [5, 6, 7].forEach((col) => {
      headerRow.getCell(col).style = headerStyle;
    });
    headerRow.commit();

    // Step 6: Map disclosures to LOCATION from MongoDB using exact match
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 5) return;

      const disclosureCell = row.getCell(6);
      if (!disclosureCell || typeof disclosureCell.value !== "string") return;

      const excelDisclosure = disclosureCell.value
        .replace(/^\d+[.-]?\d*\s*/, "") // Remove GRI number like "304-2"
        .replace(/\s+/g, " ")          // Normalize all whitespace
        .trim();

      for (const section in plainResponses) {
        const sectionMap = plainResponses[section];
        for (const key in sectionMap) {
          const normalizedKey = key.replace(/\s+/g, " ").trim();

          if (excelDisclosure === normalizedKey) {
            const locationCell = row.getCell(7);
            locationCell.value = sectionMap[key];
            locationCell.alignment = { wrapText: true, vertical: "top" };
            row.height = 40;
            return;
          }
        }
      }
    });

    // Step 7: Set clean column widths
    sheet.getColumn(5).width = 30; // GRI STANDARD
    sheet.getColumn(6).width = 60; // DISCLOSURE
    sheet.getColumn(7).width = 60; // LOCATION

    // Step 8: Stream Excel as direct response
    res.setHeader("Content-Disposition", `attachment; filename=GRI_Report_${userId}.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Cache-Control", "no-cache");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error exporting GRI with ExcelJS:", err);
    res.status(500).json({ message: "Failed to export GRI report." });
  }
};
