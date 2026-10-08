export const handler = async (event) => {
    const {GITHUB_API_KEY} = process.env;

    const content = {github_api_key: GITHUB_API_KEY};

    return {
        statusCode: 200,
        body: JSON.stringify(content)
    }
}