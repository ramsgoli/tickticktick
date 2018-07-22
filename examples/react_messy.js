import React from 'react'

const MyComponent = () => (
 <div style={{backgroundColor: '#f2b0cb', height: '500px', width: '500px', textAlign: 'center'}}>
     <h1 style={{padding: '2.5%', color: '#ffffff'}}>
       This is a React Component
     </h1>
     <h2 style={{color: '#2e6bf7'}} > My CSS sucks... </h2>
     <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
       <div style={{margin: '5%', backgroundColor: '#e2a52e', height: '250px', width: '250px'}}>

       </div>
       <div style={{margin: '5%', backgroundColor: '#3aae84', height: '200px', width: '250px'}}>

       </div>
     </div>
  </div>
);

export default MyComponent;
