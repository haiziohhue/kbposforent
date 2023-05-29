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
  code?: string;
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
  user?: IUser;
  beneficier?: IUser;
}

export interface IUser {
  id: number;
  nom?: string;
  prenom?: string;
  phone?: string;
  photo?: null | { url: string };
  email?: string;
  password?: string;
  username?: string;
  date_naissance?: Date;
  address?: string;
  caisse?: ICaisse;
  role: IRole;
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

export interface IRole {
  id: number;
  name?: string;
  type?: string;
}
export interface LoginFormTypes {
  email?: string;
  username?: string;
  password?: string;
  remember?: boolean;
  providerName?: string;
  redirectPath?: string;
}
