// Assuming InvoiceModel is defined in the domain layer, e.g.,
// import { InvoiceModel } from '../../domain/invoice.model';
// For now, using placeholder interfaces:
export interface InvoiceLineItemModel {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
  periodStartDate?: Date;
  periodEndDate?: Date;
}

export interface InvoiceModel {
  id: string;
  merchantId: string;
  subscriptionId?: string; // Link to subscription if applicable
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  amountDue: number;
  amountPaid: number;
  status: string; // e.g., 'draft', 'open', 'paid', 'void', 'uncollectible'
  currency: string;
  lineItems: InvoiceLineItemModel[];
  downloadUrl?: string;
  paymentGatewayInvoiceId?: string; // ID from payment gateway if applicable
  // other relevant fields
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface IInvoiceRepositoryPort {
  findById(id: string): Promise<InvoiceModel | null>;
  findByMerchantId(
    merchantId: string,
    paginationOptions: PaginationOptions,
  ): Promise<PaginatedResult<InvoiceModel>>;
  save(invoice: Omit<InvoiceModel, 'id' | 'createdAt' | 'updatedAt'> | InvoiceModel): Promise<InvoiceModel>;
  update(
    id: string,
    invoiceUpdate: Partial<Omit<InvoiceModel, 'id' | 'merchantId' | 'createdAt' | 'updatedAt'>>
  ): Promise<InvoiceModel | null>;
  // findBySubscriptionId(subscriptionId: string): Promise<InvoiceModel[]>;
  // findByStatus(status: string, paginationOptions: PaginationOptions): Promise<PaginatedResult<InvoiceModel>>;
}

export const IInvoiceRepositoryPort = Symbol('IInvoiceRepositoryPort');