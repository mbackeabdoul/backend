const express = require('express');
const mongoose = require('mongoose');
const Thing = require('./models/thing');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Formations',
      version: '1.0.0',
      description: 'API pour gérer des formations.',
    },
    servers: [
      {
        url: 'https://backend-3yq5.onrender.com', // URL de ton serveur

      },
    ],
  },
  apis: ['./app.js'], // Chemin vers les routes documentées
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connexion à MongoDB
mongoose.connect(
  'mongodb+srv://xuddoos_18:Xuddoos18@cluster0.gv792.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Formation:
 *       type: object
 *       required:
 *         - nomFormation
 *         - dateFormation
 *         - maxParticipants
 *         - thematique
 *         - prix
 *       properties:
 *         nomFormation:
 *           type: string
 *           description: Nom de la formation
 *         dateFormation:
 *           type: string
 *           format: date
 *           description: Date de la formation
 *         maxParticipants:
 *           type: integer
 *           description: Nombre maximum de participants
 *         thematique:
 *           type: string
 *           description: Thématique de la formation
 *         prix:
 *           type: number
 *           description: Prix de la formation
 *         dateAjout:
 *           type: string
 *           format: date-time
 *           description: Date d'ajout de la formation
 *         dateModification:
 *           type: string
 *           format: date-time
 *           description: Dernière date de modification
 */

/**
 * @swagger
 * /api/formations:
 *   get:
 *     summary: Récupère toutes les formations
 *     tags: [Formations]
 *     responses:
 *       200:
 *         description: Liste de toutes les formations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Formation'
 */

app.get('/api/formations', (req, res, next) => {
  Thing.find()
    .then(formations => res.status(200).json(formations))
    .catch(error => res.status(400).json({ error }));
});

/**
 * @swagger
 * /api/formations/{id}:
 *   get:
 *     summary: Récupère une formation par ID
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la formation
 *     responses:
 *       200:
 *         description: Détails de la formation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formation'
 *       404:
 *         description: Formation non trouvée
 */

app.get('/api/formations/:id', (req, res) => {
  Thing.findOne({ _id: req.params.id })
    .then(formation => res.status(200).json(formation))
    .catch(error => res.status(404).json({ error }));
});

/**
 * @swagger
 * /api/formations:
 *   post:
 *     summary: Crée une nouvelle formation
 *     tags: [Formations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Formation'
 *     responses:
 *       201:
 *         description: Formation créée avec succès.
 */

app.post('/api/formations', (req, res) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body,
    dateAjout: new Date(),
    dateModification: new Date(),
  });
  thing.save()
    .then(formation => res.status(201).json(formation))
    .catch(error => res.status(400).json({ error }));
});


// Exemple dans votre fichier backend (Node.js/Express)
app.get('/api/formations/date/:date', async (req, res) => {
   const { date } = req.params;
   try {
     const formations = await Formation.find({ dateFormation: date });
     res.status(200).json(formations);
   } catch (error) {
     res.status(500).json({ message: "Erreur serveur", error });
   }
 });
 

app.get('/api/formations', (req, res, next) => {
    Thing.find()
        .then(formations => {  // Change 'things' par 'formations' pour que ce soit plus clair
            res.status(200).json(formations);  // Retourne les formations en réponse
        })
        .catch(error => res.status(400).json({ error: 'Erreur lors de la récupération des formations', details: error }));
});

// Modifier une formation
app.put('/api/formations/:id', (req, res) => {
   Thing.findByIdAndUpdate(
     req.params.id, 
     { 
       ...req.body, 
       dateModification: new Date() 
     }, 
     { new: true } // Retourne le document mis à jour
   )
   .then(updatedFormation => {
     res.status(200).json(updatedFormation);
   })
   .catch(error => res.status(400).json({ error }));
});

// Récupérer une formation spécifique
app.get('/api/formations/:id', (req, res) => {
   Thing.findOne({ _id: req.params.id })
     .then(thing => res.status(200).json(thing))
     .catch(error => res.status(404).json({ error }));
});

// Récupérer toutes les formations (avec tri et pagination)
app.get('/api/formations', async (req, res) => {
    try {
       const formations = await Thing.find()
          .sort({ dateFormation: 1 });
       res.status(200).json(formations); // Renvoyer directement le tableau
    } catch (error) {
       res.status(400).json({ error });
    }
 });

// Rechercher une formation
app.get('/api/formations/search', async (req, res) => {
   const { query } = req.query;
   try {
      const formations = await Thing.find({
         $or: [
            { nomFormation: { $regex: query, $options: 'i' } },
            { thematique: { $regex: query, $options: 'i' } }
         ]
      });
      res.status(200).json(formations);
   } catch (error) {
      res.status(500).json({ error });
   }
});

// Supprimer une formation
app.delete('/api/formations/:id', (req, res) => {
   Thing.deleteOne({ _id: req.params.id })
     .then(() => res.status(200).json({ message: 'Formation supprimée avec succès !' }))
     .catch(error => res.status(400).json({ error }));
});

module.exports = app;