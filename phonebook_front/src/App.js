import { useState, useEffect } from 'react';
import personsService from './service/persons';
import './App.css'; // Importing CSS file for styles

const Filter = ({ nameFilter, handleFilterChange }) => {
  return (
    <div>
      Search:
      <input value={nameFilter} onChange={handleFilterChange} />
    </div>
  );
};

const PersonForm = ({ addPerson, newName, newNumber, handleNumberChange, handleNameChange }) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button className="add-button" type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const Persons = ({ personsName, personsNumber, removePersons }) => {
  return (
    <div className="person-item">
      <span>{personsName}</span>
      <span>{personsNumber}</span>
      <button className="delete-button" onClick={removePersons}>delete</button>
    </div>
  );
};

const Content = ({ persons, removePersons }) => {
  console.log({ persons });
  return (
    <div className="content">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.number}</td>
              <td><button className="delete-button" onClick={() => removePersons(person.id)}>delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className={`notification ${message.includes('ERROR') ? 'error' : 'success'}`}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    console.log('effect');
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  console.log('render', persons.length, 'persons');

  const addPerson = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    personsService
      .create(personObject)
      .then((returnedPersons) => {
        setPersons(persons.concat(returnedPersons));
        setMessage(`${newName} was successfully added`);
        setNewName('');
        setNewNumber('');
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setMessage(`[ERROR] ${error.response.data.error}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        console.log(error.response.data);
      });
  };

  const handleFilterChange = (e) => {
    setNameFilter(e.target.value);
  };
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const removePersons = (id) => {
    const deletedPerson = persons.find((person) => person.id === id);
    console.log(`deleting ID ${deletedPerson} now`);

    if (window.confirm(`Delete this person?`)) {
      personsService.remove(id);
      console.log(`successfully deleted ${id}`);
      setPersons(persons.filter((person) => person.id !== id));
      setMessage(`successfully deleted`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter handleFilterChange={handleFilterChange} nameFilter={nameFilter} />
      <h3>New Phonebook Entry</h3>
      <PersonForm
        newNumber={newNumber}
        newName={newName}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        onSubmit={handleSubmit}
      />
      <h2>Names</h2>

      <Content persons={persons} removePersons={removePersons} />
    </div>
  );
};

export default App;
