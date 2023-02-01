const express = require('express');
const app = express();
// const routes = require('./routes/routes');
// const { Client } = require('pg');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(3000, () => {
    console.log("listening on port 3000 : ")
});

// const client = new Client({
//     host: 'localhost',
//     user: 'postgres',
//     password: 'postgres',
//     database: 'Employee'
//   });
  
// client.connect();

// const query = 'SELECT * FROM employee';

// client.query(query, (err, res) => {
//     console.log(err, res.rows);
    
// });  

// Create department table

// CREATE TABLE department (
//     id serial PRIMARY KEY,
//     name varchar(255) NOT NULL,
//     employee_count integer NOT NULL DEFAULT 0
//   );

// Create employee table
  
//   CREATE TABLE employee (
//     id serial PRIMARY KEY,
//     name varchar(255) NOT NULL,
//     department_id integer REFERENCES department(id),
//     joining_date date NOT NULL
//   );
 
// Inserting data into department table 

//   INSERT INTO department (name) VALUES ('Sales');
//   INSERT INTO department (name) VALUES ('Marketing');
//   INSERT INTO department (name) VALUES ('Engineering');

// Inserting data into employee table 

//   INSERT INTO employee (name, department_id, joining_date) VALUES ('John Doe', 1, '2022-01-01');
//   INSERT INTO employee (name, department_id, joining_date) VALUES ('Jane Doe', 2, '2022-02-01');
//   INSERT INTO employee (name, department_id, joining_date) VALUES ('Bob Smith', 3, '2022-03-01');

// Trigger to maintain a count of employees in each department

//   CREATE OR REPLACE FUNCTION increment_employee_count()
//   RETURNS TRIGGER AS $$
//   BEGIN
//     UPDATE department
//     SET employee_count = employee_count + 1
//     WHERE id = NEW.department_id;
  
//     RETURN NEW;
//   END;
//   $$ LANGUAGE plpgsql;
  
//   CREATE TRIGGER increment_employee_count_trigger
//   AFTER INSERT ON employee
//   FOR EACH ROW
//   EXECUTE FUNCTION increment_employee_count();

// Function to return JSON of all employee details in a department based on the time they joined the company
  
//   CREATE OR REPLACE FUNCTION get_employee_details_by_department_and_time_range(department_id INT, start_date DATE, end_date DATE)
//   RETURNS JSON AS $$
//   DECLARE
//     result JSON;
//   BEGIN
//     SELECT json_agg(row_to_json(employee)) INTO result
//     FROM employee
//     WHERE department_id = department_id AND joining_date BETWEEN start_date AND end_date;
  
//     RETURN result;
//   END;
//   $$ LANGUAGE plpgsql;

// revoke the database

// client.query('REVOKE EXECUTE ON FUNCTION get_employee_details_by_department_and_time_range(INT, DATE, DATE) FROM public', (err, res) => {
//     console.log(err ? err.stack : res);
//     client.end();
//   });

app.post('/maximalsubset', async (req,res) => {
    console.log(req.body);
    var arr = req.body.array;
    const K = req.body.divisor;

    arr = arr.map(Number);
    k = Number(K);

    let f = new Array(k);
    for(let i=0;i<K;i++)
    {
        f[i]=0;
    }
        
    for (let i = 0; i < arr.length; i++)
        f[arr[i] % K]++;
    
    if (K % 2 == 0)
        f[K/2] = Math.min(f[K/2], 1);
    
    let result = Math.min(f[0], 1);
    
    for (let i = 1; i <= K/2; i++)
        result += Math.max(f[i], f[K-i]);
    
    res.status(200).send("Maximal subset length : "+result.toString());
    
});
