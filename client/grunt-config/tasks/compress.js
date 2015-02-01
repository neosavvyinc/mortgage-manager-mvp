module.exports = {
  compress: {
    main: {
      options: {
        archive: 'MAM-client.zip',
        mode: 'zip'
      },
      files: [
        {
          expand: true,
          cwd: 'target/',
          src: ['**']
        }
      ]
    }
  }
}