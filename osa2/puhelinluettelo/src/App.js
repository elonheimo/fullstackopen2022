import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const PersonList = ({persons, nameFilter, removePerson}) => {
  persons = persons.filter( person => {
    if (nameFilter === '') {
      return true
    }
    else if (person.name.includes(nameFilter) ) {
      return true
    }
    return false
  })
  return (
    <div>
      {persons.map( person =>
        <div key = {person.id}>
        {person.name} {person.number}
        <button onClick={() => removePerson(person.id)}>remove</button>
        </div> 
      )}
    </div>
  )
}

const PersonForm = ({addPerson, newName, handleNewName, newNumber, handleNewNumber}) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          <input
            value={newName}
            onChange={handleNewName}
          />
        </div>
        <div>
          <input
            value={newNumber}
            onChange={handleNewNumber}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )

}

const Filter = ({nameFilter, setNameFilter}) => {
  return (
    <div>
      <p>Filter shown with</p>
      <input
        value={nameFilter}
        onChange={(event) => {
          setNameFilter(event.target.value)
          console.log('name filter', event.target.value)
        }}
      />
    </div>
  )
}

const NotificationMessage = ({message}) => {
  const notificationStyle = {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 20,
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }
  return (
    <div style={notificationStyle}>
        {message}
    </div>
  )
    
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const hook = () => {
    console.log('effect')
    personService
      .getAll()
      .then(dbPersons => {
        setPersons(dbPersons)
      })
  }
  useEffect(hook, [])

  const handleNewName = (event) => {
    console.log('new name ', event.target.value)
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    console.log('new num ', event.target.value)
    setNewNumber(event.target.value)
  }

  const updatePerson = (personObject) => {
    const person = persons.find(n => n.name === personObject.name)
    console.log('update person name', person)
    const changedPerson = {...person, number: personObject.number}
    if (window.confirm(`${person.name} is already in contacts. Do you want to update number?` )) {
      personService
        .update(person.id, personObject)
        .then(retPerson => {
          console.log('update response', retPerson)
          setPersons(persons.map(p => p.id !== person.id ? p : retPerson))
          setNewName('')
          setNewNumber('')
          setNotification(`Updated ${personObject.name}'s number to ${personObject.number}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setNotification(`Information of ${personObject.name} has already been removed from browser`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }
  
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name : newName,
      number : newNumber
    }
    const newPerson = persons.findIndex( (person) => {
      return person.name ===   newName
    })
    if (newPerson === -1) { 
      personService
        .create(personObject)
        .then(retPerson => {
          setPersons(persons.concat(retPerson))
          setNewName('')
          setNewNumber('')
          })
      setNotification(`Added ${personObject.name}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    else {
      updatePerson(personObject)
    }
  }

  const removePerson = id => {
    const changedPersons = persons.filter(person => person.id != id)
    const personName = persons.find(person => person.id == id).name
    if (window.confirm(`Delete ${personName}?` )) {
      personService
        .remove(id)
        .then(retPersons => {
          setPersons(changedPersons)
          setNotification(`Removed ${personName}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          console.log('error deleting')
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <NotificationMessage message={notification}/>
      <Filter nameFilter= {nameFilter} setNameFilter = {setNameFilter}/>
      
      <h2>Add new</h2>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />

      <h2>Numbers</h2>
      <PersonList persons={persons} nameFilter = {nameFilter} removePerson = {removePerson}/>
    </div>
  )

}

export default App