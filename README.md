Retro Pop Gallery - Index_By_Zaka
git clone https://github.com/zakateryna/CAPSTONE.git

Index_By_Zaka è una piattaforma e-commerce full-stack dedicata alla vendita di stampe artistiche e prodotti personalizzati (poster, notebook, mug, tote bag) a partire da fotografie originali.
Il progetto è sviluppato con architettura separata frontend + backend, integra pagamenti tramite Stripe e salva gli ordini lato server.

Frontend

React (Vite)
React Router
Context API (Cart management)
Tailwind CSS
Stripe.js

Backend

Node.js
Express
MongoDB (Mongoose)
Stripe API
Webhooks per conferma pagamento

Funzionalità Principali

Visualizzazione gallery fotografica
Selezione prodotto (poster, notebook, mug, tote)
Sistema carrello dinamico
Calcolo subtotal
Integrazione Stripe Checkout
Redirect post-pagamento con query params
Webhook Stripe per conferma pagamento
Salvataggio ordini nel database
Endpoint di health check

Pagamenti

I pagamenti sono gestiti tramite Stripe.

Flusso:
1) Il frontend invia richiesta al backend per creare un Payment Intent
2) Stripe gestisce il pagamento
3) Dopo il pagamento:
-Redirect a /cart?paid=1
-Stripe invia webhook al backend
4) Il backend verifica l’evento e salva l’ordine


Struttura del progetto 

retro-pop-gallery/
│
├── frontend/
└── backend/

Il frontend gestisce interfaccia e stato applicativo.
Il backend gestisce pagamenti, webhook e persistenza dati.

cd backend
npm install
npm run dev

PORT=4545
MONGO_URI=your_mongo_connection
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

cd frontend
npm install
npm run dev

VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key

Stato del progetto

Pagamenti operativi
Webhook attivi
Ordini salvati su database
Autenticazione — sviluppo futuro

Kateryna Zavalykhata
Progetto Full-Stack