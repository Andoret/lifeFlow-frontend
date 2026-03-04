import { useState, useRef, useCallback, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Slider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SendIcon from "@mui/icons-material/Send";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { theme } from "../theme";
import { speechToText } from "../services/speechToText";

export interface VoiceRecorderProps {
  onTranscription?: (text: string, error?: string) => void;
  language?: string;
}

const BAR_COUNT = 7;
const SMOOTHING = 0.1;

function VolumeBars({ stream }: { stream: MediaStream | null }) {
  const [levels, setLevels] = useState<number[]>(() =>
    Array(BAR_COUNT).fill(0)
  );
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = SMOOTHING;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const bufferLength = analyser.frequencyBinCount;
    const step = Math.floor(bufferLength / BAR_COUNT);
    const prevLevels = Array(BAR_COUNT).fill(0);

    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      const next: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        const start = i * step;
        const end = Math.min(start + step, bufferLength);
        for (let j = start; j < end; j++) sum += dataArray[j];
        const raw = (sum / (end - start)) / 255;
        const smoothed = prevLevels[i] * SMOOTHING + raw * (1 - SMOOTHING);
        prevLevels[i] = smoothed;
        next.push(Math.min(1, smoothed * 2));
      }
      setLevels([...next]);
      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
    analyserRef.current = analyser;
    audioContextRef.current = audioContext;

    return () => {
      cancelAnimationFrame(animationRef.current);
      try {
        audioContext.close();
      } catch (_) {}
      analyserRef.current = null;
      audioContextRef.current = null;
    };
  }, [stream]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        height: 56,
      }}
    >
      {levels.map((level, i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.secondary.main,
            opacity: 0.4,
            alignSelf: "flex-end",
            transformOrigin: "bottom",
            transition: "height 0.05s ease-out",
            height: `${Math.max(4, level * 48)}px`,
          }}
        />
      ))}
    </Box>
  );
}

