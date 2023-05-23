export interface ICategory {
  id: number;
  nom: string;
}

export interface IMenu {
  id: number;
  titre: string;
  isActive?: boolean;
  description?: string;
  image: IFile[];
  createdAt: string;
  prix: number;
  categorie: ICategory;
}
