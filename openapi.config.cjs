const { generateService } = require('@umijs/openapi')

generateService({
  requestLibPath: "import request from '@/utils/request'",
  schemaPath: 'http://localhost:8901/v3/api-docs',
  serversPath: './src/api',
  projectName: '/blog_api'
})