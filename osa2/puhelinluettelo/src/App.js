import { useState, useEffect } from 'react'
import axios from 'axios'

const PersonList = ({persons, nameFilter}) => {
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
        <p key = {person.name}>
          {person.name} {person.number}
        </p> 
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

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
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
  
  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = persons.findIndex( (person) => {
      return person.name ===   newName
    })
    if (newPerson === -1) {
      const personObject = {
        name : newName,
        number : newNumber
      }
      setPersons( persons.concat(personObject) )
      setNewName( '' )
      setNewNumber( '' )
    }
    else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

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
      <PersonList persons={persons} nameFilter = {nameFilter}/>
    </div>
  )

}

export default App