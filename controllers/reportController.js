
// const fs = require("fs");
// const path = require("path");
// const Submission = require("../models/Submission");
// const puppeteer = require("puppeteer");

// // Generate BRSR Report
// exports.generateReport = async (req, res) => {
//   try {
//     const { userId, questions } = req.body;

//     // Fetch user responses from the database
//     const submission = await Submission.findOne({ userId });
//     if (!submission) {
//       return res.status(404).json({ error: "No data found for this user." });
//     }

//     const responses = submission.responses; // Ensure responses is a Map

//     // Ensure the "reports" directory exists
//     const reportsDir = path.join(__dirname, "../reports");
//     if (!fs.existsSync(reportsDir)) {
//       fs.mkdirSync(reportsDir, { recursive: true });
//     }

//     // Generate HTML content for the report
//     let htmlContent = `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 50px; }
//           h2 { text-align: center; text-decoration: underline; color:blue;margin-top:10px}
//           p { font-size: 14px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid black; padding: 10px; text-align: left; vertical-align: top; }
//           th { background-color: #f2f2f2; }
//           .subcategory { font-weight: bold; margin-top: 10px; }
//           .question { font-weight: bold; }
//           .answer { margin-left: 15px; }
//         </style>
//       </head>
//       <body>
//         <h2>Business Responsibility and Sustainability Report (BRSR)</h2>
//         <h5>II. SECTION A: GENERAL DISCLOSURES</h5>
//         <table>
//           <tr>
//             <th>Field Name</th>
//             <th>Report</th>
//           </tr>`;

//     // Iterate through sections and subcategories
//     Object.entries(questions).forEach(([sectionName, subcategories]) => {
//       let instructionText = "";

//       Object.entries(subcategories).forEach(([subcategory, questionsList]) => {
//         instructionText += `<p class="subcategory">${subcategory}</p>`; // Render subcategory name

//         questionsList.forEach((questionObj, index) => {
//           const question = questionObj.question;
//           const responseKey = `${sectionName.replace(/\s+/g, "")}_${subcategory.replace(/\s+/g, "")}_Q${index + 1}`;
//           let answer = responses.get(responseKey) || "Not answered";

//           if (Array.isArray(answer)) {
//             answer = answer.map(obj =>
//               Object.entries(obj).map(([key, value]) => `  - ${key}: ${value}`).join("<br>")
//             ).join("<br><br>");
//           }

//           instructionText += `<p class="question">Q: ${question}</p>`;
//           instructionText += `<p class="answer">A: ${answer}</p>`;
//         });
//       });

//       htmlContent += `
//       <tr>
//         <td>${sectionName}</td>
//         <td>${instructionText}</td>
//       </tr>`;
//     });

//     htmlContent += `</table></body></html>`;

//     // Save the HTML file
//     const htmlPath = path.join(reportsDir, `BRSR_Report_${userId}.html`);
//     fs.writeFileSync(htmlPath, htmlContent, "utf-8");

//     // Launch Puppeteer and convert HTML to PDF
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "load" });
    
//     const pdfPath = path.join(reportsDir, `BRSR_Report_${userId}.pdf`);
//     await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

//     await browser.close();

//     // Send the generated PDF as a response
//     res.download(pdfPath);
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server Error: Unable to generate report" });
//   }
// };

// const fs = require("fs");
// const path = require("path");
// const Submission = require("../models/Submission");
// const puppeteer = require("puppeteer");

// // Generate BRSR Report
// exports.generateReport = async (req, res) => {
//   try {
//     const { userId, questions } = req.body;

//     // Fetch user responses from the database
//     const submission = await Submission.findOne({ userId });
//     if (!submission) {
//       return res.status(404).json({ error: "No data found for this user." });
//     }

//     const responses = submission.responses; // This is a plain object
// console.log("responses:",responses);
//     // Ensure the "reports" directory exists
//     const reportsDir = path.join(__dirname, "../reports");
//     if (!fs.existsSync(reportsDir)) {
//       fs.mkdirSync(reportsDir, { recursive: true });
//     }

//     // Generate HTML content for the report
//     let htmlContent = `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 50px; }
//           h2 { text-align: center; text-decoration: underline; color:blue; margin-top:10px; }
//           p { font-size: 14px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid black; padding: 10px; text-align: left; vertical-align: top; }
//           th { background-color: #f2f2f2; }
//           .subcategory { font-weight: bold; margin-top: 10px; }
//           .question { font-weight: bold; }
//           .answer { margin-left: 15px; }
//         </style>
//       </head>
//       <body>
//         <h2>Business Responsibility and Sustainability Report (BRSR)</h2>
//         <h5>II. SECTION A: GENERAL DISCLOSURES</h5>
//         <table>
//           <tr>
//             <th>Field Name</th>
//             <th>Report</th>
//           </tr>`;

