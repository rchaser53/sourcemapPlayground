interface Poyo {
  hoge : string;
}

console.log(243)

const abc = (arg: string): Poyo => {
  return {
    hoge: arg
  }
}
