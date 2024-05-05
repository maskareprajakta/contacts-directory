import React, { useEffect, useState } from 'react';
import { Contact } from './types'; 
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddContact from '../Contacts/AddContact';
import axios from 'axios';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(2, 0),
  },
  addButton: {
    margin: theme.spacing(2, 0),
  },
  editButton: {
    marginRight: theme.spacing(1),
  },
  deleteButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main,
  },
  evenRow: {
    backgroundColor: '#f5f5f5', // Light gray background for even rows
  },
}));

const ContactList: React.FC = () => {
  const classes = useStyles();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editContactId, setEditContactId] = useState<string | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  // Function to fetch contacts from the API
  const fetchContacts = async () => {
    try {
      const response = await fetch('https://localhost:44305/api/Contact');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Function to handle click on "Create Contact" button
  const handleCreateContactClick = () => {
    setShowAddContact(true);
  };

  // Function to handle closing of AddContact modal
  const handleAddContactClose = () => {
    setEditContactId(null);
    setShowAddContact(false);
  };

  // Function to handle edit contact
  const handleEditContact = (id: string) => {
    setEditContactId(id);
    setShowAddContact(true);
  };

  // Function to handle contact deletion
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:44305/api/Contact/DeleteContact/${id}`);
      fetchContacts(); 
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Contact deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div>
      {showAddContact ? (
        // Render AddContact component if showAddContact is true
        <AddContact 
          onClose={handleAddContactClose} 
          fetchContacts={fetchContacts}
          addMode={!editContactId} 
          contactToEdit={editContactId ? contacts.find(contact => String(contact.id) === editContactId) : undefined}
        />
      ) : (
        // Render contact list table if showAddContact is false
        <div>
          <Typography variant="h4" className={classes.title}>Contact List</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className={classes.addButton}
            onClick={handleCreateContactClick}
          >
            Create Contact
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow key={contact.id} className={index % 2 === 0 ? classes.evenRow : ''}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      className={classes.editButton}
                      startIcon={<EditIcon />}
                      onClick={() => handleEditContact(String(contact.id))}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      className={classes.deleteButton}
                      startIcon={<DeleteIcon />}
                      onClick={() => contact.id && handleDelete(contact.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ContactList;
