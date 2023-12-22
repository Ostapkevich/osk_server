interface ItypeAndsteel {
  rolled_type: [
    {
      idrolled_type: number;
      name_typerolled: string;
      ind: number;
    }
  ],
  steels: [
    {
      idsteel: number;
      steel: string;
      index: number;
    }
  ]
}


interface IaddRolled {
  name_rolled: string,
  idsteel: number,
  idrolled_type: number,
  d?: number,
  weight: number,
  t?: number
}
export { ItypeAndsteel , IaddRolled}
