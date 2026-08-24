import "server-only";

export interface EnquiryRecord {
  id: string;
  userId: string;
  propertyId: string;
  propertyName: string | null;
  propertySlug: string | null;
  leadName: string;
  email: string | null;
  phone: string | null;
  preferredChannel: string | null;
  message: string | null;
  status: string;
  submittedAt: string;
  createdAt: string;
}

export async function getCustomerEnquiries(
  _userId: string,
  _limit?: number,
): Promise<EnquiryRecord[]> {
  return [];
}

export async function enrichEnquiryWithPropertySlug(
  enquiry: EnquiryRecord,
): Promise<EnquiryRecord> {
  return enquiry;
}
