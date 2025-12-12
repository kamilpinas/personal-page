import React from "react"
import { contactMethods } from "../../lib/contacts"
import ContactMethodCard from "./ContactMethodCard"

const ContactGrid: React.FC = () => {
  const primaryMethods = contactMethods.filter((m) => m.category === "primary")
  const secondaryMethods = contactMethods.filter(
    (m) => m.category === "secondary"
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-h-[46svh] overflow-y-auto md:max-h-none md:overflow-visible">
      {primaryMethods.map((method) => (
        <ContactMethodCard key={method.id} method={method} />
      ))}
      {secondaryMethods.map((method) => (
        <ContactMethodCard key={method.id} method={method} />
      ))}
    </div>
  )
}

export default ContactGrid
