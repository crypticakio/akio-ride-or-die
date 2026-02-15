// ===== MUSIC PLAYER FUNCTIONALITY =====
const audio = document.getElementById('music-player');
const playPauseButton = document.getElementById('play-pause-button');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBarFill = document.getElementById('progress-bar-fill');
const timeDisplay = document.getElementById('time-display');
const volumeSlider = document.getElementById('volume-slider');
const volumeBarFill = document.getElementById('volume-bar-fill');
const volumeButton = document.getElementById('volume-button');
const equalizer = document.getElementById('equalizer');
const albumArt = document.getElementById('album-art');

// Initialize autoplay
window.addEventListener('load', () => {
    audio.play().then(() => {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        equalizer.classList.remove('opacity-0');
        equalizer.classList.add('opacity-100');
        albumArt.classList.add('spinning');
    }).catch((error) => {
        console.log('Autoplay was prevented. User needs to interact first.');
    });
});

document.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().then(() => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            equalizer.classList.remove('opacity-0');
            equalizer.classList.add('opacity-100');
            albumArt.classList.add('spinning');
        }).catch(() => {});
    }
}, { once: true });

playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        equalizer.classList.remove('opacity-0');
        equalizer.classList.add('opacity-100');
        albumArt.classList.add('spinning');
    } else {
        audio.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        equalizer.classList.add('opacity-0');
        equalizer.classList.remove('opacity-100');
        albumArt.classList.remove('spinning');
    }
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBarFill.style.width = progress + '%';
    
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

progressBarContainer.addEventListener('click', (e) => {
    const rect = progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    audio.currentTime = percentage * audio.duration;
});

volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    volumeBarFill.style.width = e.target.value + '%';
    updateVolumeIcon(volume);
});

volumeButton.addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeBarFill.style.width = '0%';
    } else {
        audio.volume = 1;
        volumeSlider.value = 100;
        volumeBarFill.style.width = '100%';
    }
    updateVolumeIcon(audio.volume);
});

function updateVolumeIcon(volume) {
    const volumeIcon = volumeButton.querySelector('svg path');
    if (volume === 0) {
        volumeIcon.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
    } else if (volume < 0.5) {
        volumeIcon.setAttribute('d', 'M7 9v6h4l5 5V4l-5 5H7z');
    } else {
        volumeIcon.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
    }
}

// ===== DISCORD STATUS FUNCTIONALITY =====
const DISCORD_ID = '681474898790580226'; 

async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            const userData = data.data;
            const { discord_status, activities, discord_user } = userData;
            
            updateAvatar(discord_user);
            updateStatusUI(discord_status, activities);
            updateAvatarDecoration(discord_user);
        }
    } catch (error) {
        console.error("Error fetching Discord status:", error);
    }
}

function updateAvatar(discord_user) {
    if (!discord_user) return;
    
    const usernameDisplay = document.getElementById('username-display');
    if (discord_user.global_name) {
        usernameDisplay.textContent = discord_user.global_name.toUpperCase();
    } else if (discord_user.username) {
        usernameDisplay.textContent = discord_user.username.toUpperCase();
    }
    
    if (discord_user.id && discord_user.avatar) {
        const avatarImg = document.getElementById('avatar-img');
        const avatarExtension = discord_user.avatar.startsWith('a_') ? 'gif' : 'png';
        const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.${avatarExtension}?size=256`;
        avatarImg.src = avatarUrl;
    }
}

function updateAvatarDecoration(discord_user) {
    const decorationContainer = document.getElementById('avatar-decoration-container');
    if (!discord_user || !discord_user.avatar_decoration_data) {
        decorationContainer.innerHTML = '';
        return;
    }
    
    const { asset } = discord_user.avatar_decoration_data;
    if (asset) {
        const decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=160&passthrough=true`;
        decorationContainer.innerHTML = `<img src="${decorationUrl}" alt="Avatar Decoration" class="avatar-decoration">`;
    }
}

function updateStatusUI(status, activities) {
    const badge = document.getElementById('discord-badge');
    const text = document.getElementById('discord-text');
    
    const statusColors = {
        online: 'bg-green-500',
        idle: 'bg-yellow-500',
        dnd: 'bg-red-500',
        offline: 'bg-gray-500'
    };

    badge.className = `absolute bottom-2 right-2 w-7 h-7 rounded-full border-4 border-black ${statusColors[status] || 'bg-gray-500'} glow-orange`;
    
    let activityText = "";
    if (activities && activities.length > 0) {
        const vscode = activities.find(act => act.name === 'Visual Studio Code');
        if (vscode) {
            activityText = `Coding: ${vscode.details || vscode.state || 'Something cool'}`;
        } else {
            const mainActivity = activities.find(act => act.type !== 4);
            if (mainActivity) {
                activityText = `Playing: ${mainActivity.name}`;
            }
        }
    }
    
    if (!activityText) {
        if (status === 'dnd') activityText = "Do Not Disturb";
        else if (status === 'idle') activityText = "Idling";
        else if (status === 'online') activityText = "Online";
        else activityText = "Offline";
    }

    text.innerText = activityText;
}

fetchDiscordStatus();
setInterval(fetchDiscordStatus, 10000);

// ===== GLOBAL VIEW COUNTER FUNCTIONALITY =====
async function initializeViewCounter() {
    const viewCountElement = document.getElementById('view-count');
    
    try {
        // Check if this user has already been counted in this session
        const sessionKey = 'akio_profile_viewed_session';
        const hasViewedThisSession = sessionStorage.getItem(sessionKey);
        
        if (!hasViewedThisSession) {
            // Increment the global counter (only once per session)
            const response = await fetch('https://api.countapi.xyz/hit/akio-profile-unique/visits');
            const data = await response.json();
            
            // Mark this session as counted
            sessionStorage.setItem(sessionKey, 'true');
            
            // Animate to the new count
            animateCounter(viewCountElement, data.value);
        } else {
            // Just get the current count without incrementing
            const response = await fetch('https://api.countapi.xyz/get/akio-profile-unique/visits');
            const data = await response.json();
            
            // Display the current count
            animateCounter(viewCountElement, data.value);
        }
    } catch (error) {
        console.error('Error fetching view count:', error);
        // Fallback to a loading state
        viewCountElement.textContent = '---';
        
        // Retry after 3 seconds
        setTimeout(initializeViewCounter, 3000);
    }
}

function animateCounter(element, targetValue) {
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 50);
    const duration = 1500; // 1.5 seconds
    const stepTime = duration / (targetValue / increment);
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = currentValue.toLocaleString();
    }, stepTime);
}

// Initialize view counter on page load
initializeViewCounter();

// Optional: Update view count every 30 seconds to show real-time changes
setInterval(async () => {
    const viewCountElement = document.getElementById('view-count');
    try {
        const response = await fetch('https://api.countapi.xyz/get/akio-profile-unique/visits');
        const data = await response.json();
        
        // Update without animation if the count changed
        const currentDisplayed = parseInt(viewCountElement.textContent.replace(/,/g, ''));
        if (data.value !== currentDisplayed) {
            viewCountElement.textContent = data.value.toLocaleString();
        }
    } catch (error) {
        console.error('Error updating view count:', error);
    }
}, 30000); // Update every 30 seconds
