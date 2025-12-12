import React from 'react';
import { Link } from 'react-router-dom';
import { ContactMethod } from '../../lib/contacts';
import CopyButton from '../UI/CopyButton';
import * as FiIcons from 'react-icons/fi';
import * as SiIcons from 'react-icons/si';

interface ContactMethodCardProps {
  method: ContactMethod;
}

const DynamicIcon = ({ icon }: { icon: string }) => {
  // @ts-ignore
  const IconComponent = FiIcons[icon] || SiIcons[icon];
  if (!IconComponent) return null;
  return <IconComponent className="w-8 h-8 mb-2" />;
};

const ContactMethodCard: React.FC<ContactMethodCardProps> = ({ method }) => {
  const commonProps = {
    "aria-label": `${method.label} - ${method.value || ''}`,
    className: "group relative isolate rounded-xl border border-silver-400/20 bg-gradient-to-br from-white/5 to-white/2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-4 md:p-5 transition-transform duration-200 will-change-transform hover:scale-[1.02] focus-visible:scale-[1.02] hover:shadow-glow-silver focus-visible:shadow-glow-silver focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver-400/40",
  };

  const content = (
    <>
      <div className="text-silver-300 opacity-90 group-hover:opacity-100 transition">
        <DynamicIcon icon={method.icon} />
      </div>
      <div className="text-[13px] uppercase tracking-wide text-text-muted">
        {method.label}
      </div>
      <div className="text-[clamp(14px,1.4vw,16px)] text-silver-300 font-medium truncate">
        {method.value}
      </div>
      {method.copyable && method.value && <CopyButton textToCopy={method.value} />}
    </>
  );

  if (method.external) {
    return (
      <a href={method.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
        {content}
      </a>
    );
  }

  if (method.href.startsWith('mailto:') || method.href.startsWith('tel:')) {
    return (
      <a href={method.href} {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <Link to={method.href} {...commonProps}>
      {content}
    </Link>
  );
};

export default ContactMethodCard;