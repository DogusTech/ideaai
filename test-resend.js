const fs = require('fs');
const { Resend } = require('resend');

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const i = line.indexOf('=');
      if (i === -1) return [null, null];
      return [line.substring(0, i).trim(), line.substring(i + 1).replace(/^"|"$/g, '').trim()];
    })
    .filter(([k]) => k)
);

const resend = new Resend(env.RESEND_API_KEY);

async function test() {
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'info@togetlink.com',
    subject: 'Test Email',
    html: 'test'
  });
  console.log(result);
}

test();
