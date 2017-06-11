interface Poyo {
  hoge : string;
}
console.log('nya-n')
console.log(243)

const abc = (arg: string): Poyo => {
  return {
    hoge: arg
  }
}

try {
  interface Nyan {
    ara: number;
  }
  abc('bubera')
} catch (error) {
  console.error('error')
}