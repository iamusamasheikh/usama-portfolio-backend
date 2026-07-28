import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const leadsFilePath = path.join(__dirname, 'src', 'data', 'leads.json');

// Ensure leads.json exists
if (!fs.existsSync(leadsFilePath)) {
  fs.writeFileSync(leadsFilePath, JSON.stringify([], null, 2));
}

// Transporter Configuration (Environment Variables or Default Config)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'officialusamano1@gmail.com',
    pass: process.env.EMAIL_PASS || '' // Set App Password in .env if using Gmail SMTP
  }
});

// Fallback direct transporter for test/dev mode
let etherealatTransporter = null;
async function getTransporter() {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return transporter;
  }
  if (!etherealatTransporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      etherealatTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('Using Ethereal Mail fallback for development testing. User:', testAccount.user);
    } catch (e) {
      console.warn('Ethereal fallback creation warning:', e.message);
      return transporter;
    }
  }
  return etherealatTransporter;
}

// ==========================================
// 1. API: Submit Contact / Budget Estimator Lead
// ==========================================
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, service, budget, message, attachedEstimate } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and Email are required.' });
  }

  const newLead = {
    id: 'lead-' + Date.now(),
    date: new Date().toISOString(),
    name,
    email,
    phone: phone || 'N/A',
    service: service || 'General Inquiry',
    budget: budget || 'N/A',
    message: message || 'N/A',
    attachedEstimate: attachedEstimate || null,
    status: 'New'
  };

  // 1. Save Lead locally to src/data/leads.json
  try {
    const existingLeads = JSON.parse(fs.readFileSync(leadsFilePath, 'utf-8') || '[]');
    existingLeads.unshift(newLead);
    fs.writeFileSync(leadsFilePath, JSON.stringify(existingLeads, null, 2));
    console.log(`✓ New Lead Saved: ${name} (${email})`);
  } catch (err) {
    console.error('Error saving lead to file:', err.message);
  }

  // 2. Email Notifications
  try {
    const mailer = await getTransporter();

    // A. Notification Email to Usama Sheikh
    const adminMailOptions = {
      from: `"Usama Sheikh Portfolio" <officialusamano1@gmail.com>`,
      to: 'officialusamano1@gmail.com',
      subject: `🚨 New Lead Inquiry: ${name} (${service})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #10b981; border-radius: 12px; background: #0f172a; color: #ffffff;">
          <h2 style="color: #10b981; margin-top: 0;">New Portfolio Client Inquiry!</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
          <p><strong>Phone / WhatsApp:</strong> ${phone || 'N/A'}</p>
          <p><strong>Selected Service:</strong> ${service}</p>
          <p><strong>Estimated Budget:</strong> ${budget}</p>
          <hr style="border-color: rgba(255,255,255,0.1);" />
          <p><strong>Message / Requirements:</strong></p>
          <blockquote style="background: rgba(255,255,255,0.05); padding: 12px; border-left: 4px solid #10b981; margin: 0; color: #cbd5e1;">
            ${(message || '').replace(/\n/g, '<br/>')}
          </blockquote>
          ${attachedEstimate ? `
            <hr style="border-color: rgba(255,255,255,0.1);" />
            <h3 style="color: #fbbf24;">Attached Budget Estimator Details:</h3>
            <p><strong>Calculated Total:</strong> ${attachedEstimate.calculatedCost || 'N/A'}</p>
            <p><strong>Estimated Delivery:</strong> ${attachedEstimate.calculatedTimeline || 'N/A'}</p>
          ` : ''}
          <br/>
          <p style="font-size: 0.8rem; color: #94a3b8;">Inquiry Date: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    // B. Automatic Branded Confirmation Email to Client
    const clientMailOptions = {
      from: `"Usama Sheikh" <officialusamano1@gmail.com>`,
      to: email,
      subject: `Thank you for reaching out, ${name}! - Usama Sheikh`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; color: #1e293b;">
          <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #10b981;">
            <h2 style="color: #0f172a; margin: 0;">USAMA SHEIKH</h2>
            <p style="color: #10b981; font-weight: 600; font-size: 0.9rem; margin-top: 4px;">Digital Marketing Strategist & Full-Stack Web Developer</p>
          </div>
          
          <div style="padding: 20px 0;">
            <h3 style="color: #0f172a;">Hi ${name},</h3>
            <p style="line-height: 1.6; color: #475569;">Thank you for getting in touch regarding <strong>${service}</strong>!</p>
            <p style="line-height: 1.6; color: #475569;">I have received your inquiry and project details. I am currently reviewing your requirements and will get back to you within <strong>2 to 4 hours</strong> with a tailored strategy and quote.</p>
            
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 0; font-weight: 600; color: #0f172a;">Need an immediate response?</p>
              <p style="margin: 6px 0 0 0; color: #475569;">Feel free to chat with me directly on WhatsApp: <a href="https://wa.me/923007856880" style="color: #10b981; font-weight: 700;">+92 300 7856880</a></p>
            </div>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 0.85rem; color: #64748b;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: 700; color: #0f172a;">Usama Sheikh</p>
            <p style="margin: 2px 0 0 0;">WordPress & Shopify Expert · Advanced Technical SEO</p>
            <p style="margin: 2px 0 0 0;"><a href="https://usamasheikh.com" style="color: #10b981;">usamasheikh.com</a></p>
          </div>
        </div>
      `
    };

    const infoAdmin = await mailer.sendMail(adminMailOptions);
    await mailer.sendMail(clientMailOptions);

    if (etherealatTransporter) {
      console.log('Preview Notification Email URL:', nodemailer.getTestMessageUrl(infoAdmin));
    }

  } catch (emailErr) {
    console.warn('Email sending warning:', emailErr.message);
  }

  res.json({
    success: true,
    message: 'Inquiry submitted successfully! Confirmation email has been sent.'
  });
});

// ==========================================
// 2. API: Fetch All Saved Leads (For Admin Dashboard)
// ==========================================
app.get('/api/leads', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFilePath, 'utf-8') || '[]');
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to read leads.' });
  }
});

// ==========================================
// 3. API: Delete Lead by ID
// ==========================================
app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  try {
    let leads = JSON.parse(fs.readFileSync(leadsFilePath, 'utf-8') || '[]');
    leads = leads.filter(l => l.id !== id);
    fs.writeFileSync(leadsFilePath, JSON.stringify(leads, null, 2));
    res.json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete lead.' });
  }
});

// ==========================================
// 4. API: Get & Save Settings (Styles & Scripts)
// ==========================================
const settingsFilePath = path.join(__dirname, 'src', 'data', 'settings.json');

app.get('/api/settings', (req, res) => {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      return res.json({ success: true, settings: {} });
    }
    const settings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf-8') || '{}');
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to read settings.' });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const { sectionStyles, scriptsConfig } = req.body;
    const current = fs.existsSync(settingsFilePath) ? JSON.parse(fs.readFileSync(settingsFilePath, 'utf-8') || '{}') : {};
    const updated = {
      ...current,
      sectionStyles: sectionStyles || current.sectionStyles,
      scriptsConfig: scriptsConfig || current.scriptsConfig
    };
    fs.writeFileSync(settingsFilePath, JSON.stringify(updated, null, 2));
    console.log('✓ Settings updated on disk.');
    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save settings.' });
  }
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Backend Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api/contact`);
  console.log(`=================================`);
});
