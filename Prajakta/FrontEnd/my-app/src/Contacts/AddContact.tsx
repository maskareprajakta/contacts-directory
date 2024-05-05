import React, { useState, useEffect } from 'react';
import { Contact } from './types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import axios from 'axios';

// Material UI styles
const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    margin: theme.spacing(1),
    width: '300px',
  },
  button: {
    margin: theme.spacing(2),
  },
}));

interface Props {
  onClose: () => void;
  addMode: boolean;
  contactToEdit?: Contact;
  fetchContacts: () => void;
}

const AddContact: React.FC<Props> = ({ onClose, addMode, contactToEdit, fetchContacts }) => {
  // Use Material UI styles
  const classes = useStyles();

  // State variables for form fields and error message
  const [name, setName] = useState<string>(contactToEdit?.name || '');
  const [email, setEmail] = useState<string>(contactToEdit?.email || '');
  const [phone, setPhone] = useState<string>(contactToEdit?.phone || '');
  const [address, setAddress] = useState<string>(contactToEdit?.address || '');
  const [error, setError] = useState<string>('');

  // useEffect to update form fields when contactToEdit changes
  useEffect(() => {
    if (!addMode && contactToEdit) {
      setName(contactToEdit.name);
      setEmail(contactToEdit.email);
      setPhone(contactToEdit.phone);
      setAddress(contactToEdit.address);
    } else {
      // Reset form fields if in addMode or contactToEdit is undefined
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
    }
  }, [addMode, contactToEdit]);

  // Function to handle form submission
  const handleCreate = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !validatePhoneNumber(phone) || !address.trim()) {
      setError('Please fill in all fields and enter a valid phone number (10 digits)');
      return;
    }

    const newContact: Contact = { id: contactToEdit?.id || 0, name, email, phone, address };

    try {
      // Sending request based on addMode
      if (addMode) {
        await axios.post('https://localhost:44305/api/Contact/PostContact', newContact, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        // Success message for adding contact
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'New contact added successfully!',
        });
      } else {
        await axios.put(`https://localhost:44305/api/Contact/PutContact/${contactToEdit?.id}`, newContact);
        // Success message for editing contact
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Contact edited successfully!',
        });
      }
      // Fetch updated contacts and close the form
      fetchContacts();
      onClose();
    } catch (error) {
      // Error message if request fails
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Duplicate record with the same email or phone number found!',
      });
      console.error('Error:', error);
    }
  };

  // Function to handle form cancellation
  const handleCancel = () => {
    onClose();
  };

  // Function to validate phone number format
  const validatePhoneNumber = (phoneNumber: string): boolean => {
    // Regular expression to match a phone number with 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  return (
    <div className={classes.formContainer}>
      <h2>{addMode ? 'Add Contact' : 'Edit Contact'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Text fields for name, email, phone, and address */}
      <TextField
        className={classes.textField}
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        className={classes.textField}
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        className={classes.textField}
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={!validatePhoneNumber(phone)}
        helperText={!validatePhoneNumber(phone) && 'Please enter a valid phone number (10 digits)'}
      />
      <TextField
        className={classes.textField}
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {/* Buttons for form submission and cancellation */}
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleCreate}
      >
        {addMode ? 'Save' : 'Update'}
      </Button>
      <Button
        variant="contained"
        color="default"
        className={classes.button}
        onClick={handleCancel}
      >
        Cancel
      </Button>
    </div>
  );
};

export default AddContact;
