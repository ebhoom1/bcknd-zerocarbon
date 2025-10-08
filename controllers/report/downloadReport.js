// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const path = require("path");
// const BRSRSectionA = require("../../models/report/BRSRSectionA");
// const Submission = require("../../models/Submission");
// const Form = require("../../models/Form");
// const generalGuidanceHTML = require("../../utils/report/generalGuidance"); 

// exports.downloadReport = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const questionsMap = req.body?.questionsMap || JSON.parse(
//       fs.readFileSync(path.join(__dirname, "../../data/questions.json"), "utf-8")
//     );

//     const submission = await Submission.findOne({ userId });
//     const formData = await Form.findOne({ userId });
//     const report = await BRSRSectionA.findOne({ userId });

//     if (!submission || !report || !report.data?.length) {
//       return res.status(404).json({ error: "Data not found" });
//     }

//     const responses = submission.responses;
//     const htmlContent = generateHTML(report.data, responses, formData, questionsMap);

//     // Save HTML to /reports folder
//     const reportsDir = path.join(__dirname, "../../reports");
//     if (!fs.existsSync(reportsDir)) {
//       fs.mkdirSync(reportsDir, { recursive: true });
//     }

//     const htmlPath = path.join(reportsDir, `BRSR_Report_${userId}.html`);
//     fs.writeFileSync(htmlPath, htmlContent, "utf-8");
//     console.log("Reports dir exists?", fs.existsSync(reportsDir));

//     // Launch Puppeteer and generate PDF
    // // const browser = await puppeteer.launch({ headless: "new" }); //works in localhoast
    // const browser = await puppeteer.launch({  //works in production
    //   headless: "new",
    //   executablePath: "/snap/bin/chromium",
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"]
    // });
    
        
    
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "load" });

//     const pdfPath = path.join(reportsDir, `BRSR_Report_${userId}.pdf`);
//     // await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
//     await page.pdf({
//       path: pdfPath,
//       format: "A4",
//       printBackground: true,
//       margin: {
//         top: "40px",
//         bottom: "40px"
//       }
//     });
    
//     await browser.close();

//     // Send the file
//     // res.download(pdfPath);
//     res.download(pdfPath, (err) => {
//       if (err) {
//         console.error("❌ Error sending PDF:", err);
//       }
    
//       // Delete the PDF after download
//       fs.unlink(pdfPath, (err) => {
//         if (err) console.error("❌ Error deleting PDF:", err);
//         else console.log("✅ PDF deleted after sending.");
//       });
    
//       // Delete the temporary HTML file too
//       fs.unlink(htmlPath, (err) => {
//         if (err) console.error("❌ Error deleting HTML:", err);
//         else console.log("✅ HTML deleted after sending.");
//       });
//     });

//   } catch (error) {
//     console.error("❌ Error generating Section A PDF:", error);
//     res.status(500).json({ error: "Failed to generate Section A PDF" });
//   }
// };

// function generateHTML(data, responses, formData, questionsMap) {
//   const tableRows = data.map((row) => {
//     const key = row.report;
//     const sectionData = key === "form" ? null : responses.get(key);
//     console.log("sectiondata:",sectionData);
//     let content = "";

//     switch (row.qno) {
//       case "14":
//         content = formData?.description || "Not Available";
//         break;

//         case "15": {
//           if (Array.isArray(sectionData)) {
//             const PRODUCT_KEY = "UseofSoldProducts_Q1";
//             const REVENUE_KEY = "UseofSoldProducts_Q4";
//             const NIC_KEY = "UseofSoldProducts_Q5";
        
//             sectionData.sort((a, b) => {
//               const revA = parseFloat(a[REVENUE_KEY] || 0);
//               const revB = parseFloat(b[REVENUE_KEY] || 0);
//               return revB - revA;
//             });
        
