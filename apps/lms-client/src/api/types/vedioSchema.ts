import { z } from "zod";

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
});

export const videoListSchema = z.array(videoSchema);

export type Video = z.infer<typeof videoSchema>;
