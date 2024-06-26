import {Dayjs} from "dayjs";

type Option = "Générale" | "Menu composé";

export interface ICategory {
    id: number;
    nom: string;
    type: Option;
}

export interface IUnite {
    id: number;
    unite: string;
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

        quantite?: number;
    };
}

export interface ICartMenu {
    id: number;
    menus: IMenu;
    quantity: number;
    total?: number;
    component: string;
    categorie?: string;
    prix?: number;
    titre?: string;
    image?: string;
}

export interface ICaisse {
    id: number;
    nom?: string;
    balance?: number;
    password?: string;
}

export interface ICaisseLogs {
    id: number;
    caisse: ICaisse;
    etat?: "Ouverte" | "Fermé";
    createdAt?: Date;
    date_cloture?: Date;
    solde_ouverture: number;
    solde_cloture: number;
    depenses: number;
    ventes: number;
    user?: IUser;
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
    menu?: IMenu[];
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
    caisse?: ICaisse;
}

export interface IUser {
    id: number;
    nom?: string;
    prenom?: string;
    phone?: string;
    photo?: null | { url: string };
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    username?: string;
    date_naissance?: Date;
    adresse?: string;
    caisse?: ICaisse;
    role?: { label?: string; id?: number; name?: string };
    // role: IRole;
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
    caisse?: string;
}

export interface ICaisseLogsFilterVariables {
    etat?: string;
    user?: string;
    caisse?: string;
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
    unite?: IUnite;
    prix?: number;
    count?: number;
}

export interface ICatIngredients {
    id: number;
    nom?: string;
    categories?: ICategory[];
    ingredients?: IIngredients[];
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
    ingredients?: IIngredients[];
}

export interface IChef {
    id: number;
    chef: string;
    categories?: ICategory[];
}

export interface IBC {
    id: number;
    createdAt: Dayjs | null;
    updatedAt: Dayjs | null;
    etat: "Validé" | "Annulé";
    note: string;
    chef: IChef;
    traite: boolean;
    ingredients?: IIngredients[];
}

export interface IStock {
    id: number;
    ingredient: IIngredients;
    quantité: number;
    publishedAt: Date;
    updatedAt: Date;
}

export type IProps = {
    columns: Columns[];
    info: Info;
    add: boolean;
    edit: boolean;
    deleteRow: boolean;
    fetchurl: string;
    refresh: boolean;
    addFunction: (data: any) => void;
    editFunction: (data: any) => void;
    deleteFunction: (data: number) => void;
    openUpdate?: boolean;
    setOpenUpdate: any;
    item: any;
    setItem: any;
    refreshParent: boolean;
    [key: string]: any;
};
export type BACKENDINFO = {
    page: number;
    pageSize: number;
    total: number;
    filter: string[] | number[];
    sort: {
        field: string;
        sort: string;
    };
    rows: any[];
    refresh: boolean;
};

export type Columns = {
    field?: string;
    headerName?: string;
    type:
        | "boolean"
        | "string"
        | "date"
        | "number"
        | "password"
        | "actions"
        | "singleSelect";
    add?: boolean;
    edit?: boolean;
    hide?: boolean;
    editable?: boolean;
    filterable?: boolean;
    sortable?: boolean;
    // renderCell?: (params: GridRenderCellParams) => JSX.Element;
    TextFieledProps?: any;
    width?: string | number;
    filterField?: string;
    [key: string]: any;
};
export type trackingWorkedHours = {
    "id"?: number;
    "employee_id": number;
    "full_name": string;
    "start_time": string;
    "end_time": string;
    "date": string;
    "total": number;
}
export type Salaries = {
    id: number
    employee_id: number
    full_name: string
    position: string // job title
    hourly_rate: number // wage rate per hour
    hours_worked: number
    overtime_hours: number
    gross_pay: number
    deductions: number
    net_pay: number
    pay_period: string
    pay_date: Date
    bank_account_details: number
}
export type HRManagerLog = {
    id: number
    employee_id?: number
    full_name?: string
    start_date: Date
    end_date: Date
    type: "leave" | "personal leave" | "vacation" | "public holiday"
    status: "pending" | "approved" | "rejected"
    duration: number
    approver: string
    reason?: string
    notes?: string
}
