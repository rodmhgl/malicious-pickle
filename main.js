document.addEventListener('DOMContentLoaded', function () {
  // Update year in footer copyright
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Image configuration
  const imageConfig = {
    // Available image numbers
    imageNumbers: [14, 15, 16, 17, 18, 19, 20, 21, 22],
    // Base filename without extension and number
    baseFilename: 'malicious-pickle',
    // Image formats priority (first supported format will be used)
    formats: [
      { type: 'webp', path: 'images/webp/' },
      { type: 'png', path: 'images/' }
    ]
  };

  let blurbs = [];
  const imgContainer = document.querySelector('.image-container');

  // Check if browser supports WebP
  const supportsWebP = (function() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // It's supported, now check WebP support
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  })();

  // Preload images to ensure they're in browser cache
  function preloadImages() {
    // Determine best format for this browser
    const formatToUse = supportsWebP ? imageConfig.formats[0] : imageConfig.formats[1];
    
    imageConfig.imageNumbers.forEach(num => {
      const img = new Image();
      img.src = `${formatToUse.path}${imageConfig.baseFilename}${num}.${formatToUse.type}`;
    });
  }

  // Start preloading images immediately
  preloadImages();

  // Create picture element with sources for WebP and fallback
  function createPictureElement(imageNumber) {
    // Cleanup previous content
    imgContainer.innerHTML = '';
    
    // Create picture element
    const picture = document.createElement('picture');
    picture.style.display = 'flex';
    picture.style.justifyContent = 'center';
    picture.style.alignItems = 'center';
    picture.style.maxWidth = '100%';
    picture.style.height = '100%';
    
    // Add WebP source
    const webpSource = document.createElement('source');
    webpSource.srcset = `images/webp/${imageConfig.baseFilename}${imageNumber}.webp`;
    webpSource.type = 'image/webp';
    picture.appendChild(webpSource);
    
    // Add PNG fallback source
    const pngSource = document.createElement('source');
    pngSource.srcset = `images/${imageConfig.baseFilename}${imageNumber}.png`;
    pngSource.type = 'image/png';
    picture.appendChild(pngSource);
    
    // Add img element
    const img = document.createElement('img');
    img.id = 'random-image';
    img.alt = 'Visual representation of Python pickle security vulnerability';
    img.loading = 'lazy';
    img.src = `images/${imageConfig.baseFilename}${imageNumber}.png`;
    
    // Add error handling
    img.onerror = function() {
      console.error('Error loading image:', img.src);
      img.alt = 'Image failed to load';
      // Try loading a different image
      setTimeout(() => {
        setRandomImage();
      }, 500);
    };
    
    picture.appendChild(img);
    imgContainer.appendChild(picture);
    
    return img;
  }

  // Function to set a random image
  function setRandomImage() {
    const randomIndex = Math.floor(Math.random() * imageConfig.imageNumbers.length);
    const randomImageNumber = imageConfig.imageNumbers[randomIndex];
    
    // Create and return the picture element with all sources
    return createPictureElement(randomImageNumber);
  }

  // Set initial random image regardless of blurbs load outcome
  setRandomImage();

  // Image loading handled within createPictureElement

  // Function to show random image and blurb
  function showRandomContent() {
    const img = setRandomImage();
    
    if (blurbs.length > 0) {
      const randomBlurb = blurbs[Math.floor(Math.random() * blurbs.length)];
      document.getElementById('blurb-title').textContent = randomBlurb.title;
      document.getElementById('blurb-content').textContent = randomBlurb.content;
    }
  }

  // Cache key for blurbs data
  const CACHE_KEY = 'pickle-blurbs';
  
  // Function to set a random blurb
  function setRandomBlurb() {
    if (blurbs.length > 0) {
      const randomBlurb = blurbs[Math.floor(Math.random() * blurbs.length)];
      document.getElementById('blurb-title').textContent = randomBlurb.title;
      document.getElementById('blurb-content').textContent = randomBlurb.content;
    }
  }
  
  // Check for cached blurbs before fetching
  const cachedBlurbs = localStorage.getItem(CACHE_KEY);
  if (cachedBlurbs) {
    try {
      blurbs = JSON.parse(cachedBlurbs);
      setRandomBlurb();
    } catch (e) {
      // If cached data is corrupt, fetch from server
      fetchBlurbs();
    }
  } else {
    fetchBlurbs();
  }
  
  // Load blurbs from external JSON file
  function fetchBlurbs() {
    fetch('blurbs.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load blurbs.json');
        }
        return response.json();
      })
      .then(data => {
        blurbs = data;
        // Cache the blurbs data with quota handling
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
          console.warn('Storage quota exceeded, caching disabled');
        }
        // Set a random blurb once the data is loaded
        setRandomBlurb();
      })
      .catch(error => {
        console.error('Error loading blurbs:', error);
        // Fallback blurb in case loading fails
        document.getElementById('blurb-title').textContent = 'What is a Malicious Pickle?';
        document.getElementById('blurb-content').textContent =
          'A "malicious pickle" refers to a Python pickle file containing harmful code. ' +
          'Pickle is Python\'s serialization format, but it can execute arbitrary code during deserialization.';
      });
  }

  // Set up button click handler
  document.getElementById('new-pickle-btn').addEventListener('click', showRandomContent);

  // Terminal console functionality
  const terminalMessages = [
    ">>> import pickle",
    ">>> # WARNING: Never unpickle data from untrusted sources",
    ">>> class MaliciousPickle(object):",
    "...     def __reduce__(self):",
    "...         import os",
    "...         return (os.system, ('calc.exe',))",
    "...",
    ">>> # When unpickled, this will execute calc.exe",
    ">>> # The __reduce__ method is what makes pickle dangerous",
    ">>> import pickle",
    ">>> data = pickle.loads(b'...')",
    "ERROR: Insecure string pickle detected",
    ">>> # Safe alternatives: JSON, MessagePack, Protocol Buffers",
    ">>> # Security tip: Validate and sanitize all serialized data",
    ">>> # Security tip: Avoid pickle.loads on untrusted input",
    ">>> # Risk: pickle protocol allows code execution on load",
    ">>> # Vulnerability class: Insecure Deserialization",
    ">>> # Common attack vector: ML model files, config files",
    ">>> # First documented attack: January 2022",
    ">>> # Protect by: validating all serialized data",
    ">>> # Never run: pickle.loads(untrusted_data)",
    ">>> # Risk level: Critical (RCE capability)"
  ];

  const terminalContent = document.getElementById('terminal-content');

  // Function to add a line to the terminal
  function addTerminalLine(text, delay = 100) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    if (text.startsWith('>>>') || text.startsWith('...')) {
      const prompt = document.createElement('span');
      prompt.className = 'terminal-prompt';
      prompt.textContent = text.substring(0, 4);

      const content = document.createElement('span');
      content.textContent = text.substring(4);

      line.appendChild(prompt);
      line.appendChild(content);
    } else if (text.startsWith('ERROR:')) {
      line.style.color = '#ff5f56';
      line.textContent = text;
    } else {
      line.textContent = text;
    }

    terminalContent.appendChild(line);
    terminalContent.scrollTop = terminalContent.scrollHeight;
  }

  // Terminal lines container to optimize DOM updates
  const terminalLines = [];
  
  // Display terminal messages with a typing effect but optimized for performance
  let currentMessageIndex = 0;
  let animationFrameId = null;
  let lastFrameTime = 0;
  const FRAME_DELAY = 300; // Time in ms between frames

  function displayNextTerminalMessage(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    
    const elapsed = timestamp - lastFrameTime;
    
    if (elapsed >= FRAME_DELAY && currentMessageIndex < terminalMessages.length) {
      // Create but don't append the line yet
      const line = document.createElement('div');
      line.className = 'terminal-line';

      if (terminalMessages[currentMessageIndex].startsWith('>>>') || 
          terminalMessages[currentMessageIndex].startsWith('...')) {
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = terminalMessages[currentMessageIndex].substring(0, 4);

        const content = document.createElement('span');
        content.textContent = terminalMessages[currentMessageIndex].substring(4);

        line.appendChild(prompt);
        line.appendChild(content);
      } else if (terminalMessages[currentMessageIndex].startsWith('ERROR:')) {
        line.style.color = '#ff5f56';
        line.textContent = terminalMessages[currentMessageIndex];
      } else {
        line.textContent = terminalMessages[currentMessageIndex];
      }
      
      // Store the line in our array
      terminalLines.push(line);
      
      // Batch update the DOM with all lines at once
      renderVisibleTerminalLines();
      
      currentMessageIndex++;
      lastFrameTime = timestamp;
    }
    
    if (currentMessageIndex < terminalMessages.length) {
      // Continue animation if there are more messages
      animationFrameId = requestAnimationFrame(displayNextTerminalMessage);
    } else if (currentMessageIndex === terminalMessages.length) {
      // Add blinking cursor at the end
      const lastLine = document.createElement('div');
      lastLine.className = 'terminal-line';

      const prompt = document.createElement('span');
      prompt.className = 'terminal-prompt';
      prompt.textContent = '>>> ';

      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';

      lastLine.appendChild(prompt);
      lastLine.appendChild(cursor);
      
      terminalLines.push(lastLine);
      renderVisibleTerminalLines();
      currentMessageIndex++; // Increment to prevent repeated cursor additions
    }
  }
  
  // Render only the visible terminal lines for better performance
  function renderVisibleTerminalLines() {
    // Clear current content
    terminalContent.innerHTML = '';
    
    // Only render the most recent lines that would be visible
    const visibleLines = terminalLines.slice(-15); // Adjust based on likely visible area
    
    // Create a document fragment for batch DOM update
    const fragment = document.createDocumentFragment();
    visibleLines.forEach(line => fragment.appendChild(line.cloneNode(true)));
    
    terminalContent.appendChild(fragment);
    terminalContent.scrollTop = terminalContent.scrollHeight;
  }

  // Start displaying terminal messages after a short delay using requestAnimationFrame
  setTimeout(() => {
    animationFrameId = requestAnimationFrame(displayNextTerminalMessage);
  }, 1000);
  
  // Clean up animation frame on page unload
  window.addEventListener('unload', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
});