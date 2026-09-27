export const contactTopics = [
  { value: "order", label: "An existing order" },
  { value: "product", label: "Product or sizing advice" },
  { value: "returns", label: "Returns & exchanges" },
  { value: "service", label: "Service & workshop" },
  { value: "track-days", label: "Track days" },
  { value: "other", label: "Something else" },
] as const

export type ContactTopic = (typeof contactTopics)[number]["value"]

export function isContactTopic(value: unknown): value is ContactTopic {
  return contactTopics.some((topic) => topic.value === value)
}
