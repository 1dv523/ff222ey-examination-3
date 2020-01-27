'use strict'

const socket = window.io()
const issueTemplate = document.createElement('div')
const container = document.getElementById('container')
let issueCounter = 0
let token
issueTemplate.className = 'child'
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
socket.on('issues', function (data) {
  if (data.token) {
    token = data.token
  }
  issueCounter++
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

  if (data.action === 'edited') {
    const number = data.issue.id
    const elements = document.getElementsByClassName('child')
    const node = getElement(elements, number)
    node.remove()
    issueCounter--
    updateScreen(data, title, url, created, updated, text, comments, container, newIssue, user, a, form)
  } else if (data.action === 'closed') {
    const number = data.issue.id
    const elements = document.getElementsByClassName('child')
    const node = getElement(elements, number)
    node.remove()
    issueCounter--
  } else if (data.action === 'reopened') {
    updateScreen(data, title, url, created, updated, text, comments, container, newIssue, user, a, form)
  } else if (data.action === 'opened') {
    updateScreen(data, title, url, created, updated, text, comments, container, newIssue, user, a, form)
  } else {

  }
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
