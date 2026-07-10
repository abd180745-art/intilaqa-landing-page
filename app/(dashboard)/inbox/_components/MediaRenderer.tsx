import { useEffect, useState } from "react";

export const MediaRenderer = ({ msg, apiKey, baseUrl, instance }: any) => {
    const [mediaData, setMediaData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const mediaObj = msg.message?.imageMessage || msg.message?.audioMessage || msg.message?.videoMessage || msg.message?.documentMessage || msg.message?.stickerMessage;
    const mediaType = msg.message?.imageMessage ? 'image' : 
                      msg.message?.audioMessage ? 'audio' : 
                      msg.message?.videoMessage ? 'video' : 
                      msg.message?.documentMessage ? 'document' : 
                      msg.message?.stickerMessage ? 'sticker' : 'unknown';

    const loadMedia = async () => {
        if (!mediaObj?.mediaKey) return;
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`${baseUrl}/chat/getBase64FromMediaMessage/${instance}`, {
                method: 'POST',
                headers: { 'apikey': apiKey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });
            const data = await res.json();
            if (data.base64) {
                setMediaData({ base64: data.base64, mimetype: mediaObj.mimetype });
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (mediaType === 'image' || mediaType === 'sticker' || mediaType === 'audio') {
            loadMedia();
        }
    }, [mediaType]);

    if (!mediaObj) return <span className="text-zinc-500 italic">[رسالة وسائط غير مدعومة]</span>;

    if (loading) return <div className="p-4 flex justify-center"><div className="animate-spin h-5 w-5 border-b-2 border-orange-500 rounded-full"></div></div>;

    if (error) return (
        <div className="p-2 border border-red-200 bg-red-50 text-red-500 text-xs rounded flex flex-col items-center">
            <span>فشل تحميل الوسائط</span>
            <button onClick={loadMedia} className="underline mt-1 font-bold">إعادة المحاولة</button>
        </div>
    );

    if (!mediaData) {
        return (
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-between gap-3">
                <span className="text-sm truncate max-w-[150px] text-zinc-700 dark:text-zinc-300">{mediaObj.fileName || `ملف ${mediaType}`}</span>
                <button onClick={loadMedia} className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
            </div>
        );
    }

    const src = `data:${mediaData.mimetype};base64,${mediaData.base64}`;

    if (mediaType === 'image' || mediaType === 'sticker') {
        return <img src={src} className="max-w-[250px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(src)} />;
    }

    if (mediaType === 'audio') {
        return <audio controls src={src} className="max-w-[250px] min-w-[200px]" />;
    }

    if (mediaType === 'video') {
        return <video controls src={src} className="max-w-[250px] rounded-lg" />;
    }

    return (
        <a href={src} download={mediaObj.fileName || "document"} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-between gap-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-black dark:text-white">
            <span className="text-sm truncate max-w-[150px]">{mediaObj.fileName || "تنزيل الملف"}</span>
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </a>
    );
};
