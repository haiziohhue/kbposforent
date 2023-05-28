export interface ICategory {
  id: number;
  nom: string;
}

export interface IMenu {
  id: number;
  titre?: string;
  active?: boolean;
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
  code?: number;
  type?: 'Emporté' | 'Sur place';
  table?: ITable;
  //   caisse: ICaisse;
  etat?: 'Validé' | 'En cours' | 'Annulé';
  caisse?: ICaisse;
  menus?: number[];
  // menus?: IMenu[];
  total: number;
  createdAt?: string;
}

export interface IOrderFilterVariables {
  q?: string;
  table?: string;
  caisse?: string;
  user?: string;
  etat?: string[];
}

export interface ITresor {
  id: number;
  type: 'vente' | 'Dépense';
  titre: string;
  date: string;
  montant: number;
  paiment: 'Chèque' | 'Espèce';
  categorie_depense: ICatDepense;
  createdAt?: string;
  // user
  // beneficier
}
export interface ITresorFilterVariables {
  q?: string;
  type?: string;
  user?: string;
}
export interface ICatDepense {
  id: number;
  nom: string;
}
