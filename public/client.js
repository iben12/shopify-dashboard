function getStatuses() {
    axios({
        url: '/statuses/',
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then(function(response) {
        for (let project of response.data) {
            let parent = document.getElementById(project.name)
            parent.className = `project ${project.status}`;
            parent.querySelector('span.statusline').innerText = project.status;
            parent.querySelector('span.username').innerText = '@' + project.username;
            parent.querySelector('span.commit').innerText = project.commit;
        }
    }).catch(function(error) {
        console.log(error);

    });
}


getStatuses();

setInterval(function() {
    getStatuses();
}, 10 * 1000);