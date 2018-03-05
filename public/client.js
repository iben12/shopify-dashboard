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

function refreshRabbit() {
    let rabbitIframe = document.getElementById("rabbitiframe");
    rabbitIframe.contentWindow.location(reload);
}

getStatuses();

setInterval(function() {
    getStatuses();
}, 20 * 1000);

setInterval(function() {
    refreshRabbit();
}, 30 * 60 * 1000);