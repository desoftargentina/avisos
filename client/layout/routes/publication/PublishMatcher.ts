import { UrlSegment, UrlMatchResult } from '@angular/router';

export function publishMatcher(segments: UrlSegment[]): UrlMatchResult {
  if (segments.length < 1) {
    return null;
  }
  const segment = segments[segments.length - 1];
  const matches = segment.path.match('\\-\\d+$');
  if (matches && matches.length > 0) return { consumed: segments, posParams: { publishID: segment } };
  return null;
}
