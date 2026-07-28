import fs from 'fs';

const settings = {
  sectionStyles: {
    hero: {
      badgeText: "UPWORK TOP RATED FREELANCER",
      titleLine1: "Digital Marketing Strategist &",
      titleGradient: "Web Developer",
      subheading: "Full-Stack Web Developer & SEO Specialist with 7+ years of experience launching high-ROI Shopify stores, custom WordPress portals, and PPC ad campaigns.",
      profileImage: "./usama-real.png",
      primaryCtaText: "Get Free Consultation",
      secondaryCtaText: "Explore 80+ Live Projects"
    },
    stats: {
      projectsCompleted: "80+",
      successRate: "99.4%",
      yearsExperience: "7+ Years",
      clientRoas: "4.8x Average"
    },
    services: {
      badgeText: "OUR SPECIALIZATIONS",
      headingText: "Services Designed to Drive",
      gradientText: "Measurable ROI",
      subheadingText: "End-to-end web engineering, speed optimization, and ad scaling."
    },
    whyUsama: {
      badgeText: "WHY CHOOSE US",
      headingText: "Why Work With",
      gradientText: "Usama Sheikh?",
      subheadingText: "Direct communication, top-rated expertise, and guaranteed results."
    },
    timeline: {
      badgeText: "ABOUT & JOURNEY",
      headingText: "7+ Years of",
      gradientText: "Proven Industry Impact",
      bioText: "Over the past 7 years, I have engineered high-performance Shopify stores, custom WordPress platforms, and targeted digital marketing campaigns for 80+ clients globally."
    },
    testimonials: {
      badgeText: "CLIENT TESTIMONIALS",
      headingText: "Trusted by Founders &",
      gradientText: "Business Leaders Globally",
      subheadingText: "Real feedback from clients across USA, Canada, UK, Germany, and UAE."
    },
    contact: {
      badgeText: "GET IN TOUCH",
      headingText: "Let's Build Something",
      gradientText: "Amazing Together",
      subheadingText: "Have a project in mind or need a full SEO/Website audit? Fill out the form or reach out directly for a 30-minute free discovery call.",
      email: "officialusamano1@gmail.com",
      whatsapp: "+92 300 7856880",
      location: "Global / Remote (USA, UK, UAE, Canada, EU)"
    }
  },
  scriptsConfig: {
    headerScripts: "",
    bodyScripts: "",
    footerScripts: ""
  }
};

fs.writeFileSync('./src/data/settings.json', JSON.stringify(settings, null, 2));
console.log('✓ settings.json successfully pre-filled with all 7 section contents!');
