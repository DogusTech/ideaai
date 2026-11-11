import fs from 'fs';
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("GROQ_API_KEY not found in .env.local");
  process.exit(1);
}

// System prompt instructing Llama 3 to write a 1-2 sentence icebreaker
const generateIcebreaker = async (firstName, company, title, summary) => {
  if (!summary || summary.trim() === '') summary = title; // fallback

  const prompt = `You are a highly technical founder of an autonomous AI SDR/Coding agent called 'IdeaAI'.
You are writing a cold email to ${firstName}, who is a ${title} at ${company}.
Their LinkedIn summary is: "${summary}".

Write a HIGHLY PERSONALIZED, hyper-specific 1-2 sentence icebreaker for the start of your cold email.
It MUST prove you actually read their profile. Mention something specific from their summary or their company's tech stack/mission.
Do not write the full email. Just the 1-2 sentence opening.
Tone: Hacker, casual, peer-to-peer (founder to engineer), not a sales rep.
Never say "I hope this email finds you well" or "I was impressed by your profile". Just cut to the chase with an insightful observation.

Example: "Hey Alex, saw you led the transition to microservices at Handshake. I'm building an autonomous AI engineer that could have saved your team 500 hours on that refactor."

Just return the 1-2 sentences, nothing else.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      let text = data.choices[0].message.content.trim();
      text = text.replace(/^"|"$/g, ''); // remove quotes if any
      return text;
    }
  } catch (error) {
    console.error(`Failed to generate for ${firstName}:`, error);
  }
  return "Hey " + firstName + ", noticed the engineering work you're leading at " + company + " and wanted to reach out.";
};

async function main() {
  const leads = [];
  
  console.log("Reading leads.csv...");
  
  await new Promise((resolve, reject) => {
    fs.createReadStream('leads.csv')
      .pipe(csvParser())
      .on('data', (data) => {
        // Only process rows that have a Work Email
        if (data['Work email'] && data['Work email'].trim() !== '') {
          leads.push(data);
        }
      })
      .on('end', () => resolve())
      .on('error', reject);
  });

  console.log(`Found ${leads.length} leads with emails. Generating Icebreakers via Llama 3.1 70B (Groq)...`);

  const results = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i+1}/${leads.length}] Processing ${lead['First Name']} at ${lead['Company Name']}...`);
    
    // Clay usually puts the summary in "Summarize LinkedIn profile" or "Summary"
    const summary = lead['Summarize LinkedIn profile'] || lead['Headline'] || lead['Summary'] || "";
    
    const icebreaker = await generateIcebreaker(
      lead['First Name'],
      lead['Company Name'],
      lead['Job Title'],
      summary
    );

    results.push({
      firstName: lead['First Name'],
      lastName: lead['Last Name'],
      company: lead['Company Name'],
      title: lead['Job Title'],
      email: lead['Work email'],
      linkedin: lead['LinkedIn Profile'],
      icebreaker: icebreaker
    });
    
    // Delay slightly to respect API rate limits
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("Writing to ready_for_outreach.csv...");

  const csvWriter = createObjectCsvWriter({
    path: 'ready_for_outreach.csv',
    header: [
      { id: 'firstName', title: 'FirstName' },
      { id: 'lastName', title: 'LastName' },
      { id: 'company', title: 'Company' },
      { id: 'title', title: 'Title' },
      { id: 'email', title: 'Email' },
      { id: 'linkedin', title: 'LinkedIn' },
      { id: 'icebreaker', title: 'Icebreaker' }
    ]
  });

  await csvWriter.writeRecords(results);
  console.log("Done! File saved as ready_for_outreach.csv");
}

main().catch(console.error);
