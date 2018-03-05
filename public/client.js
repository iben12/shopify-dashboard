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
            parent.querySelector('span').innerText = project.status;
        }
    }).catch(function(error) {
        console.log(error);

    });
}

getStatuses();

setInterval(function() {
    getStatuses();
}, 20 * 1000);