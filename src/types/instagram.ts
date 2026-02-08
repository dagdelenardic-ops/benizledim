export interface InstagramMediaContainer {
  id: string;
}

export interface InstagramContainerStatus {
  id: string;
  status_code: "EXPIRED" | "ERROR" | "FINISHED" | "IN_PROGRESS" | "PUBLISHED";
}

export interface InstagramPublishResult {
  id: string;
}

export interface InstagramAccountInfo {
  id: string;
  username: string;
  name: string;
  profile_picture_url?: string;
  followers_count?: number;
  media_count?: number;
}