//     // Iterate through sections and subcategories
//     Object.entries(questions).forEach(([sectionName, subcategories]) => {
//       let instructionText = "";

//       Object.entries(subcategories).forEach(([subcategory, questionsList]) => {
//         instructionText += `<p class="subcategory">${subcategory}</p>`; // Render subcategory name

//         questionsList.forEach((questionObj, index) => {
//           const question = questionObj.question;
//           const responseKey = `${sectionName.replace(/\s+/g, "")}_${subcategory.replace(/\s+/g, "")}`;
//           let answer = responses[responseKey] || "Not answered";
//           console.log("responseKey:",responseKey);

//           // ✅ Fix: Properly handle multiple entries
//           if (Array.isArray(answer)) {
//             console.log("enter")
//             answer = answer.map(entry => 
//               Object.entries(entry)
//                 .map(([key, value]) => `<b>${key}:</b> ${value}`)
//                 .join("<br>")
//             ).join("<hr>"); // Separate multiple responses with a horizontal line
//           }

//           instructionText += `<p class="question">Q: ${question}</p>`;
//           instructionText += `<p class="answer">A: ${answer}</p>`;
//         });
//       });

//       htmlContent += `
//       <tr>
//         <td>${sectionName}</td>
//         <td>${instructionText}</td>
//       </tr>`;
//     });

//     htmlContent += `</table></body></html>`;

//     // Save the HTML file
//     const htmlPath = path.join(reportsDir, `BRSR_Report_${userId}.html`);
//     fs.writeFileSync(htmlPath, htmlContent, "utf-8");

//     // Launch Puppeteer and convert HTML to PDF
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "load" });
    
//     const pdfPath = path.join(reportsDir, `BRSR_Report_${userId}.pdf`);
//     await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

//     await browser.close();

//     // Send the generated PDF as a response
//     res.download(pdfPath);
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server Error: Unable to generate report" });
//   }
// };

// const fs = require("fs");
// const path = require("path");
// const Submission = require("../models/Submission");
// const puppeteer = require("puppeteer");

// // Generate BRSR Report
// exports.generateReport = async (req, res) => {
//   try {
//     const { userId, questions } = req.body;

//     // Fetch user responses from the database
//     const submission = await Submission.findOne({ userId });
//     if (!submission) {
//       return res.status(404).json({ error: "No data found for this user." });
//     }

//     const responses = submission.responses; // ✅ Extract stored responses

//     // Ensure the "reports" directory exists
//     const reportsDir = path.join(__dirname, "../reports");
//     if (!fs.existsSync(reportsDir)) {
//       fs.mkdirSync(reportsDir, { recursive: true });
//     }

//     // Generate HTML content for the report
//     let htmlContent = `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 40px; }
//           h2 { text-align: center; text-decoration: underline; color: blue; margin-top: 10px; }
//           p { font-size: 14px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid black; padding: 10px; text-align: left; vertical-align: top; }
//           th { background-color: #f2f2f2; }
//           .subcategory { font-weight: bold; margin-top: 10px; }
//           .question { font-weight: bold; }
//           .answer { margin-left: 15px; }
//         </style>
//       </head>
//       <body>
//         <h2>Business Responsibility and Sustainability Report (BRSR)</h2>
//         <h5>II. SECTION A: GENERAL DISCLOSURES</h5>
//         <table>
//           <tr>
//             <th>Field Name</th>
//             <th>Report</th>
//           </tr>`;

//     // ✅ Iterate through sections and subcategories to fetch responses
//     Object.entries(questions).forEach(([sectionName, subcategories]) => {
//       let reportText = "";

//       Object.entries(subcategories).forEach(([subcategory, questionsList]) => {
//         reportText += `<p class="subcategory">${subcategory}</p>`; // ✅ Display subcategory name

//         questionsList.forEach((questionObj, index) => {
//           const questionText = questionObj.question;

//           // ✅ Correctly format the response key
//           const responseKey = `${sectionName.replace(/\s+/g, "")}_${subcategory.replace(/\s+/g, "")}`;
//           let answerData = responses.get(responseKey) || [];

//           // ✅ Ensure data is always an array for processing
//           if (!Array.isArray(answerData)) {
//             answerData = [answerData];
//           }

//           // ✅ Get the specific key for this question (Q1, Q2, etc.)
//           const questionKey = `${subcategory.replace(/\s+/g, "")}_Q${index + 1}`;

