import fs from 'fs';
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

const generateIcebreaker = async (firstName, company, title) => {
  const prompt = `You are the technical founder of an autonomous AI SDR/Coding agent called 'IdeaAI'.
You are writing a cold email to ${firstName}, who is a ${title} at ${company}.

Write a HIGHLY PERSONALIZED, hyper-specific 1-2 sentence icebreaker for the start of your cold email.
Mention their company name (${company}) and guess a common engineering problem they face as a ${title}.
Do not write the full email. Just the 1-2 sentence opening.
Tone: Hacker, casual, peer-to-peer (founder to engineer).
Never say "I hope this email finds you well" or use generic greetings. Just jump straight into the observation.
Start with "Hey ${firstName},"

Example: "Hey Alex, saw the engineering team scaling at Handshake. I'm building an autonomous AI engineer that could save your team hundreds of hours on refactoring."

Return exactly the 1-2 sentences. Nothing else.`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:latest",
        prompt: prompt,
        stream: false,
        options: {
            temperature: 0.6,
            num_ctx: 2048
        }
      })
    });

    const data = await response.json();
    if (data.response) {
      let text = data.response.trim();
      text = text.replace(/^"|"$/g, ''); // Temizle
      return text;
    }
  } catch (error) {
    console.error(`Failed to generate for ${firstName}:`, error);
  }
  return `Hey ${firstName}, noticed the engineering work you're leading at ${company} and wanted to reach out.`;
};

async function main() {
  const leads = [];
  
  console.log("Reading apollo-contacts-export.csv...");
  
  await new Promise((resolve, reject) => {
    fs.createReadStream('apollo-contacts-export.csv')
      .pipe(csvParser())
      .on('data', (data) => {
        if (data['Email'] && data['Email'].trim() !== '') {
          leads.push(data);
        }
      })
      .on('end', () => resolve())
      .on('error', reject);
  });

  console.log(`Found ${leads.length} leads with emails. Generating Icebreakers via local Llama 3.2 (Ollama)...`);

  const results = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i+1}/${leads.length}] Processing ${lead['First Name']} at ${lead['Company Name']}...`);
    
    const icebreaker = await generateIcebreaker(
      lead['First Name'],
      lead['Company Name'],
      lead['Title']
    );

    results.push({
      firstName: lead['First Name'],
      lastName: lead['Last Name'],
      company: lead['Company Name'],
      title: lead['Title'],
      email: lead['Email'],
      icebreaker: icebreaker
    });
  }

  console.log("Writing to apollo_ready_for_outreach.csv...");

  const csvWriter = createObjectCsvWriter({
    path: 'apollo_ready_for_outreach.csv',
    header: [
      { id: 'firstName', title: 'FirstName' },
      { id: 'lastName', title: 'LastName' },
      { id: 'company', title: 'Company' },
      { id: 'title', title: 'Title' },
      { id: 'email', title: 'Email' },
      { id: 'icebreaker', title: 'Icebreaker' }
    ]
  });

  await csvWriter.writeRecords(results);
  console.log("Done! File saved as apollo_ready_for_outreach.csv");
}

main().catch(console.error);
