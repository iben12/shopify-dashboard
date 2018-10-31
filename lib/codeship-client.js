'use strict';

const axios = require('axios');

const emarsys = 'f64f7300-e93d-0133-b53e-76bef8d7b14f';

const projects = [
    { name: 'sh-core', uuid: '58bd6050-d389-0135-dea6-46dd00c5edf1' },
    { name: 'sh-client', uuid: '5bb9a7b0-d372-0135-9926-4a294b5eb5fb' },
    { name: 'connector', uuid: 'e81f8d00-d453-0135-f06a-062fed6cd65b' },
    { name: 'mg-client', uuid: '8abfa530-2b86-0136-1dc7-1af91c237dc8' },
    { name: 'mg-core', uuid: 'e2430550-2b86-0136-5072-76ecb6e6dd14' },
    { name: 'mg-ext', uuid: 'df2056c0-3b1f-0136-0a27-1e274df65f02' },
    { name: 'mg-api-client', uuid: '6f42de20-3ccb-0136-85c2-4a74f3810b0a'},
    { name: 'admin-client', uuid: '24f58280-a3a5-0136-66a3-56539f3ab422'},
    { name: 'mg1-ext', uuid: '2c9c9410-bf34-0136-376b-3692a37ca807'}
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
        statuses.push({
            name: project.name,
            status: build.status,
            username: build.username,
            commit: build.commit_message
        });
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