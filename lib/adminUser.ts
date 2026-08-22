export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  status: "ACTIVE" | "BANNED";
  createdAt: string;
};
export type AdminProperty = {
  id: string;
  title: string;
  description: string;
  rentPrice: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  city: string;
  division: string;
  postalCode: string;
  availabilityStatus: string;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};
export type AdminRentalRequest = {
  id: string;

  moveInDate: string;
  durationMonths: number;
  message?: string | null;

  status: RentalRequestStatus;

  createdAt: string;
  updatedAt: string;

  property: {
    id: string;
    title: string;
    rentPrice: number;
    city: string;
    division: string;
  };

  tenant: {
    id: string;
    name: string;
    email: string;
  };
};

export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";
