require('dotenv').config()
const express = require('express')
const app = express()
const morgan =require('morgan')
const cors = require('cors')
const Persons = require('./models/person')


app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.post('/api/persons/', (request, response, next) => {
  const body = request.body
  console.log(body)

  const person = new Persons ({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPersons => {
    response.json(savedPersons)
  })
    .catch(error => next(error))
})
app.get('/api/persons', (request, response) => {
  Persons.find({}).then(persons => {
    response.json(persons)
  })
})
app.get('/info', (request, response) => {
  const currentDate = new Date().toLocaleString()
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  Persons.find({}).then(persons => {
    response.send(
      `<div>
          <p>The phonebook has info for ${persons.length} people</p>
        </div>
        <div>
          <p>${currentDate} (${timeZone})</p>
        </div>`)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Persons.findByIdAndRemove(request.params.id).then(persons => {
    response.json(persons)
  })
})
app.get('/api/persons/:id', (request, response, next) => {
  Persons.findById(request.params.id)
    .then(persons => {
      if (persons){response.json(persons)}
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


