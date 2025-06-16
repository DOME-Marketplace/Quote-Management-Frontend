export interface Quote {
  id: string;
  description?: string;
  quoteDate?: string;
  quoteItem?: QuoteItem[];
  relatedParty?: RelatedParty[];
  note?: Note[];
}

export interface QuoteItem {
  state?: string;
  attachment?: Attachment[];
}

export interface RelatedParty {
  id?: string;
  '@type'?: string;
}

export interface Note {
  text: string;
  author: string;
}

export interface Attachment {
  name?: string;
  content?: string;
} 