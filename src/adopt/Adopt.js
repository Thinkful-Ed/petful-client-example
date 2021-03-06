import './Adopt.css'
import React from 'react'
import faker from 'faker'

import People from './People'
import Pet from './Pet'

const API_URL = process.env.REACT_APP_API_URL

export default class Adopt extends React.Component {
  state = {
    loadingStatus: 'loading',
    message: null,

    canAdopt: false,
    currentPerson: null,

    cat: {},
    dog: {},
    people: [],
  }

  // Load initial data.
  componentDidMount() {
    const getPets = fetch(`${ API_URL }/pets`)
      .then(response => response.json())

    const getPeople = fetch(`${ API_URL }/people`)
      .then(response => response.json())

    Promise.all([ getPets, getPeople ])
      .then(([ pets, people ]) => {
        this.setState({
          loadingStatus: 'loaded',

          cat: pets.cat,
          dog: pets.dog,
          people,
        })
      })
  }

  // ---------------------------------------------
  // People-Related Functions

  handleNewPerson = (person) => {
    this.setState({ currentPerson: person })
    this.addToLine(person)

    // For demo purposes, start cycling the queue so that
    // the new person gets a chance to adopt.
    this.beginAutomaticAdopting()
  }

  addToLine = (name) => {
    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }

    fetch(`${ API_URL }/people`, config)
      .then(response => response.json())
      .then(() => {
        this.setState({
          people: [ ...this.state.people, name ]
        })
      })
  }

  // ---------------------------------------------
  // Adoption-Related Functions

  handleAdopt = (type) => {
    this.adopt(type)

    // Since adoption happened manually, we can assume that
    // the person who adopted was the current user.
    this.setState({ canAdopt: false, currentPerson: null })
  }

  adopt = (type) => {
    // Don't attempt to adopt if there are no more pets
    // remaining.
    if (!this.state[type]) {
      return
    }

    const config = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    }

    fetch(`${ API_URL }/pets`, config)
      .then(response => response.json())
      .then(data => {
        const [ removed, ...people ] = this.state.people
        const canAdopt = people[0] === this.state.currentPerson

        const message = canAdopt
          ? "It's your turn!"
          : data.message

        this.setState({
          canAdopt,
          cat: data.cat,
          dog: data.dog,
          message,
          people
        })
      })
  }

  beginAutomaticAdopting = () => {
    const adoptionTimer = setInterval(() => {
      const type = [ 'cat', 'dog' ][Math.round(Math.random())]
      this.adopt(type)

      // Add someone to the line to replace the person who
      // adopted, so the queue doesn't empty out.
      this.addToLine(faker.name.findName())
    }, 3000)

    const stop = setInterval(() => {
      if (this.state.canAdopt) {
        clearInterval(adoptionTimer)
        clearInterval(stop)
      }
    })
  }

  // ---------------------------------------------

  render() {
    return <div id='adopt' className={ this.state.loadingStatus }>
      <section id='loading'>
        <span>Loading...</span>
      </section>

      <section id='pets'>
        <Pet
          data={ this.state.cat }
          canAdopt={ this.state.canAdopt }
          handleAdopt={ () => { this.adopt('cat') } }
        />

        <Pet
          data={ this.state.dog }
          canAdopt={ this.state.canAdopt }
          handleAdopt={ () => { this.adopt('dog') } }
        />
      </section>

      <p id='message'>{ this.state.message }</p>

      <People
        currentPerson={ this.state.currentPerson }
        handleNewPerson={ this.handleNewPerson }
        people={ this.state.people }
      />
    </div>
  }
}
