const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');



router.get('/', (req, res) => {
    const sqlTable = `SELECT * FROM shopping_list ORDER BY name;`;
    pool.query(sqlTable)
        .then((result) => {
            console.log('Got shopping list back from database', result);
            res.send(result.rows);
    })
    .catch((error) => {
        console.log(`Error making data base query ${sqlTable}`, error);
        res.sendStatus(500);
    })
});



router.post('/', (req, res) => {
    const shoppingList = req.body;
    const sqlText = `INSERT INTO shopping_list (name, quantity, unit, purchased)
                     VALUES ($1, $2, $3, $4)`;
    pool.query(sqlText, [shoppingList.name, shoppingList.quantity, shoppingList.unit, shoppingList.purchased])
        .then((result) => {
            console.log(`Added shopping list to the database`, shoppingList);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500);
        })
});

router.put('/toggle/:id', (req, res) => {
    let { id } = req.params;
    // This query will switch from true to false and false to true
    const sqlText = `
        UPDATE "shopping_list" SET "purchased" = NOT "purchased" 
        WHERE "id" = $1;
    `;
    pool.query(sqlText, [id])
        .then((result) => {
            console.log(`Got stuff back from the database`, result);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); // Good server always responds
        })
});

router.put('/reset', (req, res) =>{
    const sqlText = `
        UPDATE "shopping_list" SET "purchased" = false
    `;
    pool.query(sqlText)
        .then((result) => {
            console.log(`Got stuff back from the database`, result);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); // Good server always responds
        })
})


router.delete('/:id', (req, res) => {
    let { id } = req.params;
    const sqlText = `DELETE FROM "shopping_list" WHERE "id" = $1;`;
    pool.query(sqlText, [id])
        .then((result) => {
            console.log(`Got stuff back from the database`, result);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); // Good server always responds
        })
})

router.delete('/clear/all', (req, res) => {
    
    const sqlText = `DELETE FROM "shopping_list";`;
    pool.query(sqlText)
        .then((result) => {
            console.log(`Got stuff back from the database`, result);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); // Good server always responds
        });
});


module.exports = router;