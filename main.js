document.addEventListener('DOMContentLoaded', function () {
  // List of image filenames
  const images = [
    // 'malicious-pickle.png',
    // 'malicious-pickle2.png',
    // 'malicious-pickle3.png',
    // 'malicious-pickle4.png',
    // 'malicious-pickle5.png',
    // 'malicious-pickle6.png',
    // 'malicious-pickle7.png',
    // 'malicious-pickle8.png',
    // 'malicious-pickle9.png',
    // 'malicious-pickle10.png',
    // 'malicious-pickle11.png',
    // 'malicious-pickle12.png',
    // 'malicious-pickle13.png',
    'malicious-pickle14.png',
    'malicious-pickle15.png',
    'malicious-pickle16.png',
    'malicious-pickle17.png',
    'malicious-pickle18.png',
    'malicious-pickle19.png',
    'malicious-pickle20.png',
    'malicious-pickle21.png',
    'malicious-pickle22.png'
  ];

  let blurbs = [];
  const imgElement = document.getElementById('random-image');

  // Preload images to ensure they're in browser cache
  function preloadImages() {
    images.forEach(imageSrc => {
      const img = new Image();
      img.src = 'images/' + imageSrc;
    });
  }

  // Start preloading images immediately
  preloadImages();

  // Function to set a random image
  function setRandomImage() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    imgElement.src = 'images/' + randomImage;
  }

  // Set initial random image regardless of blurbs load outcome
  setRandomImage();

  // Attach onload and onerror handlers
  imgElement.onload = function () {
    console.log('Image loaded successfully:', imgElement.src);
  };

  imgElement.onerror = function () {
    console.error('Error loading image:', imgElement.src);
    imgElement.alt = 'Image failed to load';
    // Try reloading the image with a cache-busting parameter
    setTimeout(() => {
      imgElement.src = imgElement.src.split('?')[0] + '?t=' + new Date().getTime();
    }, 500);
  };

  // Function to show random image and blurb
  function showRandomContent() {
    setRandomImage();
    if (blurbs.length > 0) {
      const randomBlurb = blurbs[Math.floor(Math.random() * blurbs.length)];
      document.getElementById('blurb-title').textContent = randomBlurb.title;
      document.getElementById('blurb-content').textContent = randomBlurb.content;
    }
  }

  // Load blurbs from external JSON file
  fetch('blurbs.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load blurbs.json');
      }
      return response.json();
    })
    .then(data => {
      blurbs = data;
      // Set a random blurb once the data is loaded
      const randomBlurb = blurbs[Math.floor(Math.random() * blurbs.length)];
      document.getElementById('blurb-title').textContent = randomBlurb.title;
      document.getElementById('blurb-content').textContent = randomBlurb.content;
    })
    .catch(error => {
      console.error('Error loading blurbs:', error);
      // Fallback blurb in case loading fails
      document.getElementById('blurb-title').textContent = 'What is a Malicious Pickle?';
      document.getElementById('blurb-content').textContent =
        'A "malicious pickle" refers to a Python pickle file containing harmful code. ' +
        'Pickle is Python\'s serialization format, but it can execute arbitrary code during deserialization.';
    });

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

  // Display terminal messages with a typing effect
  let currentMessageIndex = 0;

  function displayNextTerminalMessage() {
    if (currentMessageIndex < terminalMessages.length) {
      addTerminalLine(terminalMessages[currentMessageIndex]);
      currentMessageIndex++;

      // Random delay between messages for realistic typing feel
      const delay = Math.random() * 1000 + 500;
      setTimeout(displayNextTerminalMessage, delay);
    } else {
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
      terminalContent.appendChild(lastLine);
    }
  }

  // Start displaying terminal messages after a short delay
  setTimeout(displayNextTerminalMessage, 1000);
});