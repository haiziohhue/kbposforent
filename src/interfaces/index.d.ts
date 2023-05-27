export interface ICategory {
  id: number;
  nom: string;
}

export interface IMenu {
  id: number;
  titre?: string;
  isActive?: boolean;
  // active?: 'enable' | 'disable';
  description?: string;
  image: null | { url: string };
  createdAt?: string;
  prix: number;
  categorie?: ICategory;
  stock?: number;
}

export interface ICartMenu {
  id: number;
  menus: IMenu;
  quantity: number;
  total?: number;
}

export interface ICaisse {
  id: number;
  nom?: string;
  balance?: number;
}
export interface ITable {
  id: number;
  nom: string;
}

export interface IOrder {
  id: number;
  code: number;
  type: 'emporté' | 'sur place';
  table: ITable;
  //   caisse: ICaisse;
  etat: 'validé' | 'en cours' | 'annulé';
  caisse: ICaisse;
  menus: IMenu[];
  total: number;
  createdAt: string;
}

export interface IOrderFilterVariables {
  q?: string;
  table?: string;
  caisse?: string;
  user?: string;
  etat?: string[];
}
