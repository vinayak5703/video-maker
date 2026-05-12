const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static');
const path = require('path');
const fs = require('fs');

// Set Paths
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

// --- HELPER: Get Random Text Color ---
const getRandomColor = () => {
    const colors = ['white', 'yellow', 'cyan', 'lime', 'magenta'];
    return colors[Math.floor(Math.random() * colors.length)];
};

// --- HELPER: Process Single Image to Clip ---
const createClipFromImage = (imagePath, tempOutputPath, duration, textChunk, fontPath) => {
    return new Promise((resolve, reject) => {
        
        // Clean Text
        const sanitizedText = (textChunk || "").replace(/:/g, '\\:').replace(/'/g, '');
        const textColor = getRandomColor();
        
        // Dynamic Text Filter (Bottom Center for Reels Vibe)
        // box=1: Add background box for better visibility
        const drawText = sanitizedText && fs.existsSync(fontPath) 
            ? `,drawtext=fontfile='${fontPath.replace(/\\/g, '/')}':text='${sanitizedText}':fontcolor=${textColor}:fontsize=70:x=(w-text_w)/2:y=h-250:box=1:boxcolor=black@0.5:boxborderw=20` 
            : '';

        // Random Zoom Intensity (Thoda alag effect har baar)
        const zoomSpeed = 0.0015 + (Math.random() * 0.0010); // Random between 0.0015 and 0.0025

        ffmpeg(imagePath)
            .inputOptions([`-loop 1`, `-t ${duration}`])
            .outputOptions([
                '-c:v libx264',
                '-pix_fmt yuv420p',
                // Filter: Scale HD -> Random Zoom -> Add Text -> Fix FPS
                `-vf scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1,zoompan=z='min(zoom+${zoomSpeed},1.5)':d=${duration*25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=720x1280${drawText},fps=25`, 
                '-t', duration,
                '-movflags +faststart'
            ])
            .save(tempOutputPath)
            .on('end', () => resolve(tempOutputPath))
            .on('error', (err) => {
                console.error(`❌ Error processing image ${imagePath}:`, err.message);
                reject(err);
            });
    });
};

// --- HELPER: Process Single Video to Clip ---
const createClipFromVideo = (videoPath, tempOutputPath, duration, textChunk, fontPath) => {
    return new Promise((resolve, reject) => {
        
        const sanitizedText = (textChunk || "").replace(/:/g, '\\:').replace(/'/g, '');
        const textColor = getRandomColor();

        const drawText = sanitizedText && fs.existsSync(fontPath) 
            ? `,drawtext=fontfile='${fontPath.replace(/\\/g, '/')}':text='${sanitizedText}':fontcolor=${textColor}:fontsize=70:x=(w-text_w)/2:y=h-250:box=1:boxcolor=black@0.5:boxborderw=20` 
            : '';

        ffmpeg(videoPath)
            .outputOptions([
                '-c:v libx264',
                '-pix_fmt yuv420p',
                // Filter: Scale HD -> Add Text -> Fix FPS
                `-vf scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1${drawText},fps=25`, 
                '-t', duration, 
                '-an', // Remove Audio
                '-movflags +faststart'
            ])
            .save(tempOutputPath)
            .on('end', () => resolve(tempOutputPath))
            .on('error', (err) => {
                console.error(`❌ Error processing video ${videoPath}:`, err.message);
                reject(err);
            });
    });
};

// --- HELPER: Merge All Clips ---
const mergeClips = (clipPaths, finalOutputPath) => {
    return new Promise((resolve, reject) => {
        let command = ffmpeg();

        clipPaths.forEach(clip => command.input(clip));

        const filter = `concat=n=${clipPaths.length}:v=1:a=0`;

        command
            .complexFilter(filter)
            .outputOptions([
                '-c:v libx264',
                '-pix_fmt yuv420p',
                '-preset ultrafast',
                '-movflags +faststart'
            ])
            .save(finalOutputPath)
            .on('start', () => console.log("🔗 Merging Clips..."))
            .on('end', () => resolve(finalOutputPath))
            .on('error', (err) => {
                console.error("❌ Merge Error:", err.message);
                reject(err);
            });
    });
};

exports.createVideo = async (images, videos, text, outputFileName) => {
    console.log("🎬 Starting Storyteller Processor...");

    const outputPath = path.join(__dirname, 'uploads', outputFileName);
    const tempFolder = path.join(__dirname, 'temp');
    const fontPath = path.join(__dirname, 'fonts', 'bold.ttf');

    if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

    // 1. Text Splitting Logic (The Magic Part)
    // "Happy Birthday Santosh" -> ["Happy", "Birthday", "Santosh"]
    let textWords = (text || "Memories").split(' ').filter(w => w.length > 0);
    if (textWords.length === 0) textWords = ["Magic", "Moments"];

    // 2. Combine Inputs (Images first, then videos)
    const allInputs = [...images.map(p => ({type:'img', path:p})), ...videos.map(p => ({type:'vid', path:p}))];
    
    // 3. Settings
    const CLIP_DURATION = 2.5; // Fast cuts (Reels style)
    const tempClips = [];

    try {
        // 4. Process Inputs Step-by-Step
        for (let i = 0; i < allInputs.length; i++) {
            const input = allInputs[i];
            const tempName = path.join(tempFolder, `part_${Date.now()}_${i}.mp4`);
            
            // Assign a word to this clip (Loop if words run out)
            const wordForThisClip = textWords[i % textWords.length];

            console.log(`Processing Clip ${i+1}/${allInputs.length} [Text: ${wordForThisClip}]...`);

            if (input.type === 'img') {
                await createClipFromImage(input.path, tempName, CLIP_DURATION, wordForThisClip, fontPath);
            } else {
                await createClipFromVideo(input.path, tempName, CLIP_DURATION, wordForThisClip, fontPath);
            }
            tempClips.push(tempName);
        }

        // 5. Merge
        await mergeClips(tempClips, outputPath);

        console.log("✅ Final Story Video Ready!");

        // Cleanup
        setTimeout(() => {
            tempClips.forEach(f => { if(fs.existsSync(f)) fs.unlinkSync(f) });
            allInputs.forEach(f => { if(fs.existsSync(f.path)) fs.unlinkSync(f.path) });
        }, 2000);

        return outputPath;

    } catch (error) {
        console.error("🔥 Critical Error:", error);
        throw error;
    }
};