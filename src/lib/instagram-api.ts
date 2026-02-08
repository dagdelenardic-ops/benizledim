import type {
  InstagramMediaContainer,
  InstagramContainerStatus,
  InstagramPublishResult,
  InstagramAccountInfo,
} from "@/types/instagram";

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

function getConfig() {
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!userId || !accessToken) {
    throw new Error("INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN is not set");
  }
  return { userId, accessToken };
}

export async function createMediaContainer(
  imageUrl: string,
  caption: string,
  mediaType?: "STORIES"
): Promise<InstagramMediaContainer> {
  const { userId, accessToken } = getConfig();

  const body: Record<string, string> = {
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  };
  if (mediaType) {
    body.media_type = mediaType;
  }

  const res = await fetch(`${GRAPH_API_BASE}/${userId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}

export async function createCarouselChildContainer(
  imageUrl: string
): Promise<InstagramMediaContainer> {
  const { userId, accessToken } = getConfig();

  const res = await fetch(`${GRAPH_API_BASE}/${userId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      is_carousel_item: true,
      access_token: accessToken,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}

export async function createCarouselContainer(
  childIds: string[],
  caption: string
): Promise<InstagramMediaContainer> {
  const { userId, accessToken } = getConfig();

  const res = await fetch(`${GRAPH_API_BASE}/${userId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      media_type: "CAROUSEL",
      children: childIds.join(","),
      caption,
      access_token: accessToken,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}

export async function checkContainerStatus(
  containerId: string
): Promise<InstagramContainerStatus> {
  const { accessToken } = getConfig();

  const res = await fetch(
    `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${accessToken}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}

export async function publishContainer(
  containerId: string
): Promise<InstagramPublishResult> {
  const { userId, accessToken } = getConfig();

  const res = await fetch(`${GRAPH_API_BASE}/${userId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: accessToken,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}

export async function pollContainerUntilReady(
  containerId: string,
  maxAttempts = 30,
  intervalMs = 2000
): Promise<InstagramContainerStatus> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkContainerStatus(containerId);
    if (status.status_code === "FINISHED") return status;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(`Container failed with status: ${status.status_code}`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Container did not finish in time");
}

export async function getAccountInfo(): Promise<InstagramAccountInfo> {
  const { userId, accessToken } = getConfig();

  const res = await fetch(
    `${GRAPH_API_BASE}/${userId}?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${accessToken}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}
