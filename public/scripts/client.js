'use strict'

console.log('hello world')

if ('Notification' in window) {
  if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    doNotify()
  } else {
    // notification == denied
    Notification.requestPermission()
      .then(function (result) {
        console.log(result) // granted || denied
        if (Notification.permission === 'granted') {
          doNotify()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

function doNotify () {
  const title = 'The Title'
  const t = Date.now() + 120000 // 2 mins in future
  const options = {
    body: 'Hello from JavaScript!',
    data: { prop1: 123, prop2: 'Steve' },
    lang: 'en-CA',
    icon: './img/calendar-lg.png',
    timestamp: t,
    vibrate: [100, 200, 100]
  }
  const n = new Notification(title, options)
  n.addEventListener('show', function (ev) {
    console.log('SHOW', ev.currentTarget.data)
  })
  n.addEventListener('close', function (ev) {
    console.log('CLOSE', ev.currentTarget.body)
  })
  setTimeout(n.close.bind(n), 3000) // close notification after 3 seconds
}
