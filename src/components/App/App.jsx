import React from 'react';
import axios from 'axios';
import Header from '../Header/Header.jsx'
import './App.css';
import { useEffect, useState } from 'react';


function App() {

let [ itemName, setItemName] = useState('');
let [ itemQuantity, setQuantity] = useState('');
let [ itemUnit, setUnit] = useState('');
let [ itemPurchase, setPurchase] = useState('');
let [ listArray, setListArray] = useState([]);

const fetchList = () =>{
    console.log('fetchlist');
    axios({
        method: 'GET',
        url: '/api/shopping_list'
    }).then((response) => {
        console.log(response);
        console.log(response.data);
        setListArray(response.data);
      }).catch((error) => {
        console.log(error);
      });
}
useEffect(fetchList, []);




const addItem = (event) => {
    event.preventDefault();
    
    axios({
        method: 'POST',
        url: '/api/shopping_list',
        data: {
            name: itemName,
            quantity: itemQuantity,
            unit: itemUnit
        }
    })
        .then((response) => {
            console.log('successful post:', response);
            fetchList();
            setItemName('');
            setQuantity('');
            setUnit('');
        })
        .catch((error) => {
            console.log('post failed:', error);
        })
    }
    
const deleteItem = (id) => {
    axios.delete(`/api/shopping_list/${id}`)
    .then((response) => {
        console.log('deleting item worked:', response);
        fetchList();
    })
    .catch(function (error) {
        console.log(error);
    })
}

const toggleItem = (id) => {
    console.log('toggle action', id);

    axios.put(`/api/shopping_list/toggle/${id}`)
    .then((response) => {
        console.log('toggle action worked:', response);
        fetchList();
    })
    .catch (function (error) {
        console.log(error);
    })
}
//  NEED TO ASSIGN VALUE BOOLEAN TO CONNECT DATABAASE AND URL



    return (
        <div className="App">
            <Header />
            <main>
            <h1>Add an Item</h1> 
            <form onSubmit={addItem}>
            <label htmlFor="item">Item</label>
                <input id="item" onChange={(event) => setItemName(event.target.value)} value={itemName} />
                <label htmlFor="quantity">Quantity</label>
                <input id="quantity" onChange={(event) => setQuantity(event.target.value)} value={itemQuantity} />
                <label htmlFor="unit">Unit</label>
                <input id="unit" onChange={(event) => setUnit(event.target.value)} value={itemUnit} />
                <button type="submit">Add new item</button>
            </form>
            <h2>Shopping Cart</h2>
            {listArray.map((item) => { return (<li key={item.name}>{item.name} {item.unit} {item.quantity} <button onClick={() => deleteItem(item.id)}>Remove</button> <button onClick={() => toggleItem(item.id)}>Buy</button> </li>); })}
            </main>
        </div>
    );
}

export default App;
