export interface ICategory {
  id: number;
  nom: string;
}

export interface IMenu {
  id: number;
  titre?: string;
  isActive?: boolean;
  description?: string;
  image: null | { url: string };
  createdAt?: string;
  prix: number;
  categorie?: ICategory;
  stock?: number;
}
