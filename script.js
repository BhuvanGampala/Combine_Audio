let audioCtx;
let source1, source2;
let gainNode1, gainNode2;

async function uploadFiles() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    const formData1 = new FormData();
    formData1.append("file", file1);

    const formData2 = new FormData();
    formData2.append("file", file2);

    await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData1,
    });

    await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData2,
    });

    playAudio(file1.name, file2.name);
}

async function playAudio(file1, file2) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const url1 = `http://localhost:8000/audio/${file1}`;
    const url2 = `http://localhost:8000/audio/${file2}`;

    const buffer1 = await fetch(url1).then(res => res.arrayBuffer()).then(data => audioCtx.decodeAudioData(data));
    const buffer2 = await fetch(url2).then(res => res.arrayBuffer()).then(data => audioCtx.decodeAudioData(data));

    source1 = audioCtx.createBufferSource();
    source2 = audioCtx.createBufferSource();

    source1.buffer = buffer1;
    source2.buffer = buffer2;

    gainNode1 = audioCtx.createGain();
    gainNode2 = audioCtx.createGain();

    source1.connect(gainNode1).connect(audioCtx.destination);
    source2.connect(gainNode2).connect(audioCtx.destination);

    source1.start();
    source2.start();

    document.getElementById('volume1').addEventListener('input', e => {
        gainNode1.gain.value = e.target.value;
    });

    document.getElementById('volume2').addEventListener('input', e => {
        gainNode2.gain.value = e.target.value;
    });
}
