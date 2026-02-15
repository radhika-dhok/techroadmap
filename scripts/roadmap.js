// Global variables
let currentRoadmap = null;
let completedTopics = new Set();
const STORAGE_KEY_PREFIX = 'roadmap_progress_';

// Get roadmap ID from URL
function getRoadmapId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load specific roadmap
async function loadRoadmap() {
    const roadmapId = getRoadmapId();
    
    if (!roadmapId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await fetch('data/roadmaps.json');
        const data = await response.json();
        currentRoadmap = data.roadmaps.find(r => r.id === roadmapId);
        
        if (!currentRoadmap) {
            window.location.href = 'index.html';
            return;
        }
        
        loadProgress();
        displayRoadmapInfo();
        renderRoadmap();
    } catch (error) {
        console.error('Error loading roadmap:', error);
    }
}

// Display roadmap info
function displayRoadmapInfo() {
    document.getElementById('roadmap-title').textContent = currentRoadmap.title;
    document.getElementById('roadmap-description').textContent = currentRoadmap.description;
    updateProgress();
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + currentRoadmap.id);
    if (saved) {
        completedTopics = new Set(JSON.parse(saved));
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem(
        STORAGE_KEY_PREFIX + currentRoadmap.id,
        JSON.stringify([...completedTopics])
    );
    updateProgress();
}

// Update progress display
function updateProgress() {
    const totalTopics = countTotalTopics(currentRoadmap.content);
    const completedCount = completedTopics.size;
    const percentage = Math.round((completedCount / totalTopics) * 100);
    
    document.getElementById('progress-badge').textContent = `${percentage}% Done`;
    document.getElementById('progress-text').textContent = `${completedCount} of ${totalTopics} Done`;
}

// Count total topics
function countTotalTopics(content) {
    let count = 0;
    
    function countNodes(nodes) {
        nodes.forEach(node => {
            if (node.type === 'topic') count++;
            if (node.children) {
                countNodes(node.children);
            }
        });
    }
    
    countNodes(content);
    return count;
}

// Render roadmap visualization
function renderRoadmap() {
    const svg = document.getElementById('roadmap-svg');
    const startX = 600;
    const startY = 50;
    const verticalGap = 120;
    const horizontalGap = 250;
    
    let yOffset = startY;
    
    // Render each section
    currentRoadmap.content.forEach((section, index) => {
        yOffset = renderSection(svg, section, startX, yOffset, horizontalGap, verticalGap);
        yOffset += 50; // Extra gap between sections
    });
    
    // Adjust SVG height
    svg.setAttribute('height', yOffset + 50);
}

// Render a section of the roadmap
function renderSection(svg, section, x, y, horizontalGap, verticalGap) {
    let currentY = y;
    
    // Render category node
    if (section.type === 'category') {
        createNode(svg, section.title, x, currentY, 'category', null);
        currentY += verticalGap;
        
        // Render children
        if (section.children) {
            currentY = renderChildren(svg, section.children, x, currentY, horizontalGap, verticalGap);
        }
    } else {
        // Single topic
        createNode(svg, section.title, x, currentY, section.type, section.id);
        currentY += verticalGap;
    }
    
    return currentY;
}

// Render children nodes
function renderChildren(svg, children, centerX, startY, horizontalGap, verticalGap) {
    const nodeWidth = 200;
    const totalWidth = (children.length - 1) * horizontalGap;
    const startX = centerX - totalWidth / 2;
    
    let maxY = startY;
    
    children.forEach((child, index) => {
        const x = startX + (index * horizontalGap);
        const y = startY;
        
        // Draw connector from parent
        createConnector(svg, centerX, startY - verticalGap + 40, x, y, child.id);
        
        // Create node
        createNode(svg, child.title, x, y, child.type, child.id);
        
        maxY = Math.max(maxY, y + verticalGap);
    });
    
    return maxY;
}

// Create a node
function createNode(svg, title, x, y, type, id) {
    const nodeWidth = 200;
    const nodeHeight = 60;
    const nodeX = x - nodeWidth / 2;
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('roadmap-node');
    if (type === 'category') {
        group.classList.add('category-node');
    }
    if (id && completedTopics.has(id)) {
        group.classList.add('completed');
    }
    
    // Rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', nodeX);
    rect.setAttribute('y', y);
    rect.setAttribute('width', nodeWidth);
    rect.setAttribute('height', nodeHeight);
    
    // Text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + nodeHeight / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    
    // Wrap text if too long
    const words = title.split(' ');
    if (words.length > 3) {
        const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan1.setAttribute('x', x);
        tspan1.setAttribute('dy', '-0.5em');
        tspan1.textContent = words.slice(0, 2).join(' ');
        
        const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan2.setAttribute('x', x);
        tspan2.setAttribute('dy', '1.2em');
        tspan2.textContent = words.slice(2).join(' ');
        
        text.appendChild(tspan1);
        text.appendChild(tspan2);
    } else {
        text.textContent = title;
    }
    
    group.appendChild(rect);
    group.appendChild(text);
    
    // Add click event for topics
    if (type === 'topic' && id) {
        group.style.cursor = 'pointer';
        group.addEventListener('click', () => showNodeDetails(id, title));
    }
    
    svg.appendChild(group);
}

// Create connector line
function createConnector(svg, x1, y1, x2, y2, targetId) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('connector-line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    
    if (targetId && completedTopics.has(targetId)) {
        line.classList.add('completed');
    }
    
    svg.appendChild(line);
}

// Show node details in modal
function showNodeDetails(id, title) {
    // Create modal if it doesn't exist
    let modal = document.querySelector('.node-modal');
    let overlay = document.querySelector('.modal-overlay');
    
    if (!modal) {
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.addEventListener('click', closeModal);
        
        modal = document.createElement('div');
        modal.className = 'node-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h3 id="modal-title"></h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-content">
                <p id="modal-description"></p>
                <button class="toggle-complete" id="toggle-btn">Mark as Complete</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('#toggle-btn').addEventListener('click', () => toggleComplete(id));
    }
    
    // Update modal content
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = `Learn about ${title} and master this topic.`;
    
    const toggleBtn = document.getElementById('toggle-btn');
    const isCompleted = completedTopics.has(id);
    
    toggleBtn.textContent = isCompleted ? 'Mark as Incomplete' : 'Mark as Complete';
    toggleBtn.classList.toggle('completed', isCompleted);
    
    // Show modal
    overlay.classList.add('active');
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.node-modal');
    const overlay = document.querySelector('.modal-overlay');
    
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Toggle complete status
function toggleComplete(id) {
    if (completedTopics.has(id)) {
        completedTopics.delete(id);
    } else {
        completedTopics.add(id);
    }
    
    saveProgress();
    closeModal();
    
    // Re-render roadmap
    document.getElementById('roadmap-svg').innerHTML = '';
    renderRoadmap();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadRoadmap);
