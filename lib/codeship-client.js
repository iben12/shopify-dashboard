'use strict';

const axios = require('axios');

const emarsys = 'f64f7300-e93d-0133-b53e-76bef8d7b14f';

const projects = [
    { name: 'core', uuid: '58bd6050-d389-0135-dea6-46dd00c5edf1' },
    { name: 'client', uuid: '5bb9a7b0-d372-0135-9926-4a294b5eb5fb' },
    { name: 'connector', uuid: 'e81f8d00-d453-0135-f06a-062fed6cd65b' }
];

let token;

async function tokenRequest() {
    const response = await axios({
        method: 'POST',
        url: 'https://api.codeship.com/v2/auth',
        auth: {
            username: process.env.CS_USERNAME,
            password: process.env.CS_PASSWORD
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    return response.data.access_token;
}

async function buildsRequest(project) {
    const response = await axios.get(`https://api.codeship.com/v2/organizations/${emarsys}/projects/${project}/builds`, {
        headers: {
            'Authorization': token,
            'Accepts': 'application/json'
        }
    });

    return response.data.builds[0];


}

async function requestStatuses() {
    const statuses = [];
    for (let project of projects) {
        const build = await buildsRequest(project.uuid);
        statuses.push({ name: project.name, status: build.status, username: build.username });
    }

    return statuses;
}

async function getStatuses() {
    if (!token) {
        token = await tokenRequest();
    }

    try {
        return await requestStatuses();
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('refresh token');

            token = false;
            return getStatuses();
        }

        throw error;
    }
}

module.exports = getStatuses;