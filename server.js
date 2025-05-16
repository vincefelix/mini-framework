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

// Dossier de logs pour les utilisateurs
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
const usersLogFile = path.join(logsDir, 'users.json');

// Migration workspace directory
const WORKSPACE = path.join(__dirname, 'migration_workspace');
const GITEA_BASE_URL = 'https://learn.zone01dakar.sn/git';
const GRAPHQL_URL = 'https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql';
const AUTH_URL = 'https://learn.zone01dakar.sn/api/auth/signin';

// Ensure workspace exists
if (!fs.existsSync(WORKSPACE)) {
    fs.mkdirSync(WORKSPACE, { recursive: true });
}

// Store WebSocket client connections
const clients = new Map();

// WebSocket connection event
wss.on('connection', (ws, req) => {
    const id = Date.now();
    clients.set(id, ws);
    ws.on('close', () => {
        clients.delete(id);
    });
});

// Send messages to all connected clients
function broadcast(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// API to login to Zone01 Dakar
app.post('/api/login', async (req, res) => {
    try {
        const { usernameOrEmail, password, collaborators } = req.body;
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: 'Username/Email and password required' });
        }
        const authString = `Basic ${Buffer.from(`${usernameOrEmail}:${password}`).toString('base64')}`;
        try {
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
            const token = response.data;
            if (token) {
                // Enregistrer l'utilisateur dans le fichier de logs
                try {
                    // Lire le fichier existant ou créer un nouvel objet
                    let usersData = {};
                    if (fs.existsSync(usersLogFile)) {
                        try {
                            const fileContent = fs.readFileSync(usersLogFile, 'utf8');
                            usersData = JSON.parse(fileContent);
                        } catch (err) {
                            console.error('Error reading users log file:', err);
                            usersData = {};
                        }
                    }

                    // Ajouter l'utilisateur avec timestamp
                    const timestamp = new Date().toISOString();
                    usersData[usernameOrEmail] = {
                        lastLogin: timestamp,
                        loginCount: (usersData[usernameOrEmail]?.loginCount || 0) + 1
                    };

                    // Écrire dans le fichier
                    fs.writeFileSync(usersLogFile, JSON.stringify(usersData, null, 2), 'utf8');
                    console.log(`User ${usernameOrEmail} login recorded`);
                } catch (err) {
                    console.error('Error writing to users log file:', err);
                }

                return res.status(200).json({
                    message: 'Login successful',
                    token: token
                });
            } else {
                return res.status(400).json({ error: 'Login failed' });
            }
        } catch (error) {
            console.error('Error during Zone01 login:', error);
            let errorMessage = 'Login error';
            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = 'Incorrect username or password';
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
        console.error('Server error during login:', error);
        res.status(500).json({
            error: 'Login error',
            details: error.message
        });
    }
});

// API to fetch projects
app.post('/api/fetch-projects', async (req, res) => {
    try {
        const { zone01Token, giteaUsername } = req.body;
        if (!zone01Token) {
            return res.status(400).json({ error: 'Missing Zone01 token' });
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
                error: 'GraphQL error',
                details: response.data.errors
            });
        }
        // Extract and enrich projects with path info
        const projectsData = response.data.data.object;
        const projects = projectsData.map(project => {
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
        console.error('Error fetching projects:', error);
        res.status(500).json({
            error: 'Error fetching projects',
            details: error.message
        });
    }
});

// API to migrate projects
app.post('/api/migrate-projects', async (req, res) => {
    const { zone01Token, giteaUsername, githubUsername, githubToken, projects, collaborators } = req.body;
    // Respond immediately to avoid timeout
    res.json({ message: 'Migration started' });
    // Start migration process in background
    migrateProjects(zone01Token, giteaUsername, githubUsername, githubToken, projects, collaborators);
});

// Create a repo on GitHub
async function createGithubRepo(repoName, githubUsername, githubToken) {
    try {
        broadcast({
            type: 'log',
            message: `Creating repo ${repoName} on GitHub...`,
            level: 'info',
            projectName: repoName
        });
        const response = await axios.post(
            'https://api.github.com/user/repos',
            {
                name: repoName,
                private: true,
                description: `Migration of ${repoName} from Zone01 Dakar Gitea`
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
            message: `Repo ${repoName} created successfully on GitHub`,
            level: 'success',
            projectName: repoName
        });
        return response.data;
    } catch (error) {
        // Check if repo already exists
        if (error.response && error.response.status === 422) {
            broadcast({
                type: 'log',
                message: `Repo ${repoName} already exists on GitHub, continuing with existing repo.`,
                level: 'info',
                projectName: repoName
            });
            return { name: repoName };
        } else {
            broadcast({
                type: 'log',
                message: `Error creating repo ${repoName} on GitHub: ${error.message}`,
                level: 'error',
                projectName: repoName
            });
            throw error;
        }
    }
}

