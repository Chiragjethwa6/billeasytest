const express = require('express');
const app = express();
const { Client } = require('pg');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(3000, () => {
    console.log("listening on port 3000 : ")
});

const client = new Client({
    host: 'dpg-cfedhkmn6mpu0ucgs6ug-a',
    port : '5432',
    user: 'root',
    password: 'Dra33cKbl8LLTsbffp1okryDqnkploXm',
    database: 'employees_1vq7'
  });
  
client.connect();

//API for creating tables, trigger and function
app.get('/', (req,res) => {

    const query = `
    CREATE TABLE department (
        id serial PRIMARY KEY,
        name varchar(255) NOT NULL,
        employee_count integer NOT NULL DEFAULT 0
    );
    
    CREATE TABLE employee (
        id serial PRIMARY KEY,
        name varchar(255) NOT NULL,
        department_id integer REFERENCES department(id),
        joining_date date NOT NULL
    );

    CREATE OR REPLACE FUNCTION increment_employee_count()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE department
        SET employee_count = employee_count + 1
        WHERE id = NEW.department_id;
    
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER increment_employee_count_trigger
    AFTER INSERT ON employee
    FOR EACH ROW
    EXECUTE FUNCTION increment_employee_count();

    INSERT INTO department (name) VALUES ('Sales');
    INSERT INTO department (name) VALUES ('Marketing');
    INSERT INTO department (name) VALUES ('Engineering'); 
    
    INSERT INTO employee (name, department_id, joining_date) VALUES ('Employee 1', 1, '2022-01-01');
    INSERT INTO employee (name, department_id, joining_date) VALUES ('Employee 2', 2, '2022-02-01');
    INSERT INTO employee (name, department_id, joining_date) VALUES ('Employee 3', 3, '2022-03-01');

    CREATE OR REPLACE FUNCTION get_employee_details_by_department_and_time_range(depa_id INT, start_date DATE, end_date DATE)
        RETURNS JSON AS $$
        DECLARE
        result JSON;
        BEGIN
        SELECT json_agg(row_to_json(employee)) INTO result
        FROM employee 
        WHERE depa_id = department_id AND joining_date BETWEEN start_date AND end_date;

        RETURN result;
        END;
        $$ LANGUAGE plpgsql;

    `;

    client.query(query, (err, response) => {
        console.log("Server is Up and Running and Created table employee and department, Inserted Values in both the tables, Created Trigger for employee count, Created Function for converting columns into JSON based on the filters " );
        res.status(200).send("Server is Up and Running and Created table employee and department, Inserted Values in both the tables, Created Trigger for employee count, Created Function for converting columns into JSON based on the filters ");
    });  
});

//Queries
const getDepartment =   'SELECT * FROM department;';
const getEmployee =   'SELECT * FROM employee;';
const getDataIntoJson = `
    SELECT "get_employee_details_by_department_and_time_range"(1, '2022-01-01T18:30:00.000Z', '2022-01-2T18:30:00.000Z');  
`;

//query for department table
client.query(getDepartment, (err, res) => {
    console.log("Department Table : ");
    console.log(res.rows);
});  

//query for employee table
client.query(getEmployee, (err, res) => {
    console.log("Employee Table : ");
    console.log(res.rows);
});  

//query for converting column into JSON
client.query(getDataIntoJson, (err, res) => {
    console.log("JSON Data based on filter : ");
    console.log(JSON.stringify(res.rows));
});  

//API for revoking the function created
app.post('/revokeFunction', (req,res) => {
    const name = req.body.name;
    const revokeFunction = `
    REVOKE EXECUTE ON Function ${name} FROM public;
`;

    client.query(revokeFunction, (err, response) => {
        console.log("Revoking the function created for converting columns into JSON based on filter : ");
        console.log(response);
        res.status(200).send("JSON Data based on filter : "+JSON.stringify(response));
        client.end();
    });
})

//API for finding maximal subset
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
    
    console.log("Maximal subset length : "+result.toString());
    res.status(200).send("Maximal subset length : "+result.toString());
    
});

