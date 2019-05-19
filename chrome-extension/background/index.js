const notifyToContentScripts = message => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message)
    })
}

chrome.runtime.onConnect.addListener(port => {
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => console.log(stream))
        .catch(err => console.error(err))

    port.onMessage.addListener(message => {
        const { command } = message

        if (command === 'START_RECORsD') {
            const constraints = {
                video: true,
                audio: true,
                videoConstraints: {
                    mandatory: {
                        chromeMediaSource: 'tab',
                        maxWidth: 1280,
                        maxHeight: 720,
                        minWidth: 1280,
                        minHeight: 720,
                        maxFrameRate: 3,
                        minFrameRate: 1
                    }
                },
                audioConstraints: {
                    mandatory: {
                        chromeMediaSource: 'tab',
                        echoCancellation: true
                    }
                }
            }

            chrome.tabs.query({ active: true }, tab => {
                chrome.tabCapture.capture(constraints, stream => {
                    console.log(`[extension background]`, stream)

                    console.log(stream.getAudioTracks()[0])
                    port.postMessage({
                        command: 'STREAM_FROM_TAB_CAPTURE',
                        stream,
                        track: stream.getAudioTracks()[0]
                    })

                    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            command: 'STREAM_FROM_TAB_CAPTURE',
                            stream
                        })
                    })
                    // notifyToContentScripts({
                    //     command: 'STREAM_FROM_TAB_CAPTURE',
                    //     stream
                    // })
                })
            })
            return
        }
    })
})

// Content Scripts ~> Background
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    const command = req.command

    console.log(`[extension backgroun]`, command)

    if (command === 'START_RECORD') {
        const constraints = {
            video: true,
            audio: true,
            videoConstraints: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    maxWidth: 1280,
                    maxHeight: 720,
                    minWidth: 1280,
                    minHeight: 720,
                    maxFrameRate: 3,
                    minFrameRate: 1
                }
            },
            audioConstraints: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    echoCancellation: true
                }
            }
        }

        // chrome.tabs.query({ active: true }, tab => {
        chrome.tabCapture.capture(constraints, stream => {
            console.log(`[extension background]`, stream)
            sendResponse('please!!')

            console.log(stream.getAudioTracks()[0])

            // port.postMessage({
            //     command: 'STREAM_FROM_TAB_CAPTURE',
            //     stream,
            //     track: stream.getAudioTracks()[0]
            // })

            // chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            //     chrome.tabs.sendMessage(tabs[0].id, {
            //         command: 'STREAM_FROM_TAB_CAPTURE',
            //         stream
            //     })
            // })
            // notifyToContentScripts({
            //     command: 'STREAM_FROM_TAB_CAPTURE',
            //     stream
            // })
        })
        // })
        // return
    }

    if (command === 'STOP_RECORD') {
        return
    }
})
