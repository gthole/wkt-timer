Package.describe({
    summary: "jQuery-Sidebar - a Sidebar Navigation plugin"
});

Package.on_use(function (api) {
    api.use('jquery', 'client');
    api.add_files([
        'lib/sidebar.0.2.0.js'
    ], 'client');
});
