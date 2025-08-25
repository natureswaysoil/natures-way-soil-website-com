export interface Variation {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  // other fields…
  variations?: Variation[];
  image: string;
}
