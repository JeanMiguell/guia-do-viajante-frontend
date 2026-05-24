export function getCurrentTimelineId() {
  return localStorage.getItem("timelineId");
}

export function setCurrentTimelineId(id: string) {
  localStorage.setItem("timelineId", id);
}