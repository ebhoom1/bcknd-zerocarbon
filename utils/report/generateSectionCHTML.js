// utils/report/generateSectionCHTML.js
function generateSectionCHTML(sectionCData = {}, disclosures = []) {
    const principleTitles = {
      1: "PRINCIPLE 1 Businesses should conduct and govern themselves with integrity, and in a manner that is Ethical, Transparent and Accountable.",
      2: "PRINCIPLE 2 Businesses should provide goods and services in a manner that is sustainable and safe.",
      3: "PRINCIPLE 3 Businesses should respect and promote the well-being of all employees, including those in their value chains.",
      4: "PRINCIPLE 4 Businesses should respect the interests of and be responsive to all its stakeholders.",
      5: "PRINCIPLE 5 Businesses should respect and promote human rights.",
      6: "PRINCIPLE 6 Businesses should respect and make efforts to protect and restore the environment.",
      7: "PRINCIPLE 7 Businesses, when engaging in influencing public and regulatory policy, should do so in a manner that is responsible and transparent.",
      8: "PRINCIPLE 8 Businesses should promote inclusive growth and equitable development.",
      9: "PRINCIPLE 9 Businesses should engage with and provide value to their consumers in a responsible manner."
    };
  
    let html = '<h3>SECTION C: PRINCIPLE-WISE PERFORMANCE DISCLOSURE</h3>';
  
    for (let p = 1; p <= 9; p++) {
      const key = `principle${p}`;
      const rows = sectionCData?.[key] || [];
  
      html += `<h4>${principleTitles[p]}</h4>`;
  
      const essential = rows.filter(r => !r.qno.endsWith('L'));
      const leadership = rows.filter(r => r.qno.endsWith('L'));
  
      const renderTable = (type, data, allData) => {
        let table = `<h5>${type} Indicators</h5>`;
        table += `
          <table>
            <thead>
              <tr>
                <th class="mainhead" style="width: 6%; background-color: #f2f2f2;">Q. No.</th>
                <th class="mainhead" style="width: 30%; background-color: #f2f2f2;">Field Name</th>
                <th class="mainhead" style="width: 64%; background-color: #f2f2f2;">Report</th>
              </tr>
            </thead>
            <tbody>`;
  
        if (data.length > 0) {
          for (const item of data) {
            const answerSet = disclosures.find(d => d.principleNumber === p)?.answers || {};
            const reports = item.report.map(r => `<strong>${r}</strong>: ${answerSet[r] || 'Not Available'}`).join('<br>');
  
            const qnoClean = item.qno.replace(/L$/, "");
  
            table += `
              <tr>
                <td>${qnoClean}</td>
                <td>${item.fieldName}</td>
                <td>${reports}</td>
              </tr>`;
          }
        } else {
          table += `<tr><td colspan="3">No entries available for this indicator.</td></tr>`;
        }
  
        table += '</tbody></table><br>';
        return table;
      };
  
      html += renderTable("Essential", essential, rows);
      html += renderTable("Leadership", leadership, rows);
    }
  
    return html;
  }
  
  module.exports = { generateSectionCHTML };
  