# MailCraft Experiment App

This is an example application using OpenAI API.
🤔 Problem: marketing team spends too much time creating content. Also too difficult to hypercustomize for each user.
💡 Solution: a tool that can help customize content and enables team to invest in other tasks with more value. Also, multilingual. 
⌛ Why now? Easiness of development that enables this kind of personalization.
💸 Obviusly, for this experiment, I didn't look into market size, competitors, budiness model...

![mailcraft gif](https://user-images.githubusercontent.com/1065202/227474666-0d696492-39af-415d-8238-2ff7c5532070.gif)

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd marketing-content-generator
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   $ cp .env.example .env
   ```
   On Windows:
   ```powershell
   $ copy .env.example .env
   ```
6. Add your [API key](https://platform.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)! If no API Key provided in .env, user will be prompted to enter their own API Key.
