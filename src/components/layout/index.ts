// Layout components exports
export { PageLayout } from './PageLayout';

// Legal compliance components
export { CopyrightDisclaimer } from './CopyrightDisclaimer';
export { NonAffiliationStatement } from './NonAffiliationStatement';
export { LegalComplianceFooter } from './LegalComplianceFooter';
export { PrivacyNotice } from './PrivacyNotice';
export { TermsOfService } from './TermsOfService';
export { CookieNotice } from './CookieNotice';

// Attribution components — PublisherAttribution is the canonical export.
// BandaiNamcoAttribution is kept as an alias for backward compatibility.
export {
  PublisherAttribution,
  PublisherAttribution as BandaiNamcoAttribution,
  CardImageAttribution,
  GameContentAttribution,
  ContentAttributionBadge,
  AttributionTooltip,
} from './PublisherAttribution';
