export type SupplierKind = 'api' | 'affiliate' | 'agent';

export interface HolidaySupplier {
  id: string;
  name: string;
  kind: SupplierKind;
  region: 'ireland' | 'uk' | 'global';
  supportsSearchApi: boolean;
  partnerGatedApi?: boolean;
  website: string;
  note: string;
}

export const holidaySuppliers: HolidaySupplier[] = [
  {
    id: 'loveholidays',
    name: 'loveholidays',
    kind: 'affiliate',
    region: 'uk',
    supportsSearchApi: false,
    website: 'https://www.loveholidays.com/',
    note: 'Public affiliate programme available; no public booking search API documented.',
  },
  {
    id: 'clickandgo',
    name: 'Click&Go Holidays',
    kind: 'agent',
    region: 'ireland',
    supportsSearchApi: false,
    website: 'https://www.clickandgo.com/',
    note: 'Irish OTA with web booking and call-centre model; no public booking API documented.',
  },
  {
    id: 'tui',
    name: 'TUI',
    kind: 'affiliate',
    region: 'uk',
    supportsSearchApi: false,
    website: 'https://www.tui.co.uk/',
    note: 'Affiliate programme available; no public package-holiday API documented.',
  },
  {
    id: 'amadeus',
    name: 'Amadeus (flight/hotel APIs)',
    kind: 'api',
    region: 'global',
    supportsSearchApi: true,
    website: 'https://developers.amadeus.com/',
    note: 'Developer APIs for flight/hotel search and pricing.',
  },
  {
    id: 'kayak',
    name: 'KAYAK Partner API',
    kind: 'api',
    region: 'global',
    supportsSearchApi: true,
    partnerGatedApi: true,
    website: 'https://help.affiliates.kayak.com/article/812-do-you-offer-an-api',
    note: 'API access exists but is offered on a limited partner basis.',
  },
];

export function getSuppliersById(
  ids?: string[],
  costMode: 'budget-first' | 'balanced' = 'balanced'
): HolidaySupplier[] {
  const base = ids?.length
    ? holidaySuppliers.filter((supplier) => ids.includes(supplier.id))
    : holidaySuppliers;

  if (costMode === 'budget-first') {
    return base.filter((supplier) => !supplier.partnerGatedApi);
  }

  return base;
}

export function buildSupplierSearchLink(supplierId: string, destination: string): string {
  const encoded = encodeURIComponent(destination);

  switch (supplierId) {
    case 'loveholidays':
      return `https://www.loveholidays.com/holidays/?q=${encoded}`;
    case 'clickandgo':
      return `https://www.clickandgo.com/search?destination=${encoded}`;
    case 'tui':
      return `https://www.tui.co.uk/destinations/search?query=${encoded}`;
    case 'kayak':
      return `https://www.kayak.ie/flights/DUB-${encoded}`;
    default:
      return `https://www.google.com/search?q=${encoded}+holidays+from+dublin`;
  }
}
