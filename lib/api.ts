import axios from 'axios';

const BASE_URL = 'https://autostore.link/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_API_KEY is not set in environment variables');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': `${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Types
import type {
  Type,
  Model,
  Submodel,
  ModelYear,
  Version,
  Part, 
  SearchResult
} from './types';

export const getTypes = async (page = 1): Promise<any> => {
  const { data } = await api.get('/v2/user/types/index', { params: { page, per_page: 4 } });
  return data;
};

export const getModels = async (typeId: string): Promise<Model[]> => {
  const { data } = await api.get(`/v2/user/${typeId}/models/index`);
  return data;
};

export const getSubmodels = async (modelId: string): Promise<Submodel[]> => {
  const { data } = await api.get(`/v2/user/${modelId}/submodels/index`);
  return data;
};

export const getModelYears = async (submodelId: string): Promise<ModelYear[]> => {
  const { data } = await api.get(`/v2/user/${submodelId}/modelYears/index`);
  return data;
};

export const getVersions = async (modelYearId: string): Promise<Version[]> => {
  const { data } = await api.get(`/v2/user/${modelYearId}/versions/index`);
  return data;
};

export const getParts = async (modelYearId: string, versionId?: string): Promise<Part[]> => {
  const params = versionId ? { params: { versionId } } : undefined;
  const { data } = await api.get(`/v2/user/${modelYearId}/parts/index`, params);
  return data;
};

export const search = async (search: string): Promise<SearchResult[]> => {
  const { data } = await api.post(`/v2/search/${encodeURIComponent(search)}`);
  return data;
}; 