export type Media = {
  id?: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
};
