window.$('.toggle').change(function (e) {
  const lol = e.target
  const name = lol.getAttribute('data-name')
  const type = lol.getAttribute('data-type')

  post('/toggleHook/', { repo: name, type })
  lol.setAttribute('disabled', 'true')
})

function post (path, params, method = 'post') {
  const form = document.createElement('form')
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
