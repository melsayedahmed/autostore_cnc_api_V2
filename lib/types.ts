export interface Type {
  id: string;
  name: string;
  image?: string;
}

export interface Model {
  id: string;
  name: string;
  typeId: string;
  image?: string;
}

export interface Submodel {
  id: string;
  _id?: string;
  name: string;
  image?: string;
}

export interface ModelYear {
  id: string;
  _id?: string;
  name: number | string;
  image?: string;
}

export interface Version {
  id: string;
  name: string;
  image?: string;
}

export interface Part {
  id: string;
  name: string;
  image?: string;
  dimensions?: string;
  points?: number;
  [key: string]: any;
}

export interface SearchResult {
  id: string;
  type: 'type' | 'model' | 'submodel' | 'modelYear' | 'version' | 'part';
  name: string;
  [key: string]: any;
} 