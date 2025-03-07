import { Configuration, OpenAIApi } from 'openai'

// constants
const EVENT = 'event'
const MAINTENANCE = 'maintenance'
const NEWPRODUCT = 'new-product'
const SUSTAINABILITY = 'sustainability-event'
const COMMON_PROMPT = `Eres MarketingExpertoGPT y estás especializado en desarrollar e implementar campañas de marketing. Ofreciendo guiado en contenido, objetivo, mensaje, y tácticas promocionales, asistes a los usuarios en promocionar sus productos o servicios y alcanzar su audiencia. Elabora un mensaje para un cliente, informal, en primera persona del plural. Responde en dos partes: primero el asunto terminado con un emoji, y después el cuerpo del mensaje. Sin el saludo ni la despedida, ni la firma. Escribe la fecha en formato texto. Devuelve la respuesta en formato json, una clave para el asunto y otra para el mensaje, como el siguiente esquema {"asunto": "asunto", "mensaje":"mensaje"}.`
const CATALAN_PROMPT = 'Escribe en catalán.'

let openai = {}

if (process.env.OPENAI_API_KEY) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })
  openai = new OpenAIApi(configuration)
}

export default async function (req, res) {
  // if (!configuration.apiKey) {
  //   res.status(500).json({
  //     error: {
  //       message:
  //         'OpenAI API key not configured, please follow instructions in README.md'
  //     }
  //   })
  //   return
  // }

  const subject = req.body.subject || ''
  if (subject.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid input'
      }
    })
    return
  }

  if (!process.env.OPENAI_API_KEY) {
    const apikey = req.body.apikey || ''
    if (apikey.trim().length === 0) {
      res.status(500).json({
        error: {
          message:
            'OpenAI API key not configured, please follow instructions in README.md'
        }
      })
      return
    }

    const configuration = new Configuration({
      apiKey: apikey
    })
    openai = new OpenAIApi(configuration)
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: generateSwitcher(
            req.body.date,
            req.body.type,
            req.body.subject,
            req.body.language
          )
        }
      ],
      temperature: 0.6
    })
    res.status(200).json({ result: completion.data.choices[0].message.content })
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.'
        }
      })
    }
  }
}

function generateSwitcher(date, type, subject, language) {
  switch (type) {
    case EVENT:
      return generateEvent(date, subject, language)
    case MAINTENANCE:
      return generateMaintenance(subject, language)
    case NEWPRODUCT:
      return generateNewProduct(subject, language)
    case SUSTAINABILITY:
      return generateSustainability(date, subject, language)
    default:
      throw new Error('Switch case error')
  }
}

function generateEvent(date, subject, language) {
  return `${COMMON_PROMPT} Sobre un evento que se celebrará en nuestra tienda el próximo ${date}, invitándole a inscribirse y a asistir. El tema principal del evento es ${subject}. ${
    language === 'es-ca' ? CATALAN_PROMPT : ''
  }`
}
function generateSustainability(date, subject, language) {
  return `${COMMON_PROMPT} Sobre un evento de sostenibilidad que se celebrará el próximo ${date}, invitándole a inscribirse y a asistir. El tema principal del evento es ${subject}. Ten en cuenta el carácter verde y respetuoso del evento. ${
    language === 'es-ca' ? CATALAN_PROMPT : ''
  }`
}

function generateNewProduct(subject, language) {
  return `${COMMON_PROMPT} Sobre un nuevo producto, presentación en nuestra tienda, invitándole a venir a descubrirlo. El tema principal del mensaje es ${subject}. ${
    language === 'es-ca' ? CATALAN_PROMPT : ''
  }`
}

function generateMaintenance(subject, language) {
  return `Elabora un mensaje para un cliente, informal, en primera persona del plural, sobre un un servicio postventa asociado a su producto. La idea a comunicar sobre el mantenimiento es ${subject}. Responde en dos partes: primero el asunto terminado con un emoji, y después el cuerpo del mensaje. Sin el saludo ni la despedida, ni la firma. Devuelve la respuesta en formato json, una clave para el asunto y otra para el mensaje. ${
    language === 'es-ca' ? CATALAN_PROMPT : ''
  }`
}

function generateContent(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase()
  return `Suggest three names for an animal that is a superhero.

  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Dog
  Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  Animal: ${capitalizedAnimal}
  Names:`
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase()
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`
}
