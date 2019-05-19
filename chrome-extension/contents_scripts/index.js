// Content Scripts ~> Background
const port = chrome.runtime.connect()

port.onMessage.addListener(message => {
    console.log('message', message)
    // if (msg.question == "Who's there?") port.postMessage({ answer: 'Madame' })
    // else if (msg.question == 'Madame who?') port.postMessage({ answer: 'Madame... Bovary' })
})

chrome.runtime.onMessage.addListener(function(message) {
    console.log('!!!!!!!"', message)
})
window.addEventListener('message', e => {
    console.log(`[extention content script]`, e)
    let { command } = e.data

    port.postMessage({ command })

    chrome.runtime.sendMessage({ command: 'START_RECORD' }, res => {
        console.log(res)
    })

    // if (command === 'START_RECORD') {
    //     chrome.runtime.sendMessage({ command: 'START_RECORD' }, res => {
    //         console.log(res)
    //     })
    // }
})
