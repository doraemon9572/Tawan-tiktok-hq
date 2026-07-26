const video = document.getElementById("video");
const start = document.getElementById("start");
const status = document.getElementById("status");

start.onclick = async () => {

  if (!video.files.length) {
    alert("กรุณาเลือกไฟล์วิดีโอก่อน");
    return;
  }

  const file = video.files[0];

  status.innerText = "กำลังเตรียมไฟล์...";

  console.log("Input:", file.name);
  console.log("Size:", file.size);

  setTimeout(() => {
    status.innerText = 
      "พร้อมแล้ว ขั้นต่อไปจะติดตั้ง FFmpeg engine";
  }, 1000);

};
