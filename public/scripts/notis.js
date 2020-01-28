import { deleteThat } from './client.js'
if ('Notification' in window) {
  if (window.Notification.permission === 'granted') {
    // If it's okay let's create a notification
    // doNotify()
  } else {
    // notification == denied
    window.Notification.requestPermission()
      .then(function (result) {
        console.log(result) // granted || denied
        if (window.Notification.permission === 'granted') {
          // doNotify()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export function doNotify (titl, body, icon, url) {
  const title = titl
  const t = Date.now() + 120000 // 2 mins in future
  const options = {
    body: body,
    data: { prop1: 123, prop2: 'Steve' },
    lang: 'en-CA',
    icon,
    timestamp: t,
    vibrate: [100, 200, 100]
  }
  const n = new window.Notification(title, options)
  n.addEventListener('click', function (ev) {
    console.log('clicked')
    window.focus()
    window.open(url, '_self')
    n.close()
    deleteThat()
  })
  setTimeout(n.close.bind(n), 10000) // close notification after 10 seconds
}
