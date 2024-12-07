import { type RecipeStep } from '@/types/recipe';

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /(?:vimeo\.com\/)([0-9]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function formatVideoUrl(url: string): string {
  const youtubeId = extractVideoId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }
  return url;
}

export function getVideoThumbnail(url: string): string {
  const youtubeId = extractVideoId(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return '';
}

export function validateMediaUrls(steps: RecipeStep[]): string[] {
  const errors: string[] = [];

  steps.forEach((step, stepIndex) => {
    step.media?.forEach((media, mediaIndex) => {
      if (media.type === 'video') {
        if (!extractVideoId(media.url)) {
          errors.push(`Step ${stepIndex + 1}, Media ${mediaIndex + 1}: Invalid video URL`);
        }
      } else if (media.type === 'image') {
        try {
          new URL(media.url);
        } catch {
          errors.push(`Step ${stepIndex + 1}, Media ${mediaIndex + 1}: Invalid image URL`);
        }
      }

      if (media.timestamp && !isValidTimestamp(media.timestamp)) {
        errors.push(`Step ${stepIndex + 1}, Media ${mediaIndex + 1}: Invalid timestamp format`);
      }
    });
  });

  return errors;
}

function isValidTimestamp(timestamp: string): boolean {
  return /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/.test(timestamp);
}

export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const parts = [];
  if (h > 0) parts.push(h.toString().padStart(2, '0'));
  parts.push(m.toString().padStart(2, '0'));
  parts.push(s.toString().padStart(2, '0'));
  
  return parts.join(':');
}