// Migrate a single project
async function migrateProject(project, giteaUsername, githubUsername, githubToken, allPossibleOwners = []) {
    try {
        const projectName = project.name;
        const projectPath = project.path;
        broadcast({
            type: 'log',
            message: `=== Migrating project: ${projectName} ===`,
            level: 'info',
            projectName: projectName
        });
        // Parse project path to find repo structure
        const pathSegments = projectPath.split('/').filter(segment => segment.length > 0);
        // Local project directory
        const projectDir = path.join(WORKSPACE, projectName);
        // Remove existing project directory if exists
        if (fs.existsSync(projectDir)) {
            broadcast({
                type: 'log',
                message: `Removing existing directory for ${projectName}...`,
                level: 'info',
                projectName: projectName
            });
            fs.rmSync(projectDir, { recursive: true, force: true });
        }
        // Try to clone using all possible owners
        let cloned = false;
        for (const owner of allPossibleOwners) {
            if (cloned) break;
            // const ownerGiteaUrl = `${GITEA_BASE_URL}/${owner}/${projectName}`;
            // Dans la fonction migrateProject
const ownerGiteaUrl = `https://oauth2:${zone01Token}@learn.zone01dakar.sn/git/${owner}/${projectName}`;
            broadcast({
                type: 'log',
                message: `Trying to clone from: ${ownerGiteaUrl}`,
                level: 'info',
                projectName: projectName
            });
            try {
                await execPromise(`git clone ${ownerGiteaUrl} "${projectDir}"`);
                cloned = true;
                broadcast({
                    type: 'log',
                    message: `Success! Project found under username: ${owner}`,
                    level: 'info',
                    projectName: projectName
                });
            } catch (e) {
                // Continue with next owner
            }
        }
        if (!cloned) {
            broadcast({
                type: 'log',
                message: `Could not find repo for project: ${projectName}. Please check the owner manually.`,
                level: 'error',
                projectName: projectName
            });
            throw new Error(`Could not find repo for project: ${projectName}`);
        }
        // Create new repo on GitHub
        await createGithubRepo(projectName, githubUsername, githubToken);
        // Change directory to cloned repo and configure Git
        process.chdir(projectDir);
        // Add new origin
        const githubUrl = `https://github.com/${githubUsername}/${projectName}.git`;
        broadcast({
            type: 'log',
            message: `Adding GitHub origin: ${githubUrl}`,
            level: 'info',
            projectName: projectName
        });
        // Check if origin exists
        try {
            await execPromise('git remote | grep origin');
            await execPromise(`git remote set-url origin ${githubUrl}`);
        } catch (e) {
            await execPromise(`git remote add origin ${githubUrl}`);
        }
        // Push all branches to GitHub
        broadcast({
            type: 'log',
            message: `Pushing code to GitHub...`,
            level: 'info',
            projectName: projectName
        });
        try {
            try {
                await execPromise(`git push -u origin main`);
            } catch (e) {
                try {
                    await execPromise(`git push -u origin master`);
                } catch (e) {
                    broadcast({
                        type: 'log',
                        message: 'Push failed, trying with --force...',
                        level: 'info',
                        projectName: projectName
                    });
                    await execPromise(`git push -u origin --all --force`);
                }
            }
            // Push all tags
            try {
                await execPromise(`git push --tags`);
            } catch (e) {
                broadcast({
                    type: 'log',
                    message: 'Error pushing tags, ignored.',
                    level: 'info',
                    projectName: projectName
                });
            }
            broadcast({
                type: 'log',
                message: `Migration successful for ${projectName}`,
                level: 'success',
                projectName: projectName
            });
            broadcast({
                type: 'log',
                message: `Don't forget to star ⭐ https://github.com/${githubUsername}/${projectName} !`,
                level: 'info',
                projectName: projectName
            });
            return true;
        } catch (error) {
            broadcast({
                type: 'log',
                message: `Error pushing to GitHub: ${error.message}`,
                level: 'error',
                projectName: projectName
            });
            throw error;
        }
    } catch (error) {
        broadcast({
            type: 'log',
            message: `Error migrating project ${project.name}: ${error.message}`,
            level: 'error',
            projectName: project.name
        });
        return false;
    } finally {
        // Return to root directory
        process.chdir(__dirname);
    }
}

// Main function to migrate all projects
async function migrateProjects(zone01Token, giteaUsername, githubUsername, githubToken, projects, collaborators = []) {
    let completedCount = 0;
    let successCount = 0;
    broadcast({
        type: 'log',
        message: `Starting migration of ${projects.length} projects...`,
        level: 'info'
    });
    // Add current user to possible owners
    const allPossibleOwners = [giteaUsername, ...collaborators];
    broadcast({
        type: 'log',
        message: `Possible project owners: ${allPossibleOwners.join(', ')}`,
        level: 'info'
    });
    // Ensure workspace exists
    if (!fs.existsSync(WORKSPACE)) {
        fs.mkdirSync(WORKSPACE, { recursive: true });
    }
    // Migrate each project sequentially
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
            // Update progress
            broadcast({
                type: 'progress',
                completed: completedCount,
                total: projects.length
            });
        } catch (error) {
            broadcast({
                type: 'log',
                message: `Unexpected error migrating ${project.name}: ${error.message}`,
                level: 'error',
                projectName: project.name
            });
            completedCount++;
            broadcast({
                type: 'progress',
                completed: completedCount,
                total: projects.length
            });
        }
    }
    // Notify migration complete
    broadcast({
        type: 'log',
        message: `Migration complete. ${successCount}/${projects.length} projects migrated successfully.`,
        level: successCount === projects.length ? 'success' : 'info'
    });
    broadcast({
        type: 'complete'
    });
}

// Serve the app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});