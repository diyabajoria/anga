const savedJobsKey = "anga.savedJobs";

export type SavedJob = {
  id: string;
  title: string;
  service: string;
  location: string;
  payment: number;
  time: string;
  distanceKm: number;
  rating: number;
};

export function getSavedJobs() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(savedJobsKey) || "[]");
    return Array.isArray(parsed) ? (parsed as SavedJob[]) : [];
  } catch {
    return [];
  }
}

export function saveJob(job: SavedJob) {
  if (typeof window === "undefined") return [];
  const existing = getSavedJobs();
  const next = [job, ...existing.filter((item) => item.id !== job.id)].slice(0, 20);
  localStorage.setItem(savedJobsKey, JSON.stringify(next));
  return next;
}

export function removeSavedJob(id: string) {
  if (typeof window === "undefined") return [];
  const next = getSavedJobs().filter((job) => job.id !== id);
  localStorage.setItem(savedJobsKey, JSON.stringify(next));
  return next;
}
