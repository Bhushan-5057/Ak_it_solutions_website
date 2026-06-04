export type ContactService =
  | "Website Development"
  | "Mobile App Development"
  | "SaaS Application Development";

export type ContactRequest = {
  name: string;
  email: string;
  service: ContactService;
  message: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export async function createContact(contact: ContactRequest) {
  const response = await fetch(`${API_BASE_URL}/api/contacts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });

  let payload: ApiResponse<unknown> | undefined;

  try {
    payload = (await response.json()) as ApiResponse<unknown>;
  } catch {
    throw new Error("Unable to read contact response.");
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Unable to submit contact form.");
  }

  return payload.data;
}
