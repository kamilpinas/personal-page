export type ContactMethod = {
  id: string
  label: string
  value?: string
  href: string
  icon: string
  category: "primary" | "secondary"
  external?: boolean
  copyable?: boolean
  note?: string
}

export const contactMethods: ContactMethod[] = [
  {
    id: "email",
    label: "Email",
    value: "kamilpinas@gmail.com",
    href: "mailto:kamilpinas@gmail.com",
    icon: "FiMail",
    category: "primary",
    copyable: true,
  },
  {
    id: "phone",
    label: "Phone",
    value: "+48 730697499",
    href: "tel:+48730697499",
    icon: "FiPhone",
    category: "primary",
    copyable: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "kamilpinas",
    href: "https://github.com/kamilpinas",
    icon: "FiGithub",
    category: "primary",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "kamil-pinas",
    href: "https://www.linkedin.com/in/kamil-pinas",
    icon: "FiLinkedin",
    category: "primary",
    external: true,
  },
  {
    id: "resume",
    label: "Resume/CV",
    href: "/assets/resume.pdf",
    icon: "FiFileText",
    category: "primary",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+48 730697499",
    href: "https://wa.me/48730697499",
    icon: "SiWhatsapp",
    category: "primary",
    external: true,
  },
]
