export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  status?: ProductStatus;
  specifications?: ProductSpecification[];
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export type ProductStatus = 'active' | 'inactive' | 'discontinued'; 