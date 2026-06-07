// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const categorySearchInput = document.getElementById('category-search');
    let allTalks = [];

    const fetchData = async () => {
        try {
            const response = await fetch('/api/talks');
            allTalks = await response.json();
            renderSchedule(allTalks);
        } catch (error) {
            console.error('Error fetching talks:', error);
            scheduleContainer.innerHTML = '<p class="no-results">Error loading schedule. Please try again later.</p>';
        }
    };

    const renderSchedule = (talksToRender) => {
        scheduleContainer.innerHTML = '';
        if (talksToRender.length === 0) {
            scheduleContainer.innerHTML = '<p class="no-results">No talks found matching your criteria.</p>';
            return;
        }

        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        talksToRender.forEach((talk, index) => {
            // Add previous item if it exists
            const prevEndTime = new Date(currentTime.getTime());
            prevEndTime.setMinutes(prevEndTime.getMinutes() - (talk.duration + 10)); // Assuming 10 min transition for previous

            // Add talk item
            const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);
            const talkElement = document.createElement('div');
            talkElement.classList.add('talk-item');
            talkElement.innerHTML = `
                <h2>${talk.title}</h2>
                <p><strong>Time:</strong> ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${talkEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Speakers:</strong> ${Array.isArray(talk.speakers) ? talk.speakers.join(', ') : talk.speakers}</p>
                <p class="category"><strong>Category:</strong> ${Array.isArray(talk.category) ? talk.category.join(', ') : talk.category}</p>
                <p>${talk.description}</p>
            `;
            scheduleContainer.appendChild(talkElement);

            currentTime = new Date(talkEndTime.getTime());

            // Add 10-minute transition, except after the last talk
            if (index < talksToRender.length - 1) {
                const transitionEndTime = new Date(currentTime.getTime() + 10 * 60 * 1000);
                const transitionElement = document.createElement('div');
                transitionElement.classList.add('break-item');
                transitionElement.innerHTML = `<p>Transition: ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${transitionEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>`;
                scheduleContainer.appendChild(transitionElement);
                currentTime = new Date(transitionEndTime.getTime());
            }

            // Add lunch break after 3rd talk (index 2)
            if (index === 2) {
                const lunchStartTime = new Date(currentTime.getTime());
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60 * 1000); // 1 hour lunch
                const lunchElement = document.createElement('div');
                lunchElement.classList.add('break-item');
                lunchElement.innerHTML = `<p>LUNCH BREAK: ${lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>`;
                scheduleContainer.appendChild(lunchElement);
                currentTime = new Date(lunchEndTime.getTime());
            }
        });
    };

    categorySearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredTalks = allTalks.filter(talk =>
            (Array.isArray(talk.category) ? talk.category.some(cat => cat.toLowerCase().includes(searchTerm)) : talk.category.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    // Initial data fetch
    fetchData();
});