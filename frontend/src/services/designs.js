// Service for /api/designs
const API_URL = process.env.REACT_APP_API_URL + "/api/designs";

export async function saveDesign(designPayload, token) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(designPayload),
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Save design error:", response.status, errorData);
    throw new Error(`Failed to save design: ${response.status} - ${errorData}`);
  }
  return response.json();
}

export async function getMyDesigns(token, page = 1, limit = 6) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  const response = await fetch(`${API_URL}/my?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch my designs: ${response.status} - ${errorText}`
    );
  }
  return response.json();
}

export async function getDesignById(designId, token) {
  const response = await fetch(`${API_URL}/${designId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch design");
  return response.json();
}

export async function updateDesign(designId, designPayload, token) {
  const response = await fetch(`${API_URL}/${designId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(designPayload),
  });
  if (!response.ok) throw new Error("Failed to update design");
  return response.json();
}

export async function deleteDesign(designId, token) {
  const response = await fetch(`${API_URL}/${designId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete design");
  return response.json();
}

export async function getPublicDesigns({
  page = 1,
  limit = 20,
  tags = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (tags) params.append("tags", tags);
  const response = await fetch(`${API_URL}/public?${params.toString()}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch public designs: ${response.status} - ${errorText}`
    );
  }
  return response.json();
}

export async function convertDesignToProduct(designId, token) {
  const response = await fetch(`${API_URL}/${designId}/to-product`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to convert design to product");
  return response.json();
}

// Get all designs for admin with pagination
export const getAllDesignsForAdmin = async (
  page = 1,
  limit = 8,
  search = ""
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (search) params.append("search", search);

    const response = await fetch(`${API_URL}/admin/all?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch designs: ${response.status}`);
    }

    return await response.json(); // Returns { designs, currentPage, totalPages, totalDesigns }
  } catch (error) {
    console.error("Error fetching designs:", error);
    throw error;
  }
};
