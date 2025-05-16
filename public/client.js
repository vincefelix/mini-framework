document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const zone01LoginForm = document.getElementById('zone01-login');
    const zone01Loading = document.getElementById('zone01-loading');
    const zone01LoginCard = document.getElementById('zone01-login-form');
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

    // Global variables
    let projects = [];
    let selectedProjects = [];
    let migratedCount = 0;
    let totalToMigrate = 0;
    let projectsStatus = {};

    // Check authentication and restore state from localStorage
    function checkAuthentication() {
        const zone01Token = localStorage.getItem('zone01Token');
        const githubToken = localStorage.getItem('githubToken');
        const giteaUsername = localStorage.getItem('giteaUsername');
        const githubUsername = localStorage.getItem('githubUsername');
        const savedCollaborators = localStorage.getItem('collaborators');

        if (zone01Token) {
            zone01LoginCard.classList.add('hidden');
            dashboard.classList.remove('hidden');
            document.getElementById('zone01-token').value = zone01Token;
            if (giteaUsername) document.getElementById('gitea-username').value = giteaUsername;
            if (githubUsername) document.getElementById('github-username').value = githubUsername;
            if (githubToken) document.getElementById('github-token').value = githubToken;
            if (savedCollaborators) document.getElementById('collaborators').value = savedCollaborators;
            const savedProjectsStatus = localStorage.getItem('projectsStatus');
            if (savedProjectsStatus) projectsStatus = JSON.parse(savedProjectsStatus);
            if (giteaUsername && zone01Token) fetchProjects(zone01Token, giteaUsername);
        }
    }

    // Fetch projects from API
    async function fetchProjects(zone01Token, giteaUsername) {
        projectsLoading.classList.remove('hidden');
        projectContainer.innerHTML = '';
        try {
            const response = await fetch('/api/fetch-projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zone01Token, giteaUsername }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error fetching projects');
            projects = data.projects;
            projectsLoading.classList.add('hidden');
            if (projects.length === 0) {
                projectContainer.innerHTML = '<p class="empty-message">No projects found.</p>';
            } else {
                displayProjects(projects);
            }
        } catch (error) {
            projectsLoading.classList.add('hidden');
            projectContainer.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
            console.error('Error:', error);
        }
    }

    checkAuthentication();

    // Handle Zone01 login form submit
    zone01LoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameOrEmail = document.getElementById('zone01-email').value;
        const password = document.getElementById('zone01-password').value;
        const errorDiv = document.getElementById('zone01-error');
        errorDiv.textContent = '';
        errorDiv.classList.add('hidden');
        zone01Loading.classList.remove('hidden');
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login error');
            localStorage.setItem('zone01Token', data.token);
            zone01LoginCard.classList.add('hidden');
            dashboard.classList.remove('hidden');
            document.getElementById('zone01-token').value = data.token;
        } catch (error) {
            errorDiv.textContent = `Login error: ${error.message}`;
            errorDiv.classList.remove('hidden');
            console.error('Error:', error);
        } finally {
            zone01Loading.classList.add('hidden');
        }
    });

    // Handle authentication form submit
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const zone01Token = document.getElementById('zone01-token').value;
        const giteaUsername = document.getElementById('gitea-username').value;
        const githubUsername = document.getElementById('github-username').value;
        const githubToken = document.getElementById('github-token').value;
        const collaboratorsInput = document.getElementById('collaborators').value;
        localStorage.setItem('giteaUsername', giteaUsername);
        localStorage.setItem('githubUsername', githubUsername);
        localStorage.setItem('githubToken', githubToken);
        localStorage.setItem('collaborators', collaboratorsInput);
        fetchProjects(zone01Token, giteaUsername);
    });

    // Handle logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('zone01Token');
        localStorage.removeItem('giteaUsername');
        localStorage.removeItem('githubUsername');
        localStorage.removeItem('githubToken');
        localStorage.removeItem('collaborators');
        localStorage.removeItem('projectsStatus');
        zone01LoginForm.reset();
        authForm.reset();
        dashboard.classList.add('hidden');
        migrationProgress.classList.add('hidden');
        projects = [];
        selectedProjects = [];
        projectsStatus = {};
        zone01LoginCard.classList.remove('hidden');
    });

    // Display projects with status and selection
    function displayProjects(projects) {
        projectContainer.innerHTML = '';
        const activeTab = document.querySelector('.tab-button.active');
        const activeFilter = activeTab ? activeTab.dataset.status : 'all';
        projects.forEach(project => {
            const projectStatus = projectsStatus[project.name] || 'pending';
            if (activeFilter !== 'all' && projectStatus !== activeFilter) return;
            const projectItem = document.createElement('div');
            projectItem.className = `project-item ${projectStatus}`;
            projectItem.dataset.name = project.name;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = JSON.stringify(project);
            checkbox.id = `project-${project.name}`;
            checkbox.checked = projectStatus === 'pending';
            if (projectStatus === 'success') {
                checkbox.disabled = true;
            } else if (projectStatus === 'error') {
                checkbox.checked = false;
            }
            const label = document.createElement('label');
            label.htmlFor = `project-${project.name}`;
            label.textContent = project.name;
            const statusBadge = document.createElement('span');
            statusBadge.className = `project-status ${projectStatus}`;
            switch (projectStatus) {
                case 'success':
                    statusBadge.textContent = 'Migrated';
                    break;
                case 'error':
                    statusBadge.textContent = 'Failed - Retry';
                    break;
                default:
                    statusBadge.textContent = 'Pending';
            }
            projectItem.appendChild(checkbox);
            projectItem.appendChild(label);
            projectItem.appendChild(statusBadge);
            projectContainer.appendChild(projectItem);
        });
        updateSelectedProjects();
    }

    // Update selected projects list
    function updateSelectedProjects() {
        const checkboxes = document.querySelectorAll('#project-container input[type="checkbox"]:checked:not(:disabled)');
        selectedProjects = Array.from(checkboxes).map(checkbox => JSON.parse(checkbox.value));
    }

    // Handle project filter tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayProjects(projects);
        });
    });

    // Handle select/deselect all projects
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

    // Handle migration start
    startMigrationBtn.addEventListener('click', async () => {
        if (selectedProjects.length === 0) {
            alert('Please select at least one project to migrate.');
            return;
        }
        const zone01Token = document.getElementById('zone01-token').value;
        const giteaUsername = document.getElementById('gitea-username').value;
        const githubUsername = document.getElementById('github-username').value;
        const githubToken = document.getElementById('github-token').value;
        const collaboratorsInput = document.getElementById('collaborators').value;
        const collaborators = collaboratorsInput
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        migrationProgress.classList.remove('hidden');
        dashboard.classList.add('hidden');
        migratedCount = 0;
        totalToMigrate = selectedProjects.length;
        progressStatus.textContent = `0/${totalToMigrate} projects migrated`;
        progressBar.style.width = '0%';
        migrationLog.innerHTML = '';
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
        ws.onopen = function () {
            fetch('/api/migrate-projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zone01Token,
                    giteaUsername,
                    githubUsername,
                    githubToken,
                    projects: selectedProjects,
                    collaborators
                }),
            }).catch(error => {
                addLogEntry(`Error starting migration: ${error.message}`, 'error');
                console.error('Error:', error);
            });
        };
        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
            if (data.type === 'log') {
                addLogEntry(data.message, data.level);
                if (data.projectName && (data.level === 'success' || data.level === 'error')) {
                    projectsStatus[data.projectName] = data.level;
                    localStorage.setItem('projectsStatus', JSON.stringify(projectsStatus));
                }
            } else if (data.type === 'progress') {
                migratedCount = data.completed;
                updateProgress();
            } else if (data.type === 'complete') {
                addLogEntry('Migration complete!', 'success');
                doneButton.classList.remove('hidden');
                ws.close();
            }
        };
        ws.onerror = function (error) {
            addLogEntry(`WebSocket error: ${error.message}`, 'error');
            console.error('WebSocket Error:', error);
        };
        ws.onclose = function () {
            console.log('WebSocket connection closed');
        };
    });

    // Handle "Done" button after migration
    doneButton.addEventListener('click', () => {
        migrationProgress.classList.add('hidden');
        dashboard.classList.remove('hidden');
        displayProjects(projects);
    });

    // Update selection on project checkbox change
    projectContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            updateSelectedProjects();
        }
    });

    // Add entry to migration log
    function addLogEntry(message, level = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${level}`;
        entry.textContent = message;
        migrationLog.appendChild(entry);
        migrationLog.scrollTop = migrationLog.scrollHeight;
        if ((level === 'success' || level === 'error') && message.includes('Migration')) {
            const projectNameMatch = message.match(/projet:\s+([^\s]+)/);
            if (projectNameMatch && projectNameMatch[1]) {
                const projectName = projectNameMatch[1];
                projectsStatus[projectName] = level;
                localStorage.setItem('projectsStatus', JSON.stringify(projectsStatus));
            }
        }
    }

    // Update migration progress bar
    function updateProgress() {
        const percentage = (migratedCount / totalToMigrate) * 100;
        progressBar.style.width = `${percentage}%`;
        progressStatus.textContent = `${migratedCount}/${totalToMigrate} projects migrated`;
    }
});
