// utils/report/generateSectionAHTML.js
function generateSectionAHTML(data, responses,Monthlyresponses, formData, questionsMap) {
  // console.log("responses from sectionA html:",responses);
  // console.log("data from sectionA html:",data);

  // Helper to fetch section data from Submission.responses or MonthlySubmission.responses
  const getSectionData = (key) => {
    if (!key || key === "form") return null;

    let val = null;

    if (responses) {
      if (typeof responses.get === "function") {
        val = responses.get(key);
      } else {
        val = responses[key];
      }
    }

    if ((val === null || val === undefined) && Monthlyresponses) {
      if (typeof Monthlyresponses.get === "function") {
        val = Monthlyresponses.get(key);
      } else {
        val = Monthlyresponses[key];
      }
    }

    return val;
  };

  const tableRows = data.map((row) => {
    const key = row.report;
    const sectionData = getSectionData(key);
    let content = "";
  
      switch (row.qno) {
        case "14":
          content = formData?.description || "Not Available";
          break;
  
          case "15": {
            if (Array.isArray(sectionData)) {
              const PRODUCT_KEY = "UseofSoldProducts_Q1";
              const REVENUE_KEY = "UseofSoldProducts_Q4";
              const NIC_KEY = "UseofSoldProducts_Q5";
          
              sectionData.sort((a, b) => {
                const revA = parseFloat(a[REVENUE_KEY] || 0);
                const revB = parseFloat(b[REVENUE_KEY] || 0);
                return revB - revA;
              });
          
              content = `
                <table style="width: 100%; border-collapse: collapse;" border="1">
                  <thead>
                    <tr>
                      <th style="padding: 5px;">Product</th>
                      <th style="padding: 5px;">Annual Revenue</th>
                      <th style="padding: 5px;">NIC Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sectionData
                      .map((entry) => {
                        const product = entry[PRODUCT_KEY] || "Not Available";
                        const revenue = entry[REVENUE_KEY] || "Not Available";
                        const nic = entry[NIC_KEY] || "Not Available";
          
                        return `
                          <tr>
                            <td style="padding: 5px;">${product}</td>
                            <td style="padding: 5px;">${revenue}</td>
                            <td style="padding: 5px;">${nic}</td>
                          </tr>`;
                      })
                      .join("")}
                  </tbody>
                </table>
              `;
            } else {
              content = "Not Available";
            }
            break;
          }
  
          case "18": {
            const entry = sectionData?.[0] || {}; // Assume data is in first object
            const empTypes = entry["WorkforceComposition&Diversity(Management&HRData)_Q3"] || [];
            const workerTypes = entry["WorkforceComposition&Diversity(Management&HRData)_Q7"] || [];
          
            content = `
              <h3>Employees</h3>
              <table width="100%" border="1" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th>Male</th>
                    <th>Female</th>
                    <th>Other</th>
                    <th>Total Employees</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q2_F2"] || "0"}</td>
                    <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q2_F1"] || "0"}</td>
                    <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q2_F3"] || "0"}</td>
                    <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q1"] || "0"}</td>
                  </tr>
                </tbody>
              </table>
          
              <h3>Employment Type</h3>
              <table width="60%" border="1" style="border-collapse: collapse; margin-bottom: 10px;">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    empTypes.length > 0
                      ? empTypes.map(emp => `
                        <tr>
                          <td>${emp.type}</td>
                          <td>${emp.count}</td>
                        </tr>`).join("")
                      : `<tr><td colspan="2">Not Available</td></tr>`
                  }
                </tbody>
              </table>
          
              <p><strong>Total Differently Abled Employees:</strong> ${entry["WorkforceComposition&Diversity(Management&HRData)_Q4"] || "0"}</p>
          
              <hr style="margin: 20px 0;">
          
              <h3>Workers</h3>
              <table width="100%" border="1" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th>Male</th>
                    <th>Female</th>
                    <th>Other</th>
                    <th>Total Workers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q6_F2"] || "0"}</td>
                    <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q6_F1"] || "0"}</td>
                    <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q6_F3"] || "0"}</td>
                    <td>${entry["WorkforceComposition&Diversity(Management&HRData)_Q5"] || "0"}</td>
                  </tr>
                </tbody>
              </table>
          
              <h3>Employment Type</h3>
              <table width="60%" border="1" style="border-collapse: collapse; margin-bottom: 10px;">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    workerTypes.length > 0
                      ? workerTypes.map(w => `
                        <tr>
                          <td>${w.type}</td>
                          <td>${w.count}</td>
                        </tr>`).join("")
                      : `<tr><td colspan="2">Not Available</td></tr>`
                  }
                </tbody>
              </table>
          
              <p><strong>Total Differently Abled Workers:</strong> ${entry["WorkforceComposition&Diversity(Management&HRData)_Q8"] || "0"}</p>
            `;
            break;
          }
          
          case "19": {
            const entry = sectionData?.[0] || {};
          
            const get = (key) => entry[key] || "[X]";
          
            const directorsTotal = get("BoardStructure&Leadership_Q1");
            const directorsWomen = get("BoardStructure&Leadership_Q2");
            const directorsDifferentlyAbled = get("BoardStructure&Leadership_Q3");
            const womenDirectorsDifferentlyAbled = get("BoardStructure&Leadership_Q4");
            const womenKMP = get("BoardStructure&Leadership_Q5");
            const kmpDesignations = get("BoardStructure&Leadership_Q6") || [];
            const differentlyAbledKMP = get("BoardStructure&Leadership_Q7");
            const womenDifferentlyAbledKMP = get("BoardStructure&Leadership_Q8");
            const affirmativeHiring = get("BoardStructure&Leadership_Q13");
          
            content = `
              <ul style="padding-left: 20px;">
                <li>Total Directors on the Board: <strong>${directorsTotal}</strong></li>
                <li>Total number of women on the Board of Directors: <strong>${directorsWomen}</strong></li>
                <li>Total number of directors (any gender) who are differently abled: <strong>${directorsDifferentlyAbled}</strong></li>
                <li>Total number of women directors who are differently abled: <strong>${womenDirectorsDifferentlyAbled}</strong></li>
                <li>Total number of women in Key Managerial Personnel (KMP) roles: <strong>${womenKMP}</strong></li>
                <li>KMP designations held by: <strong>${Array.isArray(kmpDesignations) ? kmpDesignations.join(", ") : kmpDesignations}</strong></li>
                <li>Total number of differently abled persons (any gender) in KMP: <strong>${differentlyAbledKMP}</strong></li>
                <li>Total number of women in KMP roles who are differently abled: <strong>${womenDifferentlyAbledKMP}</strong></li>
                <li>Does the company have affirmative hiring for women or differently abled persons?: <strong>${affirmativeHiring}</strong></li>
              </ul>
            `;
            break;
          }
          
          case "20": {
            const entry = sectionData?.[0] || {};
          
            const get = (key) => entry[key] || "XX";
          
            const empTotal = get("TurnoverData_Q1");
            const empMale = get("TurnoverData_Q2");
            const empFemale = get("TurnoverData_Q3");
            const empOther = get("TurnoverData_Q4");
          
            const workerTotal = get("TurnoverData_Q5");
            const workerMale = get("TurnoverData_Q6");
            const workerFemale = get("TurnoverData_Q7");
            const workerOther = get("TurnoverData_Q8");
          
            const empTurnoverRate = get("TurnoverData_Q9");
            const workerTurnoverRate = get("TurnoverData_Q10");
          
            content = `
              <table width="100%" border="1" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Male</th>
                    <th>Female</th>
                    <th>Other Gender Identities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Permanent Employees Who Left</td>
                    <td>${empTotal}</td>
                    <td>${empMale}</td>
                    <td>${empFemale}</td>
                    <td>${empOther}</td>
                  </tr>
                  <tr>
                    <td>Permanent Workers (Contractual, etc.) Who Left</td>
                    <td>${workerTotal}</td>
                    <td>${workerMale}</td>
                    <td>${workerFemale}</td>
                    <td>${workerOther}</td>
                  </tr>
                  <tr>
                    <td>Overall Employee Turnover Rate (%)</td>
                    <td>${empTurnoverRate}%</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Worker Turnover Rate (%)</td>
                    <td>${workerTurnoverRate}%</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            `;
            break;
          }
          
          case "21": {
            const entry = sectionData?.[0] || {};
          
            const getCellData = (array, nameKey, ownershipKey) => {
              if (!Array.isArray(array) || array.length === 0) return ["-", "-"];
              const names = array.map(e => e[nameKey] || "-").join("<br>");
              const ownerships = array.map(e => e[ownershipKey] || "-").join("<br>");
              return [names, ownerships];
            };
          
            const holdingName = entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q2"] || "-";
            const holdingOwnership = entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q3"] || "-";
          
            const [subsidiaryNames, subsidiaryOwnerships] = getCellData(
              entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q4"],
              "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q4_F1",
              "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q4_F2"
            );
          
            const [associateNames, associateOwnerships] = getCellData(
              entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q5"],
              "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q5_F1",
              "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q5_F2"
            );
          
            const [jvNames, jvOwnerships] = getCellData(
              entry["DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q6"],
              "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q6_F1",
              "DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures_Q6_F2"
            );
          
            content = `
             
              <table width="100%" border="1" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th>Entity Type</th>
                    <th>Name(s)</th>
                    <th>Percentage of Ownership/Control</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Holding Company</b></td>
                    <td>${holdingName}</td>
                    <td>${holdingOwnership}</td>
                  </tr>
                  ${
                    subsidiaryNames !== "-" ? `
                      <tr>
                        <td><b>Subsidiary Companies</b></td>
                        <td>${subsidiaryNames}</td>
                        <td>${subsidiaryOwnerships}</td>
                      </tr>` : ""
                  }
                  ${
                    associateNames !== "-" ? `
                      <tr>
                        <td><b>Associate Companies</b></td>
                        <td>${associateNames}</td>
                        <td>${associateOwnerships}</td>
                      </tr>` : ""
                  }
                  ${
                    jvNames !== "-" ? `
                      <tr>
                        <td><b>Joint Ventures (JVs)</b></td>
                        <td>${jvNames}</td>
                        <td>${jvOwnerships}</td>
                      </tr>` : ""
                  }
                </tbody>
              </table>
            `;
            break;
          }
          
          
          case "23": {
            const entry = sectionData?.[0] || {};
            const get = (key) => entry[key] || "Not Available";
          
            const grievanceForEmployees = get("GrievanceRedressal_Q1");
            const grievanceForWorkers = get("GrievanceRedressal_Q2");
            const grievanceChannels = get("GrievanceRedressal_Q3");
            const averageResolutionTime = get("GrievanceRedressal_Q8");
            const trackingEffectiveness = get("GrievanceRedressal_Q9");
          
            content = `
              <ul style="padding-left: 20px;">
                <li><strong>Grievance Mechanism for Employees:</strong> ${grievanceForEmployees}</li>
                <li><strong>Grievance Mechanism for Workers:</strong> ${grievanceForWorkers}</li>
                <li><strong>Grievance Channels Available:</strong> ${grievanceChannels}</li>
                <li><strong>Average Grievance Resolution Time:</strong> ${averageResolutionTime}</li>
                <li><strong>Tracking of Grievance Redressal Effectiveness:</strong> ${trackingEffectiveness}</li>
              </ul>
            `;
            break;
          }
          
          case "24": {
            const entry = sectionData?.[0] || {};
            const get = (key) => entry[key] || "Not Available";
          
            const envRiskYesNo = get("SustainabilityRisks&Opportunities_Q1");
            const envRiskList = get("SustainabilityRisks&Opportunities_Q2");
          
            const socialRiskYesNo = get("SustainabilityRisks&Opportunities_Q3");
            const socialRiskList = get("SustainabilityRisks&Opportunities_Q4");
          
            const govRiskYesNo = get("SustainabilityRisks&Opportunities_Q5");
            const govRiskList = get("SustainabilityRisks&Opportunities_Q6");
          
            const esgOppYesNo = get("SustainabilityRisks&Opportunities_Q7");
            const esgOppList = get("SustainabilityRisks&Opportunities_Q8");
          
            content = `
              <ul style="padding-left: 20px;">
                <li><strong>Environmental Risks Identified:</strong> ${envRiskYesNo}
                  <ul><li><strong>Key risks:</strong> ${envRiskList}</li></ul>
                </li>
                <li><strong>Social Risks Identified:</strong> ${socialRiskYesNo}
                  <ul><li><strong>Key risks:</strong> ${socialRiskList}</li></ul>
                </li>
                <li><strong>Governance Risks Identified:</strong> ${govRiskYesNo}
                  <ul><li><strong>Key risks:</strong> ${govRiskList}</li></ul>
                </li>
                <li><strong>ESG-Related Opportunities Identified:</strong> ${esgOppYesNo}
                  <ul><li><strong>Key opportunities:</strong> ${esgOppList}</li></ul>
                </li>
              </ul>
            `;
            break;
          }
          
       
  
       
  
        default:
          content = "Not Available";
          break;
      }
  
      return `
        <tr>
          <td>${row.qno}</td>
          <td>${row.fieldName}</td>
          <td>${content}</td>
        </tr>`;
    });
  
    return `
      <h3>SECTION A: GENERAL DISCLOSURES</h3>
      <table>
        <thead>
          <tr>
            <th class="mainhead" style="width: 6%; background-color: #f2f2f2;">Q.No</th>
            <th class="mainhead" style="width: 30%; background-color: #f2f2f2;">Field Name</th>
            <th class="mainhead" style="width: 64%; background-color: #f2f2f2;">Report</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="border-top: 1px solid black;"></td>
          </tr>
        </tfoot>
      </table>`;
  }
  
  module.exports = { generateSectionAHTML };
  