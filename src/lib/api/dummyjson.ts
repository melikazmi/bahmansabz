const BASE_URL = "https://dummyjson.com";

export type DummyJsonListResponse<T, K extends string> = {
    [key in K]: T[];
} & {
    total: number;
    skip: number;
    limit: number;
};

export type DummyJsonUser = {
    id: number;
    firstName: string;
    lastName: string;
    maidenName?: string;
    email: string;
    phone: string;
    image: string;
    age: number;
    gender: string;
    company?: {
        name: string;
        title: string;
        department: string;
    };
    address?: {
        city: string;
        state: string;
        country: string;
    };
};

export type DummyJsonProduct = {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
};

export type DummyJsonLoginResponse = {
  id: number;
  username: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
};

type ListParams = {
    limit?: number;
    skip?: number;
    query?: string;
    category?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        cache: "no-store",
        ...init,
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "درخواست به DummyJSON موفق نبود.");
    }

    return (await res.json()) as T;
}

export async function login(
  username: string,
  password: string
): Promise<DummyJsonLoginResponse> {
  return request<DummyJsonLoginResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export function resolveLoginToken(payload: DummyJsonLoginResponse): string {
  return payload.accessToken ?? payload.token ?? "";
}

export async function getUsers(
    params: ListParams = {}
): Promise<DummyJsonListResponse<DummyJsonUser, "users">> {
    const { limit = 12, skip = 0, query = "" } = params;
    const normalizedQuery = query.trim();

    if (normalizedQuery) {
        const searchParams = new URLSearchParams({
            q: normalizedQuery,
            limit: String(limit),
            skip: String(skip),
        });
        return request(`/users/search?${searchParams.toString()}`);
    }

    const searchParams = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
    });
    return request(`/users?${searchParams.toString()}`);
}

export async function getProducts(
    params: ListParams = {}
): Promise<DummyJsonListResponse<DummyJsonProduct, "products">> {
    const { limit = 12, skip = 0, query = "", category = "" } = params;
    const normalizedQuery = query.trim();
    const normalizedCategory = category.trim();

    if (normalizedQuery) {
        const searchParams = new URLSearchParams({
            q: normalizedQuery,
            limit: String(limit),
            skip: String(skip),
        });
        return request(`/products/search?${searchParams.toString()}`);
    }

    if (normalizedCategory) {
        const searchParams = new URLSearchParams({
            limit: String(limit),
            skip: String(skip),
        });
        return request(`/products/category/${normalizedCategory}?${searchParams.toString()}`);
    }

    const searchParams = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
    });
    return request(`/products?${searchParams.toString()}`);
}

export async function getProductCategories(): Promise<string[]> {
    const categories = await request<Array<string | { slug: string }>>(
        "/products/categories"
    );

    return categories.map((item) => (typeof item === "string" ? item : item.slug));
}
