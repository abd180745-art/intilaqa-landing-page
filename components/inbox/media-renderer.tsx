"use client";
import { useEffect, useState } from "react";
import { getMediaFromIDB, saveMediaToIDB } from "@/lib/media-cache";

export const MediaRenderer = ({ mediaObj, apiKey, baseUrl, instance }: { mediaObj: any, apiKey: string, baseUrl: string, instance: string }) => {
    const [mediaData, setMediaData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const mediaType = mediaObj?.imageMessage ? 'image' : 
                      mediaObj?.audioMessage ? 'audio' : 
                      mediaObj?.videoMessage ? 'video' : 
                      mediaObj?.documentMessage ? 'document' : 
                      mediaObj?.stickerMessage ? 'sticker' : 'unknown';

    const loadMedia = async () => {
        if (!mediaObj?.mediaKey) return;
        
        const cacheKey = mediaObj.mediaKey;
        const cached = await getMediaFromIDB(cacheKey);
        if (cached) {
            setMediaData(cached);
            return;
        }

        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`${baseUrl}/chat/getBase64FromMediaMessage/${instance}`, {
                method: 'POST',
                headers: { 'apikey': apiKey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: { message: mediaObj } }) // Wrap it properly
            });
            const data = await res.json();
            if (data.base64) {
                const finalData = { base64: data.base64, mimetype: mediaObj.mimetype };
                setMediaData(finalData);
                saveMediaToIDB(cacheKey, finalData);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (mediaType === 'image' || mediaType === 'sticker' || mediaType === 'audio' || mediaType === 'video' || mediaType === 'document') {
            loadMedia();
        }
    }, [mediaObj]);

    if (loading && !mediaData) {
        return (
            <div className="flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg min-w-[200px] min-h-[100px]">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !mediaData) {
        return (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-sm border border-red-100 dark:border-red-800">
                تعذر تحميل المرفق
                <button onClick={loadMedia} className="mr-2 underline text-xs">إعادة المحاولة</button>
            </div>
        );
    }

    const src = `data:${mediaData.mimetype};base64,${mediaData.base64}`;

    if (mediaType === 'image' || mediaType === 'sticker') {
        return <img src={src} className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(src)} />;
    }

    if (mediaType === 'audio') {
        return <audio controls src={src} className="max-w-[250px] min-w-[200px] w-full" />;
    }

    if (mediaType === 'video') {
        return <video controls src={src} className="max-w-full rounded-lg" />;
    }

    return (
        <a href={src} download={mediaObj.fileName || "document"} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-between gap-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-black dark:text-white">
            <span className="text-sm truncate max-w-[150px]">{mediaObj.fileName || "تنزيل الملف"}</span>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </a>
    );
};