//             content = `
//               <table style="width: 100%; border-collapse: collapse;" border="1">
//                 <thead>
//                   <tr>
//                     <th style="padding: 5px;">Product</th>
//                     <th style="padding: 5px;">Annual Revenue</th>
//                     <th style="padding: 5px;">NIC Code</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${sectionData
//                     .map((entry) => {
//                       const product = entry[PRODUCT_KEY] || "Not Available";
//                       const revenue = entry[REVENUE_KEY] || "Not Available";
//                       const nic = entry[NIC_KEY] || "Not Available";
        
//                       return `
//                         <tr>
//                           <td style="padding: 5px;">${product}</td>
//                           <td style="padding: 5px;">${revenue}</td>
//                           <td style="padding: 5px;">${nic}</td>
//                         </tr>`;
//                     })
//                     .join("")}
//                 </tbody>
//               </table>
//             `;
//           } else {
//             content = "Not Available";
//           }
//           break;
//         }

//         case "18": {
//           const entry = sectionData?.[0] || {}; // Assume data is in first object
//           const empTypes = entry["WorkforceComposition&Diversity(Management&HRData)_Q3"] || [];
//           const workerTypes = entry["WorkforceComposition&Diversity(Management&HRData)_Q7"] || [];
        
//           content = `
//             <h3>Employees</h3>
//             <table width="100%" border="1" style="border-collapse: collapse;">
//               <thead>
//                 <tr>
//                   <th>Male</th>
//                   <th>Female</th>
//                   <th>Other</th>
//                   <th>Total Employees</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q2_F2"] || "0"}</td>
//                   <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q2_F1"] || "0"}</td>
//                   <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q2_F3"] || "0"}</td>
//                   <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q1"] || "0"}</td>
//                 </tr>
//               </tbody>
//             </table>
        
//             <h3>Employment Type</h3>
//             <table width="60%" border="1" style="border-collapse: collapse; margin-bottom: 10px;">
//               <thead>
//                 <tr>
//                   <th>Type</th>
//                   <th>Count</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${
//                   empTypes.length > 0
//                     ? empTypes.map(emp => `
//                       <tr>
//                         <td>${emp.type}</td>
//                         <td>${emp.count}</td>
//                       </tr>`).join("")
//                     : `<tr><td colspan="2">Not Available</td></tr>`
//                 }
//               </tbody>
//             </table>
        
//             <p><strong>Total Differently Abled Employees:</strong> ${entry["WorkforceComposition&Diversity(Management&HRData)_Q4"] || "0"}</p>
        
//             <hr style="margin: 20px 0;">
        
//             <h3>Workers</h3>
//             <table width="100%" border="1" style="border-collapse: collapse;">
//               <thead>
//                 <tr>
//                   <th>Male</th>
//                   <th>Female</th>
//                   <th>Other</th>
//                   <th>Total Workers</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q6_F2"] || "0"}</td>
//                   <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q6_F1"] || "0"}</td>
//                   <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q6_F3"] || "0"}</td>
//                   <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q5"] || "0"}</td>
//                 </tr>
//               </tbody>
//             </table>
        
//             <h3>Employment Type</h3>
//             <table width="60%" border="1" style="border-collapse: collapse; margin-bottom: 10px;">
//               <thead>
//                 <tr>
//                   <th>Type</th>
//                   <th>Count</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${
//                   workerTypes.length > 0
//                     ? workerTypes.map(w => `
//                       <tr>
//                         <td>${w.type}</td>
//                         <td>${w.count}</td>
//                       </tr>`).join("")
//                     : `<tr><td colspan="2">Not Available</td></tr>`
//                 }
//               </tbody>
//             </table>
        
//             <p><strong>Total Differently Abled Workers:</strong> ${entry["WorkforceComposition&Diversity(Management&HRData)_Q8"] || "0"}</p>
//           `;
//           break;
//         }
        
//         case "19": {
//           const entry = sectionData?.[0] || {};
        
//           const get = (key) => entry[key] || "[X]";
        
