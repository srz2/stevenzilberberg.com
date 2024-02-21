Project Info
============
Project Name: stevenzilberberg.com

Updated Date: 12/30/22

Created Date: 12/30/22

Issue Tracking: https://github.com/srz2/stevenzilberberg.com/issues

Repository: https://github.com/srz2/stevenzilberberg.com

Description: This is my Personal Website. It will contain relevant links and documents to represent me at a professional and personal level while highlighting projects and other prospects I want to make public

# Overview

This is desired to be a personal website for general usage. The most common usecase is to be a landing area to point to for people to learn about me whether it be personally, professionally or used as a guide towards other things. It will eventually use this as a link to things for personal learning and education.

# Changelog

| Date  |  Change | Comments
|-------|---------|---------|
|  12/30/22     |   Initial Document Submission      |         |
|  2/21/24      | Updated for Github integration | A projects page was created |

# Software Design Requirments

The requirements for this website are as follows:
- Site must load in <250ms
- Expansion in features must always be a consideration
- HTTPS hookup must function for the website
- **MUST** contain the following either as external links or internal experiences
  - Phase 1 (Completed: 12/31/2022)
    - Linkedin
    - Github
    - Emailing
    - Resume View/Download
  - Phase 2 (Completed: 2/21/2024)
    - A *Project* page to show and highlight projects that I have completed
  - Phase 3 (Completed: No)
    - A *Blog* page with statically typed entires to talk about whatever I want
  - Phase 4 (Completed: No) - 
    - A dynamically rendered resume section which exports to a custom layout PDF
    - Moved blog over to some sort of CMS system so pages are rendered automatically

**Note**: Phase 1 is required to achieve an MVP. Phase 2 is desired for a more complete experience. Phase 3 is a nice to have strectch goal which helps build the user experience of the website past a quick lookup tool to relevant information

# Mockups

## Desktop
<img alt="Desktop Browser Wireframe" src="./wireframes/Desktop%20Browser%20View.png" width="300" height="200">

## Mobile
<img alt="Mobile Browser Wireframe" src="./wireframes/Mobile%20Browser%20View.png" width="200" height="300">

# Website Documentation and Features

## Github Integration

### Environment Variables
- GITHUB_API_KEY

 This is the api key to access authenticated github commands through their web api. Without it, we are limited to 60 requests per hour

### Scripts

- generateConfig.js

This script generates a `config.json` which contains the Github Api Key. The config file will pull it from the environment variable using NodeJs and save it to the `src/frontend/js/config.json` path

### github.js

The actual script file for github interactions directly is used by the projects page. It will do the following:

- Load the Api Key
- Get all projects from Github using their Api service
- From the repositories it gets back, it queries each repo to check if the `.available-for-web` file exists. If it does, it will include it in the gallery
- From the obtained list of projects, it will sort it by last updated
- It will then create HTML elements for the website and cache the results for up to a day

### Caching mechanism

There is a caching mechanism for github requests through the `localstorage`. If no cache exists, it will go out and use the Api to get the projects. This is an expensive operation. Each project requires at least 3 Api calls including the base call to get all the repos (can only load 100 at a time).

The cache will be good for 1 day.

If the cache exists on the page load, it will just use that instead of calling out to the web api
