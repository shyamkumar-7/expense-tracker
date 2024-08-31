
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [name,setName]=useState('');
  const [datetime,setDatetime]=useState('');
  const [description,setDescription]=useState('');
  const [price,setPrice]=useState('');

  const [transactions,setTransactions]=useState([]);


  useEffect(()=>{
   getTransactions().then(transactions=>{
    setTransactions(transactions);
   });
  },[])

  async function  getTransactions(){
    const url=process.env.REACT_APP_URL_API+'/transactions';
    const response= await fetch(url);
    const json=await response.json();
    return json;
  }



  function addNewTransaction(event){
    event.preventDefault();
    const url=process.env.REACT_APP_URL_API+'/transaction';

    fetch(url,{
      method:'POST',
      headers:{'Content-type':'application/json'},
      body: JSON.stringify({name,description,datetime,price})
    }).then(response=>{
      response.json().then(json=>{
        setTransactions([...transactions,json])
        setName('');
        setDescription('');
        setDatetime('');
        setPrice('');
        console.log('result', json)
      })
    })

    console.log(url)
  }


  function deleteTransaction(id) {
    const url = `${process.env.REACT_APP_URL_API}/transaction/${id}`;
  
    fetch(url, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setTransactions(transactions.filter(transaction => transaction._id !== id)); 
          console.log(`Transaction ${id} deleted successfully.`);
        } else {
          console.error(`Failed to delete transaction with id ${id}`);
        }
      })
      .catch(error => {
        console.error('Error deleting transaction:', error);
      });
  }
  

  let balance=0;
  for(const transaction of transactions){
    balance+=transaction.price;
  }

  return (
    <main>
      <h1 className={(balance<0? 'red' : 'green')} >Rs. {balance}</h1>
      <form onSubmit={addNewTransaction} >
        <div className='basic' >
          <input type="text" placeholder={'add item name here'} 
          value={name} 
          onChange={(event)=>setName(event.target.value)} />
          <input type="text" 
          value={price} placeholder={'+100'}
          onChange={(event)=>setPrice(event.target.value)} />
        </div>
        
        <div className='datetime' >
        <input type="datetime-local" 
          value={datetime} 
          onChange={(event)=>setDatetime(event.target.value)} />
        </div>

        <div className="description">
          <input type="text" placeholder={'description'} 
          value={description} 
          onChange={(event)=>setDescription(event.target.value)} />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>
  
        

      <div className="transactions">
        
        {transactions.length ? transactions.map(transaction=>(
          <div className="transaction">
          <div className="left">
            <div className="name">{transaction.name}</div>
            <div className="description">
            {transaction.description}
            </div>
          </div>
          {console.log(transaction.price)}
          <div className="right">
            <div className={ "price " + (transaction.price>0 ? 'green' :  'red')}> {transaction.price}</div>
            <div className="datetime">
            {transaction.datetime}
            </div>
            <button className='delete_button' onClick={() => deleteTransaction(transaction._id)}>❌</button>
          </div>
        </div>
        )) : <span className='loading' > Loading...</span> }

      </div>
    </main>
  );
}

export default App;
