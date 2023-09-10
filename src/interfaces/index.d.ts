import { Dayjs } from "dayjs";

type Option = "Générale" | "Menu composé";
export interface ICategory {
  id: number;
  nom: string;
  type: Option;
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
  quantite?: number;
  ingredients?: IIngredients[];
  menus?: {
    component: string;
    menu?: number[];
    categorie?: string;
    ingredient?: {
      ingredient: IIngredients;
      quantite: number;
    };
    prix?: number;
    quantite?: number;
  };
}

export interface ICartMenu {
  id: number;
  menus: IMenu;
  quantity: number;
  total?: number;
  component: string;
}

export interface ICaisse {
  id: number;
  nom?: string;
  balance?: number;
}
export interface ITable {
  id: number;
  nom: string;
  etat?: "Disponible" | "Occupé";
}

export interface IOrder {
  id: number;
  code?: string;
  type?: "Emporté" | "Sur place";
  table?: ITable;
  //   caisse: ICaisse;
  etat?: "Validé" | "En cours" | "Annulé";
  caisse?: ICaisse;
  // menus?: number[];
  menus?: IMenu[];
  total: number;
  createdAt?: string;
  users_permissions_user?: IUser;
}

export interface IOrderFilterVariables {
  code?: string;
  table?: string;
  caisse?: string;
  users_permissions_user?: string;
  etat?: "Validé" | "En cours" | "Annulé";
  type?: "Emporté" | "Sur place";
}

export interface ITresor {
  id: number;
  type?: "Vente" | "Dépense";
  titre?: string;
  date?: string;
  montant: number;
  // paiment?: "Chèque" | "Espèce";
  paiement?: "Chèque" | "Espèce";
  categorie_depense?: ICatDepense;
  createdAt?: string;
  user?: IUser;
  beneficier?: IUser;
  note?: string;
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
  adresse?: string;
  caisse?: ICaisse;
  // role?: { label?: string; id?: number };
  role: IRole;
}
export interface IUserMe {
  id: number;
  nom?: string;
  prenom?: string;
  phone?: string;
  photo?: null | { url: string };
  email?: string;
  password?: string;
  username?: string;
  date_naissance?: Date;
  adresse?: string;
  caisse?: ICaisse;
  role: IRole;
}
export interface ITresorFilterVariables {
  titre?: string;
  type?: string;
  user?: string;
}
export interface ICatDepense {
  id: number;
  nom: string;
}

export interface IRole {
  id: number;
  name: string;
  type: string;
}
export interface LoginFormTypes {
  email?: string;
  username?: string;
  password?: string;
  remember?: boolean;
  providerName?: string;
  redirectPath?: string;
}

export interface IIngredients {
  id: number;
  nom?: string;
  description?: string;
  unite?: string;
  ingredients?: { nom: string; prix: number };
}

export interface ICatIngredients {
  id: number;
  nom?: string;
  categories?: ICategory[];
  // ingredients?: IIngredients[];
}
export interface IGeneraleDta {
  id: number;
  nom?: string;
  adresse?: string;
  phone1?: string;
  phone2?: string;
}

export interface IMenuType {
  type: "Pizza" | "Sucré";
  label: "string";
  ingredients: [];
}

export interface IAchat {
  id: number;
  source: string;
  createdAt: Dayjs | null;
  etat: "Validé" | "Annulé";
  total: number;
  note: string;
}

export interface IChef {
  id: number;
  chef: string;
  categories?: ICategory[];
}
export interface IBC {
  id: number;
  createdAt: Dayjs | null;
  etat: "Validé" | "Annulé";
  note: string;
  chef: IChef;
}

export interface IStock {
  id: number;
  ingredient: IIngredients;
  quantité: number;
}
