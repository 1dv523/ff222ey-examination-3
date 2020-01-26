
// import { socket } from './client.js'

window.socket.emit('token')
let token

window.socket.on('token', function (data) {
  token = data
  console.log(data)
})

window.$('.toggle').change(function (e) {
  console.log('i am')
  const lol = e.target
  const name = lol.getAttribute('data-name')
  const type = lol.getAttribute('data-type')

  post('/toggleHook/', { repo: name, type })
  lol.setAttribute('disabled', 'true')
})

function post (path, params, method = 'post') {
  const form = document.createElement('form')
  const input = document.createElement('input')
  input.setAttribute('type', 'hidden')
  input.setAttribute('name', '_csrf')
  input.setAttribute('value', token)
  form.append(input)
  form.method = method
  form.action = path

  for (const key in params) {
    if (key in params) {
      const hiddenField = document.createElement('input')
      hiddenField.type = 'hidden'
      hiddenField.name = key
      hiddenField.value = params[key]

      form.appendChild(hiddenField)
    }
  }

  document.body.appendChild(form)
  form.submit()
}
