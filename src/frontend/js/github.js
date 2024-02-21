const cards = document.querySelector('.card-container');
const github_repos = 'https://api.github.com/users/srz2/repos';
const github_project = 'https://api.github.com/repos/srz2/{}';
const github_file_to_search = '/contents/.available-for-web';
var repos = []
var reposToDisplay = []

// Get the repos from github
async function getRepos() {
    // await repos.push('hue_alert')
    await fetch(github_repos)
    .then(data => data.json())
    .then(data => {
        data.forEach(x => {
            repos.push(x['name'])
        })
    })
    .finally('Done getting repos')
    .catch(err => console.log('Failed to retrieve github repos', err.message));
}

async function getProjects(repos) {
    await Promise.all(repos.map(async x => {
        var projectUrl = github_project.replace("{}", x)
        await fetch(projectUrl + github_file_to_search)
        .then(data => data.json())
        .then(async data => {
            if (data['message'] !== "Not Found"){
                await fetch(projectUrl)
                .then(data2 => data2.json())
                .then(data2 => {
                    console.log(data2);
                    reposToDisplay.push({
                        "name": toTitleCase(data2['name'].replace("_", " ").replace("-", " ")),
                        "description": data2['description'],
                        "url": data2['html_url'],
                        "image": atob(data['content']),
                        "language": data2['language']
                    })
                })
            }
        })
    }))
}

async function createCardsFromRepos(){
    console.log('Repos', reposToDisplay.length)
    console.log(reposToDisplay)
    for (const x of reposToDisplay) {
        var newEl = document.createElement("div")
        newEl.className = "card"
        newEl.innerHTML = `
            <h1>${x['name']}</h1>
            <div class="img-container">
                <img src="${x['image']}" alt="project image">
            </div>
            <div class="tech-types">
                <ul>
                    <li>${x['language']}</li>
                </ul>
            </div>
            <p>${x['description']}</p>
            <button><a target="_blank" href="${x['url']}"><i class="fa-brands fa-github"></i> View on Github</a></button>
            `
        cards.appendChild(newEl)
    }
}

async function displayProjects() {
    await getRepos();
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

displayProjects();