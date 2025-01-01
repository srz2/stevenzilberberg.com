github-api-key-expired
======================

The way this is currently setup, the github api key needs to be refreshed ever so often, if it is not refreshed and the key expires,
the website will fail retreiving projects from github.

This is an example of how the website handles that error, gracefully

![](github-api-key-expired.png)

## How to Update

Currently this website is deployed via [Netlify](http://netlify.com).
The `GITHUB_API_KEY` is stored in the following path:

Site Configuration -> Environment Variables

When this is updated, make sure all environments are updated and then
the website is redeployed.