//           const directorsTotal = get("BoardStructure&Leadership_Q1");
//           const directorsWomen = get("BoardStructure&Leadership_Q2");
//           const directorsDifferentlyAbled = get("BoardStructure&Leadership_Q3");
//           const womenDirectorsDifferentlyAbled = get("BoardStructure&Leadership_Q4");
//           const womenKMP = get("BoardStructure&Leadership_Q5");
//           const kmpDesignations = get("BoardStructure&Leadership_Q6") || [];
//           const differentlyAbledKMP = get("BoardStructure&Leadership_Q7");
//           const womenDifferentlyAbledKMP = get("BoardStructure&Leadership_Q8");
//           const affirmativeHiring = get("BoardStructure&Leadership_Q13");
        
//           content = `
//             <ul style="padding-left: 20px;">
//               <li>Total Directors on the Board: <strong>${directorsTotal}</strong></li>
//               <li>Total number of women on the Board of Directors: <strong>${directorsWomen}</strong></li>
//               <li>Total number of directors (any gender) who are differently abled: <strong>${directorsDifferentlyAbled}</strong></li>
//               <li>Total number of women directors who are differently abled: <strong>${womenDirectorsDifferentlyAbled}</strong></li>
//               <li>Total number of women in Key Managerial Personnel (KMP) roles: <strong>${womenKMP}</strong></li>
//               <li>KMP designations held by: <strong>${Array.isArray(kmpDesignations) ? kmpDesignations.join(", ") : kmpDesignations}</strong></li>
//               <li>Total number of differently abled persons (any gender) in KMP: <strong>${differentlyAbledKMP}</strong></li>
//               <li>Total number of women in KMP roles who are differently abled: <strong>${womenDifferentlyAbledKMP}</strong></li>
//               <li>Does the company have affirmative hiring for women or differently abled persons?: <strong>${affirmativeHiring}</strong></li>
//             </ul>
//           `;
//           break;
//         }
        
//         case "20": {
//           const entry = sectionData?.[0] || {};
        
//           const get = (key) => entry[key] || "XX";
        
//           const empTotal = get("TurnoverData_Q1");
//           const empMale = get("TurnoverData_Q2");
//           const empFemale = get("TurnoverData_Q3");
//           const empOther = get("TurnoverData_Q4");
        
//           const workerTotal = get("TurnoverData_Q5");
//           const workerMale = get("TurnoverData_Q6");
//           const workerFemale = get("TurnoverData_Q7");
//           const workerOther = get("TurnoverData_Q8");
        
//           const empTurnoverRate = get("TurnoverData_Q9");
//           const workerTurnoverRate = get("TurnoverData_Q10");
        
//           content = `
//             <table width="100%" border="1" style="border-collapse: collapse;">
//               <thead>
//                 <tr>
//                   <th>Category</th>
//                   <th>Total</th>
//                   <th>Male</th>
//                   <th>Female</th>
//                   <th>Other Gender Identities</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>Permanent Employees Who Left</td>
//                   <td>${empTotal}</td>
//                   <td>${empMale}</td>
//                   <td>${empFemale}</td>
//                   <td>${empOther}</td>
//                 </tr>
//                 <tr>
//                   <td>Permanent Workers (Contractual, etc.) Who Left</td>
//                   <td>${workerTotal}</td>
//                   <td>${workerMale}</td>
//                   <td>${workerFemale}</td>
//                   <td>${workerOther}</td>
//                 </tr>
//                 <tr>
//                   <td>Overall Employee Turnover Rate (%)</td>
//                   <td>${empTurnoverRate}%</td>
//                   <td>-</td>
//                   <td>-</td>
//                   <td>-</td>
//                 </tr>
//                 <tr>
//                   <td>Worker Turnover Rate (%)</td>
//                   <td>${workerTurnoverRate}%</td>
//                   <td>-</td>
//                   <td>-</td>
//                   <td>-</td>
//                 </tr>
//               </tbody>
//             </table>
//           `;
//           break;
//         }
        
//         case "21": {
//           const entry = sectionData?.[0] || {};
        
//           const getCellData = (array, nameKey, ownershipKey) => {
//             if (!Array.isArray(array) || array.length === 0) return ["-", "-"];
//             const names = array.map(e => e[nameKey] || "-").join("<br>");
//             const ownerships = array.map(e => e[ownershipKey] || "-").join("<br>");
//             return [names, ownerships];
//           };
        
