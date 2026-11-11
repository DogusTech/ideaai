const fs = require('fs');
const readline = require('readline');

async function processApollo() {
  const content = fs.readFileSync('C:\\Users\\dogus\\Downloads\\togetlinkk\\apollo-contacts-export (1).csv', 'utf8');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return;

  function parseCSVLine(line) {
    const res = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        res.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    res.push(cur.trim());
    return res;
  }

  const headers = parseCSVLine(lines[0]);
  const fnIdx = headers.indexOf('First Name');
  const lnIdx = headers.indexOf('Last Name');
  const emIdx = headers.indexOf('Email');
  const coIdx = headers.indexOf('Company Name for Emails') !== -1 ? headers.indexOf('Company Name for Emails') : headers.indexOf('Company Name');
  const tiIdx = headers.indexOf('Title');

  const cleanRows = [["First Name", "Last Name", "Email", "Company", "Job Title"].join(",")];
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const email = (cols[emIdx] || '').trim();
    if (email && email.includes('@')) {
      const fn = (cols[fnIdx] || '').trim();
      const ln = (cols[lnIdx] || '').trim();
      const co = (cols[coIdx] || '').trim();
      const ti = (cols[tiIdx] || '').trim();
      cleanRows.push(`"${fn}","${ln}","${email}","${co}","${ti}"`);
      count++;
    }
  }

  const outPath = 'C:\\Users\\dogus\\Downloads\\togetlinkk\\instantly_clean_leads.csv';
  fs.writeFileSync(outPath, cleanRows.join('\n'), 'utf8');
  console.log(`Successfully generated ${count} clean leads at: ${outPath}`);
}

processApollo();
