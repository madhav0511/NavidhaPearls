// Hand-written mirrors of the skeleton's FastAPI models. The storefront uses local catalog data,
// but these keep the HTTP boundary documented for the existing /api/status smoke route.
export interface StatusCheck {
  id: string;
  client_name: string;
  timestamp: string;
}

export interface StatusCheckCreate {
  client_name: string;
}