//           const holdingName = entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q2"] || "-";
//           const holdingOwnership = entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q3"] || "-";
        
//           const [subsidiaryNames, subsidiaryOwnerships] = getCellData(
//             entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q4"],
//             "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q4_F1",
//             "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q4_F2"
//           );
        
//           const [associateNames, associateOwnerships] = getCellData(
//             entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q5"],
//             "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q5_F1",
//             "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q5_F2"
//           );
        
//           const [jvNames, jvOwnerships] = getCellData(
//             entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q6"],
//             "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q6_F1",
//             "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q6_F2"
//           );
        
//           content = `
           
//             <table width="100%" border="1" style="border-collapse: collapse;">
//               <thead>
//                 <tr>
//                   <th>Entity Type</th>
//                   <th>Name(s)</th>
//                   <th>Percentage of Ownership/Control</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td><b>Holding Company</b></td>
//                   <td>${holdingName}</td>
//                   <td>${holdingOwnership}</td>
//                 </tr>
//                 ${
//                   subsidiaryNames !== "-" ? `
//                     <tr>
//                       <td><b>Subsidiary Companies</b></td>
//                       <td>${subsidiaryNames}</td>
//                       <td>${subsidiaryOwnerships}</td>
//                     </tr>` : ""
//                 }
//                 ${
//                   associateNames !== "-" ? `
//                     <tr>
//                       <td><b>Associate Companies</b></td>
//                       <td>${associateNames}</td>
//                       <td>${associateOwnerships}</td>
//                     </tr>` : ""
//                 }
//                 ${
//                   jvNames !== "-" ? `
//                     <tr>
//                       <td><b>Joint Ventures (JVs)</b></td>
//                       <td>${jvNames}</td>
//                       <td>${jvOwnerships}</td>
//                     </tr>` : ""
//                 }
//               </tbody>
//             </table>
//           `;
//           break;
//         }
        
        
//         case "23": {
//           const entry = sectionData?.[0] || {};
//           const get = (key) => entry[key] || "Not Available";
        
//           const grievanceForEmployees = get("GrievanceRedressal_Q1");
//           const grievanceForWorkers = get("GrievanceRedressal_Q2");
//           const grievanceChannels = get("GrievanceRedressal_Q3");
//           const averageResolutionTime = get("GrievanceRedressal_Q8");
//           const trackingEffectiveness = get("GrievanceRedressal_Q9");
        
//           content = `
//             <ul style="padding-left: 20px;">
//               <li><strong>Grievance Mechanism for Employees:</strong> ${grievanceForEmployees}</li>
//               <li><strong>Grievance Mechanism for Workers:</strong> ${grievanceForWorkers}</li>
//               <li><strong>Grievance Channels Available:</strong> ${grievanceChannels}</li>
//               <li><strong>Average Grievance Resolution Time:</strong> ${averageResolutionTime}</li>
//               <li><strong>Tracking of Grievance Redressal Effectiveness:</strong> ${trackingEffectiveness}</li>
//             </ul>
//           `;
//           break;
//         }
        
//         case "24": {
//           const entry = sectionData?.[0] || {};
//           const get = (key) => entry[key] || "Not Available";
        
//           const envRiskYesNo = get("SustainabilityRisks&Opportunities_Q1");
//           const envRiskList = get("SustainabilityRisks&Opportunities_Q2");
        
//           const socialRiskYesNo = get("SustainabilityRisks&Opportunities_Q3");
//           const socialRiskList = get("SustainabilityRisks&Opportunities_Q4");
        
//           const govRiskYesNo = get("SustainabilityRisks&Opportunities_Q5");
//           const govRiskList = get("SustainabilityRisks&Opportunities_Q6");
        
//           const esgOppYesNo = get("SustainabilityRisks&Opportunities_Q7");
//           const esgOppList = get("SustainabilityRisks&Opportunities_Q8");
        
