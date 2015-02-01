module.exports = {
  main: {
    options: {
      archive: 'MAM-client.zip',
      mode: 'zip'
    },
    files: [
      {
        expand: true,
        cwd: '<%= buildOutputDirectoryPath %>/',
        src: ['**']
      }
    ]
  }
}