//           // ✅ Extract values for the question from each entry
//           let answer = answerData
//             .map((entry, entryIndex) => {
//               const value = entry[questionKey] || "Not answered";
//               return `<div><b>Entry ${entryIndex + 1}:</b> ${value}</div>`;
//             })
//             .join("");

//           reportText += `
//             <p class="question">Q: ${questionText}</p>
//             <p class="answer">A: ${answer}</p>`;
//         });
//       });

//       htmlContent += `
//       <tr>
//         <td>${sectionName}</td>
//         <td>${reportText}</td>
//       </tr>`;
//     });

//     htmlContent += `</table></body></html>`;

//     // ✅ Save the HTML file
//     const htmlPath = path.join(reportsDir, `BRSR_Report_${userId}.html`);
//     fs.writeFileSync(htmlPath, htmlContent, "utf-8");

//     // ✅ Generate PDF using Puppeteer
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "load" });

//     const pdfPath = path.join(reportsDir, `BRSR_Report_${userId}.pdf`);
//     await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

//     await browser.close();

//     // ✅ Send the generated PDF as a response
//     res.download(pdfPath);
//   } catch (error) {
//     console.error("Error generating BRSR Report:", error);
//     res.status(500).json({ error: "Server Error: Unable to generate report" });
//   }
// };




//this is the code want to modify *********************
const fs = require("fs");
const path = require("path");
const Submission = require("../models/Submission");
const puppeteer = require("puppeteer");

// Generate BRSR Report
exports.generateReport = async (req, res) => {
  try {
    const { userId, questions } = req.body;

    // Fetch user responses from the database
    const submission = await Submission.findOne({ userId });
    if (!submission) {
      return res.status(404).json({ error: "No data found for this user." });
    }

    const responses = submission.responses; // ✅ Extract stored responses

    // Ensure the "reports" directory exists
    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate HTML content for the report
    let htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { text-align: center; text-decoration: underline; color: blue; margin-top: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid black; padding: 10px; text-align: left; vertical-align: top; word-wrap: break-word; }
          th { background-color: #f2f2f2; }
          .subcategory { font-weight: bold; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Business Responsibility and Sustainability Report (BRSR)</h1>
        <h5>II. SECTION A: GENERAL DISCLOSURES</h5>
        <table>
          <tr>
            <th>Field Name</th>
            <th>Report</th>
          </tr>`;

    // ✅ Iterate through sections and subcategories to fetch responses
    Object.entries(questions).forEach(([sectionName, subcategories]) => {
      let reportText = "";

      Object.entries(subcategories).forEach(([subcategory, questionsList]) => {
        reportText += `<h4 class="subcategory">${subcategory}</h4>`; // ✅ Display subcategory name

        // ✅ Start Table with Questions as Headers
        reportText += `<table width="100%"> <tr>`;

        // ✅ Add Question Headers (`<th>`)
        questionsList.forEach((questionObj, index) => {
          reportText += `<th>${questionObj.question}</th>`;
        });

        reportText += `</tr>`;

        // ✅ Correctly format the response key
        const responseKey = `${sectionName.replace(/\s+/g, "")}_${subcategory.replace(/\s+/g, "")}`;
        let answerData = responses.get(responseKey) || [];

        // ✅ Ensure data is always an array for processing
        if (!Array.isArray(answerData)) {
          answerData = [answerData];
        }

        // ✅ Iterate over each entry and map responses to correct questions
        answerData.forEach((entry, entryIndex) => {
          reportText += `<tr>`;
          questionsList.forEach((questionObj, index) => {
            const questionKey = `${subcategory.replace(/\s+/g, "")}_Q${index + 1}`;
            const value = entry[questionKey] || "Not answered";
            reportText += `<td>${value}</td>`;
          });
          reportText += `</tr>`;
        });

        // ✅ Close Subcategory Table
        reportText += `</table>`;
      });

      htmlContent += `
      <tr>
        <td>${sectionName}</td>
        <td>${reportText}</td>
      </tr>`;
    });

    htmlContent += `</table></body></html>`;

    // ✅ Save the HTML file
    const htmlPath = path.join(reportsDir, `BRSR_Report_${userId}.html`);
    fs.writeFileSync(htmlPath, htmlContent, "utf-8");

    // ✅ Generate PDF using Puppeteer with increased width (A3)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "load" });

    const pdfPath = path.join(reportsDir, `BRSR_Report_${userId}.pdf`);
    await page.pdf({ path: pdfPath, format: "A3", printBackground: true, landscape: true });

    await browser.close();

    // ✅ Send the generated PDF as a response
    res.download(pdfPath);
  } catch (error) {
    console.error("Error generating BRSR Report:", error);
    res.status(500).json({ error: "Server Error: Unable to generate report" });
  }
};
