const BASE_URL = "http://localhost:3000";

// Request / response interfaces
export interface FeedbackRequest {
  code: string;
  task: string;
}

export interface FeedbackResponse {
  message?: string;
  success?: boolean;
  [key: string]: any;
}

export interface ProjectFormData {
  title?: string;
  description?: string;
  techStack?: string[];
  [key: string]: any;
}

export interface ProjectsResponse {
  suggestions?: Array<Record<string, any>>;
  success?: boolean;
  [key: string]: any;
}

export interface StepsResponse {
  steps?: Array<Record<string, any>>;
  success?: boolean;
  [key: string]: any;
}

export const postFeedback = async (
  code: string,
  task: string
): Promise<FeedbackResponse> => {
  const data: FeedbackRequest = { code, task };

  console.log(JSON.stringify(data))

  const response = await fetch(`${BASE_URL}/api/gemini/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `postFeedback failed: ${response.status} ${response.statusText}`
    );
  }

  const responseData: FeedbackResponse = await response.json();
  return responseData;
};

export const postSuggestions = async (
  form_data: ProjectFormData
): Promise<ProjectsResponse> => {
  const response = await fetch(`${BASE_URL}/api/gemini/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form_data),
  });

  if (!response.ok) {
    throw new Error(
      `postSuggestions failed: ${response.status} ${response.statusText}`
    );
  }

  const responseData: ProjectsResponse = await response.json();
  return responseData;
};

export const postAppSteps = async (
  form_data: ProjectFormData
): Promise<StepsResponse> => {
  const response = await fetch(`${BASE_URL}/api/gemini/steps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form_data),
  });

  if (!response.ok) {
    throw new Error(
      `postAppSteps failed: ${response.status} ${response.statusText}`
    );
  }

  const responseData: StepsResponse = await response.json();
  return responseData;
};

export const postHint = async (
  code: string,
  task: string
): Promise<FeedbackResponse> => {
  const payload: FeedbackRequest = { code, task };

  const response = await fetch(`${BASE_URL}/api/gemini/hint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `postHint failed: ${response.status} ${response.statusText}`
    );
  }

  const responseData: FeedbackResponse = await response.json();
  return responseData;
};