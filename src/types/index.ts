export type ContentType = 'text' | 'image';

export interface TextItem {
  id: number;
  type: 'text';
  text: string;
}

export interface ImageItem {
  id: number;
  type: 'image';
  src: string;
  width: number;
  height: number;
}

export type TierItem = TextItem | ImageItem;

export interface Tier {
  id: number;
  label: string;
  colour: string;
  items: TierItem[];
}
