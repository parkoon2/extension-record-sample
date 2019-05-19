console.log('messaging')
// Content Scripts ~> Background
const runtimePort = chrome.runtime.connect()

// port.onMessage.addListener(message => {
//     console.log('message', message)
// })

window.addEventListener('message', e => {
    console.log(`[extention content script]`, e)
    let { command } = e.data

    if (command === 'START_RECORD') {
        console.log('start recording...')
        runtimePort.postMessage({ command })
    }

    // chrome.runtime.sendMessage({ command: 'START_RECORD' }, res => {
    //     console.log(res)
    // })
})
