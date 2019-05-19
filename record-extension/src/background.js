console.log('background')
chrome.runtime.onConnect.addListener(port => {
    console.log(`extension is running`, port)

    port.onMessage.addListener(message => {
        console.log('으으으응')
        captureCamera(cameraStream => {})

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
                console.log(`[extension background tab capture stream]`, stream)

                chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                    // chrome.tabs.sendMessage(tabs[0].id, {
                    //     command: 'STREAM_FROM_TAB_CAPTURE',
                    //     stream
                    // })
                })
                // notifyToContentScripts({
                //     command: 'STREAM_FROM_TAB_CAPTURE',
                //     stream
                // })
            })
        })
    })
})

function captureCamera(callback) {
    const constraints = {
        video: true,
        audio: true
    }
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            console.log('성공', stream)
            // initVideoPlayer(stream);
            // callback(stream);

            // if (enableCamera && !enableScreen && openCameraPreviewDuringRecording) {
            //     var win = window.open("video.html", "_blank", "top=0,left=0,width=" + screen.width + ",height=" + screen.height);

            //     var timer = setInterval(function() {
            //         if (win.closed) {
            //             clearInterval(timer);
            //             stopScreenRecording();
            //         }
            //     }, 1000);
            // }
        })
        .catch(function(error) {
            console.log('실패')
            //     if(!defaultDevices) {
            //         // retry with default devices
            //         captureCamera(callback, true);
            //         return;
            //     }

            //     false && chrome.tabs.create({
            //         url: 'camera-mic.html'
            //     });

            var popup_width = screen.width - parseInt(screen.width / 3)
            var popup_height = screen.height - parseInt(screen.height / 3)
            chrome.windows.create({
                url: 'src/html/camera-mic.html',
                type: 'popup',
                width: popup_width,
                height: popup_height,
                top: parseInt(screen.height / 2 - popup_height / 2),
                left: parseInt(screen.width / 2 - popup_width / 2),
                focused: true
            })

            //     // setDefaults();
        })
}
