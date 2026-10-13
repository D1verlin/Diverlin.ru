import wsaIcon from '../assets/WSA.svg';
import bookmarksHubIcon from '../assets/Bookmarks Hub.svg';
import crtOverlayIcon from '../assets/CRT Overlay.svg';
import sdfIcon from '../assets/SDF.svg';
import dnsManagerIcon from '../assets/DNS Manager.svg';
import fileConverterShellIcon from '../assets/FileConverterShell.svg';
import divLauncherIcon from '../assets/DivLauncher.svg';
import vortexIcon from '../assets/Vortex-K06-Configurator.svg';
import ytDlpIcon from '../assets/YT-DLPClient.svg';
import CLIcon from '../assets/CheckLister.svg';
import proxyRouterIcon from '../assets/Proxy Router.svg';

export const backgrounds = [
    "https://r2.diverlin.ru/Assets/Wallpaper/sakura-forest-minecraft.1920x1080_web.webm",
    "https://r2.diverlin.ru/Assets/Wallpaper/raindrops-minecraft.1920x1080_web.webm",
    "https://r2.diverlin.ru/Assets/Wallpaper/Loop%20Background%20%EF%BD%9C%20Live%20Wallpaper%20%EF%BD%9C%20Chilling%20Cat%20%EF%BD%9C%20No%20Sound_web.webm",
    "https://r2.diverlin.ru/Assets/Wallpaper/Cherry%20Blossom%20House%20%EF%BD%9C%20Minecraft%20%EF%BD%9C%20Wallpaper%20In%204K%20%EF%BD%9C%20Live%20Wallpaper_web.webm"
];

export const playlist = [{
        title: "Boa",
        author: "Duvet",
        src: "https://r2.diverlin.ru/Music/Music/boa%20-%20Duvet.mp3",
        cover: "https://r2.diverlin.ru/Music/Cover/Duvet-%20BOA.jpg"
    },
    {
        title: "Show Me How",
        author: "Men I Trust",
        src: "https://r2.diverlin.ru/Music/Music/Men%20I%20Trust%20-%20Show%20Me%20How.mp3",
        cover: "https://r2.diverlin.ru/Music/Cover/Men%20I%20Trust%20-%20Show%20Me%20How.jpg"
    },
    {
        title: "Never",
        author: "Mag.Lo",
        src: "https://r2.diverlin.ru/Music/Music/NEVER%20feat.%20O_Super.mp3",
        cover: "https://r2.diverlin.ru/Music/Cover/NEVER.jpg"
    },
    {
        title: "Rolling Stoner",
        author: "Thomas Mraz",
        src: "https://r2.diverlin.ru/Music/Music/Rolling%20Stoner.mp3",
        cover: "https://r2.diverlin.ru/Music/Cover/Rolling%20Stoner.png"
    }
];

