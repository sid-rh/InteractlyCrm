const axios = require('axios');
const mysql = require('mysql2/promise');
const DBConfig=require('../config/MySql');
const FreshSales=require('../config/FreshSales');

const createContact=async (req, res) => {
    const { first_name, last_name, email, mobile_number, data_store } = req.body;
  
    try {
      if (data_store === 'CRM') 
        {
        const response = await axios.post('/contacts', {
          contact: { first_name, last_name, email, mobile_number }
        }, FreshSales);

        res.json(response.data);
      } 
      else if (data_store === 'DATABASE') 
        {
        const connection = await mysql.createConnection(DBConfig);
        const [result] = await connection.execute(
          'INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)',
          [first_name, last_name, email, mobile_number]
        );
        await connection.end();

        res.json({ id: result.insertId, ...req.body });
      } 
      else 
      {
        res.status(400).json({ error: 'Invalid data_store value' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const getContact=async (req, res) => {
    const { contact_id, data_store } = req.body;
  
    try {
      if (data_store === 'CRM') 
        {
        const response = await axios.get(`/contacts/${contact_id}`, FreshSales);
        res.json(response.data);
      } 
      else if (data_store === 'DATABASE') 
        {
        const connection = await mysql.createConnection(DBConfig);
        const [rows] = await connection.execute('SELECT * FROM contacts WHERE id = ?', [contact_id]);
        await connection.end();
        res.json(rows[0] || { error: 'Contact not found' });
      } else {
        res.status(400).json({ error: 'Invalid data_store value' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

const updateContact=async (req, res) => {
    const { contact_id, new_email, new_mobile_number, data_store } = req.body;
  
    try {
      if (data_store === 'CRM') {
        const response = await axios.put(`/contacts/${contact_id}`, {
          contact: { email: new_email, mobile_number: new_mobile_number }
        }, FreshSales);
        res.json(response.data);
      } else if (data_store === 'DATABASE') {
        const connection = await mysql.createConnection(DBConfig);
        await connection.execute(
          'UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?',
          [new_email, new_mobile_number, contact_id]
        );
        await connection.end();
        res.json({ message: 'Contact updated successfully' });
      } else {
        res.status(400).json({ error: 'Invalid data_store value' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

const deleteContact=async (req, res) => {
    const { contact_id, data_store } = req.body;
  
    try {
      if (data_store === 'CRM') {
        await axios.delete(`/contacts/${contact_id}`, FreshSales);
        res.json({ message: 'Contact deleted successfully' });
      } else if (data_store === 'DATABASE') {
        const connection = await mysql.createConnection(DBConfig);
        await connection.execute('DELETE FROM contacts WHERE id = ?', [contact_id]);
        await connection.end();
        res.json({ message: 'Contact deleted successfully' });
      } else {
        res.status(400).json({ error: 'Invalid data_store value' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  module.exports={createContact,getContact,updateContact,deleteContact};

