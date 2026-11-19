/**
 * AHMED MAHMOUD - AI AUTOMATION ENGINEER & N8N DEVELOPER
 * PORTFOLIO CLIENT-SIDE INTERACTIVITY SCRIPT (VANILLA JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set dynamic copyright year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ─────────────────────────────────────────────────────────────
  // 1. THEME TOGGLE (DARK / LIGHT MODE - DARK DEFAULT)
  // ─────────────────────────────────────────────────────────────
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('am_portfolio_theme') || 'dark';

  // Apply initial theme
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('am_portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. MOBILE NAVIGATION MENU TOGGLE
  // ─────────────────────────────────────────────────────────────
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 3. HEADER SCROLL STATE & ACTIVE LINK TRACKING
  // ─────────────────────────────────────────────────────────────
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ─────────────────────────────────────────────────────────────
  // 4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ─────────────────────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without observer
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // ─────────────────────────────────────────────────────────────
  // 5. ANIMATED NUMBER COUNTERS IN ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────
  const counterElements = document.querySelectorAll('.achievement-number[data-target]');
  let countersAnimated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1600; // ms
      const frameRate = 30;
      const totalFrames = Math.round(duration / (1000 / frameRate));
      let currentFrame = 0;

      const timer = setInterval(() => {
        currentFrame++;
        const progress = currentFrame / totalFrames;
        // Ease out quadratic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeProgress;

        if (isDecimal) {
          counter.textContent = currentVal.toFixed(1) + suffix;
        } else {
          counter.textContent = Math.round(currentVal) + suffix;
        }

        if (currentFrame >= totalFrames) {
          clearInterval(timer);
          if (isDecimal) {
            counter.textContent = target.toFixed(1) + suffix;
          } else {
            counter.textContent = target + suffix;
          }
        }
      }, 1000 / frameRate);
    });
  }

  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounters();
        }
      });
    }, { threshold: 0.25 });

    counterObserver.observe(achievementsSection);
  } else {
    runCounters();
  }

  // ─────────────────────────────────────────────────────────────
  // 6. DETAILED PROJECT DATA & MODAL SYSTEM (REUSABLE STRUCTURE)
  // ─────────────────────────────────────────────────────────────
  // Reusable project registry mapping each project to its exact n8n workflow screenshot
  const projectsData = {
    'proj-0': {
      id: 'proj-0',
      index: 'PROJECT 01',
      title: 'AI Social Media Comments Automation',
      domain: 'AI Automation & Social Media',
      image: 'public/images/projects/ai-social-comments-automation.png',
      overview: 'An AI-powered social media automation system that automatically handles incoming comments on Instagram and Facebook. It processes user comments and generates intelligent, context-aware replies to improve customer engagement and automate social media interactions.',
      problem: 'Businesses managing active Instagram and Facebook accounts receive high volumes of comments that require timely and relevant responses. Manually monitoring and replying to every comment is time-consuming and difficult to scale.',
      features: [
        'Real-time monitoring and capture of incoming Instagram and Facebook comments via webhooks',
        'AI Agent powered processing that analyzes each comment and generates context-aware replies',
        'Separate parallel workflows for Instagram and Facebook, each with dedicated AI agent flows',
        'Memory and conversation context storage using Supabase for maintaining interaction history',
        'Automated reply dispatch back to the respective social media platform',
        'Data logging and tracking through Google Sheets integration'
      ],
      role: 'Designed and built the dual-channel automation workflow handling Instagram and Facebook comment processing, integrated AI agent reply generation, connected Supabase memory storage, and configured automated response dispatch.',
      challenge: 'Each social media platform has distinct API structures, comment formats, and reply mechanisms, requiring separate but coordinated workflow branches.',
      solution: 'Built two parallel n8n workflow flows — one for Instagram and one for Facebook — each with its own trigger, AI agent, context memory, and reply dispatch, managed under a single unified workflow.',
      technologies: ['n8n', 'Instagram API', 'Facebook API', 'AI Agent', 'OpenAI', 'Webhooks', 'Supabase', 'Google Sheets', 'HTTP Request', 'Memory Storage']
    },
    'proj-1': {
      id: 'proj-1',
      index: 'PROJECT 02',
      title: 'Social Media Automation',
      domain: 'Content Operations & Social Media',
      image: 'public/images/projects/social-media-automation.png',
      overview: 'AI-powered content publishing automation for Instagram and Facebook, supporting both image and video publishing.',
      problem: 'Manual publishing across multiple platforms consumes time and makes it difficult to maintain a consistent content schedule, especially when managing multiple accounts.',
      features: [
        'Automated content scheduling and publishing for Instagram and Facebook',
        'Native support for both image posts and video content publishing',
        'Centralized workflow orchestration connecting content sources to social channels',
        'Execution status tracking and instant failure notifications'
      ],
      role: 'Designed and built the automation workflow connecting content sources with social media platforms, managing scheduling, publishing, execution tracking, and failure notifications.',
      challenge: 'Different platforms have different publishing rules, supported formats, permissions, and API requirements.',
      solution: 'Designed platform-specific content handling, integrated the required platforms, tracked publishing status, and implemented failure notifications for unsuccessful publishing attempts.',
      technologies: ['n8n', 'Instagram API', 'Facebook API', 'Webhooks', 'JSON', 'Automation Monitoring']
    },
    'proj-2': {
      id: 'proj-2',
      index: 'PROJECT 03',
      title: 'Shopify AI E-commerce Assistant',
      domain: 'E-commerce & Store Automation',
      image: 'public/images/projects/shopify-ai-assistant.png',
      overview: 'An AI-powered Shopify automation workflow designed to interact with products and store orders.',
      problem: 'E-commerce operations face delays answering recurring customer questions about inventory, product specs, and tracking orders manually.',
      features: [
        'Direct connection between AI assistant and live Shopify store catalog',
        'Automated product information retrieval and variant lookup',
        'Store order verification and status synchronization',
        'Real-time inquiry resolution with human fallback logic'
      ],
      role: 'Connected Shopify with the automation workflow and configured the AI assistant to use product and order information when handling customer interactions.',
      challenge: 'Product information, inventory availability, and order states change frequently, requiring high accuracy.',
      solution: 'Implemented mechanisms to retrieve updated product and order data in real time, validating data before responding and routing edge cases to human support.',
      technologies: ['n8n', 'Shopify API', 'OpenAI', 'REST APIs', 'Order Management', 'E-commerce Automation']
    },
    'proj-3': {
      id: 'proj-3',
      index: 'PROJECT 04',
      title: 'AI SEO Multi-Agent System',
      domain: 'Search Engine Optimization & Autonomous Agents',
      image: 'public/images/projects/seo-multi-agent.png',
      overview: 'An SEO Director Agent coordinating specialized agents for keyword research, technical SEO, link building, SEO analytics, local SEO, and content writing.',
      problem: 'Comprehensive SEO strategy requires coordination across multiple distinct disciplines (technical audits, keywords, content, analytics) which is overwhelming and fragmented manually.',
      features: [
        'SEO Director Agent acting as the central reasoning and task orchestrator',
        'Dedicated sub-agents for Keyword Research, Technical SEO, and Link Building',
        'Specialized agents for SEO Analytics, Local SEO, and Content Writing',
        'Automated task delegation and synthesized reporting pipeline'
      ],
      role: 'Designed the multi-agent architecture in n8n, defined system prompts and tool access for each specialized agent, and connected the inter-agent communication channels.',
      challenge: 'Coordinating multiple autonomous agents to work collaboratively without losing context or generating conflicting recommendations.',
      solution: 'Engineered a centralized SEO Director Agent that decomposes requirements, assigns tasks to domain agents, reviews intermediate outputs, and produces consolidated audits.',
      technologies: ['n8n', 'Multi-Agent System', 'AI Agents', 'OpenAI / Claude', 'SEO Analytics', 'Prompt Engineering']
    },
    'proj-4': {
      id: 'proj-4',
      index: 'PROJECT 05',
      title: 'AI RAG Knowledge Base',
      domain: 'Knowledge Retrieval & Vector Embeddings',
      image: 'public/images/projects/rag-knowledge-base.png',
      overview: 'A Retrieval-Augmented Generation system using Google Drive, Pinecone Vector Store, embeddings, and an AI chat agent to retrieve company information.',
      problem: 'Company documentation is distributed across multiple Google Drive documents, making information retrieval slow and leading to repetitive manual research.',
      features: [
        'Automated synchronization with Google Drive documents and knowledge files',
        'Text extraction, chunking, and vector embedding generation',
        'High-speed vector similarity search using Pinecone Vector Store',
        'AI Chat Agent delivering context-grounded answers without hallucinations'
      ],
      role: 'Built the end-to-end RAG pipeline connecting Google Drive to Pinecone and integrated the conversational AI agent for contextual knowledge retrieval.',
      challenge: 'Maintaining synchronized embeddings when Google Drive files are updated or modified, avoiding stale responses.',
      solution: 'Implemented automated document ingestion, re-embedding triggers upon file modifications, and strict context grounding in agent system instructions.',
      technologies: ['n8n', 'Pinecone Vector Store', 'Google Drive API', 'Embeddings', 'RAG Architecture', 'AI Chat Agent']
    },
    'proj-5': {
      id: 'proj-5',
      index: 'PROJECT 06',
      title: 'Dental Clinic AI Automation',
      domain: 'Healthcare & Conversational Booking',
      image: 'public/images/projects/dental-clinic-automation.png',
      overview: 'An Instagram-based dental clinic automation system that processes incoming messages, handles voice transcription, uses an AI agent, and manages responses and data through integrations.',
      problem: 'Dental clinics receive patient inquiries around the clock via Instagram messages and voice notes, leading to delayed replies and lost appointment opportunities.',
      features: [
        'Real-time ingestion of Instagram direct messages and inquiries',
        'Automated voice note transcription for incoming audio messages',
        'Conversational AI Agent for patient guidance and appointment intake',
        'Data integration with clinic scheduling systems and instant team alerts'
      ],
      role: 'Engineered the Instagram messaging webhook pipeline, voice audio transcription workflow, AI agent conversational flow, and appointment data sync.',
      challenge: 'Handling unstructured voice notes and preventing appointment conflicts with the doctor availability schedule.',
      solution: 'Integrated automated voice transcription before passing text to the AI agent, and connected real-time availability checks to confirm appointments accurately.',
      technologies: ['n8n', 'Instagram Messaging', 'Voice Transcription', 'AI Agent', 'Google Calendar', 'Appointment Integration']
    }
  };

  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const detailButtons = document.querySelectorAll('[data-project-id]');

  function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project || !modalOverlay) return;

    document.getElementById('modalProjectIndex').textContent = `${project.index} • ${project.domain}`;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalOverview').textContent = project.overview;
    document.getElementById('modalProblem').textContent = project.problem;
    document.getElementById('modalRole').textContent = project.role;
    document.getElementById('modalChallenge').textContent = project.challenge;
    document.getElementById('modalSolution').textContent = project.solution;

    // Render workflow preview banner in details modal
    const modalPreviewBanner = document.getElementById('modalPreviewBanner');
    const modalPreviewImg = document.getElementById('modalPreviewImg');
    if (modalPreviewBanner && modalPreviewImg) {
      modalPreviewImg.src = project.image;
      modalPreviewImg.alt = `${project.title} Workflow Screenshot`;
      modalPreviewBanner.setAttribute('data-preview', project.image);
      modalPreviewBanner.setAttribute('data-project-title', project.title);
      modalPreviewBanner.setAttribute('data-project-desc', project.overview);
    }

    // Render features
    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = project.features.map(f => `
      <div class="modal-feature-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${escapeHTML(f)}</span>
      </div>
    `).join('');

    // Render technologies
    const techContainer = document.getElementById('modalTech');
    techContainer.innerHTML = project.technologies.map(t => `
      <span class="badge">${escapeHTML(t)}</span>
    `).join('');

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    // Restore body scroll if lightbox is also not open
    const lightboxModal = document.getElementById('lightboxModal');
    if (!lightboxModal || !lightboxModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 6.5 WORKFLOW SCREENSHOT LIGHTBOX MODAL SYSTEM
  // ─────────────────────────────────────────────────────────────
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxOpenNewTab = document.getElementById('lightboxOpenNewTab');

  function openLightbox(imgSrc, title, caption) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = `${title} Screenshot`;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCaption) lightboxCaption.textContent = caption || 'n8n Production Workflow Screenshot';
    if (lightboxOpenNewTab) lightboxOpenNewTab.href = imgSrc;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    if (!modalOverlay || !modalOverlay.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  // Delegated click listener for all current and future screenshot preview triggers
  document.addEventListener('click', (e) => {
    const previewTrigger = e.target.closest('[data-preview]');
    if (previewTrigger) {
      e.preventDefault();
      e.stopPropagation();
      const imgSrc = previewTrigger.getAttribute('data-preview');
      const title = previewTrigger.getAttribute('data-project-title') || 'n8n Workflow Preview';
      const caption = previewTrigger.getAttribute('data-project-desc') || '';
      if (imgSrc) {
        openLightbox(imgSrc, title, caption);
      }
    }
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard escape listener for both modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        closeLightbox();
      } else if (modalOverlay && modalOverlay.classList.contains('active')) {
        closeProjectModal();
      }
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 7. CLIENT-SIDE CONTACT FORM & DIRECT EMAIL DISPATCH
  // ─────────────────────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      // Email address for Ahmed Mahmoud
      const targetEmail = 'aboelshikh44z@gmail.com';
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Hello Ahmed,\n\n${message}\n\n---\nSender Name: ${name}\nSender Email: ${email}`
      );

      // Open email client via mailto
      const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

      showFormMessage(
        `Thank you, ${name}! Opening your email client to send your message to ${targetEmail}... If it doesn't open automatically, feel free to email directly at aboelshikh44z@gmail.com.`,
        'success'
      );

      // Trigger mailto link directly
      window.location.href = mailtoUrl;

      // Reset form fields
      contactForm.reset();
    });
  }

  function showFormMessage(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form-status-msg ${type}`;
    formStatus.style.display = 'block';

    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 9000);
  }

  // ─────────────────────────────────────────────────────────────
  // 8. ONE-CLICK COPY TO CLIPBOARD (EMAIL & PHONE)
  // ─────────────────────────────────────────────────────────────
  const copyButtons = document.querySelectorAll('.copy-trigger');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg> Copied!
        `;
        btn.style.borderColor = 'var(--accent-tertiary)';
        btn.style.color = 'var(--accent-tertiary)';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2200);
      }).catch(() => {
        // Fallback prompt
        window.prompt('Copy to clipboard: Ctrl+C, Enter', textToCopy);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 9. DYNAMIC WORKFLOW PULSE ANIMATION IN HERO CANVAS
  // ─────────────────────────────────────────────────────────────
  const workflowNodes = document.querySelectorAll('.workflow-node-card');
  if (workflowNodes.length > 0) {
    let activeNodeIndex = 0;
    setInterval(() => {
      workflowNodes.forEach((node, idx) => {
        if (idx === activeNodeIndex) {
          node.style.borderColor = 'var(--accent-primary)';
          node.style.boxShadow = '0 0 16px var(--accent-glow)';
        } else {
          node.style.borderColor = '';
          node.style.boxShadow = '';
        }
      });
      activeNodeIndex = (activeNodeIndex + 1) % workflowNodes.length;
    }, 1800);
  }

  // Helper utility for XSS safety
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