export const projectsList = [
    {
        color: "#86edff",
        title: "WSA",
        descKey: "projWsaDesc",
        date: "12.06.2023",
        tags: ["HTML", "CSS", "JS"],
        website: "https://wsa.diverlin.ru",
        github: "https://github.com/D1verlin/WSA",
        icon: wsaIcon
    },
    {
        color: "#d06bff",
        title: "Bookmarks Hub",
        descKey: "projBhDesc",
        date: "17.06.2025",
        tags: ["React", "JSON"],
        website: "https://bh.diverlin.ru",
        github: "https://github.com/D1verlin/Bookmarks-Hub",
        icon: bookmarksHubIcon
    },
    {
        color: "#54e460",
        title: "CRT Overlay",
        descKey: "projCrtDesc",
        date: "06.10.2025",
        tags: ["Python", "PyQt6", "PySide6"],
        github: "https://github.com/D1verlin/desktop-crt-overlay",
        icon: crtOverlayIcon
    },
    {
        color: "#ff7070",
        title: "SDF",
        descKey: "projSdfDesc",
        date: "17.02.2026",
        tags: ["Node.js", "Express", "Sqlite"],
        website: "https://sdf.diverlin.ru",
        github: "https://github.com/D1verlin/ShareDataFragments",
        icon: sdfIcon
    },
    {
        color: "#85ffae",
        title: "DNS Manager",
        descKey: "projDnsDesc",
        date: "31.05.2026",
        tags: ["PowerShell", ".NET"],
        github: "https://github.com/D1verlin/DNS-Manager",
        icon: dnsManagerIcon,
        screenshots: [
            "https://r2.diverlin.ru/Assets/Screenshots/dns_manager_1.webp"
        ]
    },
    {
        color: "#4789d4",
        title: "FileConverterShell",
        descKey: "projFCSDesc",
        date: "14.06.2026",
        tags: ["Powershell", "NWScript", "FFmpeg"],
        github: "https://github.com/D1verlin/FileConverterShell",
        icon: fileConverterShellIcon
    },
    {
        color: "#7c97ee",
        title: "DivLauncher",
        descKey: "projDLDesc",
        date: "21.03.2026",
        tags: ["Electron", "Node.js", "React", "Axios"],
        website: "https://d1verlin.github.io/DivLauncher",
        github: "https://github.com/D1verlin/DivLauncher",
        icon: divLauncherIcon,
        screenshots: [
          "https://r2.diverlin.ru/Assets/Screenshots/divlauncher_1.webp",
          "https://r2.diverlin.ru/Assets/Screenshots/divlauncher_2.webp",
          "https://r2.diverlin.ru/Assets/Screenshots/divlauncher_3.webp"
        ]
    },
    {
        color: "#da7397",
        title: "Vortex-K06-Configurator",
        descKey: "projVkCDesc",
        date: "10.07.2026",
        tags: ["Python", "AutoHotkey"],
        github: "https://github.com/D1verlin/Vortex-K06-Configurator",
        icon: vortexIcon,
        screenshots: [
          "https://r2.diverlin.ru/Assets/Screenshots/VortexK06_1.webp"
        ]
    },
    {
        color: "#dbdada",
        title: "YT-DLP Client",
        descKey: "projYtDlpDesc",
        date: "07.09.2026",
        tags: ["Electron", "Node.js", "FFmpeg"],
        github: "https://github.com/D1verlin/YT-DLP-Client",
        icon: ytDlpIcon,
        screenshots: [
          "https://r2.diverlin.ru/Assets/Screenshots/ytdlp_1.webp",
          "https://r2.diverlin.ru/Assets/Screenshots/ytdlp_2.webp",
          "https://r2.diverlin.ru/Assets/Screenshots/ytdlp_3.webp"
        ]
    },
    {
        color: "#DF8DC6",
        title: "CheckLister",
        descKey: "projCLDesc",
        date: "22.09.2026",
        tags: ["Electron", "TypeScript", "React"],
        github: "https://github.com/D1verlin/Checklister",
        icon: CLIcon,
        screenshots: [
          "https://r2.diverlin.ru/Assets/Screenshots/CheckLister_1.webp",
          "https://r2.diverlin.ru/Assets/Screenshots/CheckLister_2.webp"
        ]
    },
    {
        color: "#A3BED7",
        title: "Proxy Router Desktop",
        descKey: "projPrdDesc",
        date: "11.10.2026",
        tags: ["Tauri", "Rust", "React"],
        github: "https://github.com/D1verlin/ProxyRouterDesktop",
        icon: proxyRouterIcon,
        screenshots: [
            "https://r2.diverlin.ru/Assets/Screenshots/proxyrouter_1.webp",
            "https://r2.diverlin.ru/Assets/Screenshots/proxyrouter_2.webp",
            "https://r2.diverlin.ru/Assets/Screenshots/proxyrouter_3.webp",
            "https://r2.diverlin.ru/Assets/Screenshots/proxyrouter_4.webp",
            "https://r2.diverlin.ru/Assets/Screenshots/proxyrouter_5.webp",
        ]
    }
];