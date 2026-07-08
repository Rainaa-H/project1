import { apiUrl } from "./apiClient.js";

export async function importAmazonDataset(request, fetchImpl = fetch) {
  const response = await fetchImpl(await apiUrl("/api/amazon/import"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Amazon import failed");
  return body;
}
