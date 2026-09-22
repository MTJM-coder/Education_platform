const BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "pf_token";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, options = {}) {
    const token = getToken();
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        clearToken();
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(data?.message || "Une erreur est survenue.", response.status, data);
    }

    return data;
}

export class ApiError extends Error {
    constructor(message, status, body) {
        super(message);
        this.status = status;
        this.body = body; // utile pour lire les erreurs de validation (422)
    }
}