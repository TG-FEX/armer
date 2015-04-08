fis.config.merge({
    deploy: {
        local: [{
            to: './release',
            subOnly: true
        }]
    },
    roadmap: {
        path: [
        {
            reg: /^\/release\/.*$/i,
            release: false
        }]
    }
});