'use strict'

console.log('hello worldss')

const socket = window.io()
const notis = document.getElementById('notis')
const notisBar = document.getElementById('notisBar')
const template = document.createElement('template')
const issueTemplate = document.createElement('div')
const container = document.getElementById('container')
let issueCounter = 0
let token
issueTemplate.className = 'child'
// template.innerHTML = `
// <div role="alert" aria-live="assertive" aria-atomic="true" class="toast show" data-autohide="false">
// <div class="toast-header">
//   <img src="..." class="rounded mr-2 img" alt="...">
//   <strong class="mr-auto headings">Bootstrap</strong>
//   <small>11 mins ago</small>
//   <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
//     <span aria-hidden="true" onclick="document.getElementById({{this.id}}).remove(); return false;">&times;</span>
//   </button>
// </div>
// <div class="toast-body">
//   Hello, world! This is a toast message.
// </div>
// </div>
// `
issueTemplate.innerHTML = `
  <div class="card" style="width: 32rem;">
  <div class="card-body">
    <h5 class="card-title">{{this.title}}</h5>
    <h6 class="card-subtitle mb-2 text-muted">{{this.user}}</h6>
    <p class="card-text text">{{this.body}}</p>
    <a class="lol2 url" href="{{this.url}}">{{this.url}}</a>
    <p class="two"><span class="font-weight-bold"> Comments:</span></p><p class="comments two"></p>
    <a href="/{{../navBar.username}}/repo/{{../org}}/issues/{{this.number}}/{{../repo}}/comments" class="show"><p class="one lol">Show.</p></a> 
    <br>
    <p class="two"><span class="font-weight-bold">Created at:</span></p><p class="created two"></p>
    <br>
    <p class="two"><span class="font-weight-bold">Last Updated:</span></p><p class="updated two"></p>
    <br>
    <form action="/closeIssue" method="POST">
      <a href="#"><p onclick="document.getElementById({{this.id}}).submit(); return false;" class="text-danger">Close issue</p> 
      </a>
    <input type="hidden" class="csurf" name="_csrf" value="{{../csrfToken}}">
    </form>
  </div>
</div>
`
console.log(issueTemplate)
let counter = 0
socket.on('issue_comment', function (data) {
  // if (data.token) {
  //   token = data.token
  // }
  // console.log(data)
  // counter++
  // const alert = template.content.cloneNode(true)
  // const body = alert.querySelector('.toast-body')
  // const heading = alert.querySelector('.headings')
  // const img = alert.querySelector('.img')
  // img.setAttribute('src', data.sender.avatar_url)
  // notis.textContent = counter
  // if (data.action === 'deleted') {
  //   body.textContent = `${data.sender.login} deleted an issue comment on ${data.repository.full_name}`
  //   heading.textContent = 'Comment Deleted'
  // } else if (data.action === 'edited') {
  //   body.textContent = `${data.sender.login} edited an issue comment on ${data.repository.full_name}`
  //   heading.textContent = 'Comment Edited'
  // } else if (data.action === 'created') {
  //   heading.textContent = 'New Comment'
  //   body.textContent = `${data.sender.login} created a new comment on ${data.repository.full_name}`
  // } else {

  // }
  // notisBar.append(alert)
})

socket.on('issues', function (data) {
  console.log(data)
  if (data.token) {
    token = data.token
  }
  counter++
  issueCounter++
  // const alert = template.content.cloneNode(true)
  const newIssue = issueTemplate.cloneNode(true)
  newIssue.setAttribute('data-issue', data.issue.id)
  const title = newIssue.querySelector('.card-title')
  const text = newIssue.querySelector('.card-text')
  const user = newIssue.querySelector('.card-subtitle')
  const url = newIssue.querySelector('.url')
  const created = newIssue.querySelector('.created')
  const updated = newIssue.querySelector('.updated')
  const comments = newIssue.querySelector('.comments')
  const a = newIssue.querySelector('.show')
  const form = newIssue.querySelector('form')
  const p = form.querySelector('p')
  p.setAttribute('onclick', `document.getElementById(${data.issue.id}).submit(); return false;`)
  console.log(form)
  console.log(p)

  // const body = alert.querySelector('.toast-body')
  // const heading = alert.querySelector('.headings')
  // const img = alert.querySelector('.img')
  // img.setAttribute('src', data.sender.avatar_url)
  // notis.textContent = counter

  if (data.action === 'edited') {
    // body.textContent = `${data.sender.login} edited an issue name on ${data.repository.full_name}`
    // heading.textContent = 'Issue edited'
    const number = data.issue.id
    const elements = document.getElementsByClassName('child')
    const node = getElement(elements, number)
    node.remove()
    issueCounter--
    updateScreen(data, title, url, created, updated, text, comments, container, newIssue, user, a, form)
  } else if (data.action === 'closed') {
    // body.textContent = `${data.sender.login} closed an issue on ${data.repository.full_name}`
    // heading.textContent = 'Issue closed'
    const number = data.issue.id
    const elements = document.getElementsByClassName('child')
    const node = getElement(elements, number)
    node.remove()
    issueCounter--
  } else if (data.action === 'reopened') {
    // body.textContent = `${data.sender.login} reopened an issue on ${data.repository.full_name}`
    // heading.textContent = 'Issue reopened'

    updateScreen(data, title, url, created, updated, text, comments, container, newIssue, user, a, form)
  } else if (data.action === 'opened') {
    updateScreen(data, title, url, created, updated, text, comments, container, newIssue, user, a, form)
  } else {

  }
  // notisBar.append(alert)
})

function getElement (elements, number) {
  let node
  for (const item of elements) {
    let num = item.getAttribute('data-issue')
    num = parseInt(num, 10)
    if (num === number) {
      node = item
      break
    }
  }
  return node
}

function updateScreen (data, title, url, created, updated, text, comments, container, newIssue, user, a, form) {
  // body.textContent = `${data.sender.login} created a new issue on ${data.repository.full_name}`
  // heading.textContent = 'New issue'
  title.textContent = `${data.issue.title}`
  user.textContent = `${data.issue.user.login}`
  url.textContent = `${data.repository.html_url}`
  created.textContent = ` ${data.issue.created_at}`
  updated.textContent = ` ${data.issue.updated_at}`
  text.textContent = `${data.issue.body}`
  comments.textContent = ` ${data.issue.comments}`
  const csurf = form.querySelector('.csurf')
  csurf.setAttribute('value', token)
  form.setAttribute('id', data.issue.id)
  form.setAttribute('action', `/closeIssue/${data.issue.number}/${data.repository.full_name}`)
  if (data.organization) {
    a.setAttribute('href', `/${data.sender.login}/repo/${data.repository.owner.login}/issues/${data.issue.number}/${data.repository.name}/comments`)
  } else {
    a.setAttribute('href', `/${data.sender.login}/repo/issues/${data.issue.number}/${data.repository.name}/comments`)
  }
  container.append(newIssue)
  newIssue.style.order = issueCounter * -1
}
