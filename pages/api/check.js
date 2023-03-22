export default async function (req, res) {
  const apikey = process.env.OPENAI_API_KEY || ''
  if (apikey.trim().length === 0) {
    res.status(400).json({
      error: {
        message:
          'OpenAI API key not configured'
      }
    })
    return
  }
  return res.status(200).json({result:'ok'})
}
