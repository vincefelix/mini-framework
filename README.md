# 🚀 Gitea to GitHub Migration Tool

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)
![Contributors](https://img.shields.io/github/contributors/99mass/gitea-to-github)
![Stars](https://img.shields.io/github/stars/99mass/gitea-to-github?style=social)

<div align="center">
  <h3>Easily migrate your Zone01 Gitea projects to GitHub with one click</h3>
</div>

## ✨ Features

- **Seamless Authentication**: Connect directly to your Zone01 Dakar account
- **Intelligent Migration**: Automatically detects and migrates projects with grades
- **Collaboration Support**: Handles projects created by your classmates/collaborators
- **Real-time Progress**: Watch the migration process happen with detailed logs
- **Project Status Tracking**: Keep track of successful, pending, and failed migrations
- **Responsive Design**: Works beautifully on both desktop and mobile devices
- **Dark Mode**: Easy on the eyes for late-night coding sessions

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git installed on your machine
- GitHub account with personal access token
- Zone01 Dakar account credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/99mass/gitea-to-github.git

# Navigate to the project directory
cd gitea-to-github

# Install dependencies
npm install

# Start the application
npm start
```

The application will be running at `http://localhost:3000`

## 🔍 How to Use

1. **Login to Zone01 Dakar**: Enter your Zone01 Dakar username/email and password
2. **Configure Migration**: 
   - Enter your Gitea username (usually same as Zone01)
   - Enter your GitHub username
   - Paste your GitHub personal access token (needs 'repo' permissions)
   - List potential collaborators who might own projects you worked on
3. **Select Projects**: Choose which projects to migrate
4. **Start Migration**: Click the "Start Migration" button and watch the magic happen
5. **Review Results**: Check the status of each project migration
6. **⭐ Star the Project**: If you found this tool helpful, please consider giving it a star!

## 📝 Creating a GitHub Token

To create a personal access token for GitHub:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Give your token a descriptive name
4. Select the "repo" scope (full control of private repositories)
5. Click "Generate token"
6. Copy the token immediately (you won't be able to see it again!)

## 💖 Support the Project

If this tool helped you save time and effort, please consider:

- **⭐ Starring the Repository**: Show your appreciation with a GitHub star
- **🐛 Reporting Issues**: Help improve the tool by reporting bugs
- **🔧 Contributing**: Submit pull requests to add features or fix issues
- **🗣️ Spreading the Word**: Share with your Zone01 classmates!

## 👨‍💻 Author

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/99mass" alt="Samba Diop" width="100px" style="border-radius:50%">
  <h3>Samba Diop</h3>
  <p>Alliance Breukh</p>
  
  [![GitHub](https://img.shields.io/badge/GitHub-99mass-181717?style=for-the-badge&logo=github)](https://github.com/99mass)
  [![Email](https://img.shields.io/badge/Email-sambadiop161%40gmail.com-D14836?style=for-the-badge&logo=gmail)](mailto:sambadiop161@gmail.com)
</div>

## 🙏 Acknowledgements

- Thanks to all Zone01 Dakar students who tested this tool
- Special appreciation to the Zone01 community for their support
- Built with Node.js, Express, WebSockets, and modern web technologies

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>⭐ Don't forget to star this repository if you found it useful! ⭐</p>
  <p>Made with ❤️ in Dakar, Senegal</p>
</div>
