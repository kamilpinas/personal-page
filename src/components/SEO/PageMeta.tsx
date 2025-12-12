import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface PageMetaProps {
  titleKey: string;
  descriptionKey: string;
  pageName: string; // Used for translation context if needed
}

const PageMeta: React.FC<PageMetaProps> = ({ titleKey, descriptionKey, pageName }) => {
  const { t } = useTranslation();

  const title = t(titleKey, { name: 'Kamil Pinas', page: t(`${pageName}.title` || '') });
  const description = t(descriptionKey);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
    </HelmetProvider>
  );
};

export default PageMeta;
