const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('requestBody', function (req, res) { return JSON.stringify(req.body) })


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  
  response.send('<h1>Home Page</h1>')
})

app.get('/api/persons', (request, response) => {
  
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const date = new Date()
  const string = `Phonebook has info for ${persons.length} people.`
  response.send(`<p>${string}</p> <p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => Math.floor(Math.random() * (100000 - 1) + 1)


app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.body);
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const nameExists = persons.map((person) => person.name)
                            .includes(body.name)
  const numberExists = persons.map((person) => person.number)
                              .includes(body.number)
                   
  if (nameExists) {
    return response.status(400).json({ 
      error: 'name is already in use' 
    })
  }

  if (numberExists) {
    return response.status(400).json({ 
      error: 'number is already in use' 
    })
  }


  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})