const express = require('express');
const mongoose = require('mongoose');
const Thing = require('./models/thing');

const app = express();

mongoose.connect('mongodb+srv://xuddoos_18:Xuddoos18@cluster0.gv792.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
   {useUnifiedTopology: true })
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

// Ajouter une formation
app.post('/api/formations', (req, res) => {
  delete req.body._id;
  const thing = new Thing({
    nomFormation: req.body.nomFormation,
    dateFormation: req.body.dateFormation,
    maxParticipants: req.body.maxParticipants,
    thematique: req.body.thematique,
    prix: req.body.prix
  });

  thing.save()
    .then(formation => {
      console.log('Formation ajoutée:', formation);  // Ajoutez ce log pour voir la formation enregistrée
      res.status(201).json(formation);
    })
    .catch(error => res.status(400).json({ error: error.message }));
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
   Thing.updateOne({ _id: req.params.id }, { ...req.body, dateModification: Date.now(), _id: req.params.id })
     .then(() => res.status(200).json({ message: 'Formation modifiée avec succès !' }))
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
