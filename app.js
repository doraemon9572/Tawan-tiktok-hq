alert("app.js โหลดแล้ว");

async function fetchFile(file) {
    return new Uint8Array(await file.arrayBuffer());
}

const { FFmpeg } = FFmpegWASM;
const { toBlobURL } = FFmpegUtil;

const ffmpeg = new FFmpeg();

let isLoaded = false;

const video = document.getElementById("video");
const start = document.getElementById("start");
const status = document.getElementById("status");


ffmpeg.on("log", ({ message }) => {

    console.log(message);

    const log = document.getElementById("log");

    if (log) {
        log.textContent += message + "\n";
        log.scrollTop = log.scrollHeight;
    }

});


ffmpeg.on("progress", ({ progress }) => {

    const percent = Math.round(progress * 100);

    const bar = document.getElementById("progress");

    if (bar) {
        bar.value = percent;
    }

    status.innerText = "กำลังบีบอัด... " + percent + "%";

});


start.onclick = async () => {

    if (!video.files.length) {

        alert("เลือกไฟล์ก่อน");

        return;
    }


    try {


        if (!isLoaded) {


            status.innerText = "กำลังโหลด FFmpeg...";

            console.log("เริ่มโหลด FFmpeg");            
            
                 const baseURL =
            "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/";

            const ffmpegBaseURL =
            "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/";
       


           await ffmpeg.load({
    coreURL: await toBlobURL(
        `${baseURL}ffmpeg-core.js`,
        "text/javascript"
    ),

    wasmURL: await toBlobURL(
        `${baseURL}ffmpeg-core.wasm`,
        "application/wasm"
    ),

    workerURL: await toBlobURL(
        `${baseURL}ffmpeg-core.worker.js`,
        "text/javascript"
    ),

    classWorkerURL: await toBlobURL(
        `${ffmpegBaseURL}814.ffmpeg.js`,
        "text/javascript"
    )
});

            
            isLoaded = true;


            console.log("FFmpeg โหลดสำเร็จ");

            status.innerText = "FFmpeg พร้อมใช้งาน";


        }


        const file = video.files[0];


        await ffmpeg.writeFile(
            "input.mp4",
            await fetchFile(file)
        );


        status.innerText = "กำลังบีบอัด...";


        await ffmpeg.exec([

            "-i",
            "input.mp4",

            "-c:v",
            "libx264",

            "-preset",
            "slow",

            "-crf",
            "18",

            "-pix_fmt",
            "yuv420p",

            "-profile:v",
            "high",

            "-level",
            "4.2",

            "-movflags",
            "+faststart",

            "-c:a",
            "aac",

            "-b:a",
            "192k",

            "-ar",
            "48000",

            "output.mp4"

        ]);


        const data = await ffmpeg.readFile("output.mp4");


        const url = URL.createObjectURL(

            new Blob(
                [data.buffer],
                { type:"video/mp4" }
            )

        );


        const a = document.createElement("a");

        a.href = url;

        a.download = "tiktok_hq.mp4";

        a.click();


        status.innerText = "เสร็จแล้ว";


    } catch (error) {

        console.error(error);

        status.innerText = "เกิดข้อผิดพลาด";

        alert(error.message);

    }

};
