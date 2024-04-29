import { useState, useEffect } from 'react'
import personsService from './service/persons'
import axios from 'axios'



const Filter = ({nameFilter,handleFilterChange }) => {
  return (
    <div>
        Search:
        <input value={nameFilter}
        onChange={handleFilterChange}/>
    </div>
  )
}

const PersonForm = ({ addPerson, newName, newNumber, handleNumberChange, handleNameChange}) => {
  return (
<div>
<form onSubmit={addPerson}>
        <div>  
          name: <input value={newName} 
            onChange={handleNameChange}/> </div>
        <div>  
          number: <input value={newNumber} 
            onChange={handleNumberChange}/> </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
</div>
  )
}
const Persons = ({personsName, personsNumber, removePersons}) => {
  return (
    <div>
      {personsName} {personsNumber} 
          <button onClick={removePersons}>delete</button>
    </div>
  )
}
  

const Content = ({ persons, removePersons }) => {
  console.log({persons})
 return (
    <div>
     {persons.map(persons =>
        <Persons key={persons.id} 
        personsName={persons.name} 
        personsNumber={persons.number} removePersons={() =>removePersons(persons.id)}/>)}
    </div>
 )
}
const successStyle = {
  color: 'green',
  background: 'lightgrey',
  font_size: 20,
  border_style: 'solid',
  border_radius: 5,
  padding: 10,
  margin_bottom: 10
}

const errorStyle = {
  color: 'red',
  background: 'lightgrey',
  font_size: 20,
  border_style: 'solid',
  border_radius: 5,
  padding: 10,
  margin_bottom: 10
}
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message.includes('ERROR')){
    return (
      <div style={errorStyle} className="error">
        {message}
      </div>
    )
  } else {
    return (
      <div style={successStyle} className="error">
        {message}
      </div>
    )
  }
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState("")
  const [message, setMessage] = useState(null)
  
  useEffect(() => {
    console.log('effect')
    personsService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  console.log('render', persons.length, 'persons')

  const addPerson = (e) => {
    console.log('button clicked', e.target)
    e.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    personsService
    .create(personObject)
    .then(returnedPersons => {
      setPersons(persons.concat(returnedPersons))
      setMessage(
        `${newName} was successfully added`
        )
      setTimeout(() => {
      setMessage(null)
      }, 5000)
    })
       
      .catch(error => {
        setMessage(`[ERROR] ${error.response.data.error}`)
        
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        console.log(error.response.data)
      })
    }
  

  const handleFilterChange = (e) => {
    setNameFilter(e.target.value)
  }
  const handleNameChange = (e) => {
    setNewName(e.target.value)
   }
   const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
   }
  
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const filteredPersons = persons.filter((persons) => {
    return persons.name.toLowerCase().includes(nameFilter.toLowerCase())
  })
      
  const removePersons = id => {
    const deletedPerson = persons.find( person => person.id === id)
    console.log(`deleting ID ${deletedPerson} now`)

      if (window.confirm(`Delete this person?`)) {
        personsService
          .remove(id)
          console.log(`successfully deleted ${id}`)
          setPersons(persons.filter(person => person.id !== id))
          setMessage(
            `successfully deleted`
            )
          setTimeout(() => {
          setMessage(null)
          }, 5000)
  }}
      

  return (
    <div>
    <h2>Phonebook</h2>
    <Notification message={message}/>
    <Filter
    handleFilterChange={handleFilterChange} 
    nameFilter={nameFilter}/>
    <h3>Add a new</h3>
    < PersonForm
    newNumber={newNumber}
    newName={newName}
    addPerson={addPerson}
    handleNameChange={handleNameChange}
    handleNumberChange={handleNumberChange}
    onSubmit={handleSubmit}
    />
    <h2>Names</h2>

    < Content 
    persons={filteredPersons}
    removePersons={removePersons}
   />
    </div>
    )
  }

export default App