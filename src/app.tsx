import * as React from 'react'

const abc = 123;

export default class extends React.Component<any, any> {
  render(){
    console.log('nyan');
    console.log(abc);

    return <div>
            <div onClick={(event) =>{
                console.log(234)
              }}>ate</div>
          </div>
  }
}
