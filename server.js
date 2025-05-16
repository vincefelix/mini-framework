const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Dossier de travail pour la migration
const WORKSPACE = path.join(__dirname, 'migration_workspace');
const GITEA_BASE_URL = 'https://learn.zone01dakar.sn/git';
const GRAPHQL_URL = 'https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql';
const AUTH_URL = 'https://learn.zone01dakar.sn/api/auth/signin';

// S'assurer que le dossier de travail existe
if (!fs.existsSync(WORKSPACE)) {
    fs.mkdirSync(WORKSPACE, { recursive: true });
}

// Stocker les connexions WebSocket des clients
const clients = new Map();

// Événement de connexion WebSocket
wss.on('connection', (ws, req) => {
    const id = Date.now();
    clients.set(id, ws);
    
    ws.on('close', () => {
        clients.delete(id);
    });
});

// Fonction pour envoyer des messages à tous les clients connectés
function broadcast(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// API pour se connecter à Zone01 Dakar
app.post('/api/login', async (req, res) => {
    try {
        const { usernameOrEmail, password, collaborators } = req.body;
        
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: 'Nom d\'utilisateur/Email et mot de passe requis' });
        }
        
        // Créer l'authentification Basic
        const authString = `Basic ${Buffer.from(`${usernameOrEmail}:${password}`).toString('base64')}`;
        
        try {
            // Faire la requête d'authentification
            const response = await axios.post(
                AUTH_URL,
                null,
                {
                    headers: {
                        'Authorization': authString,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Retourner le token
            const token = response.data;
            
            if (token) {
                return res.status(200).json({ 
                    message: 'Connexion réussie',
                    token: token
                });
            } else {
                return res.status(400).json({ error: 'Échec de la connexion' });
            }
        } catch (error) {
            console.error('Erreur lors de la connexion à Zone01:', error);
            
            // Extraire le message d'erreur spécifique de la réponse
            let errorMessage = 'Erreur lors de la connexion';
            
            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
                }
                
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
            }
            
            return res.status(401).json({ 
                error: errorMessage
            });
        }
    } catch (error) {
        console.error('Erreur serveur lors de la connexion:', error);
        
        res.status(500).json({ 
            error: 'Erreur lors de la connexion',
            details: error.message 
        });
    }
});

// API pour récupérer les projets
app.post('/api/fetch-projects', async (req, res) => {
    try {
        const { zone01Token, giteaUsername } = req.body;
        
        if (!zone01Token) {
            return res.status(400).json({ error: 'Token Zone01 manquant' });
        }
        
        const projectQuery = `{
            object(
                where: {
                  type: {_eq: "project"},
                  paths: {
                    transactions: {
                      progress: {grade: {_is_null: false}}
                    }
                  }
                }
              ) {
                name
                type
                paths {
                  transactions(
                    where: {progress: {grade: {_is_null: false}}},
                    distinct_on: path
                  ) {
                    path
                    progress {
                      grade
                    }
                  }
                }
              }
        }`;
        
        const response = await axios.post(
            GRAPHQL_URL,
            { query: projectQuery },
            { headers: { 'Authorization': `Bearer ${zone01Token}` } }
        );
        
        if (response.data.errors) {
            return res.status(400).json({ 
                error: 'Erreur GraphQL',
                details: response.data.errors 
            });
        }
        
        // Extraire et enrichir les projets avec les informations de chemin
        const projectsData = response.data.data.object;
        const projects = projectsData.map(project => {
            // Extraire le premier chemin de transaction valide pour déterminer l'URL du projet
            let projectPath = '';
            if (project.paths && project.paths.length > 0 && 
                project.paths[0].transactions && project.paths[0].transactions.length > 0) {
                projectPath = project.paths[0].transactions[0].path;
            }
            
            return {
                name: project.name,
                path: projectPath
            };
        });
        
        return res.json({ projects });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des projets',
            details: error.message 
        });
    }
});

// API pour migrer les projets
app.post('/api/migrate-projects', async (req, res) => {
    const { zone01Token, giteaUsername, githubUsername, githubToken, projects, collaborators } = req.body;
    
    // Répondre immédiatement pour éviter le timeout
    res.json({ message: 'Migration démarrée' });
    
    // Démarrer le processus de migration en arrière-plan
    migrateProjects(zone01Token, giteaUsername, githubUsername, githubToken, projects, collaborators);
});

