export const SITE = {
  name: "ProtocolIQ",
  tagline: "AI-Native Clinical Trial Platform",
  domain: "knavis-ai.com",
  url: "https://knavis-ai.com",
  appUrl: "https://app.knavis-ai.com",
  email: "hello@knavis-ai.com",
};

export const NAV_LINKS = [
  { label: "Platform",    href: "/platform" },
  { label: "Feasibility", href: "/platform#feasibility" },
  { label: "About",       href: "/about" },
  { label: "Blog",        href: "/blog" },
  { label: "FAQ",         href: "/#faq" },
];

export const FOOTER_LINKS: Record<string, string[]> = {
  Platform:  ["Protocol Authoring","Site Feasibility","Explainable AI","Amendment Prevention","Integrations"],
  Company:   ["About Us","Our Story","Careers","Press","Contact"],
  Resources: ["Documentation","Blog","Case Studies","Changelog","FAQ"],
  Legal:     ["Privacy Policy","Terms of Service","Security","HIPAA Compliance"],
};

export const METRICS = [
  { value: "1M+", label: "Real trials analyzed" },
  { value: "18+", label: "Years clinical expertise" },
  { value: "5",   label: "US Patents" },
  { value: "7+",  label: "Global data sources" },
];

export const DATA_SOURCES = [
  { name: "ClinicalTrials.gov", tag: "Trial Database",  accent: "#00D4FF" },
  { name: "IHME GBD",           tag: "Disease Burden",  accent: "#7C3AED" },
  { name: "WHO GHO",            tag: "Health Stats",    accent: "#00FF94" },
  { name: "World Bank",         tag: "Economic Data",   accent: "#FF8A3D" },
  { name: "OpenFDA",            tag: "Safety Data",     accent: "#FF5E7A" },
  { name: "PubMed",             tag: "Literature",      accent: "#00D4FF" },
  { name: "GLOBOCAN",           tag: "Oncology Data",   accent: "#7C3AED" },
];
