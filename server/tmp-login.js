const http = require('http')
const data = JSON.stringify({ email: 'yazan@info.com', password: 'Yazan@2006.com' })
const req = http.request({ hostname: 'localhost', port: 4000, path: '/api/admin/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, res => {
  let d = ''
  res.on('data', c => d += c)
  res.on('end', () => console.log('STATUS', res.statusCode, 'BODY', d))
})
req.on('error', e => console.error(e))
req.write(data)
req.end()
