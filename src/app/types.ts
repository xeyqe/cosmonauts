export type Cosmonaut = {
  id: string;
  name: string;
  surname: string;
  birth: string,
  powers: string;
}

export type Query = {
  cosmonauts: Cosmonaut[];
}
