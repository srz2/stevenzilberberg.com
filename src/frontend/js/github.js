const loadingEl = document.querySelector("#loading");
const cards = document.querySelector('.card-container');
const github_repos = 'https://api.github.com/users/srz2/repos?per_page=100&type=public';
const github_project = 'https://api.github.com/repos/srz2/{}';
const github_project_languages = 'https://api.github.com/repos/srz2/{}/languages';
const github_file_to_search = '/contents/.available-for-web';
const KEY_CACHED_PROJECTS = "cached_projects";
let github_fetch_header = {};
var repos = []
var reposToDisplay = []

async function loadApiKey()
{
    await fetch('../config.json')
    .then(async response => await response.json())
    .then(data => {
        github_fetch_header = {headers: {"Authorization": `Bearer ${data['github_api_key']}`}}
    })
    .catch(err => console.error('Failed to get config', err));
}

// Get the repos from github
async function getRepos() {
    await fetch(github_repos, github_fetch_header)
    .then(async data => await data.json())
    .then(data => {
        data.forEach(x => repos.push(x['name']))
    })
    .catch(err => console.error('Failed to retrieve github repos', err.message));
}

async function getProjectLanguages(projectName){
    const results = [];
    const languageUrl = github_project_languages.replace("{}", projectName);
    await fetch(languageUrl, github_fetch_header)
    .then(async data => await data.json())
    .then(data => {
        Object.keys(data).forEach(x => results.push(x))
    })
    .catch(err => console.error('Failed to get languages for', projectName, err.message))

    return results;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

async function getProjectContent(projectUrl, imageUrl){
    const content = await fetch(projectUrl, github_fetch_header)
    .then(data => data.json())
    .then(async data => {
        const languages = await getProjectLanguages(data['name']);
        reposToDisplay.push({
            "name": toTitleCase(data['name'].replaceAll("_", " ").replaceAll("-", " ")),
            "description": data['description'],
            "url": data['html_url'],
            "image": imageUrl,
            "languages": languages
        })
    })
    .catch(err => console.error(err.message))

    return content;
}

async function getProject(projectUrl){
    await fetch(projectUrl + github_file_to_search, github_fetch_header)
    .then(data => data.json())
    .then(async data => {
        if (data['message'] !== "Not Found"){
            await getProjectContent(projectUrl, atob(data['content']))
        }
    })
}

async function getProjects(repos) {
    const projectPromises = [];

    for (const x of repos){
        var projectUrl = github_project.replace("{}", x)
        const promise = getProject(projectUrl);
        projectPromises.push(promise);
    }

    await Promise.all(projectPromises);
}

function createCardsFromRepos(){
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
                    ${x['languages'].map(x => `<li>${x}</li>`).join("")}
                </ul>
            </div>
            <p>${x['description']}</p>
            <button><a target="_blank" href="${x['url']}"><i class="fa-brands fa-github"></i> View on Github</a></button>
            `
        cards.appendChild(newEl)
    }

    // Remove loading message
    loadingEl.remove();
}

function createWarning(){
    const warning = document.createElement('div');
    warning.innerHTML = `
    <h1 style="color: white; font-size: 14px;">Repositories Fetching failed.<br/>This likely is an API limiting issue from too many requests. Try again in an hour</h1>
    <p style="color: white; margin-top: 14px">In the meantime, you can view my uncurated works on my <a style="color: white;" href="https://www.github.com/srz"<a>Github</a></p>
    `;
    return warning
}

async function getAndDisplayProjects() {
    await loadApiKey();
    await getRepos();
    if (repos.length == 0){
        const warning = createWarning();
        cards.appendChild(warning);
    } else {
        await getProjects(repos);

        repos = repos.sort(x => x['updated_at'])

        // Add timestamp and save cache
        localStorage[KEY_CACHED_PROJECTS] = JSON.stringify({
            lastupdated: new Date(),
            projects: reposToDisplay
        });

        // Create cards
        createCardsFromRepos();
    }
}

function clearCache(){
    localStorage.removeItem(KEY_CACHED_PROJECTS);
}

const cachedObj = localStorage[KEY_CACHED_PROJECTS];
if (cachedObj == undefined){
    getAndDisplayProjects();
} else {
    const projects = JSON.parse(cachedObj)
    const lastUpdated = new Date(projects['lastupdated'])
    const now = new Date();
    const diff = Math.abs(now - lastUpdated);
    
    // Cache expires every day
    if (diff >= 86400000) {
        console.log('Cache expired')
        getAndDisplayProjects()
    } else {
        console.log('Loading from cache')
        reposToDisplay = projects['projects']
        createCardsFromRepos();
    }
}
