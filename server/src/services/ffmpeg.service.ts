import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export const convertToHLS = (inputFilePath: string, outputDir: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPlaylistPath = path.join(outputDir, "index.m3u8");

    ffmpeg(inputFilePath)
      .outputOptions([
        "-profile:v baseline",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls",
      ])
      .output(outputPlaylistPath)
      .on("end", () => {
        console.log("HLS conversion finished successfully");
        resolve(outputPlaylistPath);
      })
      .on("error", (err) => {
        console.error("Error during HLS conversion:", err);
        reject(err);
      })
      .run();
  });
};