// Fonction pour créer un repo sur GitHub
async function createGithubRepo(repoName, githubUsername, githubToken) {
    try {
        broadcast({
            type: 'log',
            message: `Création du repo ${repoName} sur GitHub...`,
            level: 'info',
            projectName: repoName
        });
        
        const response = await axios.post(
            'https://api.github.com/user/repos',
            {
                name: repoName,
                private: true,
                description: `Migration de ${repoName} depuis Zone01 Dakar Gitea`
            },
            {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        broadcast({
            type: 'log',
            message: `Repo ${repoName} créé avec succès sur GitHub`,
            level: 'success',
            projectName: repoName
        });
        
        return response.data;
    } catch (error) {
        // Vérifier si le repo existe déjà
        if (error.response && error.response.status === 422) {
            broadcast({
                type: 'log',
                message: `Le repo ${repoName} existe déjà sur GitHub, on continue avec ce repo existant.`,
                level: 'info',
                projectName: repoName
            });
            return { name: repoName };
        } else {
            broadcast({
                type: 'log',
                message: `Erreur lors de la création du repo ${repoName} sur GitHub: ${error.message}`,
                level: 'error',
                projectName: repoName
            });
            throw error;
        }
    }
}

// Fonction pour migrer un projet individuel
async function migrateProject(project, giteaUsername, githubUsername, githubToken, allPossibleOwners = []) {
    try {
        const projectName = project.name;
        const projectPath = project.path;
        
        broadcast({
            type: 'log',
            message: `=== Migration du projet: ${projectName} ===`,
            level: 'info',
            projectName: projectName
        });
        
        // Analyser le chemin du projet pour trouver la structure du dépôt
        // Format typique: /dakar/div-01/filler
        const pathSegments = projectPath.split('/').filter(segment => segment.length > 0);
        
        // Chemin complet du répertoire du projet local
        const projectDir = path.join(WORKSPACE, projectName);
        
        // Supprimer le répertoire du projet s'il existe déjà
        if (fs.existsSync(projectDir)) {
            broadcast({
                type: 'log',
                message: `Suppression du répertoire existant pour ${projectName}...`,
                level: 'info',
                projectName: projectName
            });
            fs.rmSync(projectDir, { recursive: true, force: true });
        }
        
        // URL pour cloner depuis Gitea
        // Format: https://learn.zone01dakar.sn/git/[creator-username]/[project-name]
        // Pour extraire le nom du créateur à partir du chemin
        
        // Tenter de cloner en essayant tous les propriétaires possibles
        let cloned = false;
        
        // Essayer chaque propriétaire possible, en commençant par l'utilisateur actuel
        for (const owner of allPossibleOwners) {
            if (cloned) break;
            
            const ownerGiteaUrl = `${GITEA_BASE_URL}/${owner}/${projectName}`;
            broadcast({
                type: 'log',
                message: `Tentative de clonage depuis: ${ownerGiteaUrl}`,
                level: 'info',
                projectName: projectName
            });
            
            try {
                await execPromise(`git clone ${ownerGiteaUrl} "${projectDir}"`);
                cloned = true;
                broadcast({
                    type: 'log',
                    message: `Succès! Le projet a été trouvé sous le nom d'utilisateur: ${owner}`,
                    level: 'info',
                    projectName: projectName
                });
            } catch (e) {
                // Continuer avec le prochain propriétaire
            }
        }
        
        // Si nous n'avons pas réussi à cloner le dépôt
        if (!cloned) {
            broadcast({
                type: 'log',
                message: `Impossible de trouver le dépôt pour le projet: ${projectName}. Veuillez vérifier manuellement le propriétaire.`,
                level: 'error',
                projectName: projectName
            });
            throw new Error(`Impossible de trouver le dépôt pour le projet: ${projectName}`);
        }
        
        // Créer un nouveau repo sur GitHub
        await createGithubRepo(projectName, githubUsername, githubToken);
        
        // Changer de répertoire vers le repo cloné et configurer Git
        process.chdir(projectDir);
        
        // Ajouter la nouvelle origine
        const githubUrl = `https://github.com/${githubUsername}/${projectName}.git`;
        broadcast({
            type: 'log',
            message: `Ajout de l'origine GitHub: ${githubUrl}`,
            level: 'info',
            projectName: projectName
        });
        
        // Vérifier si l'origine existe déjà
        try {
            await execPromise('git remote | grep origin');
            // Si l'origine existe, la mettre à jour
            await execPromise(`git remote set-url origin ${githubUrl}`);
        } catch (e) {
            // Si l'origine n'existe pas, l'ajouter
            await execPromise(`git remote add origin ${githubUrl}`);
        }
        
        // Pousser tous les branches vers GitHub
        broadcast({
            type: 'log',
            message: `Envoi du code vers GitHub...`,
            level: 'info',
            projectName: projectName
        });
        
        try {
            // Essayer d'abord avec la branche principale
            try {
                await execPromise(`git push -u origin main`);
            } catch (e) {
                // Si main échoue, essayer master
                try {
                    await execPromise(`git push -u origin master`);
                } catch (e) {
                    // Si tout échoue, forcer le push
                    broadcast({
                        type: 'log',
                        message: 'Erreur lors du push, tentative de push avec --force...',
                        level: 'info',
                        projectName: projectName
                    });
                    await execPromise(`git push -u origin --all --force`);
                }
            }
            
            // Pousser tous les tags
            try {
                await execPromise(`git push --tags`);
            } catch (e) {
                broadcast({
                    type: 'log',
                    message: 'Erreur lors du push des tags, ignoré.',
                    level: 'info',
                    projectName: projectName
                });
            }
            
            broadcast({
                type: 'log',
                message: `Migration réussie pour ${projectName}`,
                level: 'success',
                projectName: projectName
            });
            
            broadcast({
                type: 'log',
                message: `N'oubliez pas de mettre une étoile ⭐ sur https://github.com/${githubUsername}/${projectName} !`,
                level: 'info',
                projectName: projectName
            });
            
            return true;
        } catch (error) {
            broadcast({
                type: 'log',
                message: `Erreur lors du push vers GitHub: ${error.message}`,
                level: 'error',
                projectName: projectName
            });
            throw error;
        }
    } catch (error) {
        broadcast({
            type: 'log',
            message: `Erreur lors de la migration du projet ${project.name}: ${error.message}`,
            level: 'error',
            projectName: project.name
        });
        return false;
    } finally {
        // Revenir au répertoire racine
        process.chdir(__dirname);
    }
}

// Fonction principale pour migrer tous les projets
async function migrateProjects(zone01Token, giteaUsername, githubUsername, githubToken, projects, collaborators = []) {
    let completedCount = 0;
    let successCount = 0;
    
    broadcast({
        type: 'log',
        message: `Démarrage de la migration de ${projects.length} projets...`,
        level: 'info'
    });
    
    // Ajouter l'utilisateur actuel à la liste des collaborateurs possibles
    const allPossibleOwners = [giteaUsername, ...collaborators];
    broadcast({
        type: 'log',
        message: `Propriétaires potentiels des projets: ${allPossibleOwners.join(', ')}`,
        level: 'info'
    });
    
    // S'assurer que le dossier de travail existe
    if (!fs.existsSync(WORKSPACE)) {
        fs.mkdirSync(WORKSPACE, { recursive: true });
    }
    
    // Migrer chaque projet séquentiellement
    for (const project of projects) {
        try {
            const success = await migrateProject(
                project,
                giteaUsername,
                githubUsername,
                githubToken,
                allPossibleOwners
            );
            
            if (success) {
                successCount++;
            }
            
            completedCount++;
            
            // Mettre à jour la progression
            broadcast({
                type: 'progress',
                completed: completedCount,
                total: projects.length
            });
        } catch (error) {
            broadcast({
                type: 'log',
                message: `Erreur inattendue lors de la migration de ${project.name}: ${error.message}`,
                level: 'error',
                projectName: project.name
            });
            
            completedCount++;
            
            // Mettre à jour la progression
            broadcast({
                type: 'progress',
                completed: completedCount,
                total: projects.length
            });
        }
    }
    
    // Notifier que la migration est terminée
    broadcast({
        type: 'log',
        message: `Migration terminée. ${successCount}/${projects.length} projets migrés avec succès.`,
        level: successCount === projects.length ? 'success' : 'info'
    });
    
    broadcast({
        type: 'complete'
    });
}

// Route pour servir l'application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
server.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});