//           content = `
//             <ul style="padding-left: 20px;">
//               <li><strong>Environmental Risks Identified:</strong> ${envRiskYesNo}
//                 <ul><li><strong>Key risks:</strong> ${envRiskList}</li></ul>
//               </li>
//               <li><strong>Social Risks Identified:</strong> ${socialRiskYesNo}
//                 <ul><li><strong>Key risks:</strong> ${socialRiskList}</li></ul>
//               </li>
//               <li><strong>Governance Risks Identified:</strong> ${govRiskYesNo}
//                 <ul><li><strong>Key risks:</strong> ${govRiskList}</li></ul>
//               </li>
//               <li><strong>ESG-Related Opportunities Identified:</strong> ${esgOppYesNo}
//                 <ul><li><strong>Key opportunities:</strong> ${esgOppList}</li></ul>
//               </li>
//             </ul>
//           `;
//           break;
//         }
        
     

     

//       default:
//         content = "Not Available";
//         break;
//     }

//     return `
//       <tr>
//         <td>${row.qno}</td>
//         <td>${row.fieldName}</td>
//         <td>${content}</td>
//       </tr>
//     `;
//   });

//   return `
//     <!DOCTYPE html>
//     <html>
//       <head>
//       <style>
//       body {
//         margin: 20mm 10mm;
//         font-family: Arial, sans-serif;
//         font-size: 12px;
//         line-height: 1.6;
//       }
//       .guidance-section {
//         margin: 10mm 20mm !important;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         page-break-inside: auto;
//       }
//       h1 {
//         text-align: center;
//         color: #2c3e50;
//         margin-bottom: 20px;
//       }
// h3{
//   text-align: left;
//   text-decoration: underline;
//   margin-bottom: 20px;

// }
//       thead {
//         display: table-header-group;
//       }
    
//       tfoot {
//         display: table-footer-group;
//       }
    
//       tr {
//         page-break-inside: avoid;
//         page-break-after: auto;
//       }
    
//       th, td {
//         border: 0.5px solid black;
//         padding: 8px;
//         text-align: left;
//       }
    
//       .mainhead {
//         background-color: #f2f2f2;
//         font-size: 14px;

//       }
//       @media print {
//         body {
//           margin: 20mm 10mm;
//           font-family: Arial, sans-serif;
//           font-size: 12px;
//           line-height: 1.6;
//         }
//         .guidance-section {
//           margin: 10mm 20mm !important;
//         }
    
//         table {
//           page-break-inside: auto;
//         }
    
//         tr {
//           page-break-inside: avoid;
//         }
    
//         thead, tfoot {
//           display: table-row-group;
//         }
//         th {
//           font-weight: bold;
//           background-color: #f2f2f2;
//         }
//         .mainhead {
//           font-size: 14px;
  
//         }
//       }

//     </style>
//   </head>
//   <body>
//   <h1>Business Responsibility and Sustainability Report</h1>
//   ${generalGuidanceHTML}

//     <h3>SECTION A: GENERAL DISCLOSURES</h3>
//     <table>
//     <thead>
//       <tr>
//         <th class="mainhead" style="width: 6%; background-color: #f2f2f2;">Q.No</th>
//         <th class="mainhead" style="width: 30%; background-color: #f2f2f2;">Field Name</th>
//         <th class="mainhead" style="width: 64%; background-color: #f2f2f2;">Report</th>
//       </tr>
//     </thead>
  
//     <tbody>
//       <!-- Repeatable Rows -->
//       ${tableRows.join("")}
//     </tbody>
  
//     <tfoot>
//       <tr>
//         <td colspan="3" style="border-top: 1px solid black;"></td>
//       </tr>
//     </tfoot>
//   </table>
      
//       </body>
//     </html>
//   `;
// }


// controllers/downloadReport.js
// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const path = require("path");
// const BRSRSectionA = require("../../models/report/BRSRSectionA");
// const Submission = require("../../models/Submission");
// const Form = require("../../models/Form");
// const generalGuidanceHTML = require("../../utils/report/generalGuidance");
// const { generateSectionAHTML } = require("../../utils/report/generateSectionAHTML");

