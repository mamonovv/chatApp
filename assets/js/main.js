const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

//Get username and room form URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

//Join chat room
socket.emit('joinRoom', {username, room})

//Message from server
socket.on('message', message => {
    outputMessage(message)

    chatMessages.scrollTop = chatMessages.scrollHeight
})

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', msg)

    //Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

function outputMessage(data) {

    //Create elements
    const div = document.createElement('div')
    const meta = document.createElement('p')
    const text = document.createElement('p')

    //Add classes to elements
    div.classList.add('message')
    meta.classList.add('meta')
    text.classList.add('text')

    //Add values to elements
    meta.innerHTML = `${data.name} <span>${data.time}</span>`
    text.innerHTML = data.msg

    //Append elements
    div.append(meta)
    div.append(text)
    chatMessages.append(div)
}