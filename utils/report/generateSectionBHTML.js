// utils/report/generateSectionBHTML.js
function generateSectionBHTML(data, responses) {
    const tableRows = data.map((row) => {
      console.log("responsesB:",responses);
      const key = row.report;
      const sectionData = responses[key];
      let content = "";
  
      switch (row.qno) {
        case "5_6": {
          if (Array.isArray(sectionData)) {
            content = sectionData.map((goal, i) => `
              <h4>Goal ${i + 1}</h4>
              <ul>
                <li><strong>Principle:</strong> ${goal.principle}</li>
                <li><strong>Goal Title:</strong> ${goal.goalTitle}</li>
                <li><strong>Baseline Context:</strong> ${goal.baselineContext}</li>
                <li><strong>Covered Entities:</strong> ${goal.coveredEntities}</li>
                <li><strong>Expected Outcome:</strong> ${goal.expectedOutcome}</li>
                <li><strong>Timeline:</strong> ${goal.timeline}</li>
                <li><strong>Mandatory/Voluntary:</strong> ${goal.mandatoryOrVoluntary}</li>
                <li><strong>Reference Law:</strong> ${goal.referenceLegislation}</li>
                <li><strong>Performance Achieved:</strong> ${goal.performanceAchieved}</li>
                <li><strong>Remarks:</strong> ${goal.remarks}</li>
              </ul>`).join("<hr/>");
          } else {
            content = "Not Available";
          }
          break;
        }
  
        case "7": {
          const entry = sectionData || {};
          content = `
            <ul>
              <li><strong>Vision/Strategy:</strong> ${entry.visionStrategy}</li>
              <li><strong>Strategic Priorities:</strong> ${entry.strategicPriorities}</li>
              <li><strong>Trends:</strong> ${entry.broaderTrends}</li>
              <li><strong>Key Events:</strong> ${entry.keyEvents}</li>
              <li><strong>Performance View:</strong> ${entry.performanceView}</li>
              <li><strong>Outlook:</strong> ${entry.futureOutlook}</li>
              <li><strong>Additional Notes:</strong> ${entry.additionalNotes}</li>
            </ul>`;
          break;
        }
  
        case "8": {
          const entry = sectionData || {};
          const ind = entry.implementationIndividual || {};
          const ovt = entry.oversightIndividual || {};
  
          const implMembers = Array.isArray(entry.implementationCommittee)
            ? entry.implementationCommittee.map(m => `<li>${m.name}, ${m.designation}</li>`).join("") : "";
  
          const ovtMembers = Array.isArray(entry.oversightCommittee)
            ? entry.oversightCommittee.map(m => `<li>${m.name}, ${m.designation}</li>`).join("") : "";
  
          content = `
            <h4>Implementation</h4>
            <p>Type: ${entry.implementationAuthorityType}</p>
            ${entry.implementationAuthorityType === 'Individual' ?
              `<p>${ind.name} – ${ind.designation}</p>` :
              `<ul>${implMembers}</ul>`}
            <h4>Oversight</h4>
            <p>Type: ${entry.oversightAuthorityType}</p>
            ${entry.oversightAuthorityType === 'Individual' ?
              `<p>${ovt.name} – ${ovt.designation}</p>` :
              `<ul>${ovtMembers}</ul>`}`;
          break;
        }
  
        case "9": {
          const entry = sectionData || {};
          const members = Array.isArray(entry.committeeMembers)
            ? entry.committeeMembers.map(m => `<li>${m.name}, ${m.designation}</li>`).join("") : "";
          content = `
            <p><strong>Has Committee:</strong> ${entry.hasCommittee}</p>
            <p><strong>Mandate:</strong> ${entry.mandate}</p>
            <ul>${members}</ul>`;
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
      <h3>SECTION B: MANAGEMENT AND PROCESS DISCLOSURES</h3>
      <table>
        <thead>
          <tr>
            <th class="mainhead">Q.No</th>
            <th class="mainhead">Field Name</th>
            <th class="mainhead">Report</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.join("")}
        </tbody>
      </table>`;
  }
  
  module.exports = { generateSectionBHTML };
  