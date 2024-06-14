import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from '../Header/Header.jsx'

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



function App() {

    let [itemName, setItemName] = useState('');
    let [itemQuantity, setQuantity] = useState('');
    let [itemUnit, setUnit] = useState('');
    let [listArray, setListArray] = useState([]);

    const fetchList = () => {
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
                unit: itemUnit,
                purchased: false
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
            .catch(function (error) {
                console.log(error);
            })
    }

    const resetItem = () => {
        console.log('reset action');

        axios.put(`/api/shopping_list/reset`)
            .then((response) => {
                console.log('reset action worked:', response);
                fetchList();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const clearItem = () => {
        console.log('clear action');

        axios.delete(`/api/shopping_list/clear/all`)
            .then((response) => {
                console.log('clear worked:', response);
                fetchList();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //  NEED TO ASSIGN VALUE BOOLEAN TO CONNECT DATABAASE AND URL



    return (
        <div className="App">
            <Header />
            <main>
                <h1>Add an Item</h1>
                <form onSubmit={addItem}>
                    <Box mb={2}>
                        <TextField id="standard-basic" label="Item" variant="standard" onChange={(event) => setItemName(event.target.value)} value={itemName} />
                    </Box>
                    <Box mb={2}>
                        <TextField id="standard-basic" label="Quantity" variant="standard" onChange={(event) => setQuantity(event.target.value)} value={itemQuantity} />
                    </Box>
                    <Box mb={2}>
                        <TextField id="standard-basic" label="Unit" variant="standard" onChange={(event) => setUnit(event.target.value)} value={itemUnit} />
                    </Box>
                    <button type="submit">Add new item</button>
                </form>
                <button onClick={() => resetItem()}>Reset</button>

                <button onClick={() => clearItem()}>Clear</button>
                <h2>Shopping Cart</h2>
                {listArray.filter(item => item.purchased === false).map((item) => {
                    return (
                        <li key={item.name}>{item.name} {item.unit} {item.quantity} {item.purchased ? (
                            // item.purchased => If it's true, "Purchased" text will generate on screen
                            <span> - Purchased</span>
                        ) : (
                            // item.purchased => If it's false, "Remove" & "Buy" button will generate on screen
                            <>
                                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => deleteItem(item.id)}>Remove</Button>
                                <Button variant="contained" color="success" startIcon={<DoneIcon />} onClick={() => toggleItem(item.id)}>Buy</Button>
                            </>
                        )}
                        </li>
                    );
                })}
                {listArray.filter(item => item.purchased === true).map((item) => {
                    return (
                        <li key={item.name}>{item.name} {item.unit} {item.quantity} {item.purchased ? (
                            // item.purchased => If it's true, "Purchased" text will generate on screen
                            <span> - Purchased</span>
                        ) : (
                            // item.purchased => If it's false, "Remove" & "Buy" button will generate on screen
                            <>
                                <button onClick={() => deleteItem(item.id)}>Remove</button>
                                <button onClick={() => toggleItem(item.id)}>Buy</button>

                            </>
                        )}
                        </li>
                    );
                })}
            </main>
        </div>
    );
}

export default App;