// exports.downloadReport = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const questionsMap = req.body?.questionsMap || JSON.parse(
//       fs.readFileSync(path.join(__dirname, "../../data/questions.json"), "utf-8")
//     );

//     const submission = await Submission.findOne({ userId });
//     const formData = await Form.findOne({ userId });
//     const report = await BRSRSectionA.findOne({ userId });

//     if (!submission || !report || !report.data?.length) {
//       return res.status(404).json({ error: "Data not found" });
//     }

//     const responses = submission.responses;

//     const sectionAHTML = generateSectionAHTML(report.data, responses, formData, questionsMap);

//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body {
//             margin: 20mm 10mm;
//             font-family: Arial, sans-serif;
//             font-size: 12px;
//             line-height: 1.6;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             page-break-inside: auto;
//           }
//           h1 {
//             text-align: center;
//             color: #2c3e50;
//             margin-bottom: 20px;
//           }
//           h3 {
//             text-align: left;
//             text-decoration: underline;
//             margin-bottom: 20px;
//           }
//           thead { display: table-header-group; }
//           tfoot { display: table-footer-group; }
//           tr { page-break-inside: avoid; page-break-after: auto; }
//           th, td {
//             border: 0.5px solid black;
//             padding: 8px;
//             text-align: left;
//           }
//           .mainhead {
//             background-color: #f2f2f2;
//             font-size: 14px;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Business Responsibility and Sustainability Report</h1>
//         ${generalGuidanceHTML}
//         ${sectionAHTML}
//       </body>
//       </html>
//     `;

//     const reportsDir = path.join(__dirname, "../../reports");
//     if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

//     const htmlPath = path.join(reportsDir, `BRSR_Report_${userId}.html`);
//     fs.writeFileSync(htmlPath, htmlContent, "utf-8");

//        const browser = await puppeteer.launch({ headless: "new" }); //works in localhoast
//       //  const browser = await puppeteer.launch({  //works in production
//       //   headless: "new",
//       //   executablePath: "/snap/bin/chromium",
//       //   args: ["--no-sandbox", "--disable-setuid-sandbox"]
//       // });

//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "load" });

//     const pdfPath = path.join(reportsDir, `BRSR_Report_${userId}.pdf`);
//     await page.pdf({
//       path: pdfPath,
//       format: "A4",
//       printBackground: true,
//       margin: { top: "40px", bottom: "40px" }
//     });

//     await browser.close();

//     res.download(pdfPath, (err) => {
//       if (err) console.error("❌ Error sending PDF:", err);
//       fs.unlink(pdfPath, (err) => err && console.error("❌ Error deleting PDF:", err));
//       fs.unlink(htmlPath, (err) => err && console.error("❌ Error deleting HTML:", err));
//     });

//   } catch (error) {
//     console.error("❌ Error generating Section A PDF:", error);
//     res.status(500).json({ error: "Failed to generate Section A PDF" });
//   }
// };


// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const path = require("path");
// const BRSRSectionA = require("../../models/report/BRSRSectionA");
// const SectionBSubmission = require("../../models/report/sectionBsubmission");
// const Submission = require("../../models/Submission");
// const Form = require("../../models/Form");
// const generalGuidanceHTML = require("../../utils/report/generalGuidance");
// const { generateSectionAHTML } = require("../../utils/report/generateSectionAHTML");
// const { generateSectionBHTML } = require("../../utils/report/generateSectionBHTML");

// exports.downloadReport = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const questionsMap = req.body?.questionsMap || JSON.parse(
//       fs.readFileSync(path.join(__dirname, "../../data/questions.json"), "utf-8")
//     );

//     const submission = await Submission.findOne({ userId });
//     const formData = await Form.findOne({ userId });
//     const sectionA = await BRSRSectionA.findOne({ userId });
//     const sectionB = await require("../../models/report/BRSRSectionB").findOne({ userId });

