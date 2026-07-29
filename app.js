async function fetchFile(file){
  return new Uint8Array(await file.arrayBuffer());
}
const { FFmpeg } = FFmpegWASM;

const ffmpeg = new FFmpeg();
let isLoaded = false;

ffmpeg.on("log", ({ message }) => {

    console.log(message);

    const log = document.getElementById("log");

    if(log){

        log.textContent += message + "\n";

        log.scrollTop = log.scrollHeight;

    }

});

ffmpeg.on("progress", ({ progress })=>{

    const percent=Math.round(progress*100);

    const bar=document.getElementById("progress");

    if(bar){

        bar.value=percent;

    }

    status.innerText=
    "กำลังบีบอัด... "+percent+"%";

});
const video = document.getElementById("video");
const start = document.getElementById("start");
const status = document.getElementById("status");

start.onclick = async () => {

  if (!video.files.length) {
    alert("เลือกไฟล์ก่อน");
    return;
  }

  if (!isLoaded) {

    status.innerText = "กำลังโหลด FFmpeg...";

    await ffmpeg.load({

        coreURL: "./ffmpeg/ffmpeg-core.js",

        wasmURL: "./ffmpeg/ffmpeg-core.wasm",

        workerURL: "./ffmpeg/ffmpeg-core.worker.js"

    });

    isLoaded = true;

}

  const file = video.files[0];

  await ffmpeg.writeFile(
    "input.mp4",
    await fetchFile(file)
  );

  status.innerText = "กำลังบีบอัด...";

  await ffmpeg.exec([
"-i","input.mp4",

"-c:v","libx264",

"-preset","slow",

"-crf","18",

"-pix_fmt","yuv420p",

"-profile:v","high",

"-level","4.2",

"-movflags","+faststart",

"-c:a","aac",

"-b:a","192k",

"-ar","48000",

"output.mp4"
]);
  

  const data =
    await ffmpeg.readFile("output.mp4");

  const url =
    URL.createObjectURL(
      new Blob([data.buffer],
      {type:"video/mp4"})
    );

  const a=document.createElement("a");
  a.href=url;
  a.download="tiktok_hq.mp4";
  a.click();

  status.innerText="เสร็จแล้ว";

};
