export interface BookRef {
  bookId: number;
  pages?: string;
}

export interface ValueEntry {
  amount: number;
  note?: string;
}

export interface ToyPrivate {
  cost?: string;
  purchaseDate?: string;
  purchaseSource?: string;
  valueRaw?: string;
  valueEntries: ValueEntry[];
}

export interface Toy {
  id: number;
  slug: string;
  name: string;
  displayName: string;
  aliases: string[];
  model?: string;
  type?: string;
  topic?: string;
  description?: string;
  mechanism?: string;
  movementDescription?: string;
  materials?: string;
  dimensions?: string;
  trademark?: string;
  condition?: string;
  firstYear?: string;
  lastYear?: string;
  boxDescription?: string;
  bookRefs: BookRef[];
  research?: string;
  notes?: string;
  photoIds: string[];
  photos: string[];
  mechPhotos: string[];
  mechDescription?: string;
  private: ToyPrivate;
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  authors?: string;
  year?: string;
  publisher?: string;
  location?: string;
  pagesWithOurToys?: string;
  notes?: string;
}

export interface Manufacturer {
  id: number;
  slug: string;
  logo?: string;
  trademark?: string;
  manufacturer?: string;
  address?: string;
  country?: string;
  startActivity?: string;
  endActivity?: string;
  founder?: string;
  history?: string;
  typesOfToys?: string;
  bibliography?: string;
  sources?: string[];
}

export interface Stats {
  totalToys: number;
  totalBooks: number;
  totalManufacturers: number;
  byType: Record<string, number>;
  byTopic: Record<string, number>;
  byMechanism: Record<string, number>;
  byCondition: Record<string, number>;
  byTrademark: Record<string, number>;
}
