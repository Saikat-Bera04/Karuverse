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
  artisanWallet?: string;
  price: number;
  currency?: string;
  celoPrice?: number;
  description?: string;
  desc: string;
  emoji?: string;
  nftTokenId?: string;
  nftTransactionHash?: string;
  nftMetadataUrl?: string;
  nftVerified: boolean;
  isVerified?: boolean;
  storySnippet?: string;
  images?: string[];
}
