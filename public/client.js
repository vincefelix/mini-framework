// client.js
document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM pour la connexion Zone01
    const zone01LoginForm = document.getElementById('zone01-login');
    const zone01Loading = document.getElementById('zone01-loading');
    const zone01LoginCard = document.getElementById('zone01-login-form');
    
    // Éléments du DOM pour la migration
    const authForm = document.getElementById('auth-form');
    const authCard = document.getElementById('login-form');
    const dashboard = document.getElementById('dashboard');
    const logoutButton = document.getElementById('logout-button');
    const projectsList = document.getElementById('projects-list');
    const projectsLoading = document.getElementById('projects-loading');
    const projectContainer = document.getElementById('project-container');
    const selectAllBtn = document.getElementById('select-all');
    const startMigrationBtn = document.getElementById('start-migration');
    const migrationProgress = document.getElementById('migration-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressStatus = document.getElementById('progress-status');
    const migrationLog = document.getElementById('migration-log');
    const doneButton = document.getElementById('done-button');
    const tabButtons = document.querySelectorAll('.tab-button');

    // Variables globales
    let projects = [];
    let selectedProjects = [];
    let migratedCount = 0;
    let totalToMigrate = 0;
    let projectsStatus = {}; // Stocke le statut de migration de chaque projet
    
    // Vérifier si l'utilisateur est déjà connecté (tokens dans localStorage)
    function checkAuthentication() {
        const zone01Token = localStorage.getItem('zone01Token');
        const githubToken = localStorage.getItem('githubToken');
        const giteaUsername = localStorage.getItem('giteaUsername');
        const githubUsername = localStorage.getItem('githubUsername');
        const savedCollaborators = localStorage.getItem('collaborators');
        
        if (zone01Token) {
            // Masquer le formulaire de connexion Zone01
            zone01LoginCard.classList.add('hidden');
            
            // Afficher le tableau de bord
            dashboard.classList.remove('hidden');
            
            // Remplir les champs avec les valeurs stockées
            document.getElementById('zone01-token').value = zone01Token;
            
            if (giteaUsername) {
                document.getElementById('gitea-username').value = giteaUsername;
            }
            
            if (githubUsername) {
                document.getElementById('github-username').value = githubUsername;
            }
            
            if (githubToken) {
                document.getElementById('github-token').value = githubToken;
            }
            
            if (savedCollaborators) {
                document.getElementById('collaborators').value = savedCollaborators;
            }
            
            // Charger les statuts des projets depuis localStorage
            const savedProjectsStatus = localStorage.getItem('projectsStatus');
            if (savedProjectsStatus) {
                projectsStatus = JSON.parse(savedProjectsStatus);
            }
            
            // Si tous les champs sont remplis, récupérer automatiquement les projets
            if (giteaUsername && zone01Token) {
                fetchProjects(zone01Token, giteaUsername);
            }
        }
    }
    
    // Fonction pour récupérer les projets
    async function fetchProjects(zone01Token, giteaUsername) {
        // Afficher le spinner de chargement
        projectsLoading.classList.remove('hidden');
        projectContainer.innerHTML = '';
        
        try {
            // Appeler l'API pour récupérer les projets
            const response = await fetch('/api/fetch-projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    zone01Token,
                    giteaUsername
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la récupération des projets');
            }
            
            projects = data.projects;
            
            // Cacher le spinner de chargement
            projectsLoading.classList.add('hidden');
            
            // Afficher les projets
            if (projects.length === 0) {
                projectContainer.innerHTML = '<p class="empty-message">Aucun projet trouvé.</p>';
            } else {
                displayProjects(projects);
            }
        } catch (error) {
            projectsLoading.classList.add('hidden');
            projectContainer.innerHTML = `<p class="error-message">Erreur: ${error.message}</p>`;
            console.error('Erreur:', error);
        }
    }
    
    // Exécuter la vérification d'authentification au chargement de la page
    checkAuthentication();
    
    // Événement du formulaire de connexion Zone01
    zone01LoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameOrEmail = document.getElementById('zone01-email').value;
        const password = document.getElementById('zone01-password').value;
        const errorDiv = document.getElementById('zone01-error');
        
        // Réinitialiser les messages d'erreur
        errorDiv.textContent = '';
        errorDiv.classList.add('hidden');
        
        // Afficher le spinner de chargement
        zone01Loading.classList.remove('hidden');
        
        try {
            // Appeler l'API pour se connecter à Zone01
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usernameOrEmail,
                    password
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                // Extraire le message d'erreur spécifique de la réponse
                const errorMessage = data.error || 'Erreur lors de la connexion';
                throw new Error(errorMessage);
            }
            
            // Sauvegarder le token dans localStorage
            localStorage.setItem('zone01Token', data.token);
            
            // Cacher le formulaire de connexion Zone01
            zone01LoginCard.classList.add('hidden');
            
            // Afficher le tableau de bord
            dashboard.classList.remove('hidden');
            document.getElementById('zone01-token').value = data.token;
            
        } catch (error) {
            errorDiv.textContent = `Erreur de connexion: ${error.message}`;
            errorDiv.classList.remove('hidden');
            console.error('Erreur:', error);
        } finally {
            zone01Loading.classList.add('hidden');
        }
    });

    // Événement du formulaire d'authentification
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const zone01Token = document.getElementById('zone01-token').value;
        const giteaUsername = document.getElementById('gitea-username').value;
        const githubUsername = document.getElementById('github-username').value;
        const githubToken = document.getElementById('github-token').value;
        const collaboratorsInput = document.getElementById('collaborators').value;
        
        // Sauvegarder les valeurs dans localStorage
        localStorage.setItem('giteaUsername', giteaUsername);
        localStorage.setItem('githubUsername', githubUsername);
        localStorage.setItem('githubToken', githubToken);
        localStorage.setItem('collaborators', collaboratorsInput);
        
        // Récupérer les projets
        fetchProjects(zone01Token, giteaUsername);
    });
    
    // Événement du bouton de déconnexion
    logoutButton.addEventListener('click', () => {
        // Effacer les données de localStorage
        localStorage.removeItem('zone01Token');
        localStorage.removeItem('giteaUsername');
        localStorage.removeItem('githubUsername');
        localStorage.removeItem('githubToken');
        localStorage.removeItem('collaborators');
        localStorage.removeItem('projectsStatus');
        
        // Réinitialiser les formulaires
        zone01LoginForm.reset();
        authForm.reset();
        
        // Cacher les écrans
        dashboard.classList.add('hidden');
        migrationProgress.classList.add('hidden');
        
        // Réinitialiser les projets et statuts
        projects = [];
        selectedProjects = [];
        projectsStatus = {};
        
        // Afficher l'écran de connexion
        zone01LoginCard.classList.remove('hidden');
    });

    // Fonction pour afficher les projets
    function displayProjects(projects) {
        projectContainer.innerHTML = '';
        
        // Obtenir le statut de filtre actif
        const activeTab = document.querySelector('.tab-button.active');
        const activeFilter = activeTab ? activeTab.dataset.status : 'all';
        
        projects.forEach(project => {
            const projectStatus = projectsStatus[project.name] || 'pending';
            
            // Filtrer selon l'onglet actif
            if (activeFilter !== 'all' && projectStatus !== activeFilter) {
                return;
            }
            
            const projectItem = document.createElement('div');
            projectItem.className = `project-item ${projectStatus}`;
            projectItem.dataset.name = project.name;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = JSON.stringify(project); // Stocker toutes les infos du projet
            checkbox.id = `project-${project.name}`;
            
            // Ne cocher que les projets en attente par défaut
            checkbox.checked = projectStatus === 'pending';
            
            // Désactiver la case pour les projets déjà traités
            if (projectStatus !== 'pending') {
                checkbox.disabled = true;
            }
            
            const label = document.createElement('label');
            label.htmlFor = `project-${project.name}`;
            label.textContent = project.name;
            
            const statusBadge = document.createElement('span');
            statusBadge.className = `project-status ${projectStatus}`;
            
            switch(projectStatus) {
                case 'success':
                    statusBadge.textContent = 'Migré';
                    break;
                case 'error':
                    statusBadge.textContent = 'Échec';
                    break;
                default:
                    statusBadge.textContent = 'En attente';
            }
            
            projectItem.appendChild(checkbox);
            projectItem.appendChild(label);
            projectItem.appendChild(statusBadge);
            projectContainer.appendChild(projectItem);
        });
        
        // Mettre à jour la liste des projets sélectionnés
        updateSelectedProjects();
    }

    // Fonction pour mettre à jour la liste des projets sélectionnés
    function updateSelectedProjects() {
        const checkboxes = document.querySelectorAll('#project-container input[type="checkbox"]:checked:not(:disabled)');
        selectedProjects = Array.from(checkboxes)
            .map(checkbox => JSON.parse(checkbox.value));
    }

    // Onglets de filtrage des projets
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les onglets
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            button.classList.add('active');
            
            // Afficher les projets avec le filtre sélectionné
            displayProjects(projects);
        });
    });

    // Événement de sélection/désélection de tous les projets
    selectAllBtn.addEventListener('click', () => {
        const activeFilter = document.querySelector('.tab-button.active').dataset.status;
        const checkboxes = document.querySelectorAll('#project-container input[type="checkbox"]:not(:disabled)');
        const visibleCheckboxes = Array.from(checkboxes).filter(checkbox => {
            const projectItem = checkbox.closest('.project-item');
            if (activeFilter === 'all') return true;
            return projectItem.classList.contains(activeFilter);
        });
        
        const allSelected = visibleCheckboxes.every(checkbox => checkbox.checked);
        
        visibleCheckboxes.forEach(checkbox => {
            checkbox.checked = !allSelected;
        });
        
        updateSelectedProjects();
    });

    // Événement pour la migration
    startMigrationBtn.addEventListener('click', async () => {
        if (selectedProjects.length === 0) {
            alert('Veuillez sélectionner au moins un projet à migrer.');
            return;
        }
        
        const zone01Token = document.getElementById('zone01-token').value;
        const giteaUsername = document.getElementById('gitea-username').value;
        const githubUsername = document.getElementById('github-username').value;
        const githubToken = document.getElementById('github-token').value;
        const collaboratorsInput = document.getElementById('collaborators').value;
        
        // Traiter la liste des collaborateurs
        const collaborators = collaboratorsInput
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        // Préparer l'écran de progression
        migrationProgress.classList.remove('hidden');
        dashboard.classList.add('hidden');
        
        migratedCount = 0;
        totalToMigrate = selectedProjects.length;
        progressStatus.textContent = `0/${totalToMigrate} projets migrés`;
        progressBar.style.width = '0%';
        migrationLog.innerHTML = '';
        
        // Établir une connexion WebSocket pour recevoir les mises à jour en temps réel
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
        
        ws.onopen = function() {
            // Démarrer la migration une fois la connexion WebSocket établie
            fetch('/api/migrate-projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    zone01Token,
                    giteaUsername,
                    githubUsername,
                    githubToken,
                    projects: selectedProjects,
                    collaborators
                }),
            }).catch(error => {
                addLogEntry(`Erreur lors du démarrage de la migration: ${error.message}`, 'error');
                console.error('Erreur:', error);
            });
        };
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            
            if (data.type === 'log') {
                addLogEntry(data.message, data.level);
                
                // Mettre à jour le statut du projet si message de succès ou d'erreur
                if (data.projectName && (data.level === 'success' || data.level === 'error')) {
                    projectsStatus[data.projectName] = data.level;
                    // Sauvegarder les statuts de projets dans localStorage
                    localStorage.setItem('projectsStatus', JSON.stringify(projectsStatus));
                }
            } else if (data.type === 'progress') {
                migratedCount = data.completed;
                updateProgress();
            } else if (data.type === 'complete') {
                addLogEntry('Migration terminée !', 'success');
                doneButton.classList.remove('hidden');
                ws.close();
            }
        };
        
        ws.onerror = function(error) {
            addLogEntry(`Erreur WebSocket: ${error.message}`, 'error');
            console.error('WebSocket Error:', error);
        };
        
        ws.onclose = function() {
            console.log('WebSocket connection closed');
        };
    });

    // Événement pour le bouton "Terminé"
    doneButton.addEventListener('click', () => {
        migrationProgress.classList.add('hidden');
        dashboard.classList.remove('hidden');
        // Réafficher les projets avec leur nouveau statut
        displayProjects(projects);
    });

    // Écouteur d'événements sur le conteneur de projets pour mettre à jour la sélection
    projectContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            updateSelectedProjects();
        }
    });

    // Fonction pour ajouter une entrée au journal de migration
    function addLogEntry(message, level = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${level}`;
        entry.textContent = message;
        migrationLog.appendChild(entry);
        migrationLog.scrollTop = migrationLog.scrollHeight;
        
        // Extraire le nom du projet du message (pour les messages de succès/échec)
        if ((level === 'success' || level === 'error') && message.includes('Migration')) {
            const projectNameMatch = message.match(/projet:\s+([^\s]+)/);
            if (projectNameMatch && projectNameMatch[1]) {
                const projectName = projectNameMatch[1];
                
                // Mettre à jour les statuts des projets
                projectsStatus[projectName] = level;
                localStorage.setItem('projectsStatus', JSON.stringify(projectsStatus));
            }
        }
    }

    // Fonction pour mettre à jour la barre de progression
    function updateProgress() {
        const percentage = (migratedCount / totalToMigrate) * 100;
        progressBar.style.width = `${percentage}%`;
        progressStatus.textContent = `${migratedCount}/${totalToMigrate} projets migrés`;
    }
});