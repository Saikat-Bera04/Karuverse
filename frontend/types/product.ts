export interface Product {
  _id?: string;
  id: string;
  title?: string;
  name: string;
  category?: string;
  craftType: string;
  district?: string;
  region: string;
  artisan: any;
  price: number;
  description?: string;
  desc: string;
  emoji: string;
  nftTokenId?: string;
  nftVerified: boolean;
  isVerified?: boolean;
  storySnippet?: string;
  images?: string[];
}
