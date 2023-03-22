import '@vtmn/css/dist/index.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import { server } from '../config'

export default function Home({ status }) {
  const [subject, setSubject] = useState('')
  const [result, setResult] = useState()
  const [asunto, setAsunto] = useState()
  const [mensaje, setMensaje] = useState()
  const [eventDate, setEventDate] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('es-es')
  const [modalOpen, setModalOpen] = useState(false)
  const [apikey, setApiKey] = useState('')

  useEffect(() => {
    if (status !== 200) {
      setModalOpen(true)
    }
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    try {
      setLoading(true)
      if (result) {
        setAsunto('')
        setMensaje('')
        setResult('')
      }
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: type,
          subject: subject,
          date: eventDate,
          language: language,
          apikey: apikey
        })
      })

      const data = await response.json()
      if (response.status !== 200) {
        setLoading(false)
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }
      setLoading(false)
      setAsunto(JSON.parse(data.result).asunto)
      setMensaje(JSON.parse(data.result).mensaje)
      setResult(data.result)
      alert(
        'Recuerda revisar siempre el contenido y reescribirlo en tus propias palabras.'
      )
      setSubject('')
      setEventDate('')
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div>
      <Head>
        <title>MailCraft</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.png" className={styles.icon} />
        <h3 className="vtmn-typo_title-3">MailCraft</h3>
        <div className={styles.boxes}>
          <div>
            <form onSubmit={onSubmit}>
              <label>
                <input
                  type="radio"
                  value="es-es"
                  name="language"
                  onChange={(e) => setLanguage(e.target.value)}
                  defaultChecked={true}
                />
                Castellano
              </label>
              <label htmlFor="catalan">
                <input
                  type="radio"
                  value="es-ca"
                  name="language"
                  onChange={(e) => setLanguage(e.target.value)}
                />
                Catalán
              </label>

              <div className="vtmn-select_container">
                <label htmlFor="type">Tipo</label>
                <select
                  name="type"
                  id="type"
                  autoComplete="on"
                  onChange={(e) => setType(e.target.value)}
                  defaultValue="select"
                >
                  <option value="select" disabled>
                    Select
                  </option>
                  <option value="event">Evento</option>
                  <option value="maintenance">Servicio mantenimiento</option>
                  <option value="clearance" disabled>
                    Últimas unidades
                  </option>
                  <option value="sustainability-event">
                    Acción sostenibilidad
                  </option>
                  <option value="new-product">Nuevo producto</option>
                </select>
              </div>

              <div>
                <label className="vtmn-text-input_label" htmlFor="date">
                  Fecha
                </label>
                <input
                  type="date"
                  className="vtmn-text-input"
                  id="date"
                  name="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={!['event', 'sustainability-event'].includes(type)}
                />
              </div>

              <label htmlFor="subject">Tema</label>

              <textarea
                id="subject"
                className="vtmn-text-input"
                type="text"
                name="subject"
                multiple
                placeholder="Idea principal a comunicar"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <input
                type="submit"
                className={`vtmn-btn vtmn-btn_size--stretched ${styles.btn}`}
                value="Generar"
                disabled={loading}
              />
            </form>
          </div>
          <div>
            {result && (
              <div
                className={`vtmn-card vtmn-card_variant--top-image ${styles.cardExample}`}
              >
                <div className="vtmn-card_image">
                  <img
                    src="https://storage.googleapis.com/dkt-design-cdn/images/landscape-placeholder.jpg"
                    alt=""
                  />
                </div>
                <div className="vtmn-card_content">
                  <h2 className="vtmn-card_content--title">Asunto: {asunto}</h2>
                  <span className="vtmn-card_content--body">{mensaje}</span>
                </div>
              </div>
            )}
            {loading && (
              <div className={styles.cardExample}>
                <span
                  className={'vtmn-skeleton ' + styles.cardExample_figure}
                ></span>
                <div className={styles.cardExample_body}>
                  <span
                    className="vtmn-skeleton vtmn-skeleton_line"
                    style={{ width: '95%' }}
                  ></span>
                  <span
                    className="vtmn-skeleton vtmn-skeleton_line"
                    style={{ width: '70%' }}
                  ></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <div class="block">
        <dialog
          open={modalOpen}
          class="vtmn-modal"
          id="modal-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vtmn-modal-title"
          aria-describedby="vtmn-modal-description"
        >
          <div class="vtmn-modal_content">
            <div class="vtmn-modal_content_title">
              <span
                id="vtmn-modal-title"
                class="vtmn-modal_content_title--text"
              >
                OpenAI API key
              </span>
            </div>
            <div class="vtmn-modal_content_body">
              <label className="vtmn-text-input_label">
                API Key
                <input
                  className="vtmn-text-input"
                  type="text"
                  onChange={(e) => setApiKey(e.target.value)}
                ></input>
              </label>
            </div>
            <div class="vtmn-modal_content_actions">
              <button
                class="vtmn-btn vtmn-btn_variant--primary"
                disabled={!apikey}
                onClick={(e) => setModalOpen(false)}
              >
                Guardar
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch(server + '/api/check')
  const status = await res.status

  return {
    props: {
      status
    }
  }
}
