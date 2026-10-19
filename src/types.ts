export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  base64?: string;
  mimeType: string;
}

export interface ProcessingState {
  isLoading: boolean;
  stepMessage: string;
  progressPercent?: number;
  error: string | null;
}

export interface ExtractedResult {
  markdown: string;
  rawHtml?: string;
  timestamp: Date;
  subjectCount?: number;
  skillsFound?: string[];
}

export interface ApiSettings {
  apiKey: string;
  model: string;
  customEndpoint?: string;
}
