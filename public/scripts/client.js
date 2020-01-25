'use strict'

console.log('hello worldss')

const socket = window.io()
const notis = document.getElementById('notis')
const notisBar = document.getElementById('notisBar')
const template = document.createElement('div')
template.innerHTML = `
<div role="alert" aria-live="assertive" aria-atomic="true" class="toast show" data-autohide="false">
<div class="toast-header">
  <img src="..." class="rounded mr-2 img" alt="...">
  <strong class="mr-auto headings">Bootstrap</strong>
  <small id="time">11 mins ago</small>
  <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
  <span aria-hidden="true" class="del" >&times;</span>
</button>
</div>
<div class="toast-body">
  Hello, world! This is a toast message.
</div>
</div>
`
let counter = 0
let id = 0
window.$('.close').click(function (e) {
  const id = e.target.getAttribute('data-id')
  console.log(id)
  const div = document.getElementById(id)
  div.remove()
  // const parent = $(this).parentNode
  // console.log('the oarent is ', parent)
  // parent.remove()
})
socket.on('issue_comment', function (data) {
  console.log(data)
  counter++
  id++
  const alert = template.cloneNode(true)
  alert.setAttribute('id', id)
  const body = alert.querySelector('.toast-body')
  const heading = alert.querySelector('.headings')
  const img = alert.querySelector('.img')
  const del = alert.querySelector('.del')
  del.setAttribute('data-id', id)
  img.setAttribute('src', data.sender.avatar_url)
  notis.textContent = counter
  if (data.action === 'deleted') {
    body.textContent = `${data.sender.login} deleted an issue comment on ${data.repository.full_name}`
    heading.textContent = 'Comment Deleted'
  } else if (data.action === 'edited') {
    body.textContent = `${data.sender.login} edited an issue comment on ${data.repository.full_name}`
    heading.textContent = 'Comment Edited'
  } else if (data.action === 'created') {
    heading.textContent = 'New Comment'
    body.textContent = `${data.sender.login} created a new comment on ${data.repository.full_name}`
  } else {

  }
  notisBar.append(alert)
})

socket.on('issues', function (data) {
  console.log(data)
  counter++
  const alert = template.content.cloneNode(true)
  const body = alert.querySelector('.toast-body')
  const heading = alert.querySelector('.headings')
  const img = alert.querySelector('.img')
  img.setAttribute('src', data.sender.avatar_url)
  notis.textContent = counter

  if (data.action === 'edited') {
    body.textContent = `${data.sender.login} edited an issue name on ${data.repository.full_name}`
    heading.textContent = 'Issue edited'
  } else if (data.action === 'closed') {
    body.textContent = `${data.sender.login} closed an issue on ${data.repository.full_name}`
    heading.textContent = 'Issue closed'
  } else if (data.action === 'reopened') {
    body.textContent = `${data.sender.login} reopened an issue on ${data.repository.full_name}`
    heading.textContent = 'Issue reopened'
  } else if (data.action === 'opened') {
    body.textContent = `${data.sender.login} created a new issue on ${data.repository.full_name}`
    heading.textContent = 'New issue'
  } else {

  }
  notisBar.append(alert)
})

function deleteThis (e) {
  const id = e.target.getAttribute('data-id')
  console.log(id)
  const div = document.getElementById(id)
  div.remove()
}

/*
if ('Notification' in window) {
  if (window.Notification.permission === 'granted') {
    // If it's okay let's create a notification
    doNotify()
  } else {
    // notification == denied
    window.Notification.requestPermission()
      .then(function (result) {
        console.log(result) // granted || denied
        if (window.Notification.permission === 'granted') {
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
  const n = new window.Notification(title, options)
  n.addEventListener('show', function (ev) {
    console.log('SHOW', ev.currentTarget.data)
  })
  n.addEventListener('close', function (ev) {
    console.log('CLOSE', ev.currentTarget.body)
  })
  setTimeout(n.close.bind(n), 3000) // close notification after 3 seconds
}
*/