function AudioPreview({
  blob,
  audioUrlRef,
  ...boxProps
}: {
  blob: Blob;
  audioUrlRef: React.MutableRefObject<string | null>;
} & React.ComponentProps<typeof Box>) {
  const [url, setUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const muiTheme = useTheme();
  const showVolumeSlider = useMediaQuery(muiTheme.breakpoints.up("sm"));

  useEffect(() => {
    const u = URL.createObjectURL(blob);
    audioUrlRef.current = u;
    setUrl(u);
    return () => {
      URL.revokeObjectURL(u);
      audioUrlRef.current = null;
    };
  }, [blob, audioUrlRef]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMetadata = () => setDuration(el.duration);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    if (el.duration) setDuration(el.duration);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [url]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else el.play();
  };

  const handleSeek = (_: Event, value: number | number[]) => {
    const v = value as number;
    const el = audioRef.current;
    if (!el || !isFinite(el.duration)) return;
    el.currentTime = (v / 100) * el.duration;
    setCurrentTime(el.currentTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (s: number) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!url) return null;
  return (
    <Box {...boxProps}>
      <audio ref={audioRef} src={url} preload="metadata" />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: theme.palette.primary.main,
          border: `1px solid ${theme.palette.secondary.main}40`,
        }}
      >
        <IconButton
          onClick={togglePlay}
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.dark,
            "&:hover": { backgroundColor: theme.palette.primary.dark, opacity: 0.9 },
            width: 44,
            height: 44,
          }}
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          {playing ? (
            <PauseIcon fontSize="medium" />
          ) : (
            <PlayArrowIcon fontSize="medium" />
          )}
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Slider
            value={duration > 0 ? progress : 0}
            onChange={handleSeek}
            size="small"
            sx={{
              color: theme.palette.secondary.main,
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
                color: theme.palette.primary.contrastText,
              },
              "& .MuiSlider-rail": { opacity: 0.5 },
              "& .MuiSlider-track": { color: theme.palette.primary.contrastText },
            }}
            aria-label="Posición"
          />
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.secondary.main,
              opacity: 0.9,
              display: "block",
              textAlign: "center",
              mt: -0.5,
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: showVolumeSlider ? 80 : 44,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setMuted((m) => !m)}
            sx={{ color: theme.palette.secondary.main, p: 0.5 }}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted || volume === 0 ? (
              <VolumeOffIcon fontSize="small" />
            ) : (
              <VolumeUpIcon fontSize="small" />
            )}
          </IconButton>
          {showVolumeSlider && (
            <Slider
              value={muted ? 0 : volume * 100}
              onChange={(_, v) => {
                const n = (v as number) / 100;
                setVolume(n);
                if (n > 0) setMuted(false);
              }}
              size="small"
              sx={{
                color: theme.palette.secondary.main,
                "& .MuiSlider-thumb": { width: 10, height: 10 },
                "& .MuiSlider-rail": { opacity: 0.5 },
              }}
              aria-label="Volumen"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function VoiceRecorder({
  onTranscription,
  language = "es",
}: VoiceRecorderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "recording" | "preview" | "processing"
  >("idle");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const userCancelledRef = useRef(false);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (userCancelledRef.current) {
          userCancelledRef.current = false;
          setStatus("idle");
          setIsRecording(false);
          setModalOpen(false);
          setRecordedBlob(null);
          return;
        }
        if (chunksRef.current.length === 0) {
          setStatus("idle");
          setIsRecording(false);
          setModalOpen(false);
          return;
        }
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        setStatus("preview");
        setIsRecording(false);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setStatus("recording");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo acceder al micrófono";
      setStatus("idle");
      setIsRecording(false);
      setModalOpen(false);
      onTranscription?.("", message);
    }
  }, [language, onTranscription]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const handleMicClick = () => {
    if (status === "processing") return;
    if (isRecording) {
      stopRecording();
    } else {
      setModalOpen(true);
      startRecording();
    }
  };

  const handleCloseModal = () => {
    if (isRecording) {
      userCancelledRef.current = true;
      stopRecording();
      return;
    }
    if (status !== "processing") {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      setRecordedBlob(null);
      setModalOpen(false);
    }
  };

  const handleSend = useCallback(async () => {
    if (!recordedBlob) return;
    setStatus("processing");
    const result = await speechToText(recordedBlob, { language });
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setRecordedBlob(null);
    setStatus("idle");
    setModalOpen(false);
    onTranscription?.(result.text, result.error);
  }, [recordedBlob, language, onTranscription]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMicClick}
        disabled={status === "processing"}
        sx={{ minWidth: 44, padding: "8px" }}
        aria-label={isRecording ? "Detener grabación" : "Grabar voz"}
      >
        {isRecording ? (
          <StopIcon sx={{ color: "white" }} />
        ) : (
          <MicIcon />
        )}
      </Button>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.primary.dark,
            borderRadius: 3,
            p: 0,
            overflow: "hidden",
          },
        }}
      >
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
         
          {status === "recording" && (
             <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
             <Typography
                 variant="h6"
                 sx={{
                   color: theme.palette.secondary.main,
                   fontWeight: 600,
                   mb: 0.5,
                 }}
               >
                 {status === "recording"
                   ? "Grabando..."
                   : status === "preview"
                     ? ""
                     : status === "processing"
                       ? "Procesando..."
                       : "Micrófono"}
               </Typography>
               <IconButton
                 size="small"
                 onClick={handleCloseModal}
                 sx={{ color: theme.palette.secondary.main }}
                 aria-label="Cerrar"
               >
                 <CloseIcon />
               </IconButton>
             </Box>
          )}
         

          <Box sx={{ textAlign: "center", mb: 2 }}>
            
            <Typography
              variant="body2"
              sx={{ color: theme.palette.secondary.main, opacity: 0.9 }}
            >
              {status === "recording"
                ? "Habla cerca del micrófono. Pulsa detener cuando termines."
                : status === "preview"
                  ? ""
                  : status === "processing"
                    ? "Convirtiendo voz a texto..."
                    : "Preparando..."}
            </Typography>
          </Box>

          {(status === "recording" || status === "processing") && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                mb: 2,
                color: theme.palette.secondary.main,
              }}
            >
              {status === "recording" && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#f44336",
                    animation: "pulse 1s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.4 },
                    },
                  }}
                />
              )}
            </Box>
          )}

          {status === "recording" && (
            <VolumeBars stream={streamRef.current} />
          )}

          {status === "recording" && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                onClick={stopRecording}
              >
                Detener grabación
              </Button>
            </Box>
          )}

          {status === "preview" && recordedBlob && (
            <Box sx={{ mt: 2 }}>
              <AudioPreview
                blob={recordedBlob}
                audioUrlRef={audioUrlRef}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{ color: theme.palette.secondary.main, borderColor: theme.palette.secondary.main }}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSend}
                >
                  <SendIcon />
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