//     if (!submission || !sectionA || !sectionA.data?.length) {
//       return res.status(404).json({ error: "Data not found" });
//     }

//     const sectionBResponsesDoc = await SectionBSubmission.findOne({ userId });

//     const responses = submission.responses;
//     const sectionBResponses = sectionBResponsesDoc ? sectionBResponsesDoc.toObject() : {};

//     const sectionAHTML = generateSectionAHTML(sectionA.data, responses, formData, questionsMap);
//     const sectionBHTML = sectionB?.data?.length ? generateSectionBHTML(sectionB.data, sectionBResponses) : "";

//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body {
//             margin: 20mm 10mm;
//             font-family: Arial, sans-serif;
//             font-size: 12px;
//             line-height: 1.6;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             page-break-inside: auto;
//           }
//           h1 {
//             text-align: center;
//             color: #2c3e50;
//             margin-bottom: 20px;
//           }
//           h3 {
//             text-align: left;
//             text-decoration: underline;
//             margin-bottom: 20px;
//           }
//           thead { display: table-header-group; }
//           tfoot { display: table-footer-group; }
//           tr { page-break-inside: avoid; page-break-after: auto; }
//           th, td {
//             border: 0.5px solid black;
//             padding: 8px;
//             text-align: left;
//           }
//           .mainhead {
//             background-color: #f2f2f2;
//             font-size: 14px;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Business Responsibility and Sustainability Report</h1>
//         ${generalGuidanceHTML}
//         ${sectionAHTML}
//         ${sectionBHTML}
//       </body>
//       </html>
//     `;

//     const reportsDir = path.join(__dirname, "../../reports");
//     if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

//     const htmlPath = path.join(reportsDir, `BRSR_Report_${userId}.html`);
//     fs.writeFileSync(htmlPath, htmlContent, "utf-8");

//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "load" });

//     const pdfPath = path.join(reportsDir, `BRSR_Report_${userId}.pdf`);
//     await page.pdf({
//       path: pdfPath,
//       format: "A4",
//       printBackground: true,
//       margin: { top: "40px", bottom: "40px" }
//     });

//     await browser.close();

//     res.download(pdfPath, (err) => {
//       if (err) console.error("❌ Error sending PDF:", err);
//       fs.unlink(pdfPath, (err) => err && console.error("❌ Error deleting PDF:", err));
//       fs.unlink(htmlPath, (err) => err && console.error("❌ Error deleting HTML:", err));
//     });

//   } catch (error) {
//     console.error("❌ Error generating BRSR PDF:", error);
//     res.status(500).json({ error: "Failed to generate BRSR PDF" });
//   }
// };


const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const BRSRSectionA = require("../../models/report/BRSRSectionA");
const BRSRSectionC = require("../../models/report/BRSRSectionC");
const SectionCSubmission = require("../../models/report/sectionCsubmission");
const SectionBSubmission = require("../../models/report/sectionBsubmission");
const Submission = require("../../models/Submission");
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
    const formData = await Form.findOne({ userId });
    const sectionA = await BRSRSectionA.findOne({ userId });
    const sectionB = await require("../../models/report/BRSRSectionB").findOne({ userId });
    const sectionC = await BRSRSectionC.findOne({ userId });
    const sectionCData = await SectionCSubmission.findOne({ userId });

    if (!submission || !sectionA || !sectionA.data?.length) {
      return res.status(404).json({ error: "Data not found" });
    }

    const sectionBResponsesDoc = await SectionBSubmission.findOne({ userId });
    const responses = submission.responses;
    const sectionBResponses = sectionBResponsesDoc ? sectionBResponsesDoc.toObject() : {};

    const sectionAHTML = generateSectionAHTML(sectionA.data, responses, formData, questionsMap);
    const sectionBHTML = sectionB?.data?.length ? generateSectionBHTML(sectionB.data, sectionBResponses) : "";
    const sectionCHTML = sectionC?.data ? generateSectionCHTML(sectionC.data, sectionCData?.disclosures || []) : "";

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
