export interface TierItem {
  id: number;
  content: string;
}

export interface Tier {
  name: string;
  colour: string;
  items: TierItem[];
}
