!function(e){var t={};function n(o){if(t[o])return t[o].exports;var s=t[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(o,s,function(t){return e[t]}.bind(null,s));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function o(e,t,n,o){const s=e,r={body:t,data:{prop1:123,prop2:"Steve"},lang:"en-CA",icon:n,timestamp:Date.now()+12e4,vibrate:[100,200,100]},i=new window.Notification(s,r);i.addEventListener("click",(function(e){console.log("clicked"),window.focus(),window.open(o,"_self"),i.close(),function(e){const t=document.getElementById(e);m(e=parseInt(e,10)),t.remove()}()})),setTimeout(i.close.bind(i),1e4)}n.r(t),"Notification"in window&&("granted"===window.Notification.permission||window.Notification.requestPermission().then((function(e){console.log(e),window.Notification.permission})).catch(e=>{console.log(e)}));const s=window.io();let r=window.sessionStorage.getItem("theIssuerNotis"),i=window.sessionStorage.getItem("theIssuerId");const a=document.getElementById("notis"),d=document.getElementById("notisBar"),u=document.createElement("div");u.innerHTML='\n<div role="alert" aria-live="assertive" aria-atomic="true" class="toast show" data-autohide="false">\n<div class="toast-header">\n  <img src="..." class="rounded mr-2 img" alt="...">\n  <strong class="mr-auto headings">Bootstrap</strong>\n  <small id="time"> less than 1 min ago</small>\n  <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">\n  <span aria-hidden="true" class="del" >&times;</span>\n</button>\n</div>\n<a href="#">\n  <div class="toast-body"></div>\n</a>\n</div>\n';let p=0;var c;function l(e){let t=e.currentTarget.getAttribute("data-id");const n=document.getElementById(t);t=parseInt(t,10),m(t),n.remove()}function m(e){r=window.sessionStorage.getItem("theIssuerNotis"),r=JSON.parse(r),r=r.filter(t=>t.id!==e),r=JSON.stringify(r),window.sessionStorage.setItem("theIssuerNotis",r),window.sessionStorage.setItem("theIssuerId",i),p--,a.textContent=0===p?"":p}let g;r&&(r=JSON.parse(r),r.length>0&&(p=(c=r).length,c.forEach(e=>{const t=u.cloneNode(!0);t.className+=" space";const n=t.querySelector(".toast-body"),o=t.querySelector(".headings"),s=t.querySelector(".img"),r=t.querySelector(".del"),i=document.createElement("span"),c=document.createElement("label");t.setAttribute("id",e.id),i.className="font-weight-bold";const m=i.cloneNode(!0),g=t.querySelector("a");g.setAttribute("href",e.url),g.setAttribute("data-id",e.id),a.textContent=0===p?"":p,"edited"===e.type?"issue"===e.notisType?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),i.textContent=`${e.author} `,n.append(i),c.textContent=" edited an issue name on ",n.append(c),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Issue edited"):(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),i.textContent=`${e.author} `,n.append(i),c.textContent=" edited a comment on ",n.append(c),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Comment edited"):"created"===e.type?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),i.textContent=`${e.author} `,n.append(i),c.textContent=" created a new comment on ",n.append(c),m.textContent=` ${e.repo}`,n.append(m),o.textContent="New Comment"):"deleted"===e.type?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),i.textContent=`${e.author} `,n.append(i),c.textContent=" deleted a comment on ",n.append(c),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Comment deleted"):"reopened"===e.type?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),i.textContent=`${e.author} `,n.append(i),c.textContent=" reopened an issue on ",n.append(c),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Issue reopened"):"opened"===e.type?(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),i.textContent=`${e.author} `,n.append(i),c.textContent=" created a new issue on ",n.append(c),m.textContent=` ${e.repo}`,n.append(m),o.textContent="New issue"):"closed"===e.type&&(r.setAttribute("data-id",e.id),s.setAttribute("src",e.img),i.textContent=`${e.author} `,n.append(i),c.textContent=" closed an issue on ",n.append(c),m.textContent=` ${e.repo}`,n.append(m),o.textContent="Issue closed"),window.$(r).click(l),window.$(g).click(l),d.append(t)}))),i=i?parseInt(i,10):0,s.on("issue_comment",e=>{r=window.sessionStorage.getItem("theIssuerNotis"),r=r?JSON.parse(r):[];const t={};p++,i++;const n=u.cloneNode(!0);n.className+=" space",n.setAttribute("id",i);const s=n.querySelector(".toast-body"),c=n.querySelector(".headings"),m=document.createElement("span"),g=n.querySelector("a");let y;n.style.order=-1*p,g.setAttribute("data-id",i),e.organization?(y=`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.issue.number}/${e.repository.name}/comments`,g.setAttribute("href",`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.issue.number}/${e.repository.name}/comments`)):(y=`/${e.sender.login}/repo/issues/${e.issue.number}/${e.repository.name}/comments`,g.setAttribute("href",`/${e.sender.login}/repo/issues/${e.issue.number}/${e.repository.name}/comments`));const C=document.createElement("label");m.className="font-weight-bold";const b=m.cloneNode(!0),x=n.querySelector(".img"),w=n.querySelector(".del");w.setAttribute("data-id",i),g.setAttribute("data-id",i),x.setAttribute("src",e.sender.avatar_url),a.textContent=p,"deleted"===e.action?(m.textContent=`${e.sender.login} `,s.append(m),C.textContent=" deleted a comment on ",s.append(C),b.textContent=` ${e.repository.full_name}`,s.append(b),c.textContent="Comment Deleted"):"edited"===e.action?(m.textContent=`${e.sender.login} `,s.append(m),C.textContent=" edited an issue comment on ",s.append(C),b.textContent=` ${e.repository.full_name}`,s.append(b),c.textContent="Comment Edited"):"created"===e.action&&(m.textContent=`${e.sender.login} `,s.append(m),C.textContent=" created a new comment on ",s.append(C),b.textContent=` ${e.repository.full_name}`,s.append(b),c.textContent="New Comment"),t.type=e.action,t.author=e.sender.login,t.heading=c.textContent,t.body=C.textContent,t.img=e.sender.avatar_url,t.repo=e.repository.full_name,t.id=i,t.url=y,document.hidden&&o(c.textContent,`${m.textContent}${C.textContent}${b.textContent}`,e.sender.avatar_url,y),d.append(n),r.push(t),r=JSON.stringify(r),window.sessionStorage.setItem("theIssuerNotis",r),window.sessionStorage.setItem("theIssuerId",i),window.$(w).click(l),window.$(g).click(l)}),s.on("issues",(function(e){r=window.sessionStorage.getItem("theIssuerNotis"),r=r?JSON.parse(r):[];const t={};p++,i++;const n=u.cloneNode(!0);n.className+=" space";const s=n.querySelector(".toast-body"),c=n.querySelector(".headings"),m=n.querySelector(".img"),g=n.querySelector(".del"),y=n.querySelector("a");let C;n.style.order=-1*p,y.setAttribute("data-id",i),e.organization?(C=`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.repository.name}/`,y.setAttribute("href",`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.repository.name}/`)):(C=`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.repository.name}`,y.setAttribute("href",`/${e.sender.login}/repo/${e.repository.owner.login}/issues/${e.repository.name}`));const b=document.createElement("span"),x=document.createElement("label");b.className="font-weight-bold";const w=b.cloneNode(!0);y.setAttribute("data-id",i),g.setAttribute("data-id",i),m.setAttribute("src",e.sender.avatar_url),a.textContent=p,"edited"===e.action?(b.textContent=`${e.sender.login} `,s.append(b),x.textContent=" edited an issue name on ",s.append(x),w.textContent=` ${e.repository.full_name}`,s.append(w),c.textContent="Issue edited"):"closed"===e.action?(b.textContent=`${e.sender.login} `,s.append(b),x.textContent=" closed an issue on ",s.append(x),w.textContent=` ${e.repository.full_name}`,s.append(w),c.textContent="Issue closed"):"reopened"===e.action?(b.textContent=`${e.sender.login} `,s.append(b),x.textContent=" reopened an issue on ",s.append(x),w.textContent=` ${e.repository.full_name}`,s.append(w),c.textContent="Issue reopened"):"opened"===e.action&&(b.textContent=`${e.sender.login} `,s.append(b),x.textContent=" created a new issue on ",s.append(x),w.textContent=` ${e.repository.full_name}`,s.append(w),c.textContent="New issue"),t.type=e.action,t.author=e.sender.login,t.heading=c.textContent,t.body=x.textContent,t.img=e.sender.avatar_url,t.id=i,t.repo=e.repository.full_name,t.notisType="issue",t.url=C,r.push(t),r=JSON.stringify(r),window.sessionStorage.setItem("theIssuerNotis",r),window.sessionStorage.setItem("theIssuerId",i),window.$(g).click(l),window.$(y).click(l),d.append(n),document.hidden&&o(c.textContent,`${b.textContent}${x.textContent}${w.textContent}`,e.sender.avatar_url,C)})),window.addEventListener("beforeunload",(function(e){s.disconnect()})),s.emit("token"),s.on("token",(function(e){g=e})),window.$(".toggle").change((function(e){const t=e.target;!function(e,t,n="post"){const o=document.createElement("form"),s=document.createElement("input");s.setAttribute("type","hidden"),s.setAttribute("name","_csrf"),s.setAttribute("value",g),o.append(s),o.method=n,o.action=e;for(const e in t)if(e in t){const n=document.createElement("input");n.type="hidden",n.name=e,n.value=t[e],o.appendChild(n)}document.body.appendChild(o),o.submit()}("/toggleHook/",{repo:t.getAttribute("data-name"),type:t.getAttribute("data-type")}),t.setAttribute("disabled","true")}))}]);