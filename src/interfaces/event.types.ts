export interface IEvent {
  id: string;
  title: string;
  description?: string;
  location: string;
  date: Date;
  